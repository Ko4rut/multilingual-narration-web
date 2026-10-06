import MainLayout from "@/components/layout/MainLayout";
import { requireSession } from "@/features/auth/session";
import type { MainLayoutProps } from "@/types/layout";

export default async function AdminLayout({ children }: MainLayoutProps) {
  await requireSession();
  return <MainLayout>{children}</MainLayout>;
}
