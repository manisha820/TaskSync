import { supabase } from './supabase';

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) {
    console.error('Error signing in with Google:', error.message);
    throw error;
  }
};

export const signInWithGithub = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) {
    console.error('Error signing in with Github:', error.message);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
      },
    },
  });
  if (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }

  // Ensure public.users record exists to satisfy Foreign Key constraints
  if (data.user) {
    await supabase.from('users').upsert({
      id: data.user.id,
      email: data.user.email,
      full_name: name,
      created_at: new Date().toISOString()
    });
  }

  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }

  // Ensure public.users record exists (for legacy or OAuth users who might be missing it)
  if (data.user) {
    await supabase.from('users').upsert({
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata?.name || 'User',
      created_at: data.user.created_at
    });
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};
