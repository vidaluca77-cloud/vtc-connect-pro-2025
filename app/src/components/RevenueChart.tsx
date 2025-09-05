'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueData {
  labels: string[];
  revenue: number[];
  rides: number[];
}

interface RevenueChartProps {
  data: RevenueData;
  period: 'daily' | 'weekly' | 'monthly';
  type?: 'line' | 'bar';
  height?: number;
}

export default function RevenueChart({ 
  data, 
  period, 
  type = 'line',
  height = 300 
}: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Revenus (€)',
        data: data.revenue,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: type === 'line',
        yAxisID: 'y',
      },
      {
        label: 'Nombre de courses',
        data: data.rides,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: false,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Évolution des revenus - ${period === 'daily' ? 'Quotidien' : period === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: { dataset: { label?: string; yAxisID?: string }; parsed: { y: number } }) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.yAxisID === 'y') {
              label += formatCurrency(context.parsed.y);
            } else {
              label += context.parsed.y + ' courses';
            }
            return label;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: period === 'daily' ? 'Jour' : period === 'weekly' ? 'Semaine' : 'Mois',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Revenus (€)',
        },
        ticks: {
          callback: function(value: number | string) {
            return formatCurrency(Number(value));
          },
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Nombre de courses',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: number | string) {
            return Number(value) + ' courses';
          },
        },
      },
    },
  };

  const containerStyle = {
    height: `${height}px`,
    position: 'relative' as const,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div style={containerStyle}>
        {type === 'line' ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
      
      {/* Summary stats */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-lg font-semibold">
            {formatCurrency(data.revenue.reduce((sum, val) => sum + val, 0))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Moyenne</p>
          <p className="text-lg font-semibold">
            {formatCurrency(data.revenue.reduce((sum, val) => sum + val, 0) / data.revenue.length)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Courses</p>
          <p className="text-lg font-semibold">
            {data.rides.reduce((sum, val) => sum + val, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">€/Course</p>
          <p className="text-lg font-semibold">
            {formatCurrency(
              data.revenue.reduce((sum, val) => sum + val, 0) / 
              Math.max(1, data.rides.reduce((sum, val) => sum + val, 0))
            )}
          </p>
        </div>
      </div>
    </div>
  );
}