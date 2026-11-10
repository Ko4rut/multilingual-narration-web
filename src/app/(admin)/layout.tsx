import MainLayout from "@/components/layout/MainLayout";
import { getCurrentUser } from "@/features/auth/current-user";
import { requireSession } from "@/features/auth/session";
import type { MainLayoutProps } from "@/types/layout/main-layout.types";

export default async function AdminLayout({ children }: Pick<MainLayoutProps, "children">) {
  await requireSession();
  const currentUser = await getCurrentUser();
  return <MainLayout currentUser={currentUser}>{children}</MainLayout>;
}
