import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';

// Initialize Supabase client with persistSession: true
const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
    },
  }
);

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
  user: User | null | undefined;
  isLoaded: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias for signOut
  supabase: SupabaseClient; // Expose supabase client
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const supabaseUser = session?.user;
      if (supabaseUser) {
        setUser(transformSupabaseUser(supabaseUser));
        setIsSignedIn(true);
      } else {
        setUser(null);
        setIsSignedIn(false);
      }
      setIsLoaded(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const supabaseUser = session?.user;
        if (supabaseUser) {
          setUser(transformSupabaseUser(supabaseUser));
          setIsSignedIn(true);
        } else {
          setUser(null);
          setIsSignedIn(false);
        }
        setIsLoaded(true);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Transform Supabase user to our expected format
  const transformSupabaseUser = (supabaseUser: SupabaseUser): User => {
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
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    isLoaded,
    isSignedIn,
    signOut,
    logout: signOut, // Alias for signOut
    supabase, // Expose supabase client for additional auth methods
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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
