"use client";

import { useMemo } from "react";
import { MOCK_LANGUAGES, MOCK_POI_CONTENTS } from "../mocks/poi-content.mock";
import { usePoiContentFilter } from "./usePoiContentFilter";
import { usePoiContentPagination } from "./usePoiContentPagination";

/**
 * Main Composer Hook for POI Content Management.
 * Combines filtering, searching, and pagination.
 */
export function usePoiContent() {
  // 1. Filter logic
  const {
    searchQuery,
    setSearchQuery,
    languageFilter,
    setLanguageFilter,
    statusFilter,
    setStatusFilter,
    filteredContents,
    resetFilters: resetFilterCriteria,
  } = usePoiContentFilter(MOCK_POI_CONTENTS);

  // 2. Pagination logic
  const pagination = usePoiContentPagination({
    totalItems: filteredContents.length,
    pageSize: 6,
  });

  // Current page items
  const paginatedContents = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    return filteredContents.slice(startIndex, startIndex + pagination.pageSize);
  }, [filteredContents, pagination.currentPage, pagination.pageSize]);

  // Filter change handlers that reset page to 1
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    pagination.resetPage();
  };

  const handleLanguageChange = (val: string) => {
    setLanguageFilter(val);
    pagination.resetPage();
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    pagination.resetPage();
  };

  const resetFilters = () => {
    resetFilterCriteria();
    pagination.resetPage();
  };

  return {
    contents: paginatedContents,
    allContents: filteredContents,
    languages: MOCK_LANGUAGES,
    searchQuery,
    setSearchQuery: handleSearchChange,
    languageFilter,
    setLanguageFilter: handleLanguageChange,
    statusFilter,
    setStatusFilter: handleStatusChange,
    pagination,
    resetFilters,
  };
}
