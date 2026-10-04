"use client";

import React, { useState } from "react";
import { usePois } from "../hooks/usePois";
import { PoisHeader } from "./PoisHeader";
import { PoisFilterBar } from "./PoisFilterBar";
import { PoisTable } from "./PoisTable";
import { PoisPagination } from "./PoisPagination";
import type { PointOfInterest } from "../types";

export function PoisOverview() {
  const {
    pois,
    regions,
    searchQuery,
    setSearchQuery,
    regionFilter,
    setRegionFilter,
    statusFilter,
    setStatusFilter,
    pagination,
    selectedIds,
    isAllSelected,
    toggleSelectAll,
    toggleSelectOne,
  } = usePois();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  return (
    <div className="w-full">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface text-foreground border border-accent px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PoisHeader onAddClick={handleAddClick} />

      {/* Filters Toolbar */}
      <PoisFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        regions={regions}
        selectedRegion={regionFilter}
        onRegionChange={setRegionFilter}
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
        onAdvancedFilterClick={handleAdvancedFilter}
      />

      {/* Main Table */}
      <PoisTable
        pois={pois}
        selectedIds={selectedIds}
        isAllSelected={isAllSelected}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelectOne={toggleSelectOne}
        onEdit={handleEditClick}
        onMoreActions={handleMoreActions}
      />

      {/* Pagination */}
      <PoisPagination {...pagination} />
    </div>
  );
}
