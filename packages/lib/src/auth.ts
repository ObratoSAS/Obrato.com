import { api } from './api-client';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function login(email: string, password: string, twoFactorToken?: string) {
  const response = await api.post<AuthTokens>('/auth/login', { email, password, twoFactorToken });
  return response.data;
}

export async function register(payload: { email: string; password: string; fullName: string }) {
  const response = await api.post<AuthTokens>('/auth/register', payload);
  return response.data;
}

export async function logout() {
  await api.post('/auth/logout');
}
