"use client";

import { useMemo, useState } from "react";
import { MOCK_POIS, MOCK_REGIONS } from "../mocks/pois.mock";

export function usePois() {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const pageSize = 6;

  const filteredPois = useMemo(() => {
    return MOCK_POIS.filter((poi) => {
      // Region filter
      if (regionFilter !== "all" && poi.region_id !== regionFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && poi.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = poi.poi_name.toLowerCase().includes(query);
        const matchesCode = poi.qr_code.toLowerCase().includes(query);
        const matchesLocation = poi.poi_location.toLowerCase().includes(query);
        const matchesRegion = poi.region_name.toLowerCase().includes(query);
        const matchesCoords = `${poi.latitude}, ${poi.longitude}`.includes(query);
        return matchesName || matchesCode || matchesLocation || matchesRegion || matchesCoords;
      }

      return true;
    });
  }, [searchQuery, regionFilter, statusFilter]);

  const totalItems = filteredPois.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Current page items
  const paginatedPois = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPois.slice(startIndex, startIndex + pageSize);
  }, [filteredPois, currentPage, pageSize]);

  // Checkbox selection
  const isAllSelected = paginatedPois.length > 0 && paginatedPois.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedPois.some((p) => p.id === id)));
    } else {
      const pageIds = paginatedPois.map((p) => p.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  const resetFilters = () => {
    setSearchQuery("");
    setRegionFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  return {
    pois: paginatedPois,
    allPois: filteredPois,
    regions: MOCK_REGIONS,
    searchQuery,
    setSearchQuery: (val: string) => {
      setSearchQuery(val);
      setCurrentPage(1);
    },
    regionFilter,
    setRegionFilter: (val: string) => {
      setRegionFilter(val);
      setCurrentPage(1);
    },
    statusFilter,
    setStatusFilter: (val: string) => {
      setStatusFilter(val);
      setCurrentPage(1);
    },
    currentPage,
    setCurrentPage,
    pageSize,
    totalItems,
    totalPages,
    selectedIds,
    isAllSelected,
    toggleSelectAll,
    toggleSelectOne,
    isSelected,
    resetFilters,
  };
}
