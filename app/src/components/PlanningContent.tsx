'use client';

import { useState, useEffect } from 'react';
import { useApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import CalendarView from './CalendarView';
import StatsCard from './StatsCard';

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'course' | 'break' | 'maintenance' | 'blocked';
  status?: string;
  earnings?: number;
  platform?: string;
}

interface DayPlanning {
  date: string;
  availability: {
    status: 'available' | 'busy' | 'off' | 'maintenance';
    startTime?: string;
    endTime?: string;
  };
  events: CalendarEvent[];
  dailyGoals: {
    targetRides?: number;
    targetEarnings?: number;
    targetHours?: number;
  };
  actualResults: {
    totalRides?: number;
    totalEarnings?: number;
    totalHours?: number;
  };
}

export default function PlanningContent() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const api = useApi();
  
  const [loading, setLoading] = useState(true);
  const [planning, setPlanning] = useState<DayPlanning[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('week');
  const [weekStats, setWeekStats] = useState({
    availableHours: 0,
    bookedHours: 0,
    targetEarnings: 0,
    projectedEarnings: 0
  });

  // Mock data for planning
  const mockPlanning: DayPlanning[] = [
    {
      date: new Date().toISOString().split('T')[0],
      availability: {
        status: 'available',
        startTime: '08:00',
        endTime: '20:00'
      },
      events: [
        {
          id: '1',
          title: 'Course CDG → Paris 16e',
          startTime: '09:00',
          endTime: '10:30',
          type: 'course',
          status: 'confirmed',
          earnings: 85,
          platform: 'Uber'
        },
        {
          id: '2',
          title: 'Pause déjeuner',
          startTime: '12:00',
          endTime: '13:00',
          type: 'break'
        },
        {
          id: '3',
          title: 'Course Gare du Nord → La Défense',
          startTime: '14:30',
          endTime: '15:45',
          type: 'course',
          status: 'confirmed',
          earnings: 45,
          platform: 'Bolt'
        }
      ],
      dailyGoals: {
        targetRides: 8,
        targetEarnings: 300,
        targetHours: 10
      },
      actualResults: {
        totalRides: 6,
        totalEarnings: 245,
        totalHours: 8.5
      }
    },
    {
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      availability: {
        status: 'available',
        startTime: '07:00',
        endTime: '19:00'
      },
      events: [
        {
          id: '4',
          title: 'Course matinale Orly → Chatelet',
          startTime: '07:30',
          endTime: '09:00',
          type: 'course',
          status: 'scheduled',
          earnings: 75,
          platform: 'Heetch'
        }
      ],
      dailyGoals: {
        targetRides: 10,
        targetEarnings: 350,
        targetHours: 12
      },
      actualResults: {}
    },
    {
      date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      availability: {
        status: 'maintenance',
        startTime: '10:00',
        endTime: '16:00'
      },
      events: [
        {
          id: '5',
          title: 'Révision véhicule',
          startTime: '10:00',
          endTime: '16:00',
          type: 'maintenance'
        }
      ],
      dailyGoals: {},
      actualResults: {}
    }
  ];

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchPlanningData = async () => {
      setLoading(true);

      try {
        // Use mock data for now - in real app this would come from API
        setPlanning(mockPlanning);
        
        // Calculate week stats
        const totalAvailable = mockPlanning.reduce((sum, day) => {
          if (day.availability.status === 'available' && day.availability.startTime && day.availability.endTime) {
            const start = new Date(`2000-01-01T${day.availability.startTime}:00`);
            const end = new Date(`2000-01-01T${day.availability.endTime}:00`);
            return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          }
          return sum;
        }, 0);

        const totalBooked = mockPlanning.reduce((sum, day) => {
          return sum + day.events.filter(e => e.type === 'course').reduce((courseSum, event) => {
            const start = new Date(`2000-01-01T${event.startTime}:00`);
            const end = new Date(`2000-01-01T${event.endTime}:00`);
            return courseSum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          }, 0);
        }, 0);

        const totalTargetEarnings = mockPlanning.reduce((sum, day) => sum + (day.dailyGoals.targetEarnings || 0), 0);
        const totalProjectedEarnings = mockPlanning.reduce((sum, day) => {
          return sum + day.events.filter(e => e.earnings).reduce((eventSum, event) => eventSum + (event.earnings || 0), 0);
        }, 0);

        setWeekStats({
          availableHours: totalAvailable,
          bookedHours: totalBooked,
          targetEarnings: totalTargetEarnings,
          projectedEarnings: totalProjectedEarnings
        });
      } catch (error) {
        console.error('Error fetching planning data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanningData();
  }, [authLoading, isAuthenticated]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    console.log('Date clicked:', date);
  };

  const handleEventClick = (event: CalendarEvent, date: Date) => {
    console.log('Event clicked:', event, 'on date:', date);
  };

  const handleAddEvent = (date: Date) => {
    console.log('Add event for date:', date);
    // Open modal or form to add new event
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xl text-gray-600">Chargement du planning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📅 Planning</h1>
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              + Ajouter une course
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              ⚙️ Paramètres
            </button>
          </div>
        </div>

        {/* Week Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Heures disponibles"
            value={`${weekStats.availableHours.toFixed(0)}h`}
            subtitle="Cette semaine"
            icon="🕐"
            iconBgColor="bg-blue-100"
          />
          
          <StatsCard
            title="Heures réservées"
            value={`${weekStats.bookedHours.toFixed(0)}h`}
            subtitle={`${Math.round((weekStats.bookedHours / weekStats.availableHours) * 100) || 0}% d'occupation`}
            icon="📋"
            iconBgColor="bg-green-100"
          />
          
          <StatsCard
            title="Objectif revenus"
            value={`${weekStats.targetEarnings}€`}
            subtitle="Cette semaine"
            icon="🎯"
            iconBgColor="bg-purple-100"
          />
          
          <StatsCard
            title="Revenus projetés"
            value={`${weekStats.projectedEarnings}€`}
            subtitle={`${Math.round((weekStats.projectedEarnings / weekStats.targetEarnings) * 100) || 0}% de l'objectif`}
            icon="💰"
            iconBgColor="bg-orange-100"
            trend={weekStats.projectedEarnings >= weekStats.targetEarnings ? {
              value: Math.round(((weekStats.projectedEarnings / weekStats.targetEarnings) - 1) * 100),
              isPositive: true,
              period: 'vs objectif'
            } : {
              value: Math.round((1 - (weekStats.projectedEarnings / weekStats.targetEarnings)) * 100),
              isPositive: false,
              period: 'vs objectif'
            }}
          />
        </div>

        {/* Calendar */}
        <div className="mb-8">
          <CalendarView
            planning={planning}
            currentDate={selectedDate}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
            showWeekView={viewMode === 'week'}
          />
        </div>

        {/* Quick Actions and Templates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <span className="text-blue-600">🚗</span>
                <div className="text-left">
                  <div className="font-medium">Ajouter une course</div>
                  <div className="text-sm text-gray-600">Programmer une nouvelle course</div>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <span className="text-orange-600">☕</span>
                <div className="text-left">
                  <div className="font-medium">Bloquer du temps</div>
                  <div className="text-sm text-gray-600">Pause, repas ou indisponibilité</div>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                <span className="text-red-600">🔧</span>
                <div className="text-left">
                  <div className="font-medium">Maintenance véhicule</div>
                  <div className="text-sm text-gray-600">Révision, réparation</div>
                </div>
              </button>
            </div>
          </div>

          {/* Planning Templates */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Modèles de planning</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <span className="text-gray-600">📋</span>
                <div>
                  <div className="font-medium">Semaine standard</div>
                  <div className="text-sm text-gray-600">Lun-Ven 8h-20h, Weekend 9h-22h</div>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <span className="text-gray-600">🌙</span>
                <div>
                  <div className="font-medium">Soirées & weekends</div>
                  <div className="text-sm text-gray-600">Optimisé pour les sorties</div>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                <span className="text-gray-600">✈️</span>
                <div>
                  <div className="font-medium">Spécial aéroports</div>
                  <div className="text-sm text-gray-600">5h-23h avec pauses optimisées</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Planning d'aujourd'hui</h3>
          
          {planning.length > 0 && planning[0].events.length > 0 ? (
            <div className="space-y-3">
              {planning[0].events.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">
                    {event.type === 'course' ? '🚗' : event.type === 'break' ? '☕' : '🔧'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-600">
                      {event.startTime} - {event.endTime}
                      {event.platform && ` • ${event.platform}`}
                      {event.earnings && ` • ${event.earnings}€`}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status === 'confirmed' ? 'Confirmé' :
                     event.status === 'scheduled' ? 'Programmé' :
                     event.type === 'break' ? 'Pause' : 'Maintenance'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun événement programmé aujourd'hui</p>
              <p className="text-sm">Commencez par ajouter votre première course !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}