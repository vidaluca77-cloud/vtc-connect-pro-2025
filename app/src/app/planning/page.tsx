import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PlanningContent from '@/components/PlanningContent';

export default async function PlanningPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return <PlanningContent />;
}