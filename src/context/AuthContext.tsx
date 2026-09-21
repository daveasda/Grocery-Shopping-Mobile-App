import React, { createContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
});

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthContext] Initializing auth listener');

    // Check initial session
    authService.getSession().then((initialSession) => {
      console.log('[AuthContext] Initial session:', initialSession?.user?.email);
      setSession(initialSession);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: authListener } = authService.supabaseClient.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('[AuthContext] Auth event:', event, 'Session:', newSession?.user?.email);
        setSession(newSession);
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}