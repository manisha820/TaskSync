import { supabase } from '../supabase';

export interface Task {
  id: string;
  board_id: string;
  user_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export const fetchTasks = async (boardId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('board_id', boardId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
  return data || [];
};

export const createTask = async (task: Partial<Task>): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    return null;
  }
  return data;
};

export const updateTaskStatus = async (taskId: string, newStatus: string): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', taskId);

  if (error) {
    console.error('Error updating task status:', error);
    return false;
  }
  return true;
};
