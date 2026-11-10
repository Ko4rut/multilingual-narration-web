import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/AuthForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <AuthForm
      mode="login"
      defaultEmail={process.env.LOCAL_LOGIN_EMAIL}
      defaultPassword={process.env.LOCAL_LOGIN_PASSWORD}
    />
  );
}
