"use client";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
export function Card({ title, description, action, children, className = "" }: { title: string; description?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  const { t } = usePreferences();
  return <section className={`card ${className}`}><div className="card-heading"><div><h2>{t(title)}</h2>{description && <p>{t(description)}</p>}</div>{action}</div>{children}</section>;
}
