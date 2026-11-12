"use client";

import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { useRegions } from "../hooks/use-regions";
import { RegionsTable } from "./RegionsTable";

/** Hiển thị danh mục khu vực ở chế độ chỉ đọc. */
export function RegionOverview() {
  const { t } = usePreferences();
  const { regions, errorMessage, isLoading } = useRegions();

  return (
    <PageLayout>
      <PageLayoutHeader
        title={t("Regions")}
        description={t("View the regions available for organizing POIs.")}
      />

      {isLoading && <p role="status">{t("Loading regions...")}</p>}
      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && (
        <PageLayoutContent>
          <RegionsTable regions={regions} />
        </PageLayoutContent>
      )}
    </PageLayout>
  );
}
