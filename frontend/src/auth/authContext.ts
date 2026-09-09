import { createContext } from 'react';
import type { AuthContextValue } from '../types/auth';

// undefined som default-värde gör att useAuth() (i useAuth.ts) kan upptäcka om den används
// utanför AuthProvider istället för att tyst ge fel data.
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
