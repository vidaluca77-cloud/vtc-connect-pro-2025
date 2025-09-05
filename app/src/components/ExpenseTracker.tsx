'use client';

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

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

interface ExpenseTrackerProps {
  expenses: Expense[];
  loading?: boolean;
  onAddExpense?: () => void;
  onExpenseClick?: (expense: Expense) => void;
  showAddButton?: boolean;
}

export default function ExpenseTracker({
  expenses,
  loading = false,
  onAddExpense,
  onExpenseClick,
  showAddButton = true
}: ExpenseTrackerProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('month');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      fuel: '⛽',
      maintenance: '🔧',
      insurance: '🛡️',
      vehicle_payment: '🚗',
      parking: '🅿️',
      tolls: '🛣️',
      phone: '📱',
      internet: '🌐',
      cleaning: '🧽',
      equipment: '🛠️',
      registration: '📋',
      license_renewal: '📄',
      accounting: '📊',
      legal: '⚖️',
      marketing: '📢',
      course_revenue: '💰',
      tip: '💵',
      bonus: '🎁',
      referral: '👥',
      other_income: '💲',
      other_expense: '💳'
    };
    return icons[category] || '📝';
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      fuel: 'Carburant',
      maintenance: 'Entretien',
      insurance: 'Assurance',
      vehicle_payment: 'Crédit véhicule',
      parking: 'Stationnement',
      tolls: 'Péages',
      phone: 'Téléphone',
      internet: 'Internet',
      cleaning: 'Nettoyage',
      equipment: 'Équipement',
      registration: 'Immatriculation',
      license_renewal: 'Renouvellement licence',
      accounting: 'Comptabilité',
      legal: 'Juridique',
      marketing: 'Marketing',
      course_revenue: 'Revenus courses',
      tip: 'Pourboires',
      bonus: 'Bonus',
      referral: 'Parrainage',
      other_income: 'Autres revenus',
      other_expense: 'Autres dépenses'
    };
    return labels[category] || category;
  };

  const getTypeColor = (type: string) => {
    return type === 'income' 
      ? 'text-green-600 bg-green-50' 
      : 'text-red-600 bg-red-50';
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons: { [key: string]: string } = {
      cash: '💵',
      card: '💳',
      bank_transfer: '🏦',
      check: '📋',
      app_payment: '📱',
      other: '💰'
    };
    return icons[method] || '💰';
  };

  // Filter expenses
  const filteredExpenses = expenses
    .filter(expense => filterType === 'all' || expense.type === filterType)
    .filter(expense => filterCategory === 'all' || expense.category === filterCategory)
    .filter(expense => {
      if (dateRange === 'all') return true;
      
      const expenseDate = new Date(expense.date);
      const now = new Date();
      
      switch (dateRange) {
        case 'week':
          return expenseDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'month':
          return expenseDate >= new Date(now.getFullYear(), now.getMonth(), 1);
        case 'year':
          return expenseDate >= new Date(now.getFullYear(), 0, 1);
        default:
          return true;
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate totals
  const totalIncome = filteredExpenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalExpenses = filteredExpenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border border-gray-200 rounded">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Suivi financier</h3>
        {showAddButton && onAddExpense && (
          <button
            onClick={onAddExpense}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            + Ajouter
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-600">💰</span>
            <span className="text-sm font-medium text-green-900">Revenus</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-600">💸</span>
            <span className="text-sm font-medium text-red-900">Dépenses</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
        </div>
        
        <div className={`p-4 rounded-lg ${netIncome >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'}>
              {netIncome >= 0 ? '📈' : '📉'}
            </span>
            <span className={`text-sm font-medium ${netIncome >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
              Résultat net
            </span>
          </div>
          <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            {formatCurrency(netIncome)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="all">Tous types</option>
          <option value="income">Revenus</option>
          <option value="expense">Dépenses</option>
        </select>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="all">Toutes catégories</option>
          <option value="fuel">Carburant</option>
          <option value="maintenance">Entretien</option>
          <option value="insurance">Assurance</option>
          <option value="parking">Stationnement</option>
          <option value="course_revenue">Revenus courses</option>
          <option value="tip">Pourboires</option>
        </select>
        
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
          <option value="all">Toutes les dates</option>
        </select>
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucune transaction trouvée</p>
          <p className="text-sm">Ajustez vos filtres ou ajoutez votre première transaction</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className={`border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors ${
                onExpenseClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onExpenseClick?.(expense)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xl">
                    {getCategoryIcon(expense.category)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {getCategoryLabel(expense.category)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(expense.type)}`}>
                        {expense.type === 'income' ? 'Revenu' : 'Dépense'}
                      </span>
                      {expense.taxDeductible && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          Déductible
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-900 mb-1">{expense.description}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>
                        {getPaymentMethodIcon(expense.paymentMethod)} {expense.paymentMethod}
                      </span>
                      {expense.vendor?.name && (
                        <span>🏪 {expense.vendor.name}</span>
                      )}
                      {expense.location?.address && (
                        <span>📍 {expense.location.address}</span>
                      )}
                      {expense.receiptUrl && (
                        <span>📎 Reçu</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    expense.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(expense.date), { 
                      addSuffix: true,
                      locale: fr 
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}