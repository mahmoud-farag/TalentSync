import React, { useState } from 'react';
import {
  ArrowRightIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { Button, Input, FormError } from '../../../shared/ui';
import { isValidEmail } from '../../../shared/constants';
import type { LoginFormData } from '../types';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, error }) => {
  //* States
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  //* Custom hooks

  //* Refs

  //* Helper functions
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //* Life cycle hooks

  //* Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  //* JSX
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* {error && <FormError message={error} />} */}

      <Input
        type="email"
        label="Work email"
        placeholder="name@company.com"
        value={formData.email}
        onChange={handleChange('email')}
        error={formErrors.email}
        autoComplete="email"
        disabled={isLoading}
        startAdornment={<EnvelopeIcon className="h-5 w-5" aria-hidden />}
      />

      <Input
        type={showPassword ? 'text' : 'password'}
        label="Password"
        labelEnd={
          <a
            href="/forgot-password"
            className="text-[11px] font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300"
          >
            Forgot?
          </a>
        }
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange('password')}
        error={formErrors.password}
        autoComplete="current-password"
        disabled={isLoading}
        startAdornment={<LockClosedIcon className="h-5 w-5" aria-hidden />}
        endAdornment={
          <button
            type="button"
            className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white/70"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        }
      />

      <Button
        type="submit"
        variant="primary"
        className="mt-2 w-full rounded-xl bg-[#3b49a2] py-3.5 text-[15px] font-semibold shadow-sm hover:bg-[#323f8f] focus:ring-[#3b49a2]"
        isLoading={isLoading}
        disabled={isLoading}
        rightIcon={<ArrowRightIcon className="h-5 w-5" aria-hidden />}
      >
        Sign In to TalentSync
      </Button>
    </form>
  );
};
