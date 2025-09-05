/**
 * Authentication hook that bridges Clerk with JWT backend
 * Syncs Clerk user with MongoDB User model
 */

import { useEffect, useState } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';
import { useApi } from '../lib/api';

interface User {
  id: string;
  clerkId?: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  vtcLicense?: string;
  driverProfile?: {
    experience?: string;
    rating?: number;
    totalTrips?: number;
    status?: string;
  };
}

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}

export function useAuth() {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const api = useApi();
  
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (!isLoaded) return;

      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        if (!isSignedIn || !clerkUser) {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            error: null,
          });
          return;
        }

        // First, sync Clerk user with backend
        const syncResult = await api.auth.syncClerkUser(clerkUser);
        
        if (!syncResult.success) {
          console.error('Failed to sync Clerk user:', syncResult.error);
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            error: syncResult.error || 'Failed to sync user',
          });
          return;
        }

        // Then get the full user data from backend
        const userResult = await api.auth.me();
        
        if (userResult.success && userResult.data) {
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            user: userResult.data.user,
            error: null,
          });
        } else {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            error: userResult.error || 'Failed to get user data',
          });
        }
      } catch (error) {
        console.error('Auth sync error:', error);
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: error instanceof Error ? error.message : 'Authentication error',
        });
      }
    };

    syncUserWithBackend();
  }, [isLoaded, isSignedIn, clerkUser, api]);

  const refreshUser = async () => {
    if (!isSignedIn) return;

    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const userResult = await api.auth.me();
      
      if (userResult.success && userResult.data) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          user: userResult.data!.user,
          error: null,
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: userResult.error || 'Failed to refresh user data',
        }));
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to refresh user',
      }));
    }
  };

  return {
    ...authState,
    refreshUser,
    getToken,
  };
}