// To be replaced with POST /api/auth/login when backend REST endpoint exists
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResult {
  user: User;
  token: string;
}