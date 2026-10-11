"use client";

import { useState } from "react";
import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import { MOCK_AUDIO_FILES } from "@/features/audios/mocks/audioData";
import { MOCK_POI_CONTENTS } from "@/features/poi-contents/mocks/poi-content.mock";
import {
  DEFAULT_MANAGEMENT_USER_ID,
  DEFAULT_POI_IMAGE_URL,
  POI_STATUS,
  POI_STATUS_OPTIONS,
} from "../constants/poi.constants";
import { MOCK_POI_CATEGORIES } from "../mocks/poi-categories.mock";
import { MOCK_POI_CATEGORY_MAPPINGS } from "../mocks/poi-category-mappings.mock";
import { MOCK_POIS } from "../mocks/pois.mock";
import { MOCK_REGIONS } from "../mocks/regions.mock";
import type { PoiCategoryMapping } from "../types/poi-category-mapping.types";
import type { PointOfInterest, PoiStatus } from "../types/poi.types";
import { canActivatePoi } from "../utils/utils";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function getUniqueFormValues(formData: FormData, key: string) {
  const values = formData.getAll(key).flatMap(function parseFormValue(value) {
    if (typeof value !== "string") {
      return [];
    }
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return [];
    }
    return [trimmedValue];
  });
  return [...new Set(values)];
}

function parsePoiStatus(value: string): PoiStatus {
  const matchedStatus = POI_STATUS_OPTIONS.find(function findStatus(option) {
    return option.value === value;
  });
  return matchedStatus?.value ?? POI_STATUS.INACTIVE;
}

function createPoiId(pois: readonly PointOfInterest[]) {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  let sequence = pois.length + 1;
  let id = `poi-${day}${month}${year}-${String(sequence).padStart(4, "0")}`;
  while (
    pois.some(function hasPoi(candidate) {
      return candidate.id === id;
    })
  ) {
    sequence += 1;
    id = `poi-${day}${month}${year}-${String(sequence).padStart(4, "0")}`;
  }
  return id;
}

export function usePois() {
  const [pois, setPois] = useState<PointOfInterest[]>(function initializePois() {
    return [...MOCK_POIS];
  });
  const [poiCategoryMappings, setPoiCategoryMappings] = useState<
    PoiCategoryMapping[]
  >(function initializePoiCategoryMappings() {
    return [...MOCK_POI_CATEGORY_MAPPINGS];
  });
  const [sheetMode, setSheetMode] = useState<FeatureFormMode>("create");
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const selectedPoi =
    pois.find(function findSelectedPoi(poi) {
      return poi.id === selectedPoiId;
    }) ?? null;
  const selectedCategoryIds = poiCategoryMappings.flatMap(
    function findSelectedCategoryIds(mapping) {
      if (mapping.poi_id !== selectedPoiId) {
        return [];
      }
      return [mapping.poi_category_id];
    },
  );
  let canActivateSelectedPoi = false;
  if (selectedPoi) {
    canActivateSelectedPoi = canActivatePoi(
      selectedPoi.id,
      MOCK_POI_CONTENTS,
      MOCK_AUDIO_FILES,
    );
  }

  function openCreateSheet() {
    setSelectedPoiId(null);
    setSheetMode("create");
    setSheetOpen(true);
    setFeedback(null);
  }

  function openViewSheet(poi: PointOfInterest) {
    setSelectedPoiId(poi.id);
    setSheetMode("view");
    setSheetOpen(true);
  }

  function openEditSheet(poi: PointOfInterest) {
    setSelectedPoiId(poi.id);
    setSheetMode("edit");
    setSheetOpen(true);
    setFeedback(null);
  }

  function editSelectedPoi() {
    if (!selectedPoi) {
      return;
    }
    setSheetMode("edit");
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setSelectedPoiId(null);
    }
  }

  function handleDeletePoi(poi: PointOfInterest) {
    const hasContent = MOCK_POI_CONTENTS.some(function findContent(content) {
      return content.poi_id === poi.id;
    });
    if (hasContent) {
      setFeedback("POIs with linked content cannot be deleted.");
      return;
    }
    setPois(function removePoi(currentPois) {
      return currentPois.filter(function keepPoi(candidate) {
        return candidate.id !== poi.id;
      });
    });
    setPoiCategoryMappings(function removePoiCategoryMappings(mappings) {
      return mappings.filter(function keepMapping(mapping) {
        return mapping.poi_id !== poi.id;
      });
    });
    setFeedback("POI deleted from demo data.");
  }

  function handleSubmit(formData: FormData) {
    const poiName = getFormValue(formData, "poi_name");
    const regionId = getFormValue(formData, "region_id");
    const poiLocation = getFormValue(formData, "poi_location");
    const qrCode = getFormValue(formData, "poi_qr_code");
    const categoryIds = getUniqueFormValues(formData, "poi_category_ids");
    const hasRegion = MOCK_REGIONS.some(function findRegion(region) {
      return region.id === regionId;
    });
    if (!poiName || !hasRegion || !poiLocation || !qrCode) {
      setFeedback("Complete all required POI fields.");
      return;
    }
    const hasUnknownCategory = categoryIds.some(function findUnknownCategory(
      categoryId,
    ) {
      return !MOCK_POI_CATEGORIES.some(function findCategory(category) {
        return category.id === categoryId;
      });
    });
    if (hasUnknownCategory) {
      setFeedback("One or more selected categories are invalid.");
      return;
    }
    const hasDuplicate = pois.some(function findDuplicatePoi(poi) {
      if (poi.id === selectedPoi?.id) {
        return false;
      }
      return (
        poi.poi_qr_code === qrCode || poi.poi_location === poiLocation
      );
    });
    if (hasDuplicate) {
      setFeedback("POI QR code and location must be unique.");
      return;
    }

    const timestamp = new Date().toISOString();
    if (sheetMode === "create") {
      const newPoiId = createPoiId(pois);
      setPois(function addPoi(currentPois) {
        const poi: PointOfInterest = {
          id: newPoiId,
          region_id: regionId,
          poi_image_url:
            getFormValue(formData, "poi_image_url") || DEFAULT_POI_IMAGE_URL,
          image_checksum_sha256:
            getFormValue(formData, "image_checksum_sha256") || null,
          poi_qr_code: qrCode,
          poi_name: poiName,
          poi_location: poiLocation,
          poi_status: POI_STATUS.INACTIVE,
          latitude: Number(getFormValue(formData, "latitude")),
          longitude: Number(getFormValue(formData, "longitude")),
          trigger_radius_meter: Number(
            getFormValue(formData, "trigger_radius_meter"),
          ),
          created_by: DEFAULT_MANAGEMENT_USER_ID,
          last_updated_by: DEFAULT_MANAGEMENT_USER_ID,
          created_at: timestamp,
          last_updated_at: timestamp,
        };
        return [poi, ...currentPois];
      });
      setPoiCategoryMappings(function addPoiCategoryMappings(mappings) {
        const newMappings = categoryIds.map(
          function createPoiCategoryMapping(categoryId) {
            return {
              poi_id: newPoiId,
              poi_category_id: categoryId,
            };
          },
        );
        return [...newMappings, ...mappings];
      });
      setSheetOpen(false);
      setFeedback(
        "POI created as inactive until its English content and audio are published.",
      );
      return;
    }

    if (!selectedPoi) {
      return;
    }
    const requestedStatus = parsePoiStatus(
      getFormValue(formData, "poi_status"),
    );
    if (
      requestedStatus === POI_STATUS.ACTIVE &&
      !canActivateSelectedPoi
    ) {
      setFeedback(
        "This POI needs published English content with valid audio before activation.",
      );
      return;
    }

    setPois(function updatePois(currentPois) {
      return currentPois.map(function updatePoi(poi) {
        if (poi.id !== selectedPoi.id) {
          return poi;
        }
        return {
          ...poi,
          region_id: regionId,
          poi_image_url:
            getFormValue(formData, "poi_image_url") || DEFAULT_POI_IMAGE_URL,
          image_checksum_sha256:
            getFormValue(formData, "image_checksum_sha256") || null,
          poi_qr_code: qrCode,
          poi_name: poiName,
          poi_location: poiLocation,
          poi_status: requestedStatus,
          latitude: Number(getFormValue(formData, "latitude")),
          longitude: Number(getFormValue(formData, "longitude")),
          trigger_radius_meter: Number(
            getFormValue(formData, "trigger_radius_meter"),
          ),
          last_updated_by: DEFAULT_MANAGEMENT_USER_ID,
          last_updated_at: timestamp,
        };
      });
    });
    setPoiCategoryMappings(function updatePoiCategoryMappings(mappings) {
      const otherPoiMappings = mappings.filter(function keepMapping(mapping) {
        return mapping.poi_id !== selectedPoi.id;
      });
      const updatedMappings = categoryIds.map(
        function createPoiCategoryMapping(categoryId) {
          return {
            poi_id: selectedPoi.id,
            poi_category_id: categoryId,
          };
        },
      );
      return [...otherPoiMappings, ...updatedMappings];
    });
    setSheetOpen(false);
    setFeedback("POI updated in demo data.");
  }

  return {
    pois,
    poiCategoryMappings,
    selectedPoi,
    selectedCategoryIds,
    sheetMode,
    isSheetOpen,
    feedback,
    canActivateSelectedPoi,
    openCreateSheet,
    openViewSheet,
    openEditSheet,
    editSelectedPoi,
    handleSheetOpenChange,
    handleDeletePoi,
    handleSubmit,
  };
}
