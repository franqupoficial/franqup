import { createClient } from '@supabase/supabase-js';

// Encontre sua chave de 'service_role' no painel do Supabase, em Settings > API
const supabaseAdminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseAdmin = createClient(supabaseAdminUrl, supabaseAdminKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});