'use client';

import React, { useEffect, useState } from 'react';

export default function DebugPage() {
  const [envVars, setEnvVars] = useState({
    supabaseUrl: '',
    supabaseAnonKey: '',
    timestamp: ''
  });

  useEffect(() => {
    // Fonction pour récupérer les variables d'environnement
    const fetchEnvVars = () => {
      setEnvVars({
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Non défini',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Non défini',
        timestamp: new Date().toISOString()
      });
    };

    // Récupérer immédiatement
    fetchEnvVars();

    // Mettre à jour toutes les 5 secondes
    const interval = setInterval(fetchEnvVars, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: string) => {
    return value === 'Non défini' ? 'text-red-600' : 'text-green-600';
  };

  const getStatusIcon = (value: string) => {
    return value === 'Non défini' ? '❌' : '✅';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🔍 Page de Diagnostic - Variables d'Environnement
        </h1>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Page temporaire de diagnostic</strong> - Cette page doit être supprimée avant la mise en production.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Variables d'environnement Supabase */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🗃️ Variables Supabase
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NEXT_PUBLIC_SUPABASE_URL
                </label>
                <div className={`p-3 bg-gray-50 rounded border ${getStatusColor(envVars.supabaseUrl)} font-mono text-sm`}>
                  {getStatusIcon(envVars.supabaseUrl)} {envVars.supabaseUrl}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </label>
                <div className={`p-3 bg-gray-50 rounded border ${getStatusColor(envVars.supabaseAnonKey)} font-mono text-sm break-all`}>
                  {getStatusIcon(envVars.supabaseAnonKey)} {envVars.supabaseAnonKey}
                </div>
              </div>
            </div>
          </div>

          {/* Informations système */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ℹ️ Informations Système
            </h2>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Dernière mise à jour:</span>
                <p className="text-sm text-gray-800 font-mono">{envVars.timestamp}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">Environnement:</span>
                <p className="text-sm text-gray-800">Client-side (Navigateur)</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">Status de rafraîchissement:</span>
                <p className="text-sm text-green-600">🔄 Auto-refresh toutes les 5s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tests de validation */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🧪 Tests de Validation
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className={envVars.supabaseUrl !== 'Non défini' ? 'text-green-600' : 'text-red-600'}>
                {getStatusIcon(envVars.supabaseUrl)}
              </span>
              <span>URL Supabase accessible côté client</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={envVars.supabaseAnonKey !== 'Non défini' ? 'text-green-600' : 'text-red-600'}>
                {getStatusIcon(envVars.supabaseAnonKey)}
              </span>
              <span>Clé anonyme Supabase accessible côté client</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={envVars.supabaseUrl !== 'Non défini' && envVars.supabaseUrl.startsWith('https://') ? 'text-green-600' : 'text-red-600'}>
                {envVars.supabaseUrl !== 'Non défini' && envVars.supabaseUrl.startsWith('https://') ? '✅' : '❌'}
              </span>
              <span>Format URL valide (HTTPS)</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-400">💡</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Instructions:</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Vérifiez que les variables d'environnement sont bien affichées</li>
                  <li>Si elles apparaissent comme "Non défini", vérifiez votre fichier .env.local</li>
                  <li>Assurez-vous que les variables commencent par NEXT_PUBLIC_</li>
                  <li>Redémarrez le serveur de développement après modification du .env.local</li>
                  <li><strong>Supprimez cette page avant la mise en production</strong></li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
