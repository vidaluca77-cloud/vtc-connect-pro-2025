'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Ride, Expense, MonthlyGoal } from '@/lib/supabase'

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
        setData(prev => ({ ...prev, loading: true, error: null }))
        
        // Create Supabase client for this request
        const supabase = createClient()
        
        // Get current user from Supabase Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          throw new Error(`Authentication error: ${authError.message}`)
        }
        
        if (!user) {
          setData(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'User not authenticated' 
          }))
          return
        }

        const userId = user.id
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1
        const currentYear = currentDate.getFullYear()

        // Fetch all data concurrently
        const [profileResult, ridesResult, expensesResult] = await Promise.all([
          supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single(),
          supabase
            .from('rides')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false }),
          supabase
            .from('expenses')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })
        ])

        if (profileResult.error && profileResult.error.code !== 'PGRST116') {
          throw new Error(`Profile fetch error: ${profileResult.error.message}`)
        }
        if (ridesResult.error) {
          throw new Error(`Rides fetch error: ${ridesResult.error.message}`)
        }
        if (expensesResult.error) {
          throw new Error(`Expenses fetch error: ${expensesResult.error.message}`)
        }

        const profile = profileResult.data
        const rides = ridesResult.data
        const expenses = expensesResult.data

        // Fetch monthly goals
        const { data: monthlyGoals, error: goalsError } = await supabase
          .from('monthly_goals')
          .select('*')
          .eq('user_id', userId)
          .eq('month', currentMonth)
          .eq('year', currentYear)
          .single()

        if (goalsError && goalsError.code !== 'PGRST116') {
          throw new Error(`Goals fetch error: ${goalsError.message}`)
        }

        // Calculate metrics
        const currentMonthStart = new Date(currentYear, currentMonth - 1, 1).toISOString()
        const nextMonthStart = new Date(currentYear, currentMonth, 1).toISOString()

        const monthlyRides = rides?.filter(ride => 
          ride.date >= currentMonthStart && ride.date < nextMonthStart
        ) || []

        const monthlyRevenue = monthlyRides.reduce((sum, ride) => sum + (ride.amount || 0), 0)
        const totalRevenue = rides?.reduce((sum, ride) => sum + (ride.amount || 0), 0) || 0
        const totalRides = rides?.length || 0
        
        const goalProgress = monthlyGoals?.revenue_goal 
          ? (monthlyRevenue / monthlyGoals.revenue_goal) * 100 
          : 0

        setData({
          profile: profile || null,
          rides: rides || [],
          expenses: expenses || [],
          monthlyGoals: monthlyGoals || null,
          monthlyRevenue,
          monthlyRides: monthlyRides.length,
          totalRevenue,
          totalRides,
          goalProgress,
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('Error fetching VTC data:', error)
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An unexpected error occurred'
        }))
      }
    }

    fetchVTCData()
  }, [])

  return data
}
