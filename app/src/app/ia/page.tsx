import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function IAPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🤖 Intelligence Artificielle
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Optimisation d'itinéraires</h2>
              <p className="text-gray-600 mb-4">
                Utilisez l'IA pour optimiser vos trajets et réduire le temps de transport.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Optimiser un trajet
              </button>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Prédiction de demande</h2>
              <p className="text-gray-600 mb-4">
                Analysez les tendances pour anticiper la demande dans votre zone.
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Voir les prédictions
              </button>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Assistant virtuel</h2>
              <p className="text-gray-600 mb-4">
                Posez vos questions à notre assistant IA pour optimiser votre activité.
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Poser une question
              </button>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Analyse financière</h2>
              <p className="text-gray-600 mb-4">
                Obtenez des insights IA sur vos performances financières.
              </p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                Analyser mes revenus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}