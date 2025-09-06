'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useVTCData } from '@/hooks/useVTCData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Euro, Car, TrendingUp, Target, AlertCircle, Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const {
    monthlyRevenue,
    monthlyRides,
    totalRevenue,
    totalRides,
    goalProgress,
    monthlyGoals,
    rides,
    loading,
    error,
    refreshData
  } = useVTCData()

  // État de non-authentification
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">
            Veuillez vous connecter pour accéder au dashboard.
          </p>
        </div>
      </div>
    )
  }

  // État de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    )
  }

  // État d'erreur
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des données: {error}
            <button 
              onClick={refreshData}
              className="ml-4 underline hover:no-underline"
            >
              Réessayer
            </button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Calculs dérivés
  const averageRideValue = totalRides > 0 ? totalRevenue / totalRides : 0
  const monthlyGoalProgress = monthlyGoals?.revenue > 0 
    ? (monthlyRevenue / monthlyGoals.revenue) * 100 : 0
  const ridesGoalProgress = monthlyGoals?.rides > 0 
    ? (monthlyRides / monthlyGoals.rides) * 100 : 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête avec informations chauffeur */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tableau de bord VTC
          </h1>
          <p className="text-muted-foreground mt-2">
            Bienvenue {user.firstName} {user.lastName}
          </p>
          {user.licenseNumber && (
            <Badge variant="outline" className="mt-2">
              Licence: {user.licenseNumber}
            </Badge>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
          </p>
          <button 
            onClick={refreshData}
            className="text-sm text-primary hover:underline mt-1"
          >
            Actualiser
          </button>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chiffre d'affaires mensuel
            </CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthlyRevenue?.toFixed(2) || '0.00'}€
            </div>
            {monthlyGoals?.revenue && (
              <div className="text-xs text-muted-foreground mt-1">
                Objectif: {monthlyGoals.revenue}€ ({monthlyGoalProgress.toFixed(1)}%)
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Courses mensuelles
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthlyRides || 0}
            </div>
            {monthlyGoals?.rides && (
              <div className="text-xs text-muted-foreground mt-1">
                Objectif: {monthlyGoals.rides} ({ridesGoalProgress.toFixed(1)}%)
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total revenus
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue?.toFixed(2) || '0.00'}€
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {totalRides || 0} courses au total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prix moyen par course
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageRideValue.toFixed(2)}€
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Moyenne calculée
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section des objectifs */}
      {(monthlyGoals?.revenue || monthlyGoals?.rides) && (
        <Card>
          <CardHeader>
            <CardTitle>Progression des objectifs mensuels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {monthlyGoals.revenue && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Chiffre d'affaires</span>
                  <span>{monthlyGoalProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(monthlyGoalProgress, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {monthlyRevenue?.toFixed(2) || 0}€ / {monthlyGoals.revenue}€
                </div>
              </div>
            )}
            
            {monthlyGoals.rides && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Nombre de courses</span>
                  <span>{ridesGoalProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(ridesGoalProgress, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {monthlyRides || 0} / {monthlyGoals.rides} courses
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Courses récentes */}
      {rides && rides.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Courses récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rides.slice(0, 5).map((ride, index) => (
                <div key={ride.id || index} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                  <div>
                    <p className="font-medium">
                      {ride.startAddress} → {ride.endAddress}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ride.date ? new Date(ride.date).toLocaleDateString('fr-FR') : 'Date inconnue'}
                      {ride.customerName && ` • ${ride.customerName}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{ride.price?.toFixed(2) || '0.00'}€</p>
                    <Badge 
                      variant={ride.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {ride.status === 'completed' ? 'Terminée' : 
                       ride.status === 'in_progress' ? 'En cours' :
                       ride.status === 'pending' ? 'En attente' : ride.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            {rides.length > 5 && (
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Et {rides.length - 5} autres courses...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Message si aucune donnée */}
      {(!rides || rides.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Aucune course enregistrée pour le moment.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Commencez à enregistrer vos courses pour voir vos statistiques ici.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
