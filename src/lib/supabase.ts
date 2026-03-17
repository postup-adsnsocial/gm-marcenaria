import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zbyxxnamglnljfggzlze.supabase.co'; 
const supabaseAnonKey = 'sb_publishable_k273B3_VOl41wwT2j-pveg_ZuiECkvN';

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
