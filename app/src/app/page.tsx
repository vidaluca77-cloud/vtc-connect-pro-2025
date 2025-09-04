import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">VTC Connect Pro</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Se connecter
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                Tableau de bord
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            VTC Connect Pro 2025
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plateforme complète de gestion VTC avec intelligence artificielle, 
            système de paiement intégré, et communauté de chauffeurs.
          </p>
          
          <SignedOut>
            <div className="flex gap-4 justify-center">
              <SignInButton mode="modal">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                  Commencer maintenant
                </button>
              </SignInButton>
              <Link href="/sign-up" className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                Créer un compte
              </Link>
            </div>
          </SignedOut>
          
          <SignedIn>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                Accéder au tableau de bord
              </Link>
              <Link href="/web" className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                Interface Web
              </Link>
            </div>
          </SignedIn>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Gestion des courses</h3>
            <p className="text-gray-600">Planification, suivi en temps réel et historique complet de vos courses.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Système financier</h3>
            <p className="text-gray-600">Gestion des revenus, dépenses et paiements sécurisés avec Stripe.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Intelligence artificielle</h3>
            <p className="text-gray-600">Optimisation d'itinéraires et prédiction de demande avec l'IA.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Communauté</h3>
            <p className="text-gray-600">Échanges entre chauffeurs, conseils et discussions.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Interface moderne</h3>
            <p className="text-gray-600">Design responsive et intuitif pour une expérience optimale.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Sécurité</h3>
            <p className="text-gray-600">Authentification sécurisée et chiffrement des données.</p>
          </div>
        </div>

        {/* Quick Access */}
        <SignedIn>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Accès rapide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/web" className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-3xl">🌐</span>
                <div>
                  <h3 className="font-semibold">Interface Web</h3>
                  <p className="text-gray-600 text-sm">Accédez à toutes les fonctionnalités web</p>
                </div>
              </Link>
              <Link href="/ia" className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-3xl">🤖</span>
                <div>
                  <h3 className="font-semibold">Intelligence Artificielle</h3>
                  <p className="text-gray-600 text-sm">Outils IA pour optimiser votre activité</p>
                </div>
              </Link>
            </div>
          </div>
        </SignedIn>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2025 VTC Connect Pro. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
