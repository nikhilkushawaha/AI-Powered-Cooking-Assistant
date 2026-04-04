import api from './axios';
import { AuthResponse, LoginData, SignupData, User } from '../types';

export const authApi = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },

  updatePreferences: async (dietary_preference: string): Promise<{ message: string; user: User }> => {
    const response = await api.put<{ message: string; user: User }>('/api/auth/preferences', {
      dietary_preference,
    });
    return response.data;
  },
};
