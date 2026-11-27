"use client";

/** Drawer đọc metadata release và danh sách item của Offline Package. */
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePreferences } from "@/features/settings/hooks/use-preferences";

import type { OfflinePackageDetailSheetProps } from "../types";
import {
  formatPackageBytes,
  formatPackageDate,
  getCategoryName,
  getLanguageName,
  getPackageStatusLabel,
  getPackageStatusTone,
  getRegionName,
} from "../utils";

export function OfflinePackageDetailSheet({
  open,
  packageRecord,
  items,
  isLoadingItems,
  itemsError,
  regions,
  languages,
  categories,
  onOpenChange,
}: OfflinePackageDetailSheetProps) {
  const { t, locale } = usePreferences();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-hidden sm:max-w-xl">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{t("Offline package details")}</SheetTitle>
          <SheetDescription>
            {t("View the published metadata and package membership.")}
          </SheetDescription>
        </SheetHeader>

        {packageRecord && (
          <div className="scrollbar-hidden min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
            <div className="space-y-3 rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground">
                    {packageRecord.package_name}
                  </h3>
                  <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
                    {packageRecord.id}
                  </p>
                </div>
                <StatusBadge
                  label={t(getPackageStatusLabel(packageRecord.package_status))}
                  tone={getPackageStatusTone(packageRecord.package_status)}
                />
              </div>
              <dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">{t("Region")}</dt>
                  <dd className="font-medium text-foreground">
                    {getRegionName(packageRecord.region_id, regions)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("Language")}</dt>
                  <dd className="font-medium text-foreground">
                    {getLanguageName(packageRecord.language_id, languages)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("POI Category")}</dt>
                  <dd className="font-medium text-foreground">
                    {t(getCategoryName(packageRecord.category_id, categories))}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("Version")}</dt>
                  <dd className="font-medium text-foreground">
                    v{packageRecord.package_version}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("Package size")}</dt>
                  <dd className="font-medium text-foreground">
                    {t(formatPackageBytes(packageRecord.total_size, locale))}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("Published at")}</dt>
                  <dd className="font-medium text-foreground">
                    {formatPackageDate(packageRecord.published_at, locale)}
                  </dd>
                </div>
              </dl>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{t("Package key")}</p>
                <p className="break-all font-mono text-xs text-foreground">
                  {packageRecord.package_key}
                </p>
              </div>
              {packageRecord.package_checksum_sha256 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t("Manifest SHA-256")}</p>
                  <p className="break-all font-mono text-[11px] text-foreground">
                    {packageRecord.package_checksum_sha256}
                  </p>
                </div>
              )}
              {packageRecord.package_url && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t("Manifest URL")}</p>
                  <p className="break-all text-xs text-foreground">
                    {packageRecord.package_url}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  {t("Package items")} ({items.length})
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t("POI, narration version and audio references stored by the Backend.")}
                </p>
              </div>
              {isLoadingItems && (
                <p className="text-xs text-muted-foreground" role="status">
                  {t("Loading package items...")}
                </p>
              )}
              {itemsError && (
                <p className="text-xs text-destructive" role="alert">
                  {t(itemsError)}
                </p>
              )}
              {!isLoadingItems && !itemsError && items.length === 0 && (
                <p className="rounded-lg border border-border p-4 text-xs text-muted-foreground">
                  {t("No items in this package.")}
                </p>
              )}
              {!isLoadingItems && !itemsError && items.map(function renderItem(item) {
                return (
                  <div key={item.id} className="rounded-xl border border-border bg-card p-3 text-xs">
                    <p className="font-mono font-medium text-foreground">
                      {t("POI ID")}: {item.poi_id}
                    </p>
                    <p className="mt-1 break-all text-muted-foreground">
                      {t("Narration content")}: {item.poi_content_id} · v{item.content_version}
                    </p>
                    <p className="mt-1 break-all text-muted-foreground">
                      {t("Audio ID")}: {item.audio_id}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
