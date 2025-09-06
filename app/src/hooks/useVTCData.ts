'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
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
      message: 'The requested resource was not found.',
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

export function useVTCData(): DashboardData {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [rides, setRides] = useState<Ride[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }
      
      setProfile(profileData)
      
      // Fetch rides for the current month
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      const { data: ridesData, error: ridesError } = await supabase
        .from('rides')
        .select('*')
        .eq('driver_id', user.id)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString())
        .order('created_at', { ascending: false })
      
      if (ridesError) {
        throw ridesError
      }
      
      setRides(ridesData || [])
      
      // Fetch expenses for the current month
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('driver_id', user.id)
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0])
        .order('date', { ascending: false })
      
      if (expensesError) {
        throw expensesError
      }
      
      setExpenses(expensesData || [])
      
      // Fetch monthly goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('monthly_goals')
        .select('*')
        .eq('driver_id', user.id)
        .eq('month', now.getMonth() + 1)
        .eq('year', now.getFullYear())
        .single()
      
      if (goalsError && goalsError.code !== 'PGRST116') {
        throw goalsError
      }
      
      setMonthlyGoals(goalsData)
      
    } catch (err) {
      const vtcError = handleSupabaseError(err)
      setError(vtcError.message)
      console.error('Error loading VTC data:', vtcError)
    } finally {
      setLoading(false)
    }
  }, [supabase])
  
  useEffect(() => {
    loadData()
  }, [loadData])
  
  // Calculate derived values
  const monthlyRevenue = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0)
  const monthlyRides = rides.length
  
  // For total values, we would need to fetch all rides, but for now we'll use monthly values
  const totalRevenue = monthlyRevenue
  const totalRides = monthlyRides
  
  const goalProgress = monthlyGoals?.revenue_goal 
    ? (monthlyRevenue / monthlyGoals.revenue_goal) * 100 
    : 0
  
  return {
    profile,
    rides,
    expenses,
    monthlyGoals,
    monthlyRevenue,
    monthlyRides,
    totalRevenue,
    totalRides,
    goalProgress,
    loading,
    error,
    refreshData: loadData
  }
}
