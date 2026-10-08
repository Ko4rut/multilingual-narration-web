"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, SESSION_COOKIE, SESSION_SECONDS } from "./session";
import { mockCredentials } from "./mocks/auth.mock";
import type { LoginState } from "./types/auth.types";

export async function login(_state: LoginState, form: FormData): Promise<LoginState> {
  if (form.get("email") !== mockCredentials.email || form.get("password") !== mockCredentials.password) {
    return { error: "Invalid email or password" };
  }
  (await cookies()).set(SESSION_COOKIE, createSession(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: SESSION_SECONDS,
  });
  redirect("/dashboard");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
