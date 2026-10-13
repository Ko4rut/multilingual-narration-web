"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { cn } from "@/lib/utils";
import type { RoleDirectoryProps } from "../types/role.types";
import { formatRoleDate } from "../utils/role.utils";

export function RoleDirectory({
  items,
  selectedRoleId,
  onSelectRole,
}: RoleDirectoryProps) {
  const { t, locale } = usePreferences();

  return (
    <Card className="gap-0 py-0 lg:min-h-[36rem]">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="text-sm">{t("Roles Directory")}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {t("Select a role to view and configure permissions.")}
        </p>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {items.map(function renderRole(item) {
          const isSelected = item.role.id === selectedRoleId;
          const createdAt = formatRoleDate(item.role.created_at, locale);
          let lastUpdatedAt = t("Never updated");
          if (item.role.last_updated_at) {
            lastUpdatedAt = formatRoleDate(
              item.role.last_updated_at,
              locale,
            );
          }
          let itemClassName =
            "w-full rounded-lg border border-border bg-background/40 p-4 text-left transition-colors hover:bg-hover focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";
          if (isSelected) {
            itemClassName =
              "w-full rounded-lg border border-primary bg-primary/5 p-4 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";
          }

          return (
            <button
              key={item.role.id}
              type="button"
              className={itemClassName}
              aria-pressed={isSelected}
              onClick={function selectRole() {
                onSelectRole(item.role.id);
              }}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      item.indicatorClassName,
                    )}
                  />
                  <span className="truncate text-sm font-semibold text-foreground">
                    {t(item.role.name)}
                  </span>
                </span>
                <span className="shrink-0 rounded-md bg-secondary px-2 py-1 text-[10px] text-muted-foreground">
                  {item.userCount.toLocaleString(locale)} {t("users")}
                </span>
              </span>
              <span className="mt-2 block text-xs text-muted-foreground">
                {t(item.description)}
              </span>
              <span className="mt-3 grid grid-cols-2 gap-3 border-t border-border/70 pt-3 text-[10px] text-muted-foreground">
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="font-medium uppercase tracking-wide">
                    {t("Created at")}
                  </span>
                  <time dateTime={item.role.created_at}>{createdAt}</time>
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="font-medium uppercase tracking-wide">
                    {t("Last updated at")}
                  </span>
                  {item.role.last_updated_at && (
                    <time dateTime={item.role.last_updated_at}>
                      {lastUpdatedAt}
                    </time>
                  )}
                  {!item.role.last_updated_at && <span>{lastUpdatedAt}</span>}
                </span>
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
