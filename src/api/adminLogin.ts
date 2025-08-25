// src/api/admin.ts
import { setAuthToken } from "../lib/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

type LoginResponse = { success: boolean; token?: string; message?: string };

export async function adminLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data: LoginResponse = await res.json().catch(() => ({ success: false, message: 'Respuesta inválida' }));

  if (!res.ok || !data.success || !data.token) {
    throw new Error(data.message || `Login failed (${res.status})`);
  }

  setAuthToken(data.token);
  return data;
}
