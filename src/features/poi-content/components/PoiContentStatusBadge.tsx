import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { PoiContentStatusBadgeProps } from "../types";

export function PoiContentStatusBadge({ status }: PoiContentStatusBadgeProps) {
  const { t } = usePreferences();

  switch (status) {
    case "published":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          {t("Published")}
        </span>
      );
    case "pending_review":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
          <span className="size-1.5 rounded-full bg-amber-400" />
          {t("Pending Review")}
        </span>
      );
    case "approved":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-400">
          <span className="size-1.5 rounded-full bg-sky-400" />
          {t("Approved")}
        </span>
      );
    case "draft":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-1 text-xs font-medium text-slate-400">
          <span className="size-1.5 rounded-full bg-slate-400" />
          {t("Draft")}
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-400">
          <span className="size-1.5 rounded-full bg-rose-400" />
          {t("Rejected")}
        </span>
      );
    default:
      return null;
  }
}
