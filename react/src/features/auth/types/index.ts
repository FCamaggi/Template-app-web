// src/features/auth/types/index.ts
import { User } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  email: string;
  password: string;
  experience_level: NonNullable<'beginner' | 'intermediate' | 'advanced'>;
  preferred_measurement: NonNullable<'RM' | 'Borg'>;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
