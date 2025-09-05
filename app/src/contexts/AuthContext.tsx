import React, { createContext, useContext } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';

interface User {
  id: string;
  name?: string; // Computed from firstName + lastName
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
  signOut: () => void;
  logout: () => void; // Alias for signOut
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { isSignedIn, signOut } = useClerkAuth();

  // Transform Clerk user to our expected format
  const user = clerkUser ? {
    ...clerkUser,
    name: clerkUser.firstName && clerkUser.lastName 
      ? `${clerkUser.firstName} ${clerkUser.lastName}` 
      : clerkUser.firstName || clerkUser.lastName || undefined,
    email: clerkUser.emailAddresses?.[0]?.emailAddress
  } : null;

  const value = {
    user,
    isLoaded,
    isSignedIn: isSignedIn || false,
    signOut: signOut || (() => {}),
    logout: signOut || (() => {}), // Alias for signOut
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