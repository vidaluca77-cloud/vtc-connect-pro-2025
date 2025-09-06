'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PlanningContent from '@/components/PlanningContent';

export default function PlanningPage() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/signin');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  return <PlanningContent />;
}