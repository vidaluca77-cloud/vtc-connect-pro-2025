'use client';

import { useUser } from '@clerk/nextjs';
import { useVTCData } from '../hooks/useVTCData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar, Clock, Car } from 'lucide-react';

export default function PlanningContent() {
  const { user } = useUser();
  const { rides, loading } = useVTCData();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Veuillez vous connecter pour accéder au planning.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Chargement du planning...</p>
      </div>
    );
  }

  const today = new Date();
  const todayRides = rides.filter(ride => {
    const rideDate = new Date(ride.ride_date);
    return rideDate.toDateString() === today.toDateString();
  });

  const upcomingRides = rides.filter(ride => {
    const rideDate = new Date(ride.ride_date);
    return rideDate > today;
  }).slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Planning</h2>
        <p className="text-gray-600">Gérez votre planning et vos courses</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses aujourd'hui</CardTitle>
            <Car className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayRides.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses à venir</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingRides.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ce mois</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rides.filter(ride => {
                const rideDate = new Date(ride.ride_date);
                return rideDate.getMonth() === today.getMonth() && 
                       rideDate.getFullYear() === today.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Planning d'aujourd'hui</CardTitle>
        </CardHeader>
        <CardContent>
          {todayRides.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune course programmée aujourd'hui</p>
          ) : (
            <div className="space-y-4">
              {todayRides.map((ride) => (
                <div key={ride.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Car className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{ride.platform}</p>
                      <p className="text-sm text-gray-600">
                        {ride.pickup_address} → {ride.destination_address}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(ride.ride_date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{ride.price_euros}€</p>
                    <p className="text-xs text-gray-500">{ride.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Rides */}
      <Card>
        <CardHeader>
          <CardTitle>Prochaines courses</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingRides.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune course programmée</p>
          ) : (
            <div className="space-y-4">
              {upcomingRides.map((ride) => (
                <div key={ride.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{ride.platform}</p>
                      <p className="text-sm text-gray-600">
                        {ride.pickup_address} → {ride.destination_address}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(ride.ride_date).toLocaleDateString()} à {new Date(ride.ride_date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{ride.price_euros}€</p>
                    <p className="text-xs text-gray-500">{ride.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Planning Tools */}
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Outils de planning avancés</h3>
        <p className="text-gray-600 mb-6">
          Les fonctionnalités de planning avancées seront bientôt disponibles.
        </p>
        <p className="text-sm text-gray-500">
          Synchronisation avec les plateformes, optimisation d'itinéraires, gestion des disponibilités.
        </p>
      </div>
    </div>
  );
}