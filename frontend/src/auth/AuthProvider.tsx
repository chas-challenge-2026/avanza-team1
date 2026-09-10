import { useState, type ReactNode } from 'react';
import type { User, AuthContextValue } from '../types/auth';
import { login as loginRequest, logout as logoutRequest, getCurrentUser } from './auth';
import { AuthContext } from './authContext';

function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  // Lazy initializer (() => ...) körs bara vid FÖRSTA renderingen.
  // Det gör att en redan inloggad user (token finns i localStorage) förblir inloggad efter en sidladdning.
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  function login(email: string, password: string): boolean {
    const result = loginRequest(email, password); // anropar mock-auth i auth.ts
    if (result === null) {
      return false; // fel credentials - komponenten som anropar visar felmeddelande
    }
    setUser(result.user); // triggar en re-render av HELA appen med rätt inloggad user
    return true;
  }

  function logout(): void {
    logoutRequest(); // rensar localStorage
    setUser(null); // rensar React-state - annars skulle isAuthenticated fortfarande vara true i UI:t
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null, // härlett från state istället för att fråga localStorage igen - ett enda source of truth
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
