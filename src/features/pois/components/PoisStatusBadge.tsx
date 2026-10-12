import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { POI_STATUS, POI_STATUS_LABELS } from "../constants/poi.constants";
import type { PoisStatusBadgeProps } from "../types/poi.types";

export function PoisStatusBadge({ status }: PoisStatusBadgeProps) {
  const { t } = usePreferences();

  if (status === POI_STATUS.ACTIVE) {
    return <StatusBadge label={t(POI_STATUS_LABELS[status])} tone="success" pulse />;
  }
  return <StatusBadge label={t(POI_STATUS_LABELS[status])} tone="neutral" />;
}
