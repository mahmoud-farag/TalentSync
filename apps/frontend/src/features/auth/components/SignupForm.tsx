import React, { useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Button, Input, FormError } from '../../../shared/ui';
import {
  isValidEmail,
  getPasswordValidationRules,
} from '../../../shared/constants';
import { cn } from '../../../core/lib';
import type { SignupFormData } from '../types';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { setSignupDraft } from '../store';

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  accountType?: string;
}

type SignupRole = 'CANDIDATE' | 'RECRUITER';

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  isLoading,
  error, 
}) => {
  //* States
  const dispatch = useAppDispatch();
  // Use signupDraft from Redux directly as the single source of truth.
  // This ensures field values survive remounts (e.g. after a server error).
  const formData = useAppSelector((state) => state.auth.signupDraft);
  const [role, setRole] = useState<SignupRole>('CANDIDATE');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  //* Custom hooks

  //* Refs

  //* Helper functions
  const passwordRules = getPasswordValidationRules();

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.firstName) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      const failedRules = passwordRules.filter(
        (rule) => !rule.test(formData.password),
      );
      if (failedRules?.length > 0) {
        errors.password = failedRules?.[0]?.message;
      }
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!role) {
      errors.accountType = 'Please choose candidate/recruiter';
    
    } else {

      dispatch(setSignupDraft({ accountType: role }));
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

  const handleChange = (field: keyof SignupFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      dispatch(setSignupDraft({ [field]: value }));
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  //* JSX
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* {error && <FormError message={error} />} */}

      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
          I am a
        </p>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setRole('CANDIDATE')}
            className={cn(
              'rounded-lg py-2.5 text-sm font-semibold transition-all',
              role === 'CANDIDATE'
                ? 'bg-[#3b49a2] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            )}
          >
            Candidate
          </button>
          <button
            type="button"
            onClick={() => setRole('RECRUITER')}
            className={cn(
              'rounded-lg py-2.5 text-sm font-semibold transition-all',
              role === 'RECRUITER'
                ? 'bg-[#3b49a2] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            )}
          >
            Recruiter
          </button>
        </div>
        <p className="mt-1.5 text-xs text-gray-400">
          Role selection is for your experience; account type can be linked to
          your workspace later.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="First name"
          placeholder="Jane"
          value={formData.firstName}
          onChange={handleChange('firstName')}
          error={formErrors.firstName}
          autoComplete="given-name"
          disabled={isLoading}
        />

        <Input
          label="Last name"
          placeholder="Doe"
          value={formData.lastName}
          onChange={handleChange('lastName')}
          error={formErrors.lastName}
          autoComplete="family-name"
          disabled={isLoading}
        />
      </div>

      <Input
        type="email"
        label="Work email"
        placeholder="name@company.com"
        value={formData.email}
        onChange={handleChange('email')}
        error={formErrors.email}
        autoComplete="email"
        disabled={isLoading}
      />

      <Input
        type="password"
        label="Password"
        placeholder="Create a password"
        value={formData.password}
        onChange={handleChange('password')}
        error={formErrors.password}
        autoComplete="new-password"
        disabled={isLoading}
        helperText="At least 8 characters with uppercase, lowercase, number, and special character"
      />

      <Input
        type="password"
        label="Confirm password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        error={formErrors.confirmPassword}
        autoComplete="new-password"
        disabled={isLoading}
      />

      <Button
        type="submit"
        variant="primary"
        className="mt-2 w-full rounded-xl bg-[#3b49a2] py-3.5 text-[15px] font-semibold shadow-sm hover:bg-[#323f8f] focus:ring-[#3b49a2]"
        isLoading={isLoading}
        disabled={isLoading}
        rightIcon={<ArrowRightIcon className="h-5 w-5" aria-hidden />}
      >
        Create TalentSync account
      </Button>
    </form>
  );
};
