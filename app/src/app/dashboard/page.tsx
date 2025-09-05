import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Car,
  Clock,
  Euro,
  MapPin,
  Phone,
  Plus,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Navigation,
  Settings,
  Bell,
  Activity
} from 'lucide-react';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Mock data - remplacez par des données réelles depuis votre API
  const stats = {
    totalRides: 156,
    monthlyRevenue: 4250,
    averageRating: 4.8,
    activeBookings: 3
  };

  const recentRides = [
    {
      id: '1',
      passenger: 'Marie Dubois',
      pickup: 'Aéroport CDG',
      destination: 'Centre-ville Paris',
      time: '14:30',
      status: 'completed',
      amount: 45.50
    },
    {
      id: '2',
      passenger: 'Jean Martin',
      pickup: 'Gare du Nord',
      destination: 'La Défense',
      time: '12:15',
      status: 'completed',
      amount: 32.00
    },
    {
      id: '3',
      passenger: 'Sophie Laurent',
      pickup: 'République',
      destination: 'Orly Airport',
      time: '10:45',
      status: 'in-progress',
      amount: 55.00
    }
  ];

  const upcomingBookings = [
    {
      id: '1',
      passenger: 'Michel Bernard',
      pickup: 'Hotel Ritz',
      destination: 'Versailles',
      scheduledTime: '16:00',
      date: 'Aujourd\'hui',
      amount: 65.00
    },
    {
      id: '2',
      passenger: 'Claire Moreau',
      pickup: 'Châtelet',
      destination: 'CDG Terminal 2',
      scheduledTime: '08:30',
      date: 'Demain',
      amount: 50.00
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-900">VTC Connect Pro</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Tableau de bord</h2>
          <p className="text-slate-600">Bienvenue dans votre espace chauffeur VTC</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-6 w-6" />
              <span className="text-sm">Nouvelle course</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Gérer planning</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Navigation className="h-6 w-6" />
              <span className="text-sm">Navigation GPS</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Phone className="h-6 w-6" />
              <span className="text-sm">Support client</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Courses totales</CardTitle>
              <Car className="h-5 w-5 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRides}</div>
              <p className="text-xs opacity-90">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% ce mois
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Revenus mensuels</CardTitle>
              <Euro className="h-5 w-5 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyRevenue}€</div>
              <p className="text-xs opacity-90">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8% ce mois
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Note moyenne</CardTitle>
              <Star className="h-5 w-5 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}/5</div>
              <p className="text-xs opacity-90">
                <Activity className="inline h-3 w-3 mr-1" />
                124 évaluations
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Réservations actives</CardTitle>
              <Clock className="h-5 w-5 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeBookings}</div>
              <p className="text-xs opacity-90">
                <Users className="inline h-3 w-3 mr-1" />
                En attente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Rides */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="h-5 w-5" />
                  <span>Courses récentes</span>
                </CardTitle>
                <CardDescription>Vos dernières courses effectuées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRides.map((ride) => (
                    <div key={ride.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback>{ride.passenger.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{ride.passenger}</p>
                          <div className="flex items-center text-sm text-slate-600 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {ride.pickup} → {ride.destination}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{ride.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-900">{ride.amount}€</div>
                        <Badge 
                          variant={ride.status === 'completed' ? 'default' : 'secondary'}
                          className={`mt-1 ${ride.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                        >
                          {ride.status === 'completed' ? 'Terminée' : 'En cours'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <Button variant="outline" className="w-full">
                  Voir toutes les courses
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Bookings */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Prochaines réservations</span>
                </CardTitle>
                <CardDescription>Vos courses programmées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-slate-900">{booking.passenger}</p>
                        <Badge variant="outline">{booking.date}</Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        <div className="flex items-center mb-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {booking.scheduledTime}
                        </div>
                        <div className="flex items-center mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.pickup} → {booking.destination}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{booking.amount}€</span>
                        <Button size="sm" variant="outline">
                          Détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <Button variant="outline" className="w-full">
                  Voir le planning complet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
