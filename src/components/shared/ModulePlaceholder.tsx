"use client";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";

export function ModulePlaceholder({ title, description }: { title: string; description: string }) {
  const { t } = usePreferences();
  return <><PageHeader title={title} description={description} /><section className="card empty-state"><span className="eyebrow">{t("READY FOR DEVELOPMENT")}</span><h2>{t(title)}</h2><p>{t("The route and workspace layout are ready. Connect this module to your API to add management workflows.")}</p><Link href="/dashboard" className="button">{t("Back to dashboard")}</Link></section></>;
}
