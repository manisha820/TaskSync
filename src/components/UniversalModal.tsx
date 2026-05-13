import React, { useState } from 'react';
import { X, CheckSquare, FileText, TrendingUp, Loader2, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { createTask } from '../lib/api/tasks';
import { saveNote } from '../lib/api/notes';
import { supabase } from '../lib/supabase';

interface UniversalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialTab?: Tab;
  initialStatus?: string;
  initialDate?: Date;
}

type Tab = 'task' | 'note' | 'habit' | 'event';

function toDateInputValue(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function UniversalModal({
  isOpen,
  onClose,
  userId,
  initialTab = 'task',
  initialStatus = 'Todo',
  initialDate,
}: UniversalModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(initialDate ? toDateInputValue(initialDate) : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !userId) return;
    setError('');
    setIsSubmitting(true);

    try {
      // Self-healing: Ensure user profile exists in public.users
      const { data: userProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (!userProfile) {
        const { data: authUser } = await supabase.auth.getUser();
        await supabase.from('users').insert([{
          id: userId,
          email: authUser.user?.email,
          full_name:
            authUser.user?.user_metadata?.name ||
            authUser.user?.email?.split('@')[0] ||
            'User',
        }]);
      }

      if (activeTab === 'task') {
        // Find or auto-create the default board
        let boardId: string | undefined;
        const { data: boards } = await supabase
          .from('boards')
          .select('id')
          .eq('user_id', userId)
          .limit(1);

        if (boards && boards.length > 0) {
          boardId = boards[0].id;
        } else {
          const { data: newBoard, error: boardError } = await supabase
            .from('boards')
            .insert([{ user_id: userId, title: 'Main Board' }])
            .select()
            .single();
          if (boardError) throw boardError;
          boardId = newBoard.id;
        }

        await createTask({
          board_id: boardId,
          user_id: userId,
          title,
          status: status || 'Todo',
          priority,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
        });

      } else if (activeTab === 'note') {
        await saveNote(null, userId, title, content);

      } else if (activeTab === 'habit') {
        const { error: habitError } = await supabase
          .from('habits')
          .insert([{ user_id: userId, name: title, schedule: 'Daily' }]);
        if (habitError) throw habitError;

      } else if (activeTab === 'event') {
        const startDate = dueDate ? new Date(dueDate) : new Date();
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        const { error: evtError } = await supabase.from('calendar_events').insert([{
          user_id: userId,
          title,
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString(),
          is_all_day: false,
          description: content || null,
        }]);
        if (evtError) throw evtError;
      }

      // Reset & close
      setTitle('');
      setContent('');
      setDueDate('');
      onClose();
    } catch (err: any) {
      console.error('UniversalModal error:', err);
      setError(err?.message || 'Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'task', label: 'Task', icon: CheckSquare },
    { id: 'note', label: 'Note', icon: FileText },
    { id: 'habit', label: 'Habit', icon: TrendingUp },
    { id: 'event', label: 'Event', icon: Calendar },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-xl glass-card border border-white/10 animate-in fade-in zoom-in duration-200 shadow-2xl">
        {/* Tab Bar */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-none',
                  activeTab === tab.id
                    ? 'bg-primary text-text-on-primary shadow-lg shadow-primary/20'
                    : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                )}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Title */}
          <input
            autoFocus
            type="text"
            placeholder={
              activeTab === 'habit'
                ? 'Habit name (e.g. Morning Run)...'
                : activeTab === 'event'
                ? 'Event title...'
                : 'Title...'
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-2xl font-bold text-text-primary outline-none placeholder:text-text-muted/30"
          />

          {/* Content/Description (note & event) */}
          {(activeTab === 'note' || activeTab === 'event') && (
            <textarea
              placeholder={activeTab === 'note' ? 'Write your thoughts...' : 'Description (optional)...'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full bg-surface-dim/50 border border-white/5 text-sm text-text-muted rounded-none p-4 outline-none resize-none placeholder:text-text-muted/30 focus:border-primary/40 transition-colors"
            />
          )}

          {/* Task-specific fields */}
          {activeTab === 'task' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-surface-dim border border-white/5 text-text-primary text-sm rounded-none px-3 py-2 outline-none focus:border-primary/40"
                >
                  <option value="Todo">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-surface-dim border border-white/5 text-text-primary text-sm rounded-none px-3 py-2 outline-none focus:border-primary/40"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          )}

          {/* Due Date (task & event) */}
          {(activeTab === 'task' || activeTab === 'event') && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">
                {activeTab === 'task' ? 'Due Date' : 'Date & Time'}
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-surface-dim border border-white/5 text-text-primary text-sm rounded-none px-3 py-2 outline-none focus:border-primary/40"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 px-4 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-text-muted text-sm font-bold hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" /> Saving...</>
              ) : (
                `Create ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
