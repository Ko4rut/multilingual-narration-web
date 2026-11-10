import { api, bearerAuthorization } from "@/service/api";
import type { AuthenticatedUser } from "../types/auth.types";

export type LoginApiResponse = {
  access_token: string;
  expires_in: number;
};

/** Xác thực credential và nhận access token từ Identity API. */
export async function loginWithCredentials(email: string, password: string) {
  const response = await api.post<LoginApiResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
}

/** Lấy thông tin công khai của user gắn với access token hiện tại. */
export async function getAuthenticatedUser(accessToken: string) {
  const response = await api.get<AuthenticatedUser>("/auth/me", {
    headers: bearerAuthorization(accessToken),
  });
  return response.data;
}
