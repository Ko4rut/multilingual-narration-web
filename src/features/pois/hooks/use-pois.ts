"use client";

import { useMemo, useState } from "react";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import { MOCK_POIS, MOCK_REGIONS } from "../mocks/pois.mock";
import type { PointOfInterest, PoiStatus, Region } from "../types";
import { usePoisFilter } from "./use-pois-filter";
import { usePoisPagination } from "./use-pois-pagination";
import { usePoisSelection } from "./use-pois-selection";

function readFormText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function parsePoiStatus(value: string): PoiStatus {
  if (value === "inactive" || value === "maintenance") {
    return value;
  }

  return "active";
}

function parseLanguageCodes(value: string) {
  return value
    .split(",")
    .map(function normalizeLanguageCode(code) {
      return code.trim().toUpperCase();
    })
    .filter(function removeEmptyLanguageCode(code) {
      return code.length > 0;
    });
}

function createPoiRecord(
  formData: FormData,
  regions: readonly Region[],
): PointOfInterest | null {
  const poiName = readFormText(formData, "poi_name");
  const qrCode = readFormText(formData, "qr_code");
  const regionId = readFormText(formData, "region_id");
  const poiLocation = readFormText(formData, "poi_location");
  const region = regions.find(function findRegion(item) {
    return item.id === regionId;
  });

  if (!poiName || !qrCode || !poiLocation || !region) {
    return null;
  }

  const status = parsePoiStatus(readFormText(formData, "status"));

  return {
    id: `poi-${Date.now()}`,
    region_id: region.id,
    region_name: region.name,
    image_url: readFormText(formData, "image_url") || "/icon.svg",
    qr_code: qrCode,
    poi_priority: Number(readFormText(formData, "poi_priority")),
    poi_name: poiName,
    latitude: Number(readFormText(formData, "latitude")),
    longitude: Number(readFormText(formData, "longitude")),
    trigger_radius: Number(readFormText(formData, "trigger_radius")),
    poi_location: poiLocation,
    created_by: "usr-admin-01",
    is_active: status === "active",
    status,
    created_at: new Date().toISOString(),
    languages: parseLanguageCodes(readFormText(formData, "languages")),
    daily_plays: 0,
  };
}

/**
 * Main Composer Hook for POI Management.
 * Combines filtering, pagination, selection, and action handling.
 */
export function usePois() {
  const { t } = usePreferences();
  const [poiRecords, setPoiRecords] = useState<PointOfInterest[]>(MOCK_POIS);
  const [isCreateSheetOpen, setCreateSheetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Filter logic
  const {
    searchQuery,
    setSearchQuery,
    regionFilter,
    setRegionFilter,
    statusFilter,
    setStatusFilter,
    filteredPois,
    resetFilters: resetFilterCriteria,
  } = usePoisFilter(poiRecords);

  // 2. Pagination logic
  const pagination = usePoisPagination({
    totalItems: filteredPois.length,
    pageSize: 6,
  });

  // Current page items
  const paginatedPois = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    return filteredPois.slice(startIndex, startIndex + pagination.pageSize);
  }, [filteredPois, pagination.currentPage, pagination.pageSize]);

  // 3. Selection logic
  const selection = usePoisSelection(paginatedPois);

  // Filter change handlers that reset page to 1
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    pagination.resetPage();
  };

  const handleRegionChange = (val: string) => {
    setRegionFilter(val);
    pagination.resetPage();
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    pagination.resetPage();
  };

  const resetFilters = () => {
    resetFilterCriteria();
    pagination.resetPage();
    selection.clearSelection();
  };

  // Toast notifications & action feedback
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  function handleAddClick() {
    setCreateSheetOpen(true);
  }

  function handleCreatePoi(formData: FormData) {
    const createdPoi = createPoiRecord(formData, MOCK_REGIONS);

    if (!createdPoi) {
      showToast(t("Complete all required POI fields."));
      return;
    }

    setPoiRecords(function addPoi(currentPois) {
      return [createdPoi, ...currentPois];
    });
    setCreateSheetOpen(false);
    resetFilterCriteria();
    pagination.resetPage();
    selection.clearSelection();
    showToast(t("POI created successfully."));
  }

  const handleEditClick = (poi: PointOfInterest) => {
    showToast(`Chỉnh sửa địa điểm: ${poi.poi_name} (chờ cập nhật)`);
  };

  const handleMoreActions = (poi: PointOfInterest) => {
    showToast(`Tùy chọn khác cho: ${poi.poi_name}`);
  };

  const handleAdvancedFilter = () => {
    showToast("Bộ lọc nâng cao (Advanced Filters) đang sẵn sàng mở rộng.");
  };

  return {
    pois: paginatedPois,
    allPois: filteredPois,
    regions: MOCK_REGIONS,
    searchQuery,
    setSearchQuery: handleSearchChange,
    regionFilter,
    setRegionFilter: handleRegionChange,
    statusFilter,
    setStatusFilter: handleStatusChange,
    pagination,
    selectedIds: selection.selectedIds,
    isAllSelected: selection.isAllSelected,
    toggleSelectAll: selection.toggleSelectAll,
    toggleSelectOne: selection.toggleSelectOne,
    isSelected: selection.isSelected,
    resetFilters,
    toastMessage,
    isCreateSheetOpen,
    setCreateSheetOpen,
    handleAddClick,
    handleCreatePoi,
    handleEditClick,
    handleMoreActions,
    handleAdvancedFilter,
  };
}
