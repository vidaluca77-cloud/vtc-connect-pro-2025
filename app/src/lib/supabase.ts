import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Environment variables are required for Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables at startup
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined'
  )
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`)
}

// Create Supabase client with optimized configuration
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable session persistence across browser sessions
    persistSession: true,
    // Automatically refresh tokens before expiration
    autoRefreshToken: true,
    // Detect authentication redirects in URL
    detectSessionInUrl: true,
    // Use secure storage when available
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    // Set custom redirect URL for production
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined
  },
  // Global configuration
  global: {
    headers: {
      'X-Client-Info': 'vtc-connect-pro-2025'
    }
  },
  // Database configuration
  db: {
    schema: 'public'
  },
  // Realtime configuration
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper function to handle Supabase errors consistently
export const handleSupabaseError = (error: any): string => {
  if (error?.message) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error checking authentication:', handleSupabaseError(error))
      return false
    }
    return !!session
  } catch (error) {
    console.error('Error checking authentication:', handleSupabaseError(error))
    return false
  }
}

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      throw new Error(handleSupabaseError(error))
    }
    return user
  } catch (error) {
    console.error('Error getting current user:', handleSupabaseError(error))
    return null
  }
}

// Export the client as default for convenience
export default supabase
