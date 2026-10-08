import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import { USER_ROLE_LABELS } from "../constants/user.constants";
import type { UserRoleBadgeProps } from "../types/user.types";

function getRoleLabel(roleId: string) {
  return USER_ROLE_LABELS[roleId] ?? roleId;
}

export function UserRoleBadge({ roleId }: UserRoleBadgeProps) {
  const { t } = usePreferences();

  return (
    <Badge
      variant="outline"
      className="border-border bg-secondary/60 font-normal text-foreground"
    >
      <span
        className="size-1.5 rounded-full bg-muted-foreground"
        aria-hidden="true"
      />
      {t(getRoleLabel(roleId))}
    </Badge>
  );
}
