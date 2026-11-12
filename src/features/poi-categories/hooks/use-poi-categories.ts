"use client";

import { useEffect, useState } from "react";
import { loadPoiCategories } from "../actions";
import type { PoiCategory } from "../types/poi-category.types";

export function usePoiCategories() {
  const [categories, setCategories] = useState<PoiCategory[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(function loadCategoryRecords() {
    let active = true;

    async function load() {
      const result = await loadPoiCategories();
      if (!active) {
        return;
      }
      if (!result.data) {
        setErrorMessage(result.error);
        setLoading(false);
        return;
      }
      setCategories(result.data);
      setLoading(false);
    }

    void load();
    return function cancel() {
      active = false;
    };
  }, []);

  return { categories, errorMessage, isLoading };
}
