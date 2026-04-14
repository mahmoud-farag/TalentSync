import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store';
import { loginThunk, logoutThunk, setError, signupThunk } from '..';
import type { LoginRequest, SignupRequest } from '../../../../core/auth/types';

/**
 * Hook to access authentication state and actions
 * Redux store is the single source of truth for auth state.
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      await dispatch(loginThunk(credentials)).unwrap();
    },
    [dispatch]
  );

  const signup = useCallback(
    async (data: SignupRequest) => {
      await dispatch(signupThunk(data)).unwrap();
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutThunk()).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  const clearAuth = useCallback(() => {
    dispatch(logoutThunk());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
    clearAuth,
  };
};

/**
 * Hook return type for TypeScript inference
 */
export type UseAuthReturn = ReturnType<typeof useAuth>;
