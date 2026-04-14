import React from 'react';
import { cn } from '../../core/lib';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  labelEnd?: React.ReactNode;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ( 
    {
      className,
      label,
      labelClassName,
      labelEnd,
      error,
      helperText,
      id,
      startAdornment,
      endAdornment,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? `input-${generatedId}`;
    const hasAdornments = Boolean(startAdornment || endAdornment);

    const inputEl = (
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'block w-full min-w-0 text-sm transition-colors placeholder:text-gray-400',
          'focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60',
          hasAdornments
            ? cn(
                'border-0 bg-transparent py-3',
                startAdornment ? 'pl-2 pr-3' : 'px-3',
                endAdornment && !startAdornment ? 'pl-3 pr-2' : undefined,
                endAdornment && startAdornment ? 'px-2' : undefined,
              )
            : cn(
                'rounded-xl border px-3 py-3 shadow-sm',
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                  : 'border-gray-200 bg-gray-50 focus:border-[#3b49a2] focus:ring-2 focus:ring-[#3b49a2]/25',
              ),
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
        {...props}
      />
    );

    return (
      <div className="w-full">
        {label && !labelEnd && (
          <label
            htmlFor={inputId}
            className={cn(
              'mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        {label && labelEnd && (
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label
              htmlFor={inputId}
              className={cn(
                'text-[11px] font-bold uppercase tracking-wider text-gray-500',
                labelClassName
              )}
            >
              {label}
            </label>
            {labelEnd}
          </div>
        )}
        {hasAdornments ? (
          <div
            className={cn(
              'flex items-stretch rounded-xl border bg-gray-100/90 shadow-sm transition-shadow',
              'focus-within:border-[#3b49a2] focus-within:ring-2 focus-within:ring-[#3b49a2]/20',
              error
                ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/25'
                : 'border-gray-200/80',
            )}
          >
            {startAdornment ? (
              <span className="flex shrink-0 items-center pl-3 text-gray-400">{startAdornment}</span>
            ) : null}
            {inputEl}
            {endAdornment ? (
              <span className="flex shrink-0 items-center pr-2 text-gray-400">{endAdornment}</span>
            ) : null}
          </div>
        ) : (
          inputEl
        )}
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
