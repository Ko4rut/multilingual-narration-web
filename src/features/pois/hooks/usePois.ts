"use client";

import { useMemo, useState } from "react";
import { MOCK_POIS, MOCK_REGIONS } from "../mocks/pois.mock";
import type { PointOfInterest } from "../types";
import { usePoisFilter } from "./usePoisFilter";
import { usePoisPagination } from "./usePoisPagination";
import { usePoisSelection } from "./usePoisSelection";

/**
 * Main Composer Hook for POI Management.
 * Combines filtering, pagination, selection, and action handling.
 */
export function usePois() {
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
  } = usePoisFilter(MOCK_POIS);

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

  const handleAddClick = () => {
    showToast("Tính năng '+ Add POI' đang chờ kết nối API / Form.");
  };

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
    handleAddClick,
    handleEditClick,
    handleMoreActions,
    handleAdvancedFilter,
  };
}
