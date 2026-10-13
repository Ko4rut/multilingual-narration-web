import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import {
  LANGUAGE_STATUS,
  LANGUAGE_STATUS_LABELS,
} from "../constants/language.constants";
import type { LanguageStatusBadgeProps } from "../types/language.types";

/** Hiển thị trạng thái ngôn ngữ bằng StatusBadge dùng chung của hệ thống. */
export function LanguageStatusBadge({ status }: LanguageStatusBadgeProps) {
  const { t } = usePreferences();

  if (status === LANGUAGE_STATUS.SUPPORTED) {
    return (
      <StatusBadge
        label={t(LANGUAGE_STATUS_LABELS[status])}
        tone="success"
      />
    );
  }

  return (
    <StatusBadge
      label={t(LANGUAGE_STATUS_LABELS[status])}
      tone="neutral"
    />
  );
}
