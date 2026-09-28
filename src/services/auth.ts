import type { AuthUser, LoginCredentials } from "@/types/auth";
import { BASE_URL } from "./api";

const TOKEN_KEY = "floodguard_token";
const USERNAME_KEY = "floodguard_username";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

/**
 * Real authentication against the FastAPI backend — there is no mock
 * fallback for login itself, since a single hardcoded account only
 * means something when checked server-side. The backend must be
 * running for sign-in to work, even while other dashboard data can
 * still fall back to mock values.
 */
export async function login({ username, password }: LoginCredentials): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Incorrect username or password.");
    }
    throw new Error("Sign-in is unavailable right now. Is the backend running?");
  }

  const data = await res.json();
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(USERNAME_KEY, data.username);
  return { username: data.username };
}
