import type { AuthCopy, AuthMode } from "./types";

export const authContent: Record<AuthMode, AuthCopy> = {
  login: { title: "Welcome Back", subtitle: "Sign in to continue to MANS Enterprise", action: "Sign In" },
  reset: { title: "Forgot Password?", subtitle: "Enter your email to reset your password", action: "Send Reset Link" },
};
