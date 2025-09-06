import { createClient } from '@supabase/supabase-js'

// Create a simple client that works in both server and client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
})

export type Profile = {
  id: string
  clerk_user_id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  licence_vtc: string | null
  vehicle_brand: string | null
  vehicle_model: string | null
  vehicle_plate: string | null
  vehicle_year: number | null
  created_at: string
  updated_at: string
}

export type Ride = {
  id: string
  user_id: string
  platform: string
  pickup_address: string
  destination_address: string
  client_name: string | null
  distance_km: number | null
  duration_minutes: number | null
  price_euros: number
  commission_euros: number | null
  net_earnings: number | null
  ride_date: string
  status: string
  notes: string | null
  created_at: string
}

export type Expense = {
  id: string
  user_id: string
  category: string
  amount_euros: number
  description: string | null
  expense_date: string
  receipt_url: string | null
  created_at: string
}

export type MonthlyGoal = {
  id: string
  user_id: string
  month: number
  year: number
  revenue_goal: number
  rides_goal: number
  hours_goal: number | null
  created_at: string
}
