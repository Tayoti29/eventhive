import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔌 Supabase URL:', supabaseUrl ? '✅ Found' : '❌ MISSING')
console.log('🔑 Supabase Key:', supabaseAnonKey ? '✅ Found' : '❌ MISSING')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ MISSING Supabase credentials!')
  console.error('Create a .env file in your project root with:')
  console.error('VITE_SUPABASE_URL=your_url')
  console.error('VITE_SUPABASE_ANON_KEY=your_key')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Test the connection immediately
supabase.from('events').select('count').single().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection test failed:', error.message)
  } else {
    console.log('✅ Supabase connected successfully!')
  }
})