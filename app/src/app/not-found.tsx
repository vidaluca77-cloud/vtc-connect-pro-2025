import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Page non trouvée - VTC Connect Pro 2025",
  description: "La page que vous recherchez n'existe pas.",
};

// Force dynamic rendering to avoid Clerk issues during build
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Page non trouvée
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                La page que vous recherchez n'existe pas.
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}