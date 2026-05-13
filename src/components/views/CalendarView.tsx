import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, CheckSquare, TrendingUp,
  FileText, Calendar as CalIcon, Loader2, X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthProvider';
import { cn } from '../../lib/utils';

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  openModal: (tab: 'task' | 'note' | 'habit' | 'event', date: Date) => void;
}

interface DayData {
  tasks: any[];
  habitLogs: any[];
  events: any[];
  notes: any[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function toDateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function CalendarView({ selectedDate, onSelectDate, openModal }: CalendarViewProps) {
  const { user } = useAuth();

  const [viewMonth, setViewMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [allHabits, setAllHabits] = useState<any[]>([]);
  const [allHabitLogs, setAllHabitLogs] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [panelDate, setPanelDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) return;
    loadAll();

    const ch = supabase.channel('calendar-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${user.id}` }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events', filter: `user_id=eq.${user.id}` }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes', filter: `user_id=eq.${user.id}` }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habit_logs', filter: `user_id=eq.${user.id}` }, loadAll)
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const loadAll = async () => {
    if (!user) return;
    setIsLoading(true);

    const [tasksRes, eventsRes, notesRes, habitsRes, logsRes] = await Promise.all([
      supabase.from('tasks').select('*').eq('user_id', user.id),
      supabase.from('calendar_events').select('*').eq('user_id', user.id),
      supabase.from('notes').select('*').eq('user_id', user.id),
      supabase.from('habits').select('*').eq('user_id', user.id),
      supabase.from('habit_logs').select('*').eq('user_id', user.id),
    ]);

    setAllTasks(tasksRes.data || []);
    setAllEvents(eventsRes.data || []);
    setAllNotes(notesRes.data || []);
    setAllHabits(habitsRes.data || []);
    setAllHabitLogs(logsRes.data || []);
    setIsLoading(false);
  };

  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const today = new Date();

  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const getDayData = (date: Date): DayData => {
    const dsISO = date.toISOString().split('T')[0];
    const dsLocal = toDateStr(date);
    
    return {
      tasks: allTasks.filter(t => t.due_date && t.due_date.split('T')[0] === dsISO),
      events: allEvents.filter(e => e.start_time && e.start_time.split('T')[0] === dsISO),
      notes: allNotes.filter(n => n.associated_date === dsLocal || (!n.associated_date && n.created_at.split('T')[0] === dsISO)),
      habitLogs: allHabitLogs.filter(l => l.completed_date === dsLocal),
    };
  };

  const panelData = panelDate ? getDayData(panelDate) : null;

  const prevMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  const nextMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));

  const handleDayClick = (date: Date) => {
    onSelectDate(date);
    setPanelDate(date);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 hover:bg-white/5 border border-white/5 transition-colors rounded-none">
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">
            {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="p-2 hover:bg-white/5 border border-white/5 transition-colors rounded-none">
            <ChevronRight size={20} />
          </button>
        </div>
        <button
          onClick={() => setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1))}
          className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
        >
          Today
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-96 text-text-muted">
              <Loader2 className="animate-spin mr-2" /> Loading calendar...
            </div>
          ) : (
            <div className="glass-card border border-white/5 overflow-hidden rounded-none">
              <div className="grid grid-cols-7 border-b border-white/5">
                {DAYS.map(d => (
                  <div key={d} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-text-muted">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {cells.map((date, idx) => {
                  if (!date) {
                    return <div key={`empty-${idx}`} className="h-28 border-b border-r border-white/5 bg-surface-dim/20" />;
                  }

                  const dayData = getDayData(date);
                  const isToday = isSameDay(date, today);
                  const isSelected = isSameDay(date, selectedDate);
                  const isPanelOpen = panelDate && isSameDay(date, panelDate);

                  // Calculate habit completion percentage for the day
                  const totalActiveHabits = allHabits.length;
                  const completedHabitsCount = dayData.habitLogs.filter(l => l.status === 'done').length;
                  const habitDotColor = completedHabitsCount === 0 ? null :
                                        completedHabitsCount === totalActiveHabits ? 'bg-emerald-400' : 'bg-primary';

                  return (
                    <div
                      key={date.toISOString()}
                      onClick={() => handleDayClick(date)}
                      className={cn(
                        'h-28 p-2 border-b border-r border-white/5 cursor-pointer transition-all hover:bg-surface-dim/60 flex flex-col relative',
                        isSelected ? 'bg-primary/10 border-primary/20' : '',
                        isPanelOpen ? 'ring-1 ring-inset ring-primary/40' : ''
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <span className={cn(
                          'text-sm font-black w-7 h-7 flex items-center justify-center rounded-none mb-1',
                          isToday ? 'bg-primary text-white' : isSelected ? 'text-primary' : 'text-text-muted'
                        )}>
                          {date.getDate()}
                        </span>
                        {habitDotColor && (
                          <div className={cn("w-2 h-2 rounded-full mt-2 mr-1", habitDotColor)} title={`${completedHabitsCount}/${totalActiveHabits} Habits Done`} />
                        )}
                      </div>

                      <div className="flex flex-col gap-0.5 overflow-hidden">
                        {dayData.tasks.slice(0, 2).map(t => (
                          <span key={t.id} className={cn("text-[10px] font-semibold px-1.5 py-0.5 truncate rounded-none", t.status === 'Done' ? "text-emerald-400 bg-emerald-500/10 line-through" : "text-primary bg-primary/10")}>
                            ✓ {t.title}
                          </span>
                        ))}
                        {dayData.events.slice(0, 1).map(e => (
                          <span key={e.id} className="text-[10px] font-semibold text-blue-300 bg-blue-500/10 px-1.5 py-0.5 truncate rounded-none">
                            📅 {e.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="xl:col-span-1 space-y-6">
          {panelDate && panelData ? (
            <div className="glass-card border border-white/10 rounded-none overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-white/5 bg-primary/5">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-primary">
                    {DAYS[panelDate.getDay()]}
                  </p>
                  <h4 className="text-xl font-black text-text-primary">
                    {MONTHS[panelDate.getMonth()]} {panelDate.getDate()}, {panelDate.getFullYear()}
                  </h4>
                </div>
                <button onClick={() => setPanelDate(null)} className="text-text-muted hover:text-text-primary">
                  <X size={18} />
                </button>
              </div>

              <div className="flex gap-2 p-4 border-b border-white/5 flex-wrap">
                {[
                  { tab: 'task' as const, label: 'Task', icon: CheckSquare, color: 'bg-primary/10 text-primary hover:bg-primary/20' },
                  { tab: 'event' as const, label: 'Event', icon: CalIcon, color: 'bg-blue-500/10 text-blue-300 hover:bg-blue-500/20' },
                  { tab: 'note' as const, label: 'Note', icon: FileText, color: 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20' },
                  { tab: 'habit' as const, label: 'Habit', icon: TrendingUp, color: 'bg-orange-500/10 text-orange-300 hover:bg-orange-500/20' },
                ].map(btn => (
                  <button
                    key={btn.tab}
                    onClick={() => openModal(btn.tab, panelDate)}
                    className={cn('flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-none transition-all', btn.color)}
                  >
                    <Plus size={12} />
                    <btn.icon size={12} />
                    {btn.label}
                  </button>
                ))}
              </div>

              <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
                {/* Habits Overview */}
                {allHabits.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-2">Habits</p>
                    <div className="space-y-1.5">
                      {allHabits.map(h => {
                        const log = panelData.habitLogs.find(l => l.habit_id === h.id);
                        const isDone = log?.status === 'done';
                        const isMissed = log?.status === 'missed';
                        return (
                          <div key={h.id} className="flex items-center gap-2 py-1 border-b border-white/5">
                            {isDone ? (
                              <CheckSquare size={14} className="text-emerald-400 shrink-0" />
                            ) : isMissed ? (
                              <X size={14} className="text-red-400 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 border border-text-muted/30 rounded-sm shrink-0" />
                            )}
                            <span className={cn("text-sm font-medium", isDone ? "text-emerald-400 line-through" : "text-text-primary")}>{h.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tasks */}
                {panelData.tasks.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Tasks Due</p>
                    {panelData.tasks.map(t => (
                      <div key={t.id} className="flex items-center gap-2 py-1.5 border-b border-white/5">
                        <CheckSquare size={14} className="text-primary shrink-0" />
                        <span className="text-sm font-medium text-text-primary truncate">{t.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Events */}
                {panelData.events.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-2">Events</p>
                    {panelData.events.map(e => (
                      <div key={e.id} className="flex items-center gap-2 py-1.5 border-b border-white/5">
                        <CalIcon size={14} className="text-blue-300 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{e.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes */}
                {panelData.notes.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Associated Notes</p>
                    {panelData.notes.map(n => (
                      <div key={n.id} className="flex items-center gap-2 py-1.5 border-b border-white/5">
                        <FileText size={14} className="text-emerald-400 shrink-0" />
                        <span className="text-sm font-medium text-text-primary truncate">{n.title || 'Untitled Note'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card border border-white/5 rounded-none p-8 text-center">
              <CalIcon size={32} className="mx-auto mb-3 text-text-muted/30" />
              <p className="text-text-muted text-sm font-medium">Click any date to view habits, notes, and tasks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
