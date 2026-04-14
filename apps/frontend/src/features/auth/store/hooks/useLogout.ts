import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../../app/store';
import { logoutThunk } from '..';

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Logout failed');
    }
  }, [dispatch, navigate]);

  return {
    logout,
    loading: isLoading,
  };
};
