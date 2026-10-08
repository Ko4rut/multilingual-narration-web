"use client";

import { ShieldCheck } from "lucide-react";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";

export function SecurityMaintenance() {
  const { t } = usePreferences();

  return (
    <div className="card bg-surface border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-border/50 pb-3">
        <ShieldCheck className="w-5 h-5 text-accent" />
        <h2 className="font-bold text-lg text-foreground">{t("Security & Maintenance")}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted">{t("Audit Log Retention")}</label>
          <select className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus-visible:outline-accent cursor-pointer">
            <option>{t("90 Days")}</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted">{t("Session Timeout")}</label>
          <select className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus-visible:outline-accent cursor-pointer">
            <option>{t("30 Minutes")}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
