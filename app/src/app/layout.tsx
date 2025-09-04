import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

export const metadata: Metadata = {
  title: "VTC Connect Pro 2025",
  description: "Plateforme VTC Connect Pro - Solution complète de gestion et réservation VTC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    return (
      <html lang="fr">
        <body className="font-sans antialiased">
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Configuration requise
              </h1>
              <p className="text-gray-600 mb-4">
                Veuillez configurer les clés Clerk pour utiliser l'application.
              </p>
              <div className="bg-gray-100 p-4 rounded text-left text-sm">
                <p className="font-semibold mb-2">Étapes :</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Créer un compte sur <a href="https://clerk.com" className="text-blue-600">clerk.com</a></li>
                  <li>Copier <code className="bg-gray-200 px-1 rounded">.env.example</code> vers <code className="bg-gray-200 px-1 rounded">.env.local</code></li>
                  <li>Ajouter vos clés Clerk dans <code className="bg-gray-200 px-1 rounded">.env.local</code></li>
                  <li>Redémarrer l'application</li>
                </ol>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="fr">
        <body className="font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
