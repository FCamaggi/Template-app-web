// src/features/auth/hooks/useAuth.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import {
  setCredentials,
  setError,
  setLoading,
  logout,
} from '../store/authSlice';
import { LoginCredentials, RegisterCredentials } from '../types';
import { RootState } from '@/store';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        dispatch(setLoading(true));
        const response = await authService.login(credentials);
        dispatch(setCredentials(response));
        toast.success('Login successful!');
        navigate('/dashboard');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        dispatch(setError(message));
        toast.error(message);
      }
    },
    [dispatch, navigate]
  );

  const handleRegister = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        dispatch(setLoading(true));
        const response = await authService.register(credentials);
        dispatch(setCredentials(response));
        toast.success('Registration successful!');
        navigate('/dashboard');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Registration failed';
        dispatch(setError(message));
        toast.error(message);
      }
    },
    [dispatch, navigate]
  );

  const handleLogout = useCallback(() => {
    authService.logout();
    dispatch(logout());
    navigate('/login');
    toast.success('Logout successful');
  }, [dispatch, navigate]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};
