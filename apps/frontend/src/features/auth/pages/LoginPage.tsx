import React from 'react';
import { Link } from 'react-router-dom';
import { AuthBrandHeader, AuthSocialRow, AuthTabs, LoginForm } from '../components';
import type { LoginFormData } from '../types';
import { useOAuth, useLogin } from '../store/hooks';

const LoginPage: React.FC = () => {
  //* States

  //* Custom hooks
  const { login, loading, error } = useLogin();
  const { startOAuth } = useOAuth();

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers
  const handleSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  const handleOAuthClick = (provider: 'google' | 'linkedin') => {
    startOAuth(provider);
  };

  //* JSX
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AuthBrandHeader />
      <AuthTabs />

      <h1 className="text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl">Welcome back</h1>
      <p className="mt-1 text-sm text-gray-500 lg:text-[15px]">
        Enter your credentials to access your talent dashboard.
      </p>

      <div className="mt-8 flex-1">
        <LoginForm onSubmit={handleSubmit} isLoading={loading} error={error} />
      </div>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <AuthSocialRow onOAuthClick={handleOAuthClick} disabled={loading} />

      <p className="mt-6 text-center text-xs leading-relaxed text-gray-500">
        By continuing, you agree to our{' '}
        <a href="/terms" className="font-medium text-[#3b49a2] hover:text-[#323f8f]">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="font-medium text-[#3b49a2] hover:text-[#323f8f]">
          Privacy Policy
        </a>
        .
      </p>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold text-[#3b49a2] hover:text-[#323f8f]">
          Create Account
        </Link>
      </p>

      <div className="mt-auto flex flex-col justify-between gap-3 border-t border-gray-100 pt-8 text-[10px] font-semibold uppercase tracking-wider text-gray-400 sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} TalentSync International</span>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <a href="/privacy" className="hover:text-gray-600">
            Privacy
          </a>
          <a href="/terms" className="hover:text-gray-600">
            Terms
          </a>
          <a href="/contact" className="hover:text-gray-600">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
