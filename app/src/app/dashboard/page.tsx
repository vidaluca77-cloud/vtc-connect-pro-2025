'use client'

import { useUser } from '@clerk/nextjs'
import { useVTCData } from '@/hooks/useVTCData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Euro, Car, TrendingUp, Target, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useUser()
  const {
    monthlyRevenue,
    monthlyRides,
    totalRevenue,
    totalRides,
    goalProgress,
    monthlyGoals,
    rides,
    loading,
    error
  } = useVTCData()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Veuillez vous connecter pour accéder au dashboard.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">Erreur de chargement</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user.firstName || 'Chauffeur'} ! 👋
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de votre activité VTC
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus ce mois</p>
                <p className="text-2xl font-bold">{monthlyRevenue.toFixed(2)}€</p>
              </div>
              <Euro className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Courses ce mois</p>
                <p className="text-2xl font-bold">{monthlyRides}</p>
              </div>
              <Car className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus total</p>
                <p className="text-2xl font-bold">{totalRevenue.toFixed(2)}€</p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Objectif mensuel</p>
                <p className="text-2xl font-bold">{goalProgress.toFixed(0)}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {monthlyGoals?.revenue_goal || 5000}€ visé
                </p>
              </div>
              <Target className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          {rides.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune course enregistrée. Ajoutez votre première course !
            </p>
          ) : (
            <div className="space-y-4">
              {rides.slice(0, 5).map((ride) => (
                <div key={ride.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Badge>{ride.platform}</Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      {ride.pickup_address} → {ride.destination_address}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{ride.price_euros}€</p>
                    <p className="text-xs text-gray-500">
                      {new Date(ride.ride_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
