'use client';

import { useState, useEffect } from 'react';
import { useApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import StatsCard from './StatsCard';
import ExpenseTracker from './ExpenseTracker';
import RevenueChart from './RevenueChart';

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
}

interface Expense {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  paymentMethod: string;
  receiptUrl?: string;
  taxDeductible: boolean;
  vendor?: {
    name: string;
    address?: string;
  };
  location?: {
    address: string;
  };
  status: string;
}

interface ChartData {
  labels: string[];
  revenue: number[];
  rides: number[];
}

export default function FinancesContent() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const api = useApi();
  
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    revenue: [],
    rides: []
  });
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Mock data for expenses - in real app this would come from API
  const mockExpenses: Expense[] = [
    {
      id: '1',
      amount: 1245.50,
      type: 'income',
      category: 'course_revenue',
      description: 'Revenus courses Uber - Semaine 45',
      date: new Date().toISOString(),
      paymentMethod: 'app_payment',
      taxDeductible: false,
      status: 'processed'
    },
    {
      id: '2',
      amount: 65.40,
      type: 'expense',
      category: 'fuel',
      description: 'Plein d\'essence Total',
      date: new Date(Date.now() - 86400000).toISOString(),
      paymentMethod: 'card',
      taxDeductible: true,
      vendor: { name: 'Total', address: 'Paris 16ème' },
      location: { address: 'Paris 16ème' },
      status: 'processed'
    },
    {
      id: '3',
      amount: 850.00,
      type: 'income',
      category: 'course_revenue',
      description: 'Revenus courses Bolt - Semaine 45',
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      paymentMethod: 'bank_transfer',
      taxDeductible: false,
      status: 'processed'
    },
    {
      id: '4',
      amount: 120.00,
      type: 'expense',
      category: 'maintenance',
      description: 'Vidange et révision',
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
      paymentMethod: 'card',
      taxDeductible: true,
      vendor: { name: 'Garage Citroën', address: 'Boulogne-Billancourt' },
      status: 'processed'
    },
    {
      id: '5',
      amount: 45.00,
      type: 'expense',
      category: 'parking',
      description: 'Stationnement Gare du Nord',
      date: new Date(Date.now() - 4 * 86400000).toISOString(),
      paymentMethod: 'cash',
      taxDeductible: true,
      status: 'processed'
    }
  ];

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchFinancialData = async () => {
      setLoading(true);

      try {
        // Use mock data for now
        setExpenses(mockExpenses);
        
        // Calculate summary from mock data
        const totalIncome = mockExpenses
          .filter(e => e.type === 'income')
          .reduce((sum, e) => sum + e.amount, 0);
        
        const totalExpenses = mockExpenses
          .filter(e => e.type === 'expense')
          .reduce((sum, e) => sum + e.amount, 0);

        setSummary({
          totalIncome,
          totalExpenses,
          netIncome: totalIncome - totalExpenses
        });

        // Mock chart data
        setChartData({
          labels: ['Sem 41', 'Sem 42', 'Sem 43', 'Sem 44', 'Sem 45', 'Sem 46', 'Sem 47'],
          revenue: [1850, 2100, 1950, 2250, 2095, 1980, 2150],
          rides: [45, 52, 48, 58, 51, 47, 53]
        });
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [authLoading, isAuthenticated]);

  const handleAddExpense = () => {
    // Open modal or navigate to add expense form
    console.log('Add expense clicked');
  };

  const handleExpenseClick = (expense: Expense) => {
    // Open expense details or edit form
    console.log('Expense clicked:', expense);
  };

  const getChartData = () => {
    switch (period) {
      case 'week':
        return {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          revenue: [280, 320, 290, 350, 310, 280, 340],
          rides: [7, 8, 7, 9, 8, 7, 9]
        };
      case 'year':
        return {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
          revenue: [8200, 8900, 8100, 9200, 8700, 9800, 9100, 9500, 8800, 9300, 8600, 9400],
          rides: [180, 195, 175, 210, 190, 220, 205, 215, 185, 200, 180, 210]
        };
      default:
        return chartData;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xl text-gray-600">Chargement des données financières...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">💰 Finances</h1>
          <button 
            onClick={handleAddExpense}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Ajouter une transaction
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Revenus totaux"
            value={summary.totalIncome.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            subtitle="Ce mois"
            icon="💰"
            iconBgColor="bg-green-100"
            trend={{
              value: 12.5,
              isPositive: true,
              period: 'vs mois dernier'
            }}
          />
          
          <StatsCard
            title="Dépenses totales"
            value={summary.totalExpenses.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            subtitle="Ce mois"
            icon="📉"
            iconBgColor="bg-red-100"
            trend={{
              value: 5.2,
              isPositive: false,
              period: 'vs mois dernier'
            }}
          />
          
          <StatsCard
            title="Bénéfice net"
            value={summary.netIncome.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            subtitle="Ce mois"
            icon="📈"
            iconBgColor="bg-blue-100"
            trend={{
              value: 18.3,
              isPositive: true,
              period: 'vs mois dernier'
            }}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['Aperçu', 'Transactions', 'Analyses'].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setTabValue(index)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    tabValue === index
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {tabValue === 0 && (
              <div className="space-y-6">
                {/* Chart Period Selector */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Évolution des revenus</h3>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {(['week', 'month', 'year'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          period === p ? 'bg-white shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Année'}
                      </button>
                    ))}
                  </div>
                </div>
                
                <RevenueChart
                  data={getChartData()}
                  period={period === 'week' ? 'daily' : period === 'month' ? 'weekly' : 'monthly'}
                  type="line"
                  height={400}
                />
              </div>
            )}

            {tabValue === 1 && (
              <ExpenseTracker
                expenses={expenses}
                loading={false}
                onAddExpense={handleAddExpense}
                onExpenseClick={handleExpenseClick}
                showAddButton={true}
              />
            )}

            {tabValue === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Analyses financières</h3>
                <p className="text-gray-600">
                  Analyses détaillées de vos performances financières
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatsCard
                    title="Moyenne journalière"
                    value={`${(summary.totalIncome / 30).toFixed(0)}€`}
                    subtitle="Revenus par jour ce mois"
                    icon="📅"
                    iconBgColor="bg-blue-100"
                  />
                  
                  <StatsCard
                    title="Marge bénéficiaire"
                    value={`${((summary.netIncome / summary.totalIncome) * 100).toFixed(1)}%`}
                    subtitle="Rentabilité de votre activité"
                    icon="📊"
                    iconBgColor="bg-green-100"
                  />
                  
                  <StatsCard
                    title="Dépenses déductibles"
                    value={`${mockExpenses.filter(e => e.type === 'expense' && e.taxDeductible).reduce((sum, e) => sum + e.amount, 0).toFixed(0)}€`}
                    subtitle="Économies fiscales potentielles"
                    icon="🧾"
                    iconBgColor="bg-purple-100"
                  />
                </div>

                {/* Additional financial metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">Répartition des revenus</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uber</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bolt</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Heetch</span>
                        <span className="font-medium">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Courses directes</span>
                        <span className="font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">Top dépenses</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carburant</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Entretien</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Assurance</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stationnement</span>
                        <span className="font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}