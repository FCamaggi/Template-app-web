// react/src/types/index.d.ts
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'guest';
  preferred_measurement?: 'RM' | 'Borg';
  experience_level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
