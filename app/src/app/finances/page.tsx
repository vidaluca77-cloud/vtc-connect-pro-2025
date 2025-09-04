import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import FinancesContent from '@/components/FinancesContent';

export default async function FinancesPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return <FinancesContent />;
}