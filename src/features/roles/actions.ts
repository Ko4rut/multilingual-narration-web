"use server";

import { getAccessToken } from "@/features/auth/session";
import { getManagerUsers } from "@/features/users/api/users.api";
import { getApiErrorMessage } from "@/service/api";
import {
  createRole,
  getPermissions,
  getRolePermissions,
  getRoles,
  replaceRolePermissions,
} from "./api/roles.api";
import type {
  RoleActionResult,
  RoleCreatePayload,
  RoleManagementData,
} from "./types/role.types";

export async function loadRoleManagement(): Promise<
  RoleActionResult<RoleManagementData>
> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return { data: null, error: "Your API session has expired. Please sign in again." };
    }

    const [roles, permissions, users] = await Promise.all([
      getRoles(accessToken),
      getPermissions(accessToken),
      getManagerUsers(accessToken),
    ]);
    const permissionsByRole = await Promise.all(
      roles.map(async function loadPermissionsForRole(role) {
        const assignedPermissions = await getRolePermissions(accessToken, role.id);
        return assignedPermissions.map(function createMapping(permission) {
          return { role_id: role.id, permission_id: permission.id };
        });
      }),
    );

    return {
      data: {
        roles,
        permissions,
        users,
        rolePermissions: permissionsByRole.flat(),
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: getApiErrorMessage(error, "Unable to load role management data."),
    };
  }
}

export async function createRoleAction(payload: RoleCreatePayload) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return { data: null, error: "Your API session has expired. Please sign in again." };
    }
    return { data: await createRole(accessToken, payload), error: null };
  } catch (error) {
    return { data: null, error: getApiErrorMessage(error, "Unable to create role.") };
  }
}

export async function updateRolePermissionsAction(
  roleId: string,
  permissionIds: readonly string[],
) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return { data: null, error: "Your API session has expired. Please sign in again." };
    }
    return {
      data: await replaceRolePermissions(accessToken, roleId, permissionIds),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: getApiErrorMessage(error, "Unable to update role permissions."),
    };
  }
}
