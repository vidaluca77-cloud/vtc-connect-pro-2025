import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function FinancesPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            💰 Finances
          </h1>
          <p className="text-gray-600 mb-8">
            Gestion complète de vos revenus, dépenses et paiements avec intégration Stripe.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Revenus du mois</h2>
              <p className="text-3xl font-bold text-green-600">2,450€</p>
              <p className="text-green-700 text-sm mt-2">+12% vs mois dernier</p>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Dépenses du mois</h2>
              <p className="text-3xl font-bold text-red-600">680€</p>
              <p className="text-red-700 text-sm mt-2">Carburant, entretien, assurance</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Bénéfice net</h2>
              <p className="text-3xl font-bold text-blue-600">1,770€</p>
              <p className="text-blue-700 text-sm mt-2">Excellent mois !</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}