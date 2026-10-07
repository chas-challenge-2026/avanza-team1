import type { User, AuthResult } from "../types/auth";
import { ApiError, apiFetch } from "../api/httpClient";

// localStorage-nycklar. Prefixet "ph" (Portföljhälsa) undviker kollisioner med andra appars data i samma webbläsare.
const TOKEN_KEY = "ph_token";
const USER_KEY = "ph_user";

interface MockAccount {
  email: string;
  password: string;
  user: User;
}

// Mock av det som en riktig backend-databas skulle innehålla (se infra/seed.sql).
// Byts ut mot ett riktigt API-anrop när backend har ett /api/auth/login-endpoint (se types/auth.ts).
const MOCK_USERS: MockAccount[] = [
  {
    email: "anna@example.com",
    password: "password123",
    user: { id: "1", name: "Anna Lindqvist", email: "anna@example.com" },
  },
  {
    email: "erik@example.com",
    password: "password123",
    user: { id: "2", name: "Erik Johansson", email: "erik@example.com" },
  },
];

const useMock = import.meta.env.VITE_USE_MOCK !== "false";

export async function login(
  email: string,
  password: string,
): Promise<AuthResult | null> {
  if (useMock) {
    const account = MOCK_USERS.find(
      (a) => a.email === email && a.password === password,
    );
    if (!account) return null;

    const token = "mock-token";
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(account.user));
    return { user: account.user, token };
  }

  try {
    const response = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const result = (await response.json()) as AuthResult;
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    return result;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export async function logout(): Promise<void> {
  if (!useMock) {
    try {
      await apiFetch("/api/auth/logout", { method: "DELETE" });
    } catch {
      // Token slängs ändå. En nere-backend får inte lämna användaren inloggad.
    }
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
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
