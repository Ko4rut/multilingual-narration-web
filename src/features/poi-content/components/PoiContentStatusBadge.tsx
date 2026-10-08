import React from "react";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import type { ContentStatus } from "../types";

interface PoiContentStatusBadgeProps {
  status: ContentStatus;
}

export function PoiContentStatusBadge({ status }: PoiContentStatusBadgeProps) {
  const { t } = usePreferences();

  switch (status) {
    case "published":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {t("Published")}
        </span>
      );
    case "pending_review":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {t("Pending Review")}
        </span>
      );
    case "approved":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          {t("Approved")}
        </span>
      );
    case "draft":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          {t("Draft")}
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          {t("Rejected")}
        </span>
      );
    default:
      return null;
  }
}
