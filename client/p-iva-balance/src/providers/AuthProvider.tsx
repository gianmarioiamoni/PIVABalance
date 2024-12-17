'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
