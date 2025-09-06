'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function WebPage() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/signin');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🌐 Interface Web
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/dashboard" className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition-colors">
              <h2 className="text-xl font-semibold mb-4">📊 Tableau de bord</h2>
              <p className="text-gray-600">
                Vue d'ensemble de votre activité VTC avec statistiques en temps réel.
              </p>
            </Link>
            
            <Link href="/finances" className="bg-green-50 p-6 rounded-lg hover:bg-green-100 transition-colors">
              <h2 className="text-xl font-semibold mb-4">💰 Finances</h2>
              <p className="text-gray-600">
                Gestion complète de vos revenus, dépenses et paiements.
              </p>
            </Link>
            
            <Link href="/planning" className="bg-purple-50 p-6 rounded-lg hover:bg-purple-100 transition-colors">
              <h2 className="text-xl font-semibold mb-4">📅 Planning</h2>
              <p className="text-gray-600">
                Planification et suivi de vos courses en temps réel.
              </p>
            </Link>
            
            <Link href="/community" className="bg-orange-50 p-6 rounded-lg hover:bg-orange-100 transition-colors">
              <h2 className="text-xl font-semibold mb-4">👥 Communauté</h2>
              <p className="text-gray-600">
                Échangez avec d'autres chauffeurs VTC de votre région.
              </p>
            </Link>
            
            <Link href="/profile" className="bg-red-50 p-6 rounded-lg hover:bg-red-100 transition-colors">
              <h2 className="text-xl font-semibold mb-4">👤 Profil</h2>
              <p className="text-gray-600">
                Gestion de votre profil et paramètres du compte.
              </p>
            </Link>
            
            <Link href="/ia" className="bg-cyan-50 p-6 rounded-lg hover:bg-cyan-100 transition-colors">
              <h2 className="text-xl font-semibold mb-4">🤖 IA</h2>
              <p className="text-gray-600">
                Outils d'intelligence artificielle pour optimiser votre activité.
              </p>
            </Link>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Fonctionnalités principales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Authentification sécurisée avec Clerk</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Interface responsive et moderne</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Gestion en temps réel des courses</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Paiements sécurisés avec Stripe</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Intelligence artificielle intégrée</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <span>Communauté de chauffeurs VTC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}