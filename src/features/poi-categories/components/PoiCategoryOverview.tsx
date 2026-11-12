"use client";

import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { usePoiCategories } from "../hooks/use-poi-categories";
import { PoiCategoriesTable } from "./PoiCategoriesTable";

/** Hiển thị danh mục loại địa điểm ở chế độ chỉ đọc. */
export function PoiCategoryOverview() {
  const { t } = usePreferences();
  const { categories, errorMessage, isLoading } = usePoiCategories();

  return (
    <PageLayout>
      <PageLayoutHeader
        title={t("POI Categories")}
        description={t("View the categories used to classify POIs.")}
      />

      {isLoading && <p role="status">{t("Loading POI categories...")}</p>}
      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && (
        <PageLayoutContent>
          <PoiCategoriesTable categories={categories} />
        </PageLayoutContent>
      )}
    </PageLayout>
  );
}
