import type { Metadata } from "next";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton
} from '@clerk/nextjs';
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
    <ClerkProvider>
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
                <div className="flex items-center space-x-4">
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Se connecter
                      </button>
                    </SignInButton>
                  </SignedOut>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
