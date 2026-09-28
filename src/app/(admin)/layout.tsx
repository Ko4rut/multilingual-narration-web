import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell"><a className="skip-link" href="#main-content">Skip to content</a><Sidebar /><main id="main-content" className="main-content">{children}</main></div>;
}
