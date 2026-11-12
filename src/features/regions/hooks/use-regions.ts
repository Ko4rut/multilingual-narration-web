"use client";

import { useEffect, useState } from "react";
import { loadRegions } from "../actions";
import type { Region } from "../types/region.types";

export function useRegions() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(function loadRegionRecords() {
    let active = true;

    async function load() {
      const result = await loadRegions();
      if (!active) {
        return;
      }
      if (!result.data) {
        setErrorMessage(result.error);
        setLoading(false);
        return;
      }
      setRegions(result.data);
      setLoading(false);
    }

    void load();
    return function cancel() {
      active = false;
    };
  }, []);

  return { regions, errorMessage, isLoading };
}
