'use client';

import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

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

interface CalendarViewProps {
  planning: DayPlanning[];
  currentDate?: Date;
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent, date: Date) => void;
  onAddEvent?: (date: Date) => void;
  showWeekView?: boolean;
}

export default function CalendarView({
  planning,
  currentDate = new Date(),
  onDateClick,
  onEventClick,
  onAddEvent,
  showWeekView = false
}: CalendarViewProps) {
  const [viewDate, setViewDate] = useState(currentDate);
  const [viewMode, setViewMode] = useState<'month' | 'week'>(showWeekView ? 'week' : 'month');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-300';
      case 'busy':
        return 'bg-yellow-100 border-yellow-300';
      case 'off':
        return 'bg-gray-100 border-gray-300';
      case 'maintenance':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'bg-blue-500 text-white';
      case 'break':
        return 'bg-orange-500 text-white';
      case 'maintenance':
        return 'bg-red-500 text-white';
      case 'blocked':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getPlanningForDate = (date: Date): DayPlanning | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return planning.find(p => p.date === dateStr);
  };

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = useMemo(() => {
    const days = [];
    let currentDay = calendarStart;

    while (currentDay <= calendarEnd) {
      days.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }

    return days;
  }, [calendarStart, calendarEnd]);

  const weekDays = useMemo(() => {
    if (viewMode !== 'week') return [];
    
    const weekStart = startOfWeek(viewDate, { weekStartsOn: 1 });
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }
    
    return days;
  }, [viewDate, viewMode]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setViewDate(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setViewDate(newDate);
  };

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-1">
      {/* Weekday headers */}
      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
        <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 bg-gray-50">
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {calendarDays.map((day) => {
        const dayPlanning = getPlanningForDate(day);
        const isCurrentMonth = isSameMonth(day, viewDate);
        const isCurrentDay = isSameDay(day, currentDate);
        const isTodayDate = isToday(day);
        
        return (
          <div
            key={day.toISOString()}
            className={`
              min-h-[100px] p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 
              ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'bg-white'}
              ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}
              ${isTodayDate ? 'bg-blue-50' : ''}
              ${dayPlanning ? getStatusColor(dayPlanning.availability.status) : ''}
            `}
            onClick={() => onDateClick?.(day)}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-sm font-medium ${isTodayDate ? 'text-blue-600' : ''}`}>
                {format(day, 'd')}
              </span>
              {onAddEvent && isCurrentMonth && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddEvent(day);
                  }}
                  className="text-xs text-gray-400 hover:text-blue-500"
                >
                  +
                </button>
              )}
            </div>
            
            {dayPlanning && (
              <div className="space-y-1">
                {/* Daily summary */}
                {dayPlanning.actualResults.totalEarnings && (
                  <div className="text-xs text-green-600 font-medium">
                    {formatCurrency(dayPlanning.actualResults.totalEarnings)}
                  </div>
                )}
                
                {/* Events (max 2 visible) */}
                {dayPlanning.events.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate ${getEventColor(event.type)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event, day);
                    }}
                  >
                    {event.startTime} {event.title}
                  </div>
                ))}
                
                {dayPlanning.events.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayPlanning.events.length - 2} autres
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderWeekView = () => (
    <div className="grid grid-cols-8 gap-1 h-[600px]">
      {/* Time column */}
      <div className="bg-gray-50">
        <div className="h-12 border-b border-gray-200"></div>
        {Array.from({ length: 24 }, (_, hour) => (
          <div key={hour} className="h-8 border-b border-gray-200 text-xs text-gray-600 p-1">
            {hour.toString().padStart(2, '0')}:00
          </div>
        ))}
      </div>
      
      {/* Week days */}
      {weekDays.map((day) => {
        const dayPlanning = getPlanningForDate(day);
        const isTodayDate = isToday(day);
        
        return (
          <div key={day.toISOString()} className="border-l border-gray-200">
            {/* Day header */}
            <div className={`h-12 p-2 border-b border-gray-200 text-center ${isTodayDate ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <div className={`text-sm font-medium ${isTodayDate ? 'text-blue-600' : ''}`}>
                {format(day, 'EEE d', { locale: fr })}
              </div>
              {dayPlanning?.actualResults.totalEarnings && (
                <div className="text-xs text-green-600">
                  {formatCurrency(dayPlanning.actualResults.totalEarnings)}
                </div>
              )}
            </div>
            
            {/* Time slots */}
            <div className="relative">
              {Array.from({ length: 24 }, (_, hour) => (
                <div key={hour} className="h-8 border-b border-gray-100"></div>
              ))}
              
              {/* Events */}
              {dayPlanning?.events.map((event) => {
                const startHour = parseInt(event.startTime.split(':')[0]);
                const startMinute = parseInt(event.startTime.split(':')[1]);
                const endHour = parseInt(event.endTime.split(':')[0]);
                const endMinute = parseInt(event.endTime.split(':')[1]);
                
                const top = (startHour + startMinute / 60) * 32; // 32px per hour
                const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 32;
                
                return (
                  <div
                    key={event.id}
                    className={`absolute left-1 right-1 rounded text-xs p-1 cursor-pointer hover:opacity-80 ${getEventColor(event.type)}`}
                    style={{ top: `${top}px`, height: `${height}px` }}
                    onClick={() => onEventClick?.(event, day)}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div>{event.startTime} - {event.endTime}</div>
                    {event.earnings && (
                      <div>{formatCurrency(event.earnings)}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Planning</h3>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'month' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'week' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Semaine
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => viewMode === 'month' ? navigateMonth('prev') : navigateWeek('prev')}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          
          <h4 className="text-lg font-medium min-w-[200px] text-center">
            {viewMode === 'month' 
              ? format(viewDate, 'MMMM yyyy', { locale: fr })
              : `Semaine du ${format(startOfWeek(viewDate, { weekStartsOn: 1 }), 'd MMM', { locale: fr })}`
            }
          </h4>
          
          <button
            onClick={() => viewMode === 'month' ? navigateMonth('next') : navigateWeek('next')}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
          
          <button
            onClick={() => setViewDate(new Date())}
            className="ml-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Aujourd'hui
          </button>
        </div>
      </div>

      {/* Calendar */}
      {viewMode === 'month' ? renderMonthView() : renderWeekView()}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span>Occupé</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
          <span>Repos</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
          <span>Maintenance</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Course</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span>Pause</span>
        </div>
      </div>
    </div>
  );
}