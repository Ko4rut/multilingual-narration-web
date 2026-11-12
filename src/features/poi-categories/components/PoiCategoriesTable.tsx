"use client";

import {
  DataTable,
  DataTableContent,
  DataTablePanel,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
} from "@/components/shared/DataTable";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { DataTableColumn } from "@/types/shared/data-table.types";
import type {
  PoiCategoriesTableProps,
  PoiCategory,
} from "../types/poi-category.types";

export function PoiCategoriesTable({ categories }: PoiCategoriesTableProps) {
  const { t } = usePreferences();
  const columns: readonly DataTableColumn<PoiCategory>[] = [
    {
      id: "category",
      header: t("POI Category"),
      searchValue: function getSearchValue(category) {
        return `${category.category_name} ${category.category_code} ${category.id}`;
      },
      cell: function renderCategory(category) {
        return (
          <div className="flex min-w-64 flex-col gap-1">
            <span className="font-medium text-foreground">
              {category.category_name}
            </span>
            <span className="font-mono text-xs text-success">{category.id}</span>
          </div>
        );
      },
    },
    {
      id: "category_code",
      header: t("Category code"),
      accessor: "category_code",
      cell: function renderCode(category) {
        return (
          <span className="font-mono text-sm font-semibold text-foreground">
            {category.category_code}
          </span>
        );
      },
    },
  ];

  return (
    <DataTable
      data={categories}
      columns={columns}
      getRowId={function getId(category) {
        return category.id;
      }}
    >
      <DataTablePanel>
        <DataTableToolbar>
          <DataTableSearch placeholder="Search category name, code or ID..." />
        </DataTableToolbar>
        <DataTableContent emptyMessage="No POI categories match your search." />
        <DataTablePagination itemLabel="category records" />
      </DataTablePanel>
    </DataTable>
  );
}
