"use client";

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
import { MoreMenu } from "@/components/shared/MoreMenu";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type {
  DataTableColumn,
  DataTableFilter,
} from "@/types/shared/data-table.types";
import { POI_STATUS_OPTIONS } from "../constants/poi.constants";
import type { PointOfInterest, PoisTableProps } from "../types/poi.types";
import {
  createPoiCategoryFilterOptions,
  createRegionFilterOptions,
  findPoiRegion,
  formatCoordinates,
  formatPoiTimestamp,
  getPoiCategoryIds,
} from "../utils/poi.utils";
import { PoisStatusBadge } from "./PoisStatusBadge";

export function PoisTable({
  pois,
  categoryMappings,
  onViewPoi,
  onEditPoi,
  onCopyPoi,
  regions,
  categories,
}: PoisTableProps) {
  const { t, locale } = usePreferences();
  const columns: readonly DataTableColumn<PointOfInterest>[] = [
    // Column POI
    {
      id: "poi",
      header: t("Point of Interest"),
      searchValue: function getPoiSearchValue(poi) {
        return `${poi.poi_name} ${poi.id} ${poi.poi_qr_code}`;
      },
      cell: function renderPoi(poi) {
        return (
          <div className="flex min-w-64 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poi.poi_image_url}
              alt=""
              className="size-10 shrink-0 rounded-lg border border-border object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {poi.poi_name}
              </p>
              <p className="truncate font-mono text-xs text-success">
                {poi.id}
              </p>
            </div>
          </div>
        );
      },
    },
    // Column Region
    {
      id: "region_id",
      header: t("Region"),
      searchValue: function getRegionSearchValue(poi) {
        const region = findPoiRegion(poi.region_id, regions);
        return `${poi.region_id} ${region?.region_name ?? ""} ${region?.region_code ?? ""}`;
      },
      cell: function renderRegion(poi) {
        const region = findPoiRegion(poi.region_id, regions);
        if (!region) {
          return <span className="font-mono text-xs">{poi.region_id}</span>;
        }
        return (
          <div className="flex min-w-32 max-w-40 truncate flex-col gap-1">
            <span className="text-sm text-foreground">
              {t(region.region_name)}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {region.region_code}
            </span>
          </div>
        );
      },
    },
    // Column Location & GPS & Trigger Radius
    {
      id: "location",
      header: t("Location & GPS & Trigger Radius"),
      cell: function renderLocation(poi) {
        return (
          <div className="flex min-w-72 max-w-92 truncate flex-col gap-1">
            <span className="text-sm text-foreground">{poi.poi_location}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {formatCoordinates(poi.latitude, poi.longitude)}
              <span aria-hidden="true"> · </span>
              {t("Trigger radius")}: {poi.trigger_radius_meter.toLocaleString(
                locale,
              )} m
            </span>
          </div>
        );
      },
    },
    // Column Status
    {
      id: "poi_status",
      header: t("Status"),
      accessor: "poi_status",
      cell: function renderStatus(poi) {
        let activationLabel = t("Cannot activate yet");
        let activationClassName = "text-xs text-muted-foreground";
        if (poi.can_activate) {
          activationLabel = t("Ready to activate");
          activationClassName = "text-xs text-success";
        }
        return (
          <div className="flex min-w-32 flex-col items-start gap-1">
            <PoisStatusBadge status={poi.poi_status} />
            <span className={activationClassName}>{activationLabel}</span>
          </div>
        );
      },
    },
    // Column Timestamps
    {
      id: "timestamps",
      header: t("Timestamps"),
      searchValue: function getTimestampSearchValue(poi) {
        return `${poi.created_at} ${poi.last_updated_at}`;
      },
      cell: function renderTimestamps(poi) {
        return (
          <div className="flex min-w-52 flex-col gap-1 text-xs">
            <span>
              {t("Created at")}: {formatPoiTimestamp(poi.created_at, locale)}
            </span>
            <span>
              {t("Last updated at")}: {formatPoiTimestamp(poi.last_updated_at, locale)}
            </span>
          </div>
        );
      },
    },
    // Column Actions
    {
      id: "actions",
      header: <span className="sr-only">{t("Actions")}</span>,
      headerClassName: "w-12 text-right",
      className: "w-12 text-right",
      cell: function renderActions(poi) {
        return (
          <MoreMenu
            onView={function handleView() {
              onViewPoi(poi);
            }}
            onEdit={function handleEdit() {
              onEditPoi(poi);
            }}
            onCopy={function handleCopy() {
              onCopyPoi(poi);
            }}
          />
        );
      },
    },
  ];
  const regionOptions = createRegionFilterOptions(regions);
  const categoryOptions = createPoiCategoryFilterOptions(categories);
  const filters: readonly DataTableFilter<PointOfInterest>[] = [
    {
      id: "poi_status",
      label: "Status",
      allLabel: "All statuses",
      options: POI_STATUS_OPTIONS,
      getValue: function getPoiStatus(poi) {
        return poi.poi_status;
      },
    },
    {
      id: "region_id",
      label: "Region",
      allLabel: "All regions",
      options: regionOptions,
      getValue: function getRegionId(poi) {
        return poi.region_id;
      },
    },
    {
      id: "poi_category_id",
      label: "Category",
      allLabel: "All categories",
      options: categoryOptions,
      getValue: function getCategoryFilterValues(poi) {
        return getPoiCategoryIds(poi.id, categoryMappings);
      },
    },
  ];

  return (
    <DataTable
      data={pois}
      columns={columns}
      filters={filters}
      getRowId={function getPoiId(poi) {
        return poi.id;
      }}
    >
      <DataTablePanel>
        <DataTableToolbar>
          <DataTableSearch placeholder="Search POIs by name, ID, QR code or location..." />
          <DataTableToolbarActions>
            <DataTableFilters />
          </DataTableToolbarActions>
        </DataTableToolbar>
        <DataTableContent
          emptyMessage="No POIs match your filters."
          className="min-w-[1120px]"
        />
        <DataTablePagination itemLabel="POIs" />
      </DataTablePanel>
    </DataTable>
  );
}
