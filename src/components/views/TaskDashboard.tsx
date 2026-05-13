import { useState, useEffect } from 'react';
import {
  TrendingUp, CheckCircle2, BarChart3, Clock, ChevronRight, Loader2,
  Calendar, FileText, AlertCircle, Trophy, Pin
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import { GlowCard } from '../ui/spotlight-card';

interface TaskDashboardProps {
  viewMode?: 'day' | 'week' | 'month';
  selectedDate?: Date;
}

function getDateRange(viewMode: string, selectedDate: Date) {
  const now = selectedDate || new Date();
  if (viewMode === 'day') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
    return { start, end };
  } else if (viewMode === 'week') {
    const day = now.getDay();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
    return { start, end };
  } else {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return { start, end };
  }
}

export function TaskDashboard({ viewMode = 'week', selectedDate = new Date() }: TaskDashboardProps) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [habitLogs, setHabitLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadAll();

    const channel = supabase.channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${user.id}` }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes', filter: `user_id=eq.${user.id}` }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events', filter: `user_id=eq.${user.id}` }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habit_logs', filter: `user_id=eq.${user.id}` }, loadAll)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const loadAll = async () => {
    if (!user) return;
    setIsLoading(true);
    const [tasksRes, notesRes, eventsRes, habitsRes, logsRes] = await Promise.all([
      supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('notes').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }),
      supabase.from('calendar_events').select('*').eq('user_id', user.id).order('start_time', { ascending: true }),
      supabase.from('habits').select('*').eq('user_id', user.id),
      supabase.from('habit_logs').select('*').eq('user_id', user.id)
    ]);
    setTasks(tasksRes.data || []);
    setNotes(notesRes.data || []);
    setEvents(eventsRes.data || []);
    setHabits(habitsRes.data || []);
    setHabitLogs(logsRes.data || []);
    setIsLoading(false);
  };

  const { start, end } = getDateRange(viewMode, selectedDate);

  const filteredTasks = tasks.filter(t => {
    const date = t.due_date ? new Date(t.due_date) : new Date(t.created_at);
    return date >= start && date <= end;
  });

  const filteredNotes = notes.filter(n => {
    const date = new Date(n.created_at);
    return date >= start && date <= end;
  });

  const filteredEvents = events.filter(e => {
    const date = new Date(e.start_time);
    return date >= start && date <= end;
  });

  // Calculate habit stats for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = habitLogs.filter(l => l.completed_date === todayStr && l.status === 'done');
  const habitCompletionRate = habits.length > 0 
    ? Math.round((todayLogs.length / habits.length) * 100) 
    : 0;

  const completedTasks = filteredTasks.filter(t => t.status === 'Done');
  const completionRate = filteredTasks.length > 0
    ? Math.round((completedTasks.length / filteredTasks.length) * 100)
    : 0;

  const viewLabel = viewMode === 'day' ? 'Today' : viewMode === 'week' ? 'This Week' : 'This Month';
  const pinnedNotes = notes.filter(n => n.is_pinned);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-text-muted p-8">
        <Loader2 className="animate-spin" size={20} /> Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-none">
          {viewLabel}
        </span>
        {viewMode === 'day' && (
          <span className="text-xs text-text-muted font-medium">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        )}
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Task Completion',
            value: `${completionRate}%`,
            unit: `${completedTasks.length}/${filteredTasks.length} tasks done`,
            icon: CheckCircle2,
            color: 'text-primary',
            glow: 'purple' as const,
          },
          {
            label: 'Daily Habits',
            value: `${habitCompletionRate}%`,
            unit: `${todayLogs.length}/${habits.length} habits today`,
            icon: Trophy,
            color: 'text-orange-400',
            glow: 'orange' as const,
          },
          {
            label: 'Pinned Notes',
            value: pinnedNotes.length.toString(),
            unit: 'Important docs',
            icon: Pin,
            color: 'text-emerald-400',
            glow: 'green' as const,
          },
          {
            label: 'Upcoming Events',
            value: filteredEvents.length.toString(),
            unit: `Scheduled ${viewMode}`,
            icon: Calendar,
            color: 'text-blue-400',
            glow: 'blue' as const,
          },
        ].map((metric, i) => (
          <GlowCard
            key={i}
            glowColor={metric.glow}
            className="p-6 flex items-center gap-5 border border-white/5"
          >
            <div className={cn('w-14 h-14 rounded-none flex items-center justify-center shrink-0 bg-surface-bright', metric.color)}>
              <metric.icon size={28} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{metric.label}</p>
              <h3 className="text-3xl font-black text-text-primary tracking-tight">{metric.value}</h3>
              <p className="text-[10px] text-text-muted truncate mt-0.5">{metric.unit}</p>
            </div>
          </GlowCard>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Feed */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Pinned Notes & Categories (If any) */}
          {pinnedNotes.length > 0 && (
            <div className="glass-card p-8 border border-white/5 rounded-none">
              <h4 className="text-xl font-bold text-text-primary tracking-tight mb-6 flex items-center gap-2">
                <Pin size={20} className="text-emerald-400" /> Pinned Notes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pinnedNotes.map(note => (
                  <div key={note.id} className="p-4 bg-surface-dim border border-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-pointer">
                    <p className="font-bold text-text-primary text-sm truncate">{note.title || 'Untitled'}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-2">{note.category}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Table */}
          <div className="glass-card rounded-none overflow-hidden flex flex-col border border-white/5">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
              <h4 className="text-xl font-bold text-text-primary tracking-tight">
                {viewLabel}'s Tasks
                <span className="ml-3 text-sm font-medium text-text-muted">({filteredTasks.length})</span>
              </h4>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-text-muted">
                <CheckCircle2 size={40} className="mb-4 opacity-20" />
                <p className="font-bold">No tasks {viewMode === 'day' ? 'due today' : `this ${viewMode}`}</p>
              </div>
            ) : (
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-dim/50">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Task</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Priority</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTasks.map(task => (
                      <tr key={task.id} className="hover:bg-surface-dim transition-colors cursor-pointer">
                        <td className="px-6 py-4">
                          <p className="font-bold text-text-primary text-sm">{task.title}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={cn('w-2 h-2 rounded-none',
                              task.status === 'Done' ? 'bg-emerald-400' :
                              task.status === 'In Progress' ? 'bg-primary' :
                              'bg-surface-bright'
                            )} />
                            <span className="text-xs font-semibold text-text-muted">{task.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn('px-2.5 py-1 rounded-none text-[10px] font-black uppercase tracking-widest',
                            task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-surface-dim text-text-muted'
                          )}>
                            {task.priority || 'medium'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-text-muted">
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Habits Status */}
          <div className="glass-card p-6 border border-white/5 rounded-none">
             <h4 className="text-sm font-black uppercase tracking-widest text-text-muted mb-4 flex items-center justify-between">
               Today's Habits
               <Trophy size={16} className="text-orange-400" />
             </h4>
             {habits.length === 0 ? (
               <p className="text-text-muted text-xs italic">No active habits</p>
             ) : (
               <div className="space-y-3">
                 {habits.map(h => {
                   const isDone = todayLogs.some(l => l.habit_id === h.id);
                   return (
                     <div key={h.id} className="flex items-center gap-3">
                       <div className={cn("w-4 h-4 rounded-sm flex items-center justify-center border", isDone ? "bg-emerald-500/20 border-emerald-400" : "border-white/20")}>
                         {isDone && <CheckCircle2 size={12} className="text-emerald-400" />}
                       </div>
                       <span className={cn("text-sm font-bold", isDone ? "text-emerald-400 line-through" : "text-text-primary")}>{h.name}</span>
                     </div>
                   );
                 })}
               </div>
             )}
          </div>

          {/* Upcoming Events */}
          {filteredEvents.length > 0 && (
            <div className="glass-card p-6 rounded-none border border-white/5">
              <h4 className="text-sm font-black uppercase tracking-widest text-text-muted mb-4">Events {viewLabel}</h4>
              <div className="space-y-3">
                {filteredEvents.slice(0, 4).map(event => (
                  <div key={event.id} className="flex items-center gap-3">
                    <Calendar size={14} className="text-blue-300 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{event.title}</p>
                      <p className="text-[10px] text-text-muted">
                        {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
