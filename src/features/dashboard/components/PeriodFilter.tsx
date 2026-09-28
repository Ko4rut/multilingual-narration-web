"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Period } from "../types";

export function PeriodFilter({ period }: { period: Period }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <label className="period-filter"><span className="sr-only">Reporting period</span><select value={period} disabled={pending} onChange={(event) => { const value = event.target.value; startTransition(() => router.replace(`/dashboard?period=${value}`, { scroll: false })); }}><option value="7">Last 7 Days</option><option value="30">Last 30 Days</option><option value="90">Last 90 Days</option></select><span role="status" className="sr-only">{pending ? "Updating dashboard" : ""}</span></label>;
}
