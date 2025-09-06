'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User as SupabaseUser, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  name?: string; // Computed from user_metadata
  email?: string; // Primary email
  firstName?: string | null;
  lastName?: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
  imageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  error: AuthError | null;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias for signOut
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  // Transform Supabase user to our expected format
  const transformSupabaseUser = useCallback((supabaseUser: SupabaseUser): User => {
    const firstName = supabaseUser.user_metadata?.first_name || supabaseUser.user_metadata?.firstName;
    const lastName = supabaseUser.user_metadata?.last_name || supabaseUser.user_metadata?.lastName;
    const fullName = supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name;
    
    return {
      id: supabaseUser.id,
      name: fullName || (firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName) || undefined,
      email: supabaseUser.email,
      firstName: firstName || null,
      lastName: lastName || null,
      emailAddresses: supabaseUser.email ? [{ emailAddress: supabaseUser.email }] : [],
      imageUrl: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
    };
  }, []);

  // Handle auth state changes
  const handleAuthStateChange = useCallback((session: Session | null, error?: AuthError) => {
    try {
      setLoading(true);
      setError(error || null);
      
      if (session?.user) {
        const transformedUser = transformSupabaseUser(session.user);
        setUser(transformedUser);
        setSession(session);
        setIsSignedIn(true);
      } else {
        setUser(null);
        setSession(null);
        setIsSignedIn(false);
      }
    } catch (err) {
      console.error('Error handling auth state change:', err);
      setError(err as AuthError);
    } finally {
      setLoading(false);
      setIsLoaded(true);
    }
  }, [transformSupabaseUser]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get initial session with error handling
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError(sessionError);
        }
        
        if (mounted) {
          handleAuthStateChange(session, sessionError);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        if (mounted) {
          setError(err as AuthError);
          setLoading(false);
          setIsLoaded(true);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          console.log('Auth state changed:', event);
          
          // Handle specific auth events
          switch (event) {
            case 'SIGNED_IN':
            case 'TOKEN_REFRESHED':
            case 'SIGNED_OUT':
              handleAuthStateChange(session);
              break;
            case 'PASSWORD_RECOVERY':
            case 'USER_UPDATED':
              if (session) {
                handleAuthStateChange(session);
              }
              break;
            default:
              handleAuthStateChange(session);
          }
        }
      }
    );

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);

  // Sign out function with error handling
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        setError(error);
        throw error;
      }
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err as AuthError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh session function
  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        setError(error);
        throw error;
      }
      
      handleAuthStateChange(session);
    } catch (err) {
      console.error('Refresh session error:', err);
      setError(err as AuthError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleAuthStateChange]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    isLoaded,
    isSignedIn,
    error,
    signOut,
    logout: signOut, // Alias for signOut
    refreshSession,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export supabase client for use in other parts of the app
export { supabase };

// Additional utility hooks
export const useAuthUser = () => {
  const { user } = useAuth();
  return user;
};

export const useAuthSession = () => {
  const { session } = useAuth();
  return session;
};

export const useAuthLoading = () => {
  const { loading, isLoaded } = useAuth();
  return { loading, isLoaded };
};
