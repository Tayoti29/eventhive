import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔌 Supabase URL:', supabaseUrl ? '✅ Found' : '❌ MISSING')
console.log('🔑 Supabase Key:', supabaseAnonKey ? '✅ Found' : '❌ MISSING')

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

supabase.from('events').select('count').single().then(({ error }) => {
  if (error) console.error('❌ Supabase connection failed:', error.message)
  else console.log('✅ Supabase connected successfully!')
})