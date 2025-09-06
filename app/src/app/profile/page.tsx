'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, isLoaded, signOut } = useAuth();
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            👤 Profil
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Informations du compte</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <p className="text-gray-900">{user.name || 'Non défini'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Actions
                  </label>
                  <button
                    onClick={() => signOut()}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Se déconnecter
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Chauffeur VTC actif
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Membre depuis
                  </label>
                  <p className="text-gray-900">Janvier 2025</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Courses totales</span>
                  <span className="font-semibold">234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Note moyenne</span>
                  <span className="font-semibold">4.8/5 ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenus totaux</span>
                  <span className="font-semibold">12,450€</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Préférences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Notifications par email</span>
                <input type="checkbox" checked className="rounded" readOnly />
              </div>
              <div className="flex items-center justify-between">
                <span>Notifications push</span>
                <input type="checkbox" checked className="rounded" readOnly />
              </div>
              <div className="flex items-center justify-between">
                <span>Mode sombre</span>
                <input type="checkbox" className="rounded" readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}