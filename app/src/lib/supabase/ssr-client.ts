import { createBrowserClient } from '@supabase/ssr'
import { Database } from '../database.types'

// Create a Supabase client for browser-side rendering
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'
  )
}
