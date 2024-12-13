// src/features/auth/services/authService.ts
import axios from '@/lib/axios';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(
      '/auth/register',
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Opcional: llamar al endpoint de logout si existe
    localStorage.removeItem('token');
  },

  getProfile: async () => {
    const response = await axios.get('/auth/profile');
    return response.data;
  },

  validateToken: async () => {
    try {
      const response = await axios.get('/auth/validate');
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      throw error;
    }
  },
};
