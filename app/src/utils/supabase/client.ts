import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../../lib/database.types'

/**
 * Créer un client Supabase moderne pour le navigateur
 * Utilise @supabase/ssr pour une meilleure compatibilité SSR/CSR
 * Compatible avec Next.js 13+ App Router
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définis dans .env.local'
    )
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        // Persister la session dans localStorage
        persistSession: true,
        // Détecter automatiquement les changements de session
        autoRefreshToken: true,
        // Configuration des redirections
        flowType: 'pkce'
      },
      // Configuration du cache global
      global: {
        headers: {
          'X-Client-Info': 'vtc-connect-pro-2025/1.0.0'
        }
      }
    }
  )
}

// Export d'une instance par défaut pour usage simple
export const supabase = createClient()

// Export des types de base pour faciliter l'utilisation
export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Functions,
  Enums
} from '../../lib/database.types'

// Types utilitaires pour les tables principales
export type Profile = Database['public']['Tables']['profiles']['Row']
export type NewProfile = Database['public']['Tables']['profiles']['Insert']
export type UpdateProfile = Database['public']['Tables']['profiles']['Update']

export type Ride = Database['public']['Tables']['rides']['Row']
export type NewRide = Database['public']['Tables']['rides']['Insert']
export type UpdateRide = Database['public']['Tables']['rides']['Update']

export type Expense = Database['public']['Tables']['expenses']['Row']
export type NewExpense = Database['public']['Tables']['expenses']['Insert']
export type UpdateExpense = Database['public']['Tables']['expenses']['Update']

export type MonthlyGoal = Database['public']['Tables']['monthly_goals']['Row']
export type NewMonthlyGoal = Database['public']['Tables']['monthly_goals']['Insert']
export type UpdateMonthlyGoal = Database['public']['Tables']['monthly_goals']['Update']
