import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CommunityContent from '@/components/CommunityContent';

export default async function CommunityPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return <CommunityContent />;
}