import { createClient } from '@supabase/supabase-js';

const BOM = String.fromCharCode(0xFEFF);

function clean(val: string | undefined): string {
  return (val ?? '').split(BOM).join('').trim();
}

const supabaseUrl = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const serviceRoleKey = clean(process.env.SUPABASE_SERVICE_ROLE_KEY) || supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
