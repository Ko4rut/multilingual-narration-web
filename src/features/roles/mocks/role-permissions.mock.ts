import { MOCK_PERMISSIONS } from "./permissions.mock";
import type { RolePermission } from "../types/role.types";

function permissionsForFunctions(
  roleId: string,
  functionIds: readonly string[],
): RolePermission[] {
  return MOCK_PERMISSIONS.flatMap(function createRolePermission(permission) {
    if (!functionIds.includes(permission.function_id)) {
      return [];
    }
    return [{ role_id: roleId, permission_id: permission.id }];
  });
}

function permissionsByIds(
  roleId: string,
  permissionIds: readonly string[],
): RolePermission[] {
  return permissionIds.map(function createRolePermission(permissionId) {
    return { role_id: roleId, permission_id: permissionId };
  });
}

export const MOCK_ROLE_PERMISSIONS: readonly RolePermission[] = [
  ...MOCK_PERMISSIONS.map(function grantAdministratorPermission(permission) {
    return {
      role_id: "role-super-admin",
      permission_id: permission.id,
    };
  }),
  ...permissionsForFunctions("role-content-admin", [
    "func-dashboard",
    "func-pois",
    "func-poi-content",
    "func-audio",
    "func-languages",
  ]),
  ...permissionsForFunctions("role-system-admin", [
    "func-dashboard",
    "func-users",
    "func-roles",
    "func-languages",
    "func-settings",
  ]),
  ...permissionsByIds("role-content-moderator", [
    "perm-0001",
    "perm-0002",
    "perm-0006",
    "perm-0008",
    "perm-0010",
    "perm-0011",
    "perm-0012",
    "perm-0023",
  ]),
];
