import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from './database.types'

export const supabase = createClientComponentClient<Database>()

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Ride = Database['public']['Tables']['rides']['Row']
export type Expense = Database['public']['Tables']['expenses']['Row']
export type MonthlyGoal = Database['public']['Tables']['monthly_goals']['Row']
