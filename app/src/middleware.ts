import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware without Clerk authentication
// Authentication is now handled client-side with Supabase
export function middleware(request: NextRequest) {
  // Allow all requests to pass through
  // Client-side authentication with Supabase will handle protected routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
