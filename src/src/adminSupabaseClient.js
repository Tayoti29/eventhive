import { createClient } from '@supabase/supabase-js'

// Uses the SAME Supabase project as your main app — just a separate
// client instance with its own storage key, so the admin session
// never collides with a regular user's logged-in session.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const adminSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'eventhive-admin-auth',
    persistSession: true,
    autoRefreshToken: true,
  },
})
