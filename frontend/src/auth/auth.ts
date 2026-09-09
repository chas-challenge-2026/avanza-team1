import type { User, AuthResult } from '../types/auth';

const TOKEN_KEY = 'ph_token';
const USER_KEY = 'ph_user';

interface MockAccount {
  email: string;
  password: string;
  user: User;
}

const MOCK_USERS: MockAccount[] = [
  { email: 'anna@example.com', password: 'password123', user: { id: '1', name: 'Anna Lindqvist', email: 'anna@example.com' } },
  { email: 'erik@example.com', password: 'password123', user: { id: '2', name: 'Erik Johansson', email: 'erik@example.com' } },
];

export function login(email: string, password: string): AuthResult | null {
  const account = MOCK_USERS.find(a => a.email === email && a.password === password);
  if (!account) return null;

  const token = 'mock-token';
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(account.user));
  return { user: account.user, token };
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(TOKEN_KEY) !== null;
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}