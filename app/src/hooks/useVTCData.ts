'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
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
  const { user } = useUser()
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
    if (!user) {
      setData(prev => ({ ...prev, loading: false }))
      return
    }
    fetchUserData()
  }, [user])

  const fetchUserData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }))
      const clerkUserId = user!.id

      // 1. Récupérer profil utilisateur
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // Créer profil s'il n'existe pas
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            clerk_user_id: clerkUserId,
            email: user!.primaryEmailAddress?.emailAddress || '',
            first_name: user!.firstName || '',
            last_name: user!.lastName || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (createError) throw createError
        profile = newProfile
      } else if (profileError) {
        throw profileError
      }

      // 2. Récupérer courses
      const { data: rides, error: ridesError } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', profile.id)
        .order('ride_date', { ascending: false })

      if (ridesError) throw ridesError

      // 3. Récupérer dépenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', profile.id)
        .order('expense_date', { ascending: false })

      if (expensesError) throw expensesError

      // 4. Récupérer objectifs mensuels
      const currentMonth = new Date().getMonth() + 1
      const currentYear = new Date().getFullYear()

      const { data: monthlyGoals, error: goalsError } = await supabase
        .from('monthly_goals')
        .select('*')
        .eq('user_id', profile.id)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .single()

      // Calculer statistiques
      const totalRevenue = rides?.reduce((sum, ride) => sum + (ride.price_euros || 0), 0) || 0
      const totalRides = rides?.length || 0

      const monthlyRides = rides?.filter(ride => {
        const rideDate = new Date(ride.ride_date)
        return rideDate.getMonth() === (currentMonth - 1) && rideDate.getFullYear() === currentYear
      }) || []

      const monthlyRevenue = monthlyRides.reduce((sum, ride) => sum + (ride.price_euros || 0), 0)
      const goalProgress = monthlyGoals?.revenue_goal 
        ? Math.min((monthlyRevenue / monthlyGoals.revenue_goal) * 100, 100)
        : 0

      setData({
        profile,
        rides: rides || [],
        expenses: expenses || [],
        monthlyGoals,
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
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      }))
    }
  }

  const addRide = async (rideData: Record<string, unknown>) => {
    if (!data.profile) throw new Error('Profil utilisateur requis')

    const { data: newRide, error } = await supabase
      .from('rides')
      .insert({
        user_id: data.profile.id,
        ...rideData,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    await fetchUserData()
    return newRide
  }

  const addExpense = async (expenseData: Record<string, unknown>) => {
    if (!data.profile) throw new Error('Profil utilisateur requis')

    const { data: newExpense, error } = await supabase
      .from('expenses')
      .insert({
        user_id: data.profile.id,
        ...expenseData,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    await fetchUserData()
    return newExpense
  }

  const updateProfile = async (profileData: Record<string, unknown>) => {
    if (!data.profile) throw new Error('Profil utilisateur requis')

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.profile.id)
      .select()
      .single()

    if (error) throw error
    await fetchUserData()
    return updatedProfile
  }

  return {
    ...data,
    addRide,
    addExpense,
    updateProfile,
    refreshData: fetchUserData
  }
}