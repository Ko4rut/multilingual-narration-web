"use client";

import { useMemo, useState } from "react";
import { MOCK_POIS, MOCK_REGIONS } from "../mocks/pois.mock";
import type { PointOfInterest } from "../types";

export function usePois() {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const pageSize = 6;

  // Filter POIs based on active criteria
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

      // Search query filter
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

  // Start item index for current page display
  const startItem = useMemo(() => {
    if (totalItems === 0) {
      return 0;
    }
    return (currentPage - 1) * pageSize + 1;
  }, [currentPage, pageSize, totalItems]);

  // End item index for current page display
  const endItem = useMemo(() => {
    return Math.min(currentPage * pageSize, totalItems);
  }, [currentPage, pageSize, totalItems]);

  // Page numbers array with ellipsis
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
      return pages;
    }

    if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      return pages;
    }

    pages.push(1, "...", currentPage, "...", totalPages);
    return pages;
  }, [currentPage, totalPages]);

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const goToPrevPage = () => {
    if (canPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (canNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

  // Action notifications / handlers
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
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      pageSize,
      startItem,
      endItem,
      pageNumbers,
      canPrev,
      canNext,
      onPrevPage: goToPrevPage,
      onNextPage: goToNextPage,
      onPageChange: goToPage,
    },
    selectedIds,
    isAllSelected,
    toggleSelectAll,
    toggleSelectOne,
    isSelected,
    resetFilters,
    toastMessage,
    handleAddClick,
    handleEditClick,
    handleMoreActions,
    handleAdvancedFilter,
  };
}
