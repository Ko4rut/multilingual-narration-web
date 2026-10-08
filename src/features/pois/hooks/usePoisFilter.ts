"use client";

import { useMemo, useState } from "react";
import type { PointOfInterest } from "../types";

export function usePoisFilter(allPois: PointOfInterest[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPois = useMemo(() => {
    return allPois.filter((poi) => {
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
  }, [allPois, searchQuery, regionFilter, statusFilter]);

  const resetFilters = () => {
    setSearchQuery("");
    setRegionFilter("all");
    setStatusFilter("all");
  };

  return {
    searchQuery,
    setSearchQuery,
    regionFilter,
    setRegionFilter,
    statusFilter,
    setStatusFilter,
    filteredPois,
    resetFilters,
  };
}
