import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function CommunityPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            👥 Communauté
          </h1>
          <p className="text-gray-600 mb-8">
            Échangez avec d'autres chauffeurs VTC, partagez conseils et expériences.
          </p>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  JM
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Jean Martin</h3>
                  <p className="text-gray-600 text-sm mb-2">Chauffeur VTC depuis 3 ans</p>
                  <p className="text-gray-800">
                    "Excellente zone aujourd'hui autour de La Défense ! 
                    Beaucoup de demandes entre 17h et 19h."
                  </p>
                  <div className="flex gap-4 mt-3 text-sm text-gray-500">
                    <span>Il y a 2h</span>
                    <button className="text-blue-600 hover:text-blue-800">Répondre</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  SL
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Sophie Leroy</h3>
                  <p className="text-gray-600 text-sm mb-2">Nouvelle conductrice VTC</p>
                  <p className="text-gray-800">
                    "Des conseils pour optimiser mes trajets en région parisienne ? 
                    Merci d'avance pour votre aide !"
                  </p>
                  <div className="flex gap-4 mt-3 text-sm text-gray-500">
                    <span>Il y a 4h</span>
                    <button className="text-blue-600 hover:text-blue-800">Répondre</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}