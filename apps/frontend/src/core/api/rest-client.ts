import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '../config';
import { getAccessToken, clearTokens } from '../auth/token';

/**
 * Axios instance for REST API calls (OAuth, webhooks, file uploads)
 */
export const restClient = axios.create({
  baseURL: env.REST_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Request interceptor: Inject access token
 */
restClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Handle errors globally
 */
restClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear tokens and redirect to login
      clearTokens();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Log error for debugging
    if (env.NODE_ENV === 'development') {
      console.error('[REST Error]', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

/**
 * Helper to construct OAuth authorization URLs
 */
export const getOAuthUrl = (provider: 'google' | 'linkedin'): string => {
  return `${env.REST_URL}/oauth/${provider}`;
};

/**
 * Helper to exchange OAuth code for tokens
 */
export const exchangeOAuthCode = async (
  provider: 'google' | 'linkedin',
  code: string,
  state?: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await restClient.post(`/oauth/${provider}/callback`, {
    code,
    state,
    redirectUri: env.OAUTH_REDIRECT_URI,
  });

  return response.data;
};