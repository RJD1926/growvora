import { createClient } from '@supabase/supabase-js';

const CONFIG_STORAGE_KEY = 'growvora_supabase_config_v1';

// Default Supabase project configuration
const DEFAULT_SUPABASE_URL = 'https://kcyxuitejytjkvrceyjn.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_5mGcxPyDIDoS3iHhFstZmw_b2FUZzR4';

// Read config from environment variables, localStorage, or defaults
export const getSupabaseConfig = () => {
  try {
    const local = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    }
  } catch (e) {
    // fallback
  }

  return {
    url: import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY
  };
};

export const saveSupabaseConfig = (url, anonKey) => {
  const cleanUrl = (url || '').trim();
  const cleanKey = (anonKey || '').trim();
  const config = { url: cleanUrl, anonKey: cleanKey };
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  reinitializeSupabaseClient();
  window.dispatchEvent(new CustomEvent('growvora_cloud_config_updated'));
  return config;
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
  reinitializeSupabaseClient();
  window.dispatchEvent(new CustomEvent('growvora_cloud_config_updated'));
};

let supabaseInstance = null;

const reinitializeSupabaseClient = () => {
  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      supabaseInstance = null;
    }
  } else {
    supabaseInstance = null;
  }
  return supabaseInstance;
};

// Initial setup
reinitializeSupabaseClient();

export const getSupabase = () => {
  if (!supabaseInstance) {
    return reinitializeSupabaseClient();
  }
  return supabaseInstance;
};

export const isSupabaseConfigured = () => {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
};

export const testSupabaseConnection = async () => {
  const client = getSupabase();
  if (!client) {
    return { success: false, message: 'Supabase URL and Anon Key are required.' };
  }

  try {
    // Test read from growvora_store table
    const { data, error } = await client
      .from('growvora_store')
      .select('key')
      .limit(1);

    if (error) {
      // If table doesn't exist yet, message user with instructions
      if (
        error.code === '42P01' || 
        error.code === 'PGRST205' || 
        (error.message && error.message.toLowerCase().includes('growvora_store'))
      ) {
        return {
          success: false,
          needsTable: true,
          message: 'Connected to your Supabase project! Please run the SQL snippet below in your Supabase SQL Editor to create the "growvora_store" table.'
        };
      }
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Successfully connected to Supabase Cloud Database!' };
  } catch (err) {
    return { success: false, message: err.message || 'Connection failed' };
  }
};

