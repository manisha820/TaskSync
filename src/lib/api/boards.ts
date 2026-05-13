import { supabase } from '../supabase';

export interface Board {
  id: string;
  user_id: string;
  title: string;
  columns: string[];
  created_at: string;
}

export const getOrCreateDefaultBoard = async (userId: string): Promise<Board | null> => {
  // First, check if a board exists
  const { data: boards, error: fetchError } = await supabase
    .from('boards')
    .select('*')
    .eq('user_id', userId)
    .limit(1);

  if (fetchError) {
    console.error('Error fetching board:', fetchError);
    return null;
  }

  if (boards && boards.length > 0) {
    return boards[0];
  }

  // If no board exists, create one
  const { data: newBoard, error: insertError } = await supabase
    .from('boards')
    .insert([{
      user_id: userId,
      title: 'Main Board',
      columns: ['Todo', 'In Progress', 'Done']
    }])
    .select()
    .single();

  if (insertError) {
    console.error('Error creating default board:', insertError);
    return null;
  }

  return newBoard;
};
