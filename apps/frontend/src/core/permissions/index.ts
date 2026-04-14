export type { Permission, PermissionCheckResult, RolePermissions } from './types';
export {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasRole,
  isAdmin,
  createPermissionGuard,
  createRoleGuard,
} from './guards';