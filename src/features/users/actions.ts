"use server";

import { getAccessToken } from "@/features/auth/session";
import { getApiErrorMessage } from "@/service/api";
import {
  createManagerUser,
  getManagerRoles,
  getManagerUsers,
  updateManagerUser,
} from "./api/users.api";
import type {
  ManagerUserCreatePayload,
  ManagerUserUpdatePayload,
  UserActionResult,
  UserManagementData,
} from "./types/user.types";

export async function loadUserManagement(): Promise<UserActionResult<UserManagementData>> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return { data: null, error: "Your API session has expired. Please sign in again." };
    }
    const [users, roles] = await Promise.all([
      getManagerUsers(accessToken),
      getManagerRoles(accessToken),
    ]);
    return { data: { users, roles }, error: null };
  } catch (error) {
    return { data: null, error: getApiErrorMessage(error, "Unable to load user management data.") };
  }
}

export async function createUser(payload: ManagerUserCreatePayload): Promise<UserActionResult<Awaited<ReturnType<typeof createManagerUser>>>> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return { data: null, error: "Your API session has expired. Please sign in again." };
    }
    return { data: await createManagerUser(accessToken, payload), error: null };
  } catch (error) {
    return { data: null, error: getApiErrorMessage(error, "Unable to create manager user.") };
  }
}

export async function updateUser(userId: string, payload: ManagerUserUpdatePayload): Promise<UserActionResult<Awaited<ReturnType<typeof updateManagerUser>>>> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return { data: null, error: "Your API session has expired. Please sign in again." };
    }
    return { data: await updateManagerUser(accessToken, userId, payload), error: null };
  } catch (error) {
    return { data: null, error: getApiErrorMessage(error, "Unable to update manager user.") };
  }
}
