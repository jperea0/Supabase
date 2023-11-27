import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_url;
const supabaseKey = import.meta.env.VITE_key;

export const supabase = createClient(supabaseUrl, supabaseKey);