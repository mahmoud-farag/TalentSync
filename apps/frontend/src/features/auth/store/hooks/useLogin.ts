import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../../app/store';
import { loginThunk } from '..';
import type { LoginRequest } from '../../../../core/auth/types';

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        await dispatch(loginThunk(credentials)).unwrap();
        toast.success('Signed in successfully');
        navigate('/dashboard');
        return { success: true };
      } catch (err) {
        const errorMessage = typeof err === 'string' ? err : err instanceof Error ? err.message : 'Login failed';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [dispatch, navigate]
  );

  return {
    login,
    loading: isLoading,
    error,
  };
};
