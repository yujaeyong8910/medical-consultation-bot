import { createClient } from '@supabase/supabase-js';

function clean(val: string | undefined): string {
  return (val ?? '').replace(/﻿/g, '').trim();
}

const supabaseUrl = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const serviceRoleKey = clean(process.env.SUPABASE_SERVICE_ROLE_KEY) || supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
