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
import { MOCK_POI_CATEGORIES } from "../mocks/poi-categories.mock";
import { MOCK_REGIONS } from "../mocks/regions.mock";
import type { PointOfInterest, PoisTableProps } from "../types/poi.types";
import { formatCoordinates } from "../utils/utils";
import { PoisStatusBadge } from "./PoisStatusBadge";

export function PoisTable({
  pois,
  categoryMappings,
  onViewPoi,
  onEditPoi,
  onCopyPoi,
  onDeletePoi,
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
        const region = MOCK_REGIONS.find(function findRegion(candidate) {
          return candidate.id === poi.region_id;
        });
        return `${poi.region_id} ${region?.region_name ?? ""} ${region?.region_code ?? ""}`;
      },
      cell: function renderRegion(poi) {
        const region = MOCK_REGIONS.find(function findRegion(candidate) {
          return candidate.id === poi.region_id;
        });
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
              {t("Trigger radius")}: {poi.trigger_radius_meter.toLocaleString(locale)} m
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
        return <PoisStatusBadge status={poi.poi_status} />;
      },
    },
    // Column Audit
    {
      id: "audit",
      header: t("Audit details"),
      searchValue: function getAuditSearchValue(poi) {
        return `${poi.created_by} ${poi.last_updated_by} ${poi.created_at} ${poi.last_updated_at}`;
      },
      cell: function renderAudit(poi) {
        return (
          <div className="flex min-w-52 flex-col gap-1 text-xs">
            <span>
              {t("Created by")}: {poi.created_by}
            </span>
            <span>
              {t("Updated by")}: {poi.last_updated_by}
            </span>
            <span className="text-muted-foreground">
              {new Date(poi.last_updated_at).toLocaleString(locale)}
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
            onDelete={function handleDelete() {
              onDeletePoi(poi);
            }}
          />
        );
      },
    },
  ];
  const regionOptions = MOCK_REGIONS.map(function createRegionOption(region) {
    return { value: region.id, label: region.region_name };
  });
  const categoryOptions = MOCK_POI_CATEGORIES.map(
    function createCategoryOption(category) {
      return { value: category.id, label: category.category_name };
    },
  );
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
      getValue: function getPoiCategoryIds(poi) {
        return categoryMappings.flatMap(function findPoiCategoryId(mapping) {
          if (mapping.poi_id !== poi.id) {
            return [];
          }
          return [mapping.poi_category_id];
        });
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
      initialPageSize={10}
    >
      <DataTablePanel>
        <DataTableToolbar>
          <DataTableSearch placeholder="Search POIs by name, ID, QR code or location..." />
          <DataTableToolbarActions>
            <DataTableFilters />
          </DataTableToolbarActions>
        </DataTableToolbar>
        <DataTableContent emptyMessage="No POIs match your filters." className="min-w-[1120px]"/>
        <DataTablePagination itemLabel="POIs" pageSizeOptions={[10]} />
      </DataTablePanel>
    </DataTable>
  );
}
