import api from './client';
import type { AuthResponse } from '../types/index';

export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/signup', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  getMe: () => api.get('/auth/me').then((r) => r.data),
};