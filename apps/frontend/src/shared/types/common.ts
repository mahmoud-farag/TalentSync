/**
 * Common types used across the application
 */

/**
 * Status type for entities
 */
export type Status = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'ARCHIVED';

/**
 * Priority levels
 */
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

/**
 * Common entity interface
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Select option type
 */
export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
}

/**
 * Key-value pair
 */
export interface KeyValue<K = string, V = string> {
  key: K;
  value: V;
}

/**
 * Range type
 */
export interface Range<T = number> {
  min?: T;
  max?: T;
}

/**
 * Async state
 */
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}