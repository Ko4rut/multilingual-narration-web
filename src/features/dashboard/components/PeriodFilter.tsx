"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Period } from "../types";

import { usePreferences } from "@/features/preferences/hooks/usePreferences";

export function PeriodFilter({ period }: { period: Period }) {
  const { t } = usePreferences();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <label className="period-filter"><span className="sr-only">{t("Reporting period")}</span><select aria-label={t("Reporting period")} value={period} disabled={pending} onChange={(event) => { const value = event.target.value; startTransition(() => router.replace(`/dashboard?period=${value}`, { scroll: false })); }}><option value="7">{t("Last 7 Days")}</option><option value="30">{t("Last 30 Days")}</option><option value="90">{t("Last 90 Days")}</option></select><span role="status" className="sr-only">{pending ? t("Updating dashboard") : ""}</span></label>;
}
