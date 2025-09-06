export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: {
          clerk_user_id: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          licence_vtc?: string | null
          vehicle_brand?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_year?: number | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          licence_vtc?: string | null
          vehicle_brand?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_year?: number | null
          updated_at?: string
        }
      }
      rides: {
        Row: {
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
        Insert: {
          user_id: string
          platform: string
          pickup_address: string
          destination_address: string
          client_name?: string | null
          distance_km?: number | null
          duration_minutes?: number | null
          price_euros: number
          commission_euros?: number | null
          net_earnings?: number | null
          ride_date: string
          status?: string
          notes?: string | null
        }
        Update: {
          platform?: string
          pickup_address?: string
          destination_address?: string
          client_name?: string | null
          distance_km?: number | null
          duration_minutes?: number | null
          price_euros?: number
          commission_euros?: number | null
          net_earnings?: number | null
          ride_date?: string
          status?: string
          notes?: string | null
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          category: string
          amount_euros: number
          description: string | null
          expense_date: string
          receipt_url: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          category: string
          amount_euros: number
          description?: string | null
          expense_date: string
          receipt_url?: string | null
        }
        Update: {
          category?: string
          amount_euros?: number
          description?: string | null
          expense_date?: string
          receipt_url?: string | null
        }
      }
      monthly_goals: {
        Row: {
          id: string
          user_id: string
          month: number
          year: number
          revenue_goal: number
          rides_goal: number
          hours_goal: number | null
          created_at: string
        }
        Insert: {
          user_id: string
          month: number
          year: number
          revenue_goal?: number
          rides_goal?: number
          hours_goal?: number | null
        }
        Update: {
          revenue_goal?: number
          rides_goal?: number
          hours_goal?: number | null
        }
      }
    }
  }
}
