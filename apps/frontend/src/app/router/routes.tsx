import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout, MainLayout, OAuthCallbackLayout } from '../layouts';
import { ProtectedRoute, PublicRoute } from './guards';
import { LoadingScreen } from '../../shared/components';
import { PlaceholderPage } from './PlaceholderPage';

// Lazy load pages
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('../../features/auth/pages/SignupPage'));
const OAuthCallbackPage = lazy(
  () => import('../../features/auth/pages/OAuthCallbackPage'),
);
const DashboardPage = lazy(
  () => import('../../features/dashboard/pages/DashboardPage'),
);

 

// Router configuration
export const AppRouters = createBrowserRouter([
  // Public routes (login, signup)
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: (
          <AuthLayout>
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <LoginPage />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: '/signup',
        element: (
          <AuthLayout>
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <SignupPage />
            </Suspense>
          </AuthLayout>
        ),
      },
    ],
  },

  // OAuth callback routes
  {
    path: '/oauth/callback/:provider',
    element: (
      <OAuthCallbackLayout provider="OAuth">
        <Suspense fallback={null}>
          <OAuthCallbackPage />
        </Suspense>
      </OAuthCallbackLayout>
    ),
  },

  // Protected routes (require authentication)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: '/dashboard',
            element: (
              <Suspense
                fallback={<LoadingScreen message="Loading dashboard..." />}
              >
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: '/users',
            element: <PlaceholderPage title="Users" />,
          },
          {
            path: '/jobs',
            element: <PlaceholderPage title="Jobs" />,
          },
          {
            path: '/candidates',
            element: <PlaceholderPage title="Candidates" />,
          },
          {
            path: '/settings',
            element: <PlaceholderPage title="Settings" />,
          },
        ],
      },
    ],
  },

  // Catch-all route
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

