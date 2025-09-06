import type { Metadata } from "next";
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'sonner';
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
  return (
    <AuthProvider>
      <html lang="fr">
        <body className="font-sans antialiased">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">
                    VTC Connect Pro
                  </h1>
                </div>
              </div>
            </div>
          </header>
          <main>
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    </AuthProvider>
  );
}
