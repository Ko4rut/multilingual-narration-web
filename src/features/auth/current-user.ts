import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "./api/auth.api";
import { ACCESS_TOKEN_COOKIE } from "./session";

/** Lấy user đã xác thực từ backend; JWT chỉ được đọc ở server. */
export const getCurrentUser = cache(async function getCurrentUserFromApi() {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    redirect("/login");
  }

  try {
    return await getAuthenticatedUser(accessToken);
  } catch {
    redirect("/login");
  }
});
