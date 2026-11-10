import type { ReactNode } from "react";
import type { AuthenticatedUser } from "@/features/auth/types/auth.types";

/** Thuộc tính đầu vào của shell quản trị dùng chung. */
export type MainLayoutProps = {
  children: ReactNode;
  currentUser: AuthenticatedUser;
};
