'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/ssr-client'
import { User } from '@supabase/supabase-js'
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
  refreshData: () => Promise<void>
}

interface VTCDataError {
  message: string
  code?: string
  details?: any
}

// Custom error handling function
const handleSupabaseError = (error: any): VTCDataError => {
  if (error?.code === 'PGRST301') {
    return {
      message: 'Access denied. Please check your permissions.',
      code: 'UNAUTHORIZED',
      details: error
    }
  }
  if (error?.code === 'PGRST116') {
    return {
      message: 'No data found or access restricted.',
      code: 'NOT_FOUND',
      details: error
    }
  }
  return {
    message: error?.message || 'An unexpected error occurred',
    code: error?.code || 'UNKNOWN_ERROR',
    details: error
  }
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
    error: null,
    refreshData: async () => {}
  })

  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const supabase = createClient()

  // Authentication check function
  const checkAuthentication = useCallback(async (): Promise<boolean> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Authentication error:', error)
        setIsAuthenticated(false)
        setUser(null)
        return false
      }
      
      if (!user) {
        setIsAuthenticated(false)
        setUser(null)
        return false
      }
      
      setUser(user)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      console.error('Unexpected authentication error:', error)
      setIsAuthenticated(false)
      setUser(null)
      return false
    }
  }, [supabase.auth])

  // Optimized data fetching with proper error handling and RLS compliance
  const fetchVTCData = useCallback(async (): Promise<void> => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }))
      
      // 1. Verify authentication before any database operations
      const authenticated = await checkAuthentication()
      if (!authenticated) {
        throw new Error('User must be authenticated to access VTC data')
      }
      
      if (!user?.id) {
        throw new Error('User ID is required for data access')
      }

      // 2. Fetch profile with RLS policy compliance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        throw handleSupabaseError(profileError)
      }

      // 3. Fetch rides with optimized query and RLS compliance
      const { data: rides, error: ridesError } = await supabase
        .from('rides')
        .select(`
          id,
          driver_id,
          pickup_location,
          dropoff_location,
          pickup_time,
          dropoff_time,
          distance,
          duration,
          total_amount,
          status,
          created_at,
          updated_at
        `)
        .eq('driver_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1000) // Limit for performance

      if (ridesError) {
        throw handleSupabaseError(ridesError)
      }

      // 4. Fetch expenses with RLS compliance
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select(`
          id,
          driver_id,
          category,
          amount,
          description,
          date,
          receipt_url,
          created_at,
          updated_at
        `)
        .eq('driver_id', user.id)
        .order('date', { ascending: false })
        .limit(500) // Limit for performance

      if (expensesError) {
        throw handleSupabaseError(expensesError)
      }

      // 5. Fetch monthly goals with current month filter for performance
      const currentMonth = new Date().toISOString().slice(0, 7)
      const { data: monthlyGoals, error: goalsError } = await supabase
        .from('monthly_goals')
        .select(`
          id,
          driver_id,
          month,
          revenue_goal,
          rides_goal,
          expenses_budget,
          created_at,
          updated_at
        `)
        .eq('driver_id', user.id)
        .eq('month', currentMonth)
        .maybeSingle() // Use maybeSingle to avoid error when no record exists

      if (goalsError) {
        throw handleSupabaseError(goalsError)
      }

      // 6. Calculate metrics with null safety
      const currentMonthRides = rides?.filter(ride => 
        ride.created_at?.startsWith(currentMonth)
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

      // 7. Update state with calculated data
      setData(prevData => ({
        ...prevData,
        profile: profile || null,
        rides: rides || [],
        expenses: expenses || [],
        monthlyGoals: monthlyGoals || null,
        monthlyRevenue,
        monthlyRides: currentMonthRides.length,
        totalRevenue,
        totalRides: rides?.length || 0,
        goalProgress: Math.min(goalProgress, 100), // Cap at 100%
        loading: false,
        error: null
      }))
      
    } catch (error) {
      console.error('Error fetching VTC data:', error)
      
      const vtcError = error instanceof Error ? error : new Error('Unknown error occurred')
      
      setData(prev => ({
        ...prev,
        loading: false,
        error: vtcError.message
      }))
    }
  }, [user?.id, supabase, checkAuthentication])

  // Memoized refresh function to avoid unnecessary re-renders
  const refreshData = useCallback(async (): Promise<void> => {
    await fetchVTCData()
  }, [fetchVTCData])

  // Authentication state listener
  useEffect(() => {
    let mounted = true
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
          await fetchVTCData()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setIsAuthenticated(false)
          setData({
            profile: null,
            rides: [],
            expenses: [],
            monthlyGoals: null,
            monthlyRevenue: 0,
            monthlyRides: 0,
            totalRevenue: 0,
            totalRides: 0,
            goalProgress: 0,
            loading: false,
            error: null,
            refreshData: async () => {}
          })
        }
      }
    )

    // Initial auth check and data fetch
    checkAuthentication().then(authenticated => {
      if (mounted && authenticated) {
        fetchVTCData()
      } else if (mounted) {
        setData(prev => ({ ...prev, loading: false }))
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, []) // Empty dependency array is intentional

  // Update refreshData in the returned data object
  useEffect(() => {
    setData(prev => ({ ...prev, refreshData }))
  }, [refreshData])

  return {
    ...data,
    isAuthenticated,
    user,
    refreshData
  }
}
