"use client";

import { useState } from "react";
import type { PointOfInterest } from "../types";

export function usePoisSelection(currentPois: PointOfInterest[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isAllSelected =
    currentPois.length > 0 &&
    currentPois.every((poi) => selectedIds.includes(poi.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPois.some((poi) => poi.id === id))
      );
    } else {
      const pageIds = currentPois.map((poi) => poi.id);
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

  const clearSelection = () => {
    setSelectedIds([]);
  };

  return {
    selectedIds,
    isAllSelected,
    toggleSelectAll,
    toggleSelectOne,
    isSelected,
    clearSelection,
  };
}
