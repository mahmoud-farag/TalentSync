import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../../app/store';
import { signupThunk } from '..';
import type { SignupRequest } from '../../../../core/auth/types';

export const useSignup = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const signup = useCallback(
    async (data: SignupRequest) => {
      try {
        await dispatch(signupThunk(data)).unwrap();
        toast.success('Account created successfully');
        navigate('/dashboard');
        return { success: true };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Signup failed';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [dispatch, navigate]
  );

  return {
    signup,
    loading: isLoading,
    error,
  };
};
