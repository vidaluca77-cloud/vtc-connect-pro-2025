'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
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
      message: 'The result contains 0 rows',
      code: 'NO_DATA',
      details: error
    }
  }

  if (error?.message?.includes('JWT')) {
    return {
      message: 'Authentication error. Please sign in again.',
      code: 'AUTH_ERROR',
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

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, return null instead of throwing
          return null
        }
        throw error
      }

      return profile
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw handleSupabaseError(error)
    }
  }, [])

  const fetchRides = useCallback(async (userId: string): Promise<Ride[]> => {
    try {
      const { data: rides, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (error) throw error
      return rides || []
    } catch (error) {
      console.error('Error fetching rides:', error)
      throw handleSupabaseError(error)
    }
  }, [])

  const fetchExpenses = useCallback(async (userId: string): Promise<Expense[]> => {
    try {
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (error) throw error
      return expenses || []
    } catch (error) {
      console.error('Error fetching expenses:', error)
      throw handleSupabaseError(error)
    }
  }, [])

  const fetchMonthlyGoals = useCallback(async (userId: string): Promise<MonthlyGoal | null> => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
      
      const { data: goals, error } = await supabase
        .from('monthly_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('month', currentMonth)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No goals found for this month, return null
          return null
        }
        throw error
      }

      return goals
    } catch (error) {
      console.error('Error fetching monthly goals:', error)
      throw handleSupabaseError(error)
    }
  }, [])

  const calculateMetrics = useCallback((rides: Ride[], expenses: Expense[], goals: MonthlyGoal | null) => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Filter rides and expenses for current month
    const monthlyRides = rides.filter(ride => {
      const rideDate = new Date(ride.date)
      return rideDate.getMonth() === currentMonth && rideDate.getFullYear() === currentYear
    })

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })

    // Calculate revenue
    const monthlyRevenue = monthlyRides.reduce((sum, ride) => sum + (ride.amount || 0), 0)
    const totalRevenue = rides.reduce((sum, ride) => sum + (ride.amount || 0), 0)
    const monthlyExpenseTotal = monthlyExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
    const netMonthlyRevenue = monthlyRevenue - monthlyExpenseTotal

    // Calculate goal progress
    let goalProgress = 0
    if (goals?.revenue_goal && goals.revenue_goal > 0) {
      goalProgress = (netMonthlyRevenue / goals.revenue_goal) * 100
    }

    return {
      monthlyRevenue: netMonthlyRevenue,
      monthlyRides: monthlyRides.length,
      totalRevenue,
      totalRides: rides.length,
      goalProgress: Math.min(goalProgress, 100) // Cap at 100%
    }
  }, [])

  const refreshData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }))
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      // Fetch all data concurrently
      const [profile, rides, expenses, monthlyGoals] = await Promise.all([
        fetchProfile(user.id),
        fetchRides(user.id),
        fetchExpenses(user.id),
        fetchMonthlyGoals(user.id)
      ])

      // Calculate metrics
      const metrics = calculateMetrics(rides, expenses, monthlyGoals)

      setData(prev => ({
        ...prev,
        profile,
        rides,
        expenses,
        monthlyGoals,
        ...metrics,
        loading: false,
        error: null,
        refreshData
      }))
    } catch (error: any) {
      console.error('Error refreshing VTC data:', error)
      const vtcError = handleSupabaseError(error)
      setData(prev => ({
        ...prev,
        loading: false,
        error: vtcError.message,
        refreshData
      }))
    }
  }, [fetchProfile, fetchRides, fetchExpenses, fetchMonthlyGoals, calculateMetrics])

  // Set refreshData function in initial state
  useEffect(() => {
    setData(prev => ({ ...prev, refreshData }))
  }, [refreshData])

  // Load data on mount
  useEffect(() => {
    refreshData()
  }, [refreshData])

  return data
}
