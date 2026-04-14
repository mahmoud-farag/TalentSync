import type { UserRole } from '../auth/types';

/**
 * Permission types from backend
 * These should match the permissions defined in app-permissions.json
 */
export type Permission = string;

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  hasPermission: boolean;
  missingPermissions?: Permission[];
}

/**
 * Role permission mapping type
 */
export type RolePermissions = Record<UserRole, Permission[]>;