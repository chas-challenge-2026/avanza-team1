import { createContext } from 'react';
import type { AuthContextValue } from '../types/auth';

// Detta objekt ligger isolerat i en egen fil (istället för i AuthProvider.tsx eller useAuth.ts)
// eftersom eslint-regeln react-refresh/only-export-components kräver att en fil bara exporterar
// EN sak om den innehåller en komponent - annars fungerar inte Fast Refresh (hot-reload) i dev-läge.
// undefined som default-värde gör att useAuth() (i useAuth.ts) kan upptäcka om den används
// utanför AuthProvider istället för att tyst ge fel data.
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
