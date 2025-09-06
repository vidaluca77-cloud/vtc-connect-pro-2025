import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Create a simple client that works in both server and client
const supabaseUrl = process.env.SUPABASE__URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.SUPABASE__ANON_KEY || 'placeholder_key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
})

// Export database types for convenience
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Ride = Database['public']['Tables']['rides']['Row']
export type NewProfile = Database['public']['Tables']['profiles']['Insert']
export type UpdateProfile = Database['public']['Tables']['profiles']['Update']
export type NewRide = Database['public']['Tables']['rides']['Insert']
export type UpdateRide = Database['public']['Tables']['rides']['Update']
