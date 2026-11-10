import { api, bearerAuthorization } from "@/service/api";
import type {
  ManagerRole,
  ManagerUser,
  ManagerUserCreatePayload,
  ManagerUserPage,
  ManagerUserUpdatePayload,
} from "../types/user.types";

export async function getManagerUsers(accessToken: string) {
  const response = await api.get<ManagerUserPage>("/manager-users", {
    params: { offset: 0, limit: 100 },
    headers: bearerAuthorization(accessToken),
  });
  return response.data.items;
}

export async function getManagerRoles(accessToken: string) {
  const response = await api.get<ManagerRole[]>("/roles", {
    headers: bearerAuthorization(accessToken),
  });
  return response.data;
}

export async function createManagerUser(
  accessToken: string,
  payload: ManagerUserCreatePayload,
) {
  const response = await api.post<ManagerUser>("/manager-users", payload, {
    headers: bearerAuthorization(accessToken),
  });
  return response.data;
}

export async function updateManagerUser(
  accessToken: string,
  userId: string,
  payload: ManagerUserUpdatePayload,
) {
  const response = await api.patch<ManagerUser>(
    `/manager-users/${encodeURIComponent(userId)}`,
    payload,
    { headers: bearerAuthorization(accessToken) },
  );
  return response.data;
}
