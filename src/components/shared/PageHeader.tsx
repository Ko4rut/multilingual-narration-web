"use client";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
export function PageHeader({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  const { t } = usePreferences();
  return <header className="page-header"><div><h1>{t(title)}</h1><p>{t(description)}</p></div>{children}</header>;
}
