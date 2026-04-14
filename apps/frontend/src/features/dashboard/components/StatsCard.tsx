import React from 'react';
import { cn } from '../../../core/lib';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}) => {
  //* States

  //* Custom hooks

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers

  //* JSX
  return (
    <div className={cn('rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="mt-2">
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
        {trend && (
          <p
            className={cn(
              'mt-1 text-sm font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </p>
        )}
      </div>
    </div>
  );
};
