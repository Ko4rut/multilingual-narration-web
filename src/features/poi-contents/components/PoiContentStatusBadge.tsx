import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import {
  CONTENT_STATUS,
  CONTENT_STATUS_LABELS,
} from "../constants/poi-content.constants";
import type { PoiContentStatusBadgeProps } from "../types/poi-content.types";

export function PoiContentStatusBadge({ status }: PoiContentStatusBadgeProps) {
  const { t } = usePreferences();
  let tone: "success" | "warning" | "info" | "destructive" | "neutral" = "neutral";

  if (status === CONTENT_STATUS.PUBLISHED)
    tone = "success";
  if ( status === CONTENT_STATUS.APPROVED || status === CONTENT_STATUS.WAITING_APPROVAL)
    tone = "info";
  if (status === CONTENT_STATUS.DRAFT)
    tone = "warning";
  if (status === CONTENT_STATUS.REJECTED)
    tone = "destructive";

  return <StatusBadge label={t(CONTENT_STATUS_LABELS[status])} tone={tone} />;
}
