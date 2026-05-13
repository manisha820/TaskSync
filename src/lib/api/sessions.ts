import { supabase } from '../supabase';

export interface WorkSession {
  id: string;
  user_id: string;
  task_id: string | null;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  focus_score: number | null;
  tasks_completed: number;
  reflection_notes: string | null;
}

export const startWorkSession = async (userId: string, taskId: string | null = null): Promise<WorkSession | null> => {
  const { data, error } = await supabase
    .from('work_sessions')
    .insert([{ user_id: userId, task_id: taskId, start_time: new Date().toISOString() }])
    .select()
    .single();

  if (error) {
    console.error('Error starting work session:', error);
    return null;
  }
  return data;
};

export const endWorkSession = async (sessionId: string, duration: number, tasksCompleted: number = 0): Promise<boolean> => {
  const { error } = await supabase
    .from('work_sessions')
    .update({ 
      end_time: new Date().toISOString(), 
      duration_minutes: duration,
      tasks_completed: tasksCompleted
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Error ending work session:', error);
    return false;
  }
  return true;
};
