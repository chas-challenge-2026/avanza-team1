import { useState, type ReactNode } from "react";
import type { User, AuthContextValue } from "../types/auth";
import {
  login as loginRequest,
  logout as logoutRequest,
  getCurrentUser,
} from "./auth";
import { AuthContext } from "./authContext";

function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  // Lazy initializer (() => ...) körs bara vid FÖRSTA renderingen.
  // Det gör att en redan inloggad user (token finns i localStorage) förblir inloggad efter en sidladdning.
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  async function login(email: string, password: string): Promise<boolean> {
    const result = await loginRequest(email, password);
    if (result === null) return false;
    setUser(result.user);
    return true;
  }

  async function logout(): Promise<void> {
    await logoutRequest();
    setUser(null);
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
