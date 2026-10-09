import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { ProfileIdentityCardProps } from "../types/profile.types";

/** Hiển thị nhận diện chính, vai trò và trạng thái của người dùng hiện tại. */
export function ProfileIdentityCard({
  profile,
  roleLabel,
  statusLabel,
  employeeIdLabel,
}: ProfileIdentityCardProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="h-20 bg-linear-to-r from-success/25 via-info/10 to-transparent" />
      <CardContent className="relative flex flex-col gap-5 pt-5 pb-6 sm:-mt-10 sm:flex-row sm:items-end sm:justify-between sm:pt-0">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
          <Avatar className="size-20 overflow-visible border-4 border-card shadow-sm">
            <AvatarFallback className="bg-sidebar-accent text-xl font-semibold text-sidebar-accent-foreground">
              {profile.initials}
            </AvatarFallback>
            <AvatarBadge
              aria-hidden="true"
              className="bg-success ring-card group-data-[size=default]/avatar:size-4"
            />
          </Avatar>
          <div className="min-w-0 pb-1">
            <h2 className="truncate text-xl font-semibold text-card-foreground">
              {profile.fullName}
            </h2>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {profile.email}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">{roleLabel}</Badge>
              <StatusBadge tone="success" label={statusLabel} />
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-muted/30 px-4 py-3 sm:text-right">
          <p className="text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {employeeIdLabel}
          </p>
          <p className="mt-1 font-mono text-xs font-medium text-card-foreground">
            {profile.id}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
