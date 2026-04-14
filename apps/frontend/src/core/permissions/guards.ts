import type { UserRole } from '../auth/types';
import type { Permission, PermissionCheckResult } from './types';

/**
 * Check if user has a specific permission
 */
export const hasPermission = (
  userPermissions: Permission[],
  requiredPermission: Permission
): boolean => {
  return userPermissions.includes(requiredPermission);
};

/**
 * Check if user has ALL specified permissions
 */
export const hasAllPermissions = (
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): PermissionCheckResult => {
  const missingPermissions = requiredPermissions.filter(
    (permission) => !userPermissions.includes(permission)
  );

  return {
    hasPermission: missingPermissions.length === 0,
    missingPermissions: missingPermissions.length > 0 ? missingPermissions : undefined,
  };
};

/**
 * Check if user has ANY of the specified permissions
 */
export const hasAnyPermission = (
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean => {
  return requiredPermissions.some((permission) => userPermissions.includes(permission));
};

/**
 * Check if user has a specific role
 */
export const hasRole = (userRole: UserRole, requiredRoles: UserRole | UserRole[]): boolean => {
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  return userRole === requiredRoles;
};

/**
 * Check if user is an admin
 */
export const isAdmin = (userRole: UserRole): boolean => {
  return userRole === 'ADMIN';
};

/**
 * Higher-order function to create a permission guard
 */
export const createPermissionGuard = (requiredPermissions: Permission[]) => {
  return (userPermissions: Permission[]): boolean => {
    return hasAllPermissions(userPermissions, requiredPermissions).hasPermission;
  };
};

/**
 * Higher-order function to create a role guard
 */
export const createRoleGuard = (requiredRoles: UserRole[]) => {
  return (userRole: UserRole): boolean => {
    return hasRole(userRole, requiredRoles);
  };
};