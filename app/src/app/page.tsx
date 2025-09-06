import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to signin page instead of showing Clerk components
  redirect('/auth/signin');
  
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
            <Link href="/auth/signin" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Se connecter
            </Link>
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800">
              Créer un compte
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Plateforme de gestion VTC professionnelle
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Gérez vos courses, clients et revenus en toute simplicité
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Créer un compte
            </Link>
            <Link href="/auth/signin" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
              Se connecter
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
