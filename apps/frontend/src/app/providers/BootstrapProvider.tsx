import React, { useEffect, useState } from 'react';
import { LoadingScreen } from '../../shared/components';
import { useAppDispatch } from '../store';
import { initializeAuth } from '../store/authSlice';

interface BootstrapProviderProps {
  children: React.ReactNode;
}

/**
 * BootstrapProvider handles initial app loading state
 * Shows loading screen while checking authentication status
 */ 
export const BootstrapProvider: React.FC<BootstrapProviderProps> = ({ children }) => {
  const [isBootstrapped, setIsBootstrapped] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const bootstrap = async (): Promise<void> => {
     try{
      await dispatch(initializeAuth());
      await new Promise<void>((resolve) => setTimeout(resolve, 500));
     } catch (error) {
      console.error('Bootstrap failed:', error);
     } finally {
      setIsBootstrapped(true);
     }
    };

    bootstrap();
  }, [dispatch]);

  if (!isBootstrapped) {
    return <LoadingScreen message="Initializing..." />;
  }

  return <>{children}</>;
};