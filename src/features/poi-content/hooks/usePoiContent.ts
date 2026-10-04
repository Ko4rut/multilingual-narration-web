"use client";

import { useMemo, useState } from "react";
import { MOCK_LANGUAGES, MOCK_POI_CONTENTS } from "../mocks/poi-content.mock";

export function usePoiContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Filter items based on active criteria
  const filteredContents = useMemo(() => {
    return MOCK_POI_CONTENTS.filter((item) => {
      // Language filter
      if (languageFilter !== "all" && item.language_code !== languageFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && item.content_status !== statusFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesPoiName = item.poi_name.toLowerCase().includes(query);
        const matchesTitle = item.narration_title.toLowerCase().includes(query);
        const matchesLocation = item.poi_location.toLowerCase().includes(query);
        const matchesAuthor = item.created_by_name.toLowerCase().includes(query);
        return matchesPoiName || matchesTitle || matchesLocation || matchesAuthor;
      }

      return true;
    });
  }, [searchQuery, languageFilter, statusFilter]);

  const totalItems = filteredContents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Current page items
  const paginatedContents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredContents.slice(startIndex, startIndex + pageSize);
  }, [filteredContents, currentPage, pageSize]);

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

  const resetFilters = () => {
    setSearchQuery("");
    setLanguageFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  return {
    contents: paginatedContents,
    allContents: filteredContents,
    languages: MOCK_LANGUAGES,
    searchQuery,
    setSearchQuery: (val: string) => {
      setSearchQuery(val);
      setCurrentPage(1);
    },
    languageFilter,
    setLanguageFilter: (val: string) => {
      setLanguageFilter(val);
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
    resetFilters,
  };
}
