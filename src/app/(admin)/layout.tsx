import { Sidebar } from "@/components/layout/Sidebar";
import { requireSession } from "@/features/auth/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireSession();
  return <div className="admin-shell"><a className="skip-link" href="#main-content">Skip to content</a><Sidebar /><main id="main-content" className="main-content">{children}</main></div>;
}
