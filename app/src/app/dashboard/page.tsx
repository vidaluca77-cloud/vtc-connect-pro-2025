'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useVTCData } from '@/hooks/useVTCData'
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
          <AlertCircle className="mx-auto h-12 w-12 text-gray-500 mb-4" />
          <p className="text-gray-600 text-lg">
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
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    )
  }

  // État d'erreur
  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">
              Erreur lors du chargement des données: {error}
            </p>
          </div>
        </div>
        <button 
          onClick={refreshData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord VTC
          </h1>
          <p className="text-gray-600">
            Bienvenue, {user.name || user.email}
          </p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenus du mois */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Revenus du mois
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {monthlyRevenue?.toLocaleString('fr-FR')}€
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Euro className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Courses du mois */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Courses du mois
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {monthlyRides || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Revenus totaux */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Revenus totaux
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalRevenue?.toLocaleString('fr-FR')}€
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Total courses */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total courses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalRides || 0}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Objectifs du mois */}
        {monthlyGoals && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center mb-4">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">
                Objectifs du mois
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Objectif revenus */}
              {monthlyGoals.revenue && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Revenus
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {monthlyRevenue?.toLocaleString('fr-FR')}€ / {monthlyGoals.revenue.toLocaleString('fr-FR')}€
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((monthlyRevenue || 0) / monthlyGoals.revenue * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((monthlyRevenue || 0) / monthlyGoals.revenue * 100)}% atteint
                  </p>
                </div>
              )}

              {/* Objectif courses */}
              {monthlyGoals.rides && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Courses
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {monthlyRides || 0} / {monthlyGoals.rides}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((monthlyRides || 0) / monthlyGoals.rides * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((monthlyRides || 0) / monthlyGoals.rides * 100)}% atteint
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Courses récentes */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Courses récentes
            </h2>
          </div>
          <div className="p-6">
            {rides && rides.length > 0 ? (
              <div className="space-y-4">
                {rides.slice(0, 5).map((ride, index) => (
                  <div key={ride.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Car className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {ride.pickup} → {ride.destination}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(ride.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {ride.amount}€
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ride.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : ride.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ride.status === 'completed' && 'Terminée'}
                        {ride.status === 'cancelled' && 'Annulée'}
                        {ride.status === 'pending' && 'En attente'}
                        {ride.status === 'in_progress' && 'En cours'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Aucune course enregistrée pour le moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
