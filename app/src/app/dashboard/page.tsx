import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardContent from '@/components/DashboardContent';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return <DashboardContent />;
}