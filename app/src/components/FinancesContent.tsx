'use client';

import { useAuth } from '../contexts/AuthContext';
import { useVTCData } from '../hooks/useVTCData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Euro, TrendingUp, TrendingDown } from 'lucide-react';

export default function FinancesContent() {
  const { user } = useAuth();
  const { 
    monthlyRevenue, 
    totalRevenue, 
    expenses, 
    rides,
    loading 
  } = useVTCData();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Veuillez vous connecter pour accéder aux finances.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Chargement des données financières...</p>
      </div>
    );
  }

  const monthlyExpenses = expenses.reduce((sum, expense) => {
    const expenseDate = new Date(expense.expense_date);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
      return sum + expense.amount_euros;
    }
    return sum;
  }, 0);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount_euros, 0);
  const netIncome = monthlyRevenue - monthlyExpenses;
  const totalNetIncome = totalRevenue - totalExpenses;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Finances</h2>
        <p className="text-gray-600">Gérez vos revenus et dépenses VTC</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus ce mois</CardTitle>
            <Euro className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{monthlyRevenue.toFixed(2)}€</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses ce mois</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{monthlyExpenses.toFixed(2)}€</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bénéfice net ce mois</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netIncome.toFixed(2)}€
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bénéfice total</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalNetIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalNetIncome.toFixed(2)}€
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus récents</CardTitle>
          </CardHeader>
          <CardContent>
            {rides.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune course enregistrée</p>
            ) : (
              <div className="space-y-3">
                {rides.slice(0, 5).map((ride) => (
                  <div key={ride.id} className="flex justify-between items-center p-2 border-b">
                    <div>
                      <p className="font-medium">{ride.platform}</p>
                      <p className="text-sm text-gray-500">{new Date(ride.ride_date).toLocaleDateString()}</p>
                    </div>
                    <span className="font-bold text-green-600">+{ride.price_euros}€</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dépenses récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune dépense enregistrée</p>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-2 border-b">
                    <div>
                      <p className="font-medium">{expense.category}</p>
                      <p className="text-sm text-gray-500">{new Date(expense.expense_date).toLocaleDateString()}</p>
                    </div>
                    <span className="font-bold text-red-600">-{expense.amount_euros}€</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}