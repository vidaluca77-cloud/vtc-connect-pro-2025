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
