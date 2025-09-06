'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/ssr-client'
import type { Profile, Ride, Expense, MonthlyGoal } from '@/lib/types/database'

export interface DashboardData {
  profile: Profile | null
  rides: Ride[]
  expenses: Expense[]
  monthlyGoals: MonthlyGoal | null
  monthlyRevenue: number
  monthlyRides: number
  totalRevenue: number
  totalRides: number
  goalProgress: number
  loading: boolean
  error: string | null
}

export const useVTCData = () => {
  const [data, setData] = useState<DashboardData>({
    profile: null,
    rides: [],
    expenses: [],
    monthlyGoals: null,
    monthlyRevenue: 0,
    monthlyRides: 0,
    totalRevenue: 0,
    totalRides: 0,
    goalProgress: 0,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchVTCData = async () => {
      try {
        const supabase = createClient()
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          throw new Error('User not authenticated')
        }

        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          throw new Error('Failed to fetch profile')
        }

        // Fetch rides with corrected field name: driver_id instead of user_id
        const { data: rides, error: ridesError } = await supabase
          .from('rides')
          .select('*')
          .eq('driver_id', user.id)
          .order('created_at', { ascending: false })

        if (ridesError) {
          throw new Error('Failed to fetch rides')
        }

        // Fetch expenses with corrected field name: driver_id instead of user_id  
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('*')
          .eq('driver_id', user.id)
          .order('created_at', { ascending: false })

        if (expensesError) {
          throw new Error('Failed to fetch expenses')
        }

        // Fetch monthly goals with corrected field name: driver_id instead of user_id
        const currentMonth = new Date().toISOString().slice(0, 7)
        const { data: monthlyGoals, error: goalsError } = await supabase
          .from('monthly_goals')
          .select('*')
          .eq('driver_id', user.id)
          .eq('month', currentMonth)
          .single()

        // Calculate metrics using corrected field name: total_amount instead of amount
        const currentMonthRides = rides?.filter(ride => 
          ride.created_at.startsWith(currentMonth)
        ) || []
        
        const monthlyRevenue = currentMonthRides.reduce((sum, ride) => 
          sum + (ride.total_amount || 0), 0
        )
        
        const totalRevenue = rides?.reduce((sum, ride) => 
          sum + (ride.total_amount || 0), 0
        ) || 0
        
        const goalProgress = monthlyGoals?.revenue_goal 
          ? (monthlyRevenue / monthlyGoals.revenue_goal) * 100 
          : 0

        setData({
          profile,
          rides: rides || [],
          expenses: expenses || [],
          monthlyGoals: monthlyGoals || null,
          monthlyRevenue,
          monthlyRides: currentMonthRides.length,
          totalRevenue,
          totalRides: rides?.length || 0,
          goalProgress,
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('Error fetching VTC data:', error)
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred'
        }))
      }
    }

    fetchVTCData()
  }, [])

  return data
}
