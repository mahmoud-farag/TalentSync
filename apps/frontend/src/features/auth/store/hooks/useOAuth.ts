import { useCallback, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../../../app/store';
import { setUser, setError } from '..';
import { setTokens, setStoredUser } from '../../../../core/auth/token';
import { initiateOAuth, handleOAuthCallback } from '../../api';
import type { OAuthProvider } from '../../../../core/auth/types';

export const useOAuth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const startOAuth = useCallback((provider: OAuthProvider) => {
    initiateOAuth(provider);
  }, []);

  const processCallback = useCallback(
    async (provider: OAuthProvider, code: string, state?: string) => {
      setIsLoading(true);
      try {
        const { user, accessToken, refreshToken } = await handleOAuthCallback(provider, code, state);

        // Store tokens and user
        setTokens(accessToken, refreshToken);
        setStoredUser(user);

        // Update Redux state
        dispatch(setUser(user as any));

        toast.success('Signed in successfully');

        // Navigate to dashboard
        navigate('/dashboard');

        return { success: true };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'OAuth authentication failed';
        dispatch(setError(errorMessage));
        navigate('/login');
        return { success: false, error: errorMessage };
      } finally {
      setIsLoading(false);
    }
  },
    [dispatch, navigate]
  );

  return {
    startOAuth,
    processCallback,
    isLoading,
  };
};

/**
 * Hook for OAuth callback page
 */
export const useOAuthCallback = () => {
  const { provider } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const { processCallback, isLoading } = useOAuth();

  const code = searchParams.get('code');
  const state = searchParams.get('state') || undefined;

  const processOAuthCallback = useCallback(async () => {
    if (!provider || !code) {
      const errorMessage = 'Invalid OAuth callback';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }

    return processCallback(provider as OAuthProvider, code, state);
  }, [provider, code, state, processCallback]);

  return {
    provider: provider as OAuthProvider | undefined,
    code,
    isLoading,
    processOAuthCallback,
  };
};
