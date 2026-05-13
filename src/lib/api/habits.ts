import { supabase } from '../supabase';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  schedule: string;
  icon: string | null;
  is_active: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string; // YYYY-MM-DD
  status: 'done' | 'missed' | 'skipped';
  completed_at: string;
}

export const fetchHabits = async (userId: string): Promise<Habit[]> => {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching habits:', error);
    return [];
  }
  return data || [];
};

export const fetchHabitLogs = async (userId: string, startDate?: string, endDate?: string): Promise<HabitLog[]> => {
  let query = supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId);

  if (startDate) query = query.gte('completed_date', startDate);
  if (endDate) query = query.lte('completed_date', endDate);

  const { data, error } = await query.order('completed_date', { ascending: false });

  if (error) {
    console.error('Error fetching habit logs:', error);
    return [];
  }
  return data || [];
};

export const logHabit = async (
  habitId: string, 
  userId: string, 
  dateStr: string, 
  status: 'done' | 'missed' | 'skipped'
): Promise<HabitLog | null> => {
  
  // Use upsert to handle existing logs for the same day (assuming unique constraint exists)
  const { data, error } = await supabase
    .from('habit_logs')
    .upsert(
      { habit_id: habitId, user_id: userId, completed_date: dateStr, status },
      { onConflict: 'habit_id,completed_date' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error logging habit:', error);
    return null;
  }
  return data;
};

export const removeHabitLog = async (habitId: string, dateStr: string): Promise<boolean> => {
  const { error } = await supabase
    .from('habit_logs')
    .delete()
    .match({ habit_id: habitId, completed_date: dateStr });

  if (error) {
    console.error('Error removing habit log:', error);
    return false;
  }
  return true;
};
