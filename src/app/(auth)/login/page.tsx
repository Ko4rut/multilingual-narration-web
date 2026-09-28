import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/AuthForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
