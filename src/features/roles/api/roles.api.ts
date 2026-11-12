import { api, bearerAuthorization } from "@/service/api";
import type { Permission, Role, RoleCreatePayload } from "../types/role.types";

export async function getRoles(accessToken: string) {
  const response = await api.get<Role[]>("/roles", {
    headers: bearerAuthorization(accessToken),
  });
  return response.data;
}

export async function getPermissions(accessToken: string) {
  const response = await api.get<Permission[]>("/roles/permissions", {
    headers: bearerAuthorization(accessToken),
  });
  return response.data;
}

export async function getRolePermissions(accessToken: string, roleId: string) {
  const response = await api.get<Permission[]>(
    `/roles/${encodeURIComponent(roleId)}/permissions`,
    { headers: bearerAuthorization(accessToken) },
  );
  return response.data;
}

export async function createRole(
  accessToken: string,
  payload: RoleCreatePayload,
) {
  const response = await api.post<Role>("/roles", payload, {
    headers: bearerAuthorization(accessToken),
  });
  return response.data;
}

export async function replaceRolePermissions(
  accessToken: string,
  roleId: string,
  permissionIds: readonly string[],
) {
  const response = await api.put<Permission[]>(
    `/roles/${encodeURIComponent(roleId)}/permissions`,
    { permission_ids: permissionIds },
    { headers: bearerAuthorization(accessToken) },
  );
  return response.data;
}
