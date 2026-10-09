import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { PoisStatusBadgeProps } from "../types";

export function PoisStatusBadge({ status }: PoisStatusBadgeProps) {
  const { t } = usePreferences();

  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          {t("Active")}
        </span>
      );
    case "inactive":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
          <span className="size-1.5 rounded-full bg-amber-400" />
          {t("Inactive")}
        </span>
      );
    case "maintenance":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-400">
          <span className="size-1.5 rounded-full bg-rose-400" />
          {t("Maintenance")}
        </span>
      );
    default:
      return null;
  }
}
