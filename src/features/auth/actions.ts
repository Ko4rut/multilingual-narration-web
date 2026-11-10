"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getApiErrorMessage } from "@/service/api";
import {
  loginWithCredentials,
  type LoginApiResponse,
} from "./api/auth.api";
import {
  ACCESS_TOKEN_COOKIE,
  createSession,
  SESSION_COOKIE,
  SESSION_SECONDS,
} from "./session";
import type { LoginState } from "./types/auth.types";

export async function login(_state: LoginState, form: FormData): Promise<LoginState> {
  const email = form.get("email");
  const password = form.get("password");
  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid email or password" };
  }

  let result: LoginApiResponse;
  try {
    result = await loginWithCredentials(email, password);
  } catch (error) {
    return { error: getApiErrorMessage(error, "Invalid email or password") };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSession(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: SESSION_SECONDS,
  });
  cookieStore.set(ACCESS_TOKEN_COOKIE, result.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: result.expires_in,
  });
  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  redirect("/login");
}
