// src/lib/auth.ts
const TOKEN_KEYS = ['adminToken', 'token'] as const;

export function getAuthToken(): string {
  for (const k of TOKEN_KEYS) {
    const t = localStorage.getItem(k);
    if (t) return t;
  }
  return '';
}

export function setAuthToken(token: string) {
  // Guarda con ambos nombres para compatibilidad
  localStorage.setItem('adminToken', token);
  localStorage.setItem('token', token);
}

export function clearAuthToken() {
  TOKEN_KEYS.forEach(k => localStorage.removeItem(k));
}
