import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseClient = null;

try {
  // Only create the client if the URL and Key are provided and look like valid strings
  if (supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

export const supabase = supabaseClient;
