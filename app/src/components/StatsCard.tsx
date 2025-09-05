import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  onClick?: () => void;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-blue-100',
  trend,
  onClick
}: StatsCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      // Format large numbers
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}k`;
      }
      return val.toString();
    }
    return val;
  };

  const getTrendColor = (isPositive: boolean) => {
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (isPositive: boolean) => {
    return isPositive ? '↗️' : '↘️';
  };

  return (
    <div 
      className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <span className="text-xl">{icon}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900">{formatValue(value)}</p>
      </div>
      
      {(subtitle || trend) && (
        <div className="flex items-center justify-between">
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
          
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${getTrendColor(trend.isPositive)}`}>
              <span>{getTrendIcon(trend.isPositive)}</span>
              <span>
                {trend.isPositive ? '+' : ''}{trend.value}% {trend.period}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}