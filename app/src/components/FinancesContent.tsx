'use client';

import { useState, useEffect } from 'react';

interface FinancialData {
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    pendingPayments: number;
  };
  transactions: Array<{
    id: string;
    date: Date;
    type: 'revenue' | 'expense';
    description: string;
    amount: number;
    status: 'completed' | 'pending';
  }>;
  monthlyData: number[];
}

export default function FinancesContent() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState<FinancialData>({
    summary: {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      pendingPayments: 0
    },
    transactions: [],
    monthlyData: []
  });

  useEffect(() => {
    // Mock data load
    setTimeout(() => {
      setFinancialData({
        summary: {
          totalRevenue: 8450.75,
          totalExpenses: 2340.50,
          netProfit: 6110.25,
          pendingPayments: 450.00
        },
        transactions: [
          {
            id: 'TXN001',
            date: new Date(),
            type: 'revenue',
            description: 'Course Paris CDG - 16e Arrondissement',
            amount: 85.50,
            status: 'completed'
          },
          {
            id: 'TXN002',
            date: new Date(Date.now() - 86400000),
            type: 'expense',
            description: 'Carburant Shell',
            amount: -45.00,
            status: 'completed'
          },
          {
            id: 'TXN003',
            date: new Date(Date.now() - 2 * 86400000),
            type: 'revenue',
            description: 'Course Gare du Nord - La Défense',
            amount: 45.00,
            status: 'completed'
          }
        ],
        monthlyData: [4200, 4800, 3900, 5200, 4700, 5800]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, trend, trendText, icon, colorClass }: {
    title: string;
    value: string;
    trend?: number;
    trendText?: string;
    icon: string;
    colorClass: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}€</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
              </span>
              {trendText && (
                <span className="text-gray-500 text-xs ml-2">{trendText}</span>
              )}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
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
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            📥 Exporter
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Revenus totaux"
            value={financialData.summary.totalRevenue.toLocaleString('fr-FR')}
            trend={12.5}
            trendText="vs mois dernier"
            icon="💰"
            colorClass="bg-green-100"
          />
          <StatCard
            title="Dépenses totales"
            value={financialData.summary.totalExpenses.toLocaleString('fr-FR')}
            trend={-5.2}
            trendText="vs mois dernier"
            icon="📉"
            colorClass="bg-red-100"
          />
          <StatCard
            title="Bénéfice net"
            value={financialData.summary.netProfit.toLocaleString('fr-FR')}
            trend={18.3}
            trendText="vs mois dernier"
            icon="📈"
            colorClass="bg-blue-100"
          />
          <StatCard
            title="Paiements en attente"
            value={financialData.summary.pendingPayments.toLocaleString('fr-FR')}
            icon="🏦"
            colorClass="bg-yellow-100"
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Évolution des revenus</h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    📊 Graphique des revenus mensuels
                    <br />
                    <small className="text-xs">(Intégration chart.js à venir)</small>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Répartition des dépenses</h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    🥧 Graphique circulaire
                    <br />
                    <small className="text-xs">(Intégration chart.js à venir)</small>
                  </div>
                </div>
              </div>
            )}

            {tabValue === 1 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {financialData.transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date.toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.type === 'revenue' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type === 'revenue' ? 'Revenu' : 'Dépense'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                          <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}€
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status === 'completed' ? 'Terminé' : 'En attente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tabValue === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Analyses financières</h3>
                <p className="text-gray-600">
                  Analyses détaillées de vos performances financières
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="text-lg font-semibold mb-2">Moyenne journalière</h4>
                    <p className="text-3xl font-bold text-blue-600">
                      {(financialData.summary.totalRevenue / 30).toFixed(2)}€
                    </p>
                    <p className="text-blue-700 text-sm mt-1">
                      Revenus par jour ce mois
                    </p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h4 className="text-lg font-semibold mb-2">Marge bénéficiaire</h4>
                    <p className="text-3xl font-bold text-green-600">
                      {((financialData.summary.netProfit / financialData.summary.totalRevenue) * 100).toFixed(1)}%
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      Rentabilité de votre activité
                    </p>
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