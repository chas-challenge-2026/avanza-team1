// To be replaced with POST /api/auth/login when backend REST endpoint exists
export interface User {
  id: string;
  name: string;
  email: string;
}

// Formen ett riktigt REST-auth-svar typiskt skulle ha: användarinfo + en token.
// Genom att forma mocken efter detta redan nu blir bytet till riktig backend en mindre omskrivning senare.
export interface AuthResult {
  user: User;
  token: string;
}

// Formen på det AuthProvider delar med resten av appen via Context.
// Ligger här (inte i authContext.ts) eftersom både AuthProvider.tsx och useAuth.ts importerar den.
export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}
