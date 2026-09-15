import type { User, AuthResult } from '../types/auth';

// localStorage-nycklar. Prefixet "ph" (Portföljhälsa) undviker kollisioner med andra appars data i samma webbläsare.
const TOKEN_KEY = 'ph_token';
const USER_KEY = 'ph_user';

interface MockAccount {
  email: string;
  password: string;
  user: User;
}

// Mock av det som en riktig backend-databas skulle innehålla (se infra/seed.sql).
// Byts ut mot ett riktigt API-anrop när backend har ett /api/auth/login-endpoint (se types/auth.ts).
const MOCK_USERS: MockAccount[] = [
  { email: 'anna@example.com', password: 'password123', user: { id: '1', name: 'Anna Lindqvist', email: 'anna@example.com' } },
  { email: 'erik@example.com', password: 'password123', user: { id: '2', name: 'Erik Johansson', email: 'erik@example.com' } },
];

export function login(email: string, password: string): AuthResult | null {
  // && kräver att BÅDA fält matchar - annars skulle fel lösenord med rätt email också logga in.
  const account = MOCK_USERS.find(a => a.email === email && a.password === password);
  if (!account) return null; // null signalerar "fel credentials" till anroparen (AC: visa felmeddelande)

  const token = 'mock-token';
  localStorage.setItem(TOKEN_KEY, token); // AC: token ska persistas i localStorage
  localStorage.setItem(USER_KEY, JSON.stringify(account.user)); // sparas separat från token så vi vet VEM som är inloggad efter en sidladdning
  return { user: account.user, token };
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY); // måste tas bort tillsammans med token, annars kan gammal user-data läcka in vid nästa inloggning
}

export function isAuthenticated(): boolean {
  // Token som "finns/finns inte" ÄR hela vår mock-autentisering - inget innehåll verifieras (out of scope enligt issue #40)
  return localStorage.getItem(TOKEN_KEY) !== null;
}

export function getCurrentUser(): User | null {
  // JSON.stringify/parse behövs eftersom localStorage bara kan lagra strängar, inte objekt
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}
