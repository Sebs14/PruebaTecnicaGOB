import { api } from '@/lib/api';
import type { User, LoginCredentials, LoginResponse } from '@/types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/login', credentials);
  },

  logout: async (): Promise<void> => {
    return api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  refreshToken: async (): Promise<void> => {
    return api.post('/auth/refresh');
  },
};
