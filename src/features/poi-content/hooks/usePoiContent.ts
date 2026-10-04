"use client";

import { useMemo, useState } from "react";
import { MOCK_LANGUAGES, MOCK_POI_CONTENTS } from "../mocks/poi-content.mock";

export function usePoiContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

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

      // Search query
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
    currentPage,
    setCurrentPage,
    pageSize,
    totalItems,
    totalPages,
    resetFilters,
  };
}
