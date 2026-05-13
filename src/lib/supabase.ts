import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing! Check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
} else {
  console.log('Supabase initialized with URL:', supabaseUrl.substring(0, 15) + '...');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder_key'
);

// B.L.A.S.T Layer 3: Deterministic Backend Utility Functions Example
export const fetchUserBoards = async (userId: string) => {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error fetching boards:', error);
    return null;
  }
  return data;
};
