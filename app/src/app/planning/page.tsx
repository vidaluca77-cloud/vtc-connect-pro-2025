import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function PlanningPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            📅 Planning
          </h1>
          <p className="text-gray-600 mb-8">
            Planification et suivi de vos courses en temps réel avec géolocalisation.
          </p>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Course prévue</h3>
                  <p className="text-gray-600">14:30 - Gare du Nord → Aéroport CDG</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  À venir
                </span>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Course en cours</h3>
                  <p className="text-gray-600">République → Châtelet-Les Halles</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  En cours
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}