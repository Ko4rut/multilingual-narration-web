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
import type { Region, RegionsTableProps } from "../types/region.types";

export function RegionsTable({ regions }: RegionsTableProps) {
  const { t } = usePreferences();
  const columns: readonly DataTableColumn<Region>[] = [
    {
      id: "region",
      header: t("Region"),
      searchValue: function getSearchValue(region) {
        return `${region.region_name} ${region.region_code} ${region.id}`;
      },
      cell: function renderRegion(region) {
        return (
          <div className="flex min-w-64 flex-col gap-1">
            <span className="font-medium text-foreground">
              {region.region_name}
            </span>
            <span className="font-mono text-xs text-success">{region.id}</span>
          </div>
        );
      },
    },
    {
      id: "region_code",
      header: t("Region code"),
      accessor: "region_code",
      cell: function renderCode(region) {
        return (
          <span className="font-mono text-sm font-semibold text-foreground">
            {region.region_code}
          </span>
        );
      },
    },
  ];

  return (
    <DataTable
      data={regions}
      columns={columns}
      getRowId={function getId(region) {
        return region.id;
      }}
    >
      <DataTablePanel>
        <DataTableToolbar>
          <DataTableSearch placeholder="Search region name, code or ID..." />
        </DataTableToolbar>
        <DataTableContent emptyMessage="No regions match your search." />
        <DataTablePagination itemLabel="region records" />
      </DataTablePanel>
    </DataTable>
  );
}
