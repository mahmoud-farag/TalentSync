import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../../core/lib';

export const AuthTabs: React.FC = () => {
  //* States

  //* Custom hooks

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers

  //* JSX
  return (
    <div className="mb-6 flex gap-10 border-b border-gray-200">
      <NavLink
        to="/login"
        className={({ isActive }) =>
          cn(
            'relative pb-3 text-sm font-semibold transition-colors',
            isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
          )
        }
      >
        {({ isActive }) => (
          <>
            Sign In
            {isActive ? (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#3b49a2]" />
            ) : null}
          </>
        )}
      </NavLink>
      <NavLink
        to="/signup"
        className={({ isActive }) =>
          cn(
            'relative pb-3 text-sm font-semibold transition-colors',
            isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
          )
        }
      >
        {({ isActive }) => (
          <>
            Create Account
            {isActive ? (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#3b49a2]" />
            ) : null}
          </>
        )}
      </NavLink>
    </div>
  );
};
