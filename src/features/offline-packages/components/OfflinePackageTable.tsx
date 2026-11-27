"use client";

/** Danh sách package kèm bộ lọc Region, Language, Category và trạng thái. */
import {
  DataTable,
  DataTableContent,
  DataTableFilters,
  DataTablePanel,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
  DataTableToolbarActions,
} from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { DataTableColumn, DataTableFilter } from "@/types/shared/data-table.types";

import type { OfflinePackage } from "../types";
import type { OfflinePackageTableProps } from "../types";
import {
  NO_CATEGORY_SCOPE,
  formatPackageBytes,
  formatPackageDate,
  getCategoryName,
  getLanguageName,
  getPackageStatusLabel,
  getPackageStatusTone,
  getRegionName,
} from "../utils";

export function OfflinePackageTable({
  packages,
  regions,
  languages,
  categories,
  selectedPackageId,
  onSelectPackage,
}: OfflinePackageTableProps) {
  const { t, locale } = usePreferences();

  const columns: readonly DataTableColumn<OfflinePackage>[] = [
    {
      id: "package",
      header: t("Offline package"),
      searchValue: function packageSearch(item) {
        return [item.id, item.package_name, item.package_key].join(" ");
      },
      cell: function packageCell(item) {
        return (
          <div className="flex min-w-64 flex-col gap-1">
            <span className="font-semibold text-foreground">{item.package_name}</span>
            <span className="max-w-72 truncate font-mono text-xs text-muted-foreground">
              {item.package_key}
            </span>
          </div>
        );
      },
    },
    {
      id: "scope",
      header: t("Scope"),
      searchValue: function scopeSearch(item) {
        return [
          getRegionName(item.region_id, regions),
          getLanguageName(item.language_id, languages),
          getCategoryName(item.category_id, categories),
        ].join(" ");
      },
      cell: function scopeCell(item) {
        return (
          <div className="flex min-w-48 flex-col gap-1 text-xs">
            <span className="font-medium text-foreground">
              {getRegionName(item.region_id, regions)}
            </span>
            <span className="text-muted-foreground">
              {getLanguageName(item.language_id, languages)} ·{" "}
              {t(getCategoryName(item.category_id, categories))}
            </span>
          </div>
        );
      },
    },
    {
      id: "version",
      header: t("Version"),
      cell: function versionCell(item) {
        return <span className="font-mono text-xs">v{item.package_version}</span>;
      },
    },
    {
      id: "status",
      header: t("Status"),
      accessor: "package_status",
      cell: function statusCell(item) {
        return (
          <StatusBadge
            label={t(getPackageStatusLabel(item.package_status))}
            tone={getPackageStatusTone(item.package_status)}
          />
        );
      },
    },
    {
      id: "size",
      header: t("Size"),
      cell: function sizeCell(item) {
        return (
          <span className="text-xs text-muted-foreground">
            {t(formatPackageBytes(item.total_size, locale))}
          </span>
        );
      },
    },
    {
      id: "published",
      header: t("Published at"),
      cell: function publishedCell(item) {
        return (
          <span className="min-w-32 text-xs text-muted-foreground">
            {formatPackageDate(item.published_at, locale)}
          </span>
        );
      },
    },
  ];

  const regionOptions = regions.map(function regionOption(item) {
    return { value: item.id, label: item.region_name };
  });
  const languageOptions = languages.map(function languageOption(item) {
    return { value: item.id, label: item.language_name };
  });
  const categoryOptions = [
    { value: NO_CATEGORY_SCOPE, label: t("All POI categories (base scope)") },
    ...categories.map(function categoryOption(item) {
      return { value: item.id, label: item.category_name };
    }),
  ];
  const statusOptions = [
    { value: "PUBLISHED", label: t("Published") },
    { value: "BUILDING", label: t("Building") },
    { value: "FAILED", label: t("Failed") },
  ];

  const filters: readonly DataTableFilter<OfflinePackage>[] = [
    {
      id: "region_id",
      label: "Region",
      allLabel: "All regions",
      options: regionOptions,
      getValue: function regionFilter(item) { return item.region_id; },
    },
    {
      id: "language_id",
      label: "Language",
      allLabel: "All languages",
      options: languageOptions,
      getValue: function languageFilter(item) { return item.language_id; },
    },
    {
      id: "category_id",
      label: "Category",
      allLabel: "Any category scope",
      options: categoryOptions,
      getValue: function categoryFilter(item) {
        return item.category_id ?? NO_CATEGORY_SCOPE;
      },
    },
    {
      id: "package_status",
      label: "Status",
      allLabel: "All statuses",
      options: statusOptions,
      getValue: function statusFilter(item) { return item.package_status; },
    },
  ];

  return (
    <DataTable
      data={packages}
      columns={columns}
      filters={filters}
      getRowId={function getPackageId(item) { return item.id; }}
      selectedRowId={selectedPackageId ?? undefined}
      onRowClick={onSelectPackage}
    >
      <DataTablePanel>
        <DataTableToolbar>
          <DataTableSearch placeholder="Search package name, key or ID..." />
          <DataTableToolbarActions>
            <DataTableFilters />
          </DataTableToolbarActions>
        </DataTableToolbar>
        <DataTableContent
          emptyMessage="No offline packages match your filters."
          className="min-w-[930px]"
        />
        <DataTablePagination itemLabel="offline packages" />
      </DataTablePanel>
    </DataTable>
  );
}
