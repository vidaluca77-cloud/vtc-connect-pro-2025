'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function DashboardContent() {
  const { user } = useUser();

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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🚗</span>
              </div>
              <h3 className="text-lg font-semibold">Courses du jour</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-green-600 text-sm">+2 vs hier</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold">Revenus du jour</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">324€</p>
            <p className="text-green-600 text-sm">+15% vs hier</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⏱️</span>
              </div>
              <h3 className="text-lg font-semibold">Temps de travail</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">8h</p>
            <p className="text-blue-600 text-sm">Objectif: 10h</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold">Note moyenne</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">4.8</p>
            <p className="text-yellow-600 text-sm">Très bon !</p>
          </div>
        </div>

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

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Nouvelle course</h3>
                <p className="text-gray-600 text-sm">Ajouter une nouvelle course</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Activité récente</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Course terminée</h4>
                <p className="text-gray-600 text-sm">Aéroport Charles de Gaulle → Paris 15ème - 45€</p>
              </div>
              <span className="text-gray-500 text-sm">Il y a 15 min</span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm">💳</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Paiement reçu</h4>
                <p className="text-gray-600 text-sm">Paiement par carte bancaire - 45€</p>
              </div>
              <span className="text-gray-500 text-sm">Il y a 16 min</span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Recommandation IA</h4>
                <p className="text-gray-600 text-sm">Zone recommandée: La Défense (forte demande)</p>
              </div>
              <span className="text-gray-500 text-sm">Il y a 1h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}