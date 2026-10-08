import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import { USER_STATUS } from "../constants/user.constants";
import type { UserStatusBadgeProps } from "../types/user.types";

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const { t } = usePreferences();

  if (status === USER_STATUS.ACTIVE) {
    return (
      <Badge
        variant="outline"
        className="border-success/40 bg-success/15 font-normal text-success"
      >
        <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
        {t("Active")}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-destructive/50 bg-destructive/15 font-normal text-destructive"
    >
      <span
        className="size-1.5 rounded-full bg-destructive"
        aria-hidden="true"
      />
      {t("Inactive")}
    </Badge>
  );
}
