'use client';

import { useUser } from '@clerk/nextjs';

export default function CommunityContent() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Veuillez vous connecter pour accéder à la communauté.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Communauté VTC Connect Pro</h2>
        <p className="text-gray-600 mb-6">
          La section communauté sera bientôt disponible avec Supabase.
        </p>
        <p className="text-sm text-gray-500">
          Retrouvez ici les discussions, conseils et entraide entre chauffeurs VTC.
        </p>
      </div>
    </div>
  );
}