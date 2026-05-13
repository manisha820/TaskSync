import React, { useState, useEffect } from 'react';
import { Trophy, ArrowRight, Plus, Check, X, Flame, Target, BarChart2, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../auth/AuthProvider';
import { fetchHabits, fetchHabitLogs, logHabit, removeHabitLog, Habit, HabitLog } from '../../lib/api/habits';
import { supabase } from '../../lib/supabase';

interface HabitTrackerProps {
  openModal?: (tab: 'task' | 'note' | 'habit' | 'event') => void;
}

function toDateString(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function HabitTracker({ openModal }: HabitTrackerProps) {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingHabitId, setLoadingHabitId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
      const channel = supabase.channel('habits-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'habits', filter: `user_id=eq.${user.id}` }, loadData)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'habit_logs', filter: `user_id=eq.${user.id}` }, loadData)
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    const [fetchedHabits, fetchedLogs] = await Promise.all([
      fetchHabits(user.id),
      fetchHabitLogs(user.id)
    ]);
    setHabits(fetchedHabits);
    setLogs(fetchedLogs);
    setIsLoading(false);
  };

  const handleToggle = async (habitId: string, dateStr: string, currentStatus: string | null) => {
    if (!user) return;
    setLoadingHabitId(`${habitId}-${dateStr}`);
    
    try {
      if (currentStatus === 'done') {
        // Optimistic
        setLogs(logs.filter(l => !(l.habit_id === habitId && l.completed_date === dateStr)));
        await removeHabitLog(habitId, dateStr);
      } else {
        // Optimistic
        const newStatus = 'done';
        const optimisticLog: HabitLog = {
          id: 'temp-' + Date.now(),
          habit_id: habitId,
          user_id: user.id,
          completed_date: dateStr,
          status: newStatus,
          completed_at: new Date().toISOString()
        };
        // Remove existing for this date if any
        const cleanLogs = logs.filter(l => !(l.habit_id === habitId && l.completed_date === dateStr));
        setLogs([...cleanLogs, optimisticLog]);
        
        await logHabit(habitId, user.id, dateStr, newStatus);
      }
    } finally {
      setLoadingHabitId(null);
    }
  };

  const getLogStatus = (habitId: string, dateStr: string) => {
    const log = logs.find(l => l.habit_id === habitId && l.completed_date === dateStr);
    return log ? log.status : null;
  };

  const calculateStreaks = (habitId: string) => {
    const habitLogs = logs
      .filter(l => l.habit_id === habitId && l.status === 'done')
      .map(l => new Date(l.completed_date).getTime())
      .sort((a, b) => a - b);
    
    if (habitLogs.length === 0) return { current: 0, best: 0, percentage: 0 };

    let current = 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    
    let checkDate = new Date(today);
    while (true) {
      if (habitLogs.includes(checkDate.getTime())) {
        current++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        if (current === 0 && checkDate.getTime() === today.getTime()) {
           checkDate.setDate(checkDate.getDate() - 1);
           continue;
        }
        break;
      }
    }

    let best = current;
    let tempStreak = 1;
    for (let i = 1; i < habitLogs.length; i++) {
       const diff = (habitLogs[i] - habitLogs[i-1]) / (1000 * 60 * 60 * 24);
       if (diff === 1) {
         tempStreak++;
         best = Math.max(best, tempStreak);
       } else {
         tempStreak = 1;
       }
    }

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const recentLogs = habitLogs.filter(t => t >= thirtyDaysAgo.getTime()).length;
    const percentage = Math.round((recentLogs / 30) * 100);

    return { current, best, percentage };
  };

  // Last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="glass-card p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 rounded-none">
        <div>
          <h2 className="text-3xl font-black text-text-primary tracking-tight mb-2">Build Consistency</h2>
          <p className="text-text-muted font-medium max-w-xl">
            Track your daily routines, analyze your streaks, and optimize your productivity through automated insights.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center px-6 border-r border-white/10">
            <h3 className="text-4xl font-black text-primary">{habits.length}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-1">Active Habits</p>
          </div>
          <div className="text-center px-6">
            <h3 className="text-4xl font-black text-emerald-400">
              {logs.filter(l => l.completed_date === toDateString(new Date()) && l.status === 'done').length}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-1">Done Today</p>
          </div>
        </div>
      </div>

      {/* Main Habits View */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-text-primary flex items-center gap-3">
            <Target size={24} className="text-primary" /> Active Habits
          </h3>
          <div className="flex items-center gap-3">
            {isLoading && <Loader2 size={16} className="animate-spin text-text-muted" />}
            {openModal && (
              <button
                onClick={() => openModal('habit')}
                className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-none text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
              >
                <Plus size={14} /> Add Habit
              </button>
            )}
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="p-16 text-center bg-surface-dim border border-dashed border-white/10 text-text-muted flex flex-col items-center gap-4 animate-in fade-in">
            <Trophy size={48} className="opacity-20" />
            <div>
              <p className="font-bold text-lg text-text-primary mb-1">No habits configured</p>
              <p className="text-sm opacity-80">Consistency starts with a single step. Create your first habit!</p>
            </div>
            {openModal && (
              <button onClick={() => openModal('habit')} className="mt-4 btn-primary px-6 py-2">
                Create Habit
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {habits.map((habit) => {
              const { current, best, percentage } = calculateStreaks(habit.id);
              
              return (
                <div key={habit.id} className="glass-card border border-white/5 rounded-none p-6 flex flex-col lg:flex-row gap-8 transition-all hover:border-primary/20 hover:bg-surface-dim/40 group">
                  {/* Habit Info */}
                  <div className="w-full lg:w-64 shrink-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 pb-6 lg:pb-0 lg:pr-6">
                    <div>
                      <h4 className="text-xl font-black text-text-primary mb-1">{habit.name}</h4>
                      <p className="text-xs font-bold uppercase tracking-widest text-text-muted">{habit.schedule}</p>
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-orange-400">
                        <Flame size={16} />
                        <span className="font-bold text-sm">{current} Day Streak</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-text-muted">
                        <Trophy size={14} />
                        <span className="font-medium text-xs">Best: {best}</span>
                      </div>
                    </div>
                  </div>

                  {/* 7-Day Quick Toggles */}
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4">Last 7 Days</p>
                    <div className="flex gap-2 w-full justify-between sm:justify-start sm:gap-4 overflow-x-auto pb-2">
                      {last7Days.map(date => {
                        const dateStr = toDateString(date);
                        const status = getLogStatus(habit.id, dateStr);
                        const isDone = status === 'done';
                        const isMissed = status === 'missed';
                        const isToday = toDateString(new Date()) === dateStr;
                        const loading = loadingHabitId === `${habit.id}-${dateStr}`;

                        return (
                          <div key={dateStr} className="flex flex-col items-center gap-2">
                            <span className={cn('text-[10px] font-bold uppercase', isToday ? 'text-primary' : 'text-text-muted')}>
                              {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <button
                              onClick={() => handleToggle(habit.id, dateStr, status)}
                              disabled={loading}
                              className={cn(
                                'w-12 h-12 flex items-center justify-center transition-all duration-300 relative rounded-none',
                                isDone ? 'bg-primary text-text-on-primary shadow-lg shadow-primary/20 scale-105' : 
                                isMissed ? 'bg-red-500/20 text-red-400' :
                                'bg-surface border border-white/5 text-text-muted hover:border-primary/40 hover:bg-surface-bright'
                              )}
                            >
                              {loading ? (
                                <RefreshCw size={18} className="animate-spin opacity-50" />
                              ) : isDone ? (
                                <Check size={20} className="animate-in zoom-in duration-200" />
                              ) : isMissed ? (
                                <X size={20} />
                              ) : (
                                <span className="opacity-0 group-hover:opacity-30 transition-opacity">
                                  <Check size={20} />
                                </span>
                              )}
                            </button>
                            <span className="text-[10px] font-medium text-text-muted">
                              {date.getDate()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Monthly Consistency Heatmap Mini */}
                  <div className="w-full lg:w-48 shrink-0 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">30-Day Focus</span>
                      <span className="text-xs font-bold text-primary">{percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-dim overflow-hidden rounded-none">
                      <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
