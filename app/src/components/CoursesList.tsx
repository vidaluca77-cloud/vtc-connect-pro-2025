'use client';

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Course {
  id: string;
  platform: string;
  startLocation: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  endLocation: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  distance: number;
  duration: number;
  price: {
    gross: number;
    commission: number;
    net: number;
    tip?: number;
  };
  status: string;
  passenger: {
    name: string;
    rating?: number;
  };
  rating?: {
    score: number;
    comment?: string;
  };
  scheduledDateTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
}

interface CoursesListProps {
  courses: Course[];
  loading?: boolean;
  onCourseClick?: (course: Course) => void;
  showFilters?: boolean;
}

export default function CoursesList({ 
  courses, 
  loading = false, 
  onCourseClick,
  showFilters = true 
}: CoursesListProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminée';
      case 'in_progress':
        return 'En cours';
      case 'scheduled':
        return 'Programmée';
      case 'cancelled':
        return 'Annulée';
      case 'no_show':
        return 'Absent';
      default:
        return status;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'uber':
        return '🚗';
      case 'bolt':
        return '⚡';
      case 'heetch':
        return '🎯';
      case 'marcel':
        return '🎩';
      case 'kapten':
        return '🚁';
      case 'direct':
        return '📱';
      default:
        return '🚙';
    }
  };

  const filteredCourses = courses
    .filter(course => filterStatus === 'all' || course.status === filterStatus)
    .filter(course => filterPlatform === 'all' || course.platform === filterPlatform)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.scheduledDateTime).getTime() - new Date(a.scheduledDateTime).getTime();
        case 'earnings':
          return b.price.net - a.price.net;
        case 'distance':
          return b.distance - a.distance;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Courses</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Courses ({filteredCourses.length})</h3>
        
        {showFilters && (
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="completed">Terminées</option>
              <option value="in_progress">En cours</option>
              <option value="scheduled">Programmées</option>
              <option value="cancelled">Annulées</option>
            </select>
            
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">Toutes les plateformes</option>
              <option value="uber">Uber</option>
              <option value="bolt">Bolt</option>
              <option value="heetch">Heetch</option>
              <option value="marcel">Marcel</option>
              <option value="direct">Direct</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="date">Date</option>
              <option value="earnings">Revenus</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        )}
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucune course trouvée</p>
          <p className="text-sm">Commencez par ajouter votre première course !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors ${
                onCourseClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onCourseClick?.(course)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl">
                    {getPlatformIcon(course.platform)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-600 uppercase">
                        {course.platform}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                        {getStatusText(course.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">📍</span>
                        <span className="text-gray-900">{course.startLocation.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-red-600">🏁</span>
                        <span className="text-gray-900">{course.endLocation.address}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                      <span>👤 {course.passenger.name}</span>
                      <span>📏 {course.distance.toFixed(1)} km</span>
                      <span>⏱️ {course.duration} min</span>
                      {course.passenger.rating && (
                        <span>⭐ {course.passenger.rating}/5</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(course.price.net + (course.price.tip || 0))}
                  </div>
                  <div className="text-xs text-gray-500">
                    Net: {formatCurrency(course.price.net)}
                  </div>
                  {course.price.tip && course.price.tip > 0 && (
                    <div className="text-xs text-green-600">
                      +{formatCurrency(course.price.tip)} pourboire
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(course.scheduledDateTime), { 
                      addSuffix: true,
                      locale: fr 
                    })}
                  </div>
                </div>
              </div>
              
              {course.rating && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Votre note:</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < course.rating!.score ? 'text-yellow-400' : 'text-gray-300'}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({course.rating.score}/5)</span>
                  </div>
                  {course.rating.comment && (
                    <p className="text-xs text-gray-600 mt-1">"{course.rating.comment}"</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}