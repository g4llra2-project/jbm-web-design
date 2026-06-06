import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Create client only if configuration variables are available to prevent crash
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Service to sync and fetch JBM CMS Config data to/from Supabase JSONB
 */
const CONFIG_ROW_KEY = 'jbm_main_config';

export async function fetchCMSDataFromSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured yet. Make sure VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY are in your .env');
  }

  const { data, error } = await supabase
    .from('jbm_cms_config')
    .select('data')
    .eq('key', CONFIG_ROW_KEY)
    .maybeSingle();

  if (error) {
    console.error('Supabase fetch error:', error);
    throw error;
  }

  return data?.data || null;
}

export async function saveCMSDataToSupabase(newData: any) {
  if (!supabase) {
    throw new Error('Supabase is not configured yet.');
  }

  const { error } = await supabase
    .from('jbm_cms_config')
    .upsert({
      key: CONFIG_ROW_KEY,
      data: newData
    }, {
      onConflict: 'key'
    });

  if (error) {
    console.error('Supabase save error:', error);
    throw error;
  }

  return true;
}
