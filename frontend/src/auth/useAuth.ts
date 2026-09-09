import { useContext } from 'react';
import type { AuthContextValue } from '../types/auth';
import { AuthContext } from './authContext';

// Den publika ingången till Context för komponenter som behöver auth-state (t.ex. ProtectedRoute, Login).
function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    // Fångar en vanlig bugg tidigt: att glömma wrappa <App /> i <AuthProvider> i main.tsx.
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { useAuth };
