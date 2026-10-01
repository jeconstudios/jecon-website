import { createClient } from '@supabase/supabase-js';

// Public URL + anon/publishable key — safe in client-side code. Every table these
// touch has Row Level Security on; the anon key alone grants nothing.
const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key);
