import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { USER_STATUS, USER_STATUS_LABELS } from "../constants/user.constants";
import type { UserStatusBadgeProps } from "../types/user.types";

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const { t } = usePreferences();

  if (status === USER_STATUS.ACTIVE) {
    return (
      <StatusBadge tone="success" label={t(USER_STATUS_LABELS[status])} />
    );
  }

  return (
    <StatusBadge tone="destructive" label={t(USER_STATUS_LABELS[status])} />
  );
}
