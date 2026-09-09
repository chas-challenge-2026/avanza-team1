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
