/**
 * Shared domain model types
 */

/**
 * Entity with ID
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tenant/Workspace
 */
export interface Tenant extends BaseEntity {
  name: string;
  slug: string;
  logo?: string;
  isActive: boolean;
  settings?: TenantSettings;
}

export interface TenantSettings {
  primaryColor?: string;
  secondaryColor?: string;
  timezone?: string;
  dateFormat?: string;
  currency?: string;
}

/**
 * Status type for various entities
 */
export type Status = 'active' | 'inactive' | 'archived';

/**
 * Priority type
 */
export type Priority = 'low' | 'medium' | 'high';

/**
 * Generic select option
 */
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

/**
 * Menu item for navigation
 */
export interface MenuItem {
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  badge?: string | number;
  disabled?: boolean;
}