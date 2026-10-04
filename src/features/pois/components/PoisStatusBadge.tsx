import React from "react";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import type { PoiStatus } from "../types";

interface PoisStatusBadgeProps {
  status: PoiStatus;
}

export function PoisStatusBadge({ status }: PoisStatusBadgeProps) {
  const { t } = usePreferences();

  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {t("Active")}
        </span>
      );
    case "inactive":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {t("Inactive")}
        </span>
      );
    case "maintenance":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          {t("Maintenance")}
        </span>
      );
    default:
      return null;
  }
}
