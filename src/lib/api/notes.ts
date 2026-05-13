import { supabase } from '../supabase';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  is_pinned: boolean;
  associated_date: string | null;
  created_at: string;
  updated_at: string;
}

export const fetchNotes = async (userId: string): Promise<Note[]> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
  return data || [];
};

export const saveNote = async (
  noteId: string | null, 
  userId: string, 
  title: string, 
  content: string, 
  tags: string[] = [],
  category: string = 'Personal Work',
  is_pinned: boolean = false,
  associated_date: string | null = null
): Promise<Note | null> => {
  if (noteId) {
    // Update existing
    const { data, error } = await supabase
      .from('notes')
      .update({ title, content, tags, category, is_pinned, associated_date, updated_at: new Date().toISOString() })
      .eq('id', noteId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating note:', error);
      return null;
    }
    return data;
  } else {
    // Insert new
    const { data, error } = await supabase
      .from('notes')
      .insert([{ user_id: userId, title, content, tags, category, is_pinned, associated_date }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating note:', error);
      return null;
    }
    return data;
  }
};

export const deleteNote = async (noteId: string): Promise<boolean> => {
  const { error } = await supabase.from('notes').delete().eq('id', noteId);
  if (error) {
    console.error('Error deleting note:', error);
    return false;
  }
  return true;
};
