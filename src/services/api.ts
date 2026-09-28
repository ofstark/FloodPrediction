/**
 * Base API client. When USE_MOCK_DATA is true, service functions
 * (predictions.ts, alerts.ts, locations.ts, geography.ts) return local
 * mock data instead of calling the network. Flip it to false once the
 * FastAPI backend is running and reachable at BASE_URL.
 */

export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export const USE_MOCK_DATA = false;

const TOKEN_KEY = "floodguard_token";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Simulates network latency for a more realistic demo experience
 * (only used when USE_MOCK_DATA is true). */
export function mockDelay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function handleUnauthorized(status: number) {
  if (status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("floodguard_username");
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: { ...authHeaders() } });
  if (!res.ok) {
    handleUnauthorized(res.status);
    throw new ApiError(res.status, `API error ${res.status} on GET ${path}`);
  }
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    handleUnauthorized(res.status);
    throw new ApiError(res.status, `API error ${res.status} on POST ${path}`);
  }
  return res.json();
}
