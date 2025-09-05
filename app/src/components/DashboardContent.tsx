'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';
import StatsCard from './StatsCard';
import RevenueChart from './RevenueChart';

interface DashboardStats {
  today: {
    rides: number;
    earnings: number;
    hours: number;
    avgRating: number;
  };
  week: {
    rides: number;
    earnings: number;
    hours: number;
  };
  month: {
    rides: number;
    earnings: number;
    hours: number;
  };
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
  icon: string;
}

interface ChartData {
  daily: {
    rides: number[];
    earnings: number[];
  };
  monthly: {
    rides: number[];
    earnings: number[];
  };
}

export default function DashboardContent() {
  const { user } = useUser();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const api = useApi();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'monthly'>('daily');

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch dashboard stats, activity, and chart data in parallel
        const [statsResult, activityResult, chartResult] = await Promise.all([
          api.dashboard.getStats(),
          api.dashboard.getActivity(),
          api.dashboard.getChartData()
        ]);

        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data.stats);
        } else {
          console.error('Failed to fetch stats:', statsResult.error);
          setError(statsResult.error || 'Failed to load dashboard data');
        }

        if (activityResult.success && activityResult.data) {
          setActivities(activityResult.data);
        } else {
          console.error('Failed to fetch activity:', activityResult.error);
        }

        if (chartResult.success && chartResult.data) {
          setChartData(chartResult.data as ChartData);
        } else {
          console.error('Failed to fetch chart data:', chartResult.error);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authLoading, isAuthenticated, api]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    
    return date.toLocaleDateString('fr-FR');
  };

  const getRevenueChartData = () => {
    if (!chartData) return { labels: [], revenue: [], rides: [] };
    
    const data = chartPeriod === 'daily' ? chartData.daily : chartData.monthly;
    
    if (chartPeriod === 'daily') {
      const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      return {
        labels,
        revenue: data.earnings,
        rides: data.rides
      };
    } else {
      const labels = [
        'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
        'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
      ];
      return {
        labels,
        revenue: data.earnings,
        rides: data.rides
      };
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">Erreur de chargement</h2>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Bienvenue, {user?.firstName || user?.emailAddresses[0]?.emailAddress} ! 
            Voici un aperçu de votre activité VTC.
          </p>
        </div>

        {/* Stats Grid with new StatsCard component */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Courses du jour"
            value={stats?.today.rides || 0}
            subtitle={stats?.week.rides ? `${stats.week.rides} cette semaine` : 'Aucune course cette semaine'}
            icon="🚗"
            iconBgColor="bg-blue-100"
            trend={stats?.today.rides && stats?.week.rides ? {
              value: Math.round(((stats.today.rides / (stats.week.rides / 7)) - 1) * 100),
              isPositive: stats.today.rides > (stats.week.rides / 7),
              period: 'vs moyenne'
            } : undefined}
          />

          <StatsCard
            title="Revenus du jour"
            value={stats?.today.earnings ? formatCurrency(stats.today.earnings) : '0€'}
            subtitle={stats?.week.earnings ? `${formatCurrency(stats.week.earnings)} cette semaine` : 'Aucun revenu cette semaine'}
            icon="💰"
            iconBgColor="bg-green-100"
            trend={stats?.today.earnings && stats?.week.earnings ? {
              value: Math.round(((stats.today.earnings / (stats.week.earnings / 7)) - 1) * 100),
              isPositive: stats.today.earnings > (stats.week.earnings / 7),
              period: 'vs moyenne'
            } : undefined}
          />

          <StatsCard
            title="Temps de travail"
            value={stats?.today.hours ? `${stats.today.hours}h` : '0h'}
            subtitle={stats?.week.hours ? `${stats.week.hours}h cette semaine` : 'Objectif: 40h/semaine'}
            icon="⏱️"
            iconBgColor="bg-purple-100"
          />

          <StatsCard
            title="Note moyenne"
            value={stats?.today.avgRating ? stats.today.avgRating.toFixed(1) : '5.0'}
            subtitle="Très bon !"
            icon="⭐"
            iconBgColor="bg-orange-100"
          />
        </div>

        {/* Revenue Chart */}
        {chartData && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Évolution des revenus</h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setChartPeriod('daily')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    chartPeriod === 'daily' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  7 jours
                </button>
                <button
                  onClick={() => setChartPeriod('monthly')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    chartPeriod === 'monthly' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  12 mois
                </button>
              </div>
            </div>
            
            <RevenueChart
              data={getRevenueChartData()}
              period={chartPeriod}
              type="line"
              height={400}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/web" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌐</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Interface Web</h3>
                <p className="text-gray-600 text-sm">Accéder à toutes les fonctionnalités</p>
              </div>
            </div>
          </Link>

          <Link href="/ia" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Intelligence Artificielle</h3>
                <p className="text-gray-600 text-sm">Optimiser votre activité</p>
              </div>
            </div>
          </Link>

          <Link href="/finances" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Gestion Financière</h3>
                <p className="text-gray-600 text-sm">Revenus, dépenses et rapports</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Activité récente</h2>
          
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune activité récente</p>
              <p className="text-sm">Commencez par ajouter votre première course !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-gray-600 text-sm">{activity.description}</p>
                    {activity.amount && (
                      <p className="text-green-600 text-sm font-medium">
                        {formatCurrency(activity.amount)}
                      </p>
                    )}
                  </div>
                  <span className="text-gray-500 text-sm">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}