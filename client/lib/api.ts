// Centralized API helper to support both dev (Vite proxy) and production (VITE_API_BASE_URL)
// In dev, Vite proxies "/api" to Spring Boot on :8080 (see vite.config.ts)
// In prod (Netlify/Vercel/etc), set VITE_API_BASE_URL to your backend origin

const trimTrailingSlash = (s: string) => s.replace(/\/$/, "");

const API_BASE: string = (import.meta as any)?.env?.VITE_API_BASE_URL
  ? trimTrailingSlash((import.meta as any).env.VITE_API_BASE_URL)
  : "";

export function resolveApiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${normalized}` : normalized;
}

export async function apiFetch(input: string, init?: RequestInit) {
  const url = resolveApiUrl(input);
  return fetch(url, init);
}

export function authHeaders(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
