"use client";

import { useMemo, useState } from "react";
import type { PoiContentItem } from "../types";

export function usePoiContentFilter(allContents: PoiContentItem[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredContents = useMemo(() => {
    return allContents.filter((item) => {
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
  }, [allContents, searchQuery, languageFilter, statusFilter]);

  const resetFilters = () => {
    setSearchQuery("");
    setLanguageFilter("all");
    setStatusFilter("all");
  };

  return {
    searchQuery,
    setSearchQuery,
    languageFilter,
    setLanguageFilter,
    statusFilter,
    setStatusFilter,
    filteredContents,
    resetFilters,
  };
}
