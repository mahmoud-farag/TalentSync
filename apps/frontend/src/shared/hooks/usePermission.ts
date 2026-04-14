import { useMemo } from 'react';
import type { Permission } from '../../core/permissions';
import { hasPermission, hasAllPermissions, hasAnyPermission } from '../../core/permissions';

interface UsePermissionOptions {
  userPermissions: Permission[];
}

/**
 * Hook to check user permissions
 */
export const usePermission = ({ userPermissions }: UsePermissionOptions) => {
  const checkPermission = useMemo(() => {
    return {
      has: (permission: Permission) => hasPermission(userPermissions, permission),
      hasAll: (permissions: Permission[]) =>
        hasAllPermissions(userPermissions, permissions).hasPermission,
      hasAny: (permissions: Permission[]) => hasAnyPermission(userPermissions, permissions),
    };
  }, [userPermissions]);

  return checkPermission;
};
