"use client";

import { useMemo, useState } from "react";
import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import { MOCK_AUDIO_FILES } from "@/features/audios/mocks/audios.mock";
import { MOCK_POI_CONTENTS } from "@/features/poi-contents/mocks/poi-content.mock";
import {
  DEFAULT_MANAGEMENT_USER_ID,
  DEFAULT_POI_IMAGE_URL,
  POI_STATUS,
} from "../constants/poi.constants";
import { MOCK_POI_CATEGORIES } from "../mocks/poi-categories.mock";
import { MOCK_POI_CATEGORY_MAPPINGS } from "../mocks/poi-category-mappings.mock";
import { MOCK_POIS } from "../mocks/pois.mock";
import { MOCK_REGIONS } from "../mocks/regions.mock";
import type { PoiCategoryMapping } from "../types/poi-category-mapping.types";
import type { PointOfInterest } from "../types/poi.types";
import {
  canActivatePoi,
  createPoiId,
  createPoisOverviewSummary,
  getPoiCategoryIds,
  getPoiFormValue,
  getUniquePoiFormValues,
  hasDuplicatePoi,
  hasUnknownPoiCategory,
  parsePoiStatus,
} from "../utils/poi.utils";

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
  const overviewSummary = useMemo(function getOverviewSummary() {
    return createPoisOverviewSummary(pois);
  }, [pois]);
  const selectedPoi =
    pois.find(function findSelectedPoi(poi) {
      return poi.id === selectedPoiId;
    }) ?? null;
  const selectedCategoryIds = getPoiCategoryIds(
    selectedPoiId,
    poiCategoryMappings,
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

  async function handleCopyPoi(poi: PointOfInterest) {
    try {
      await navigator.clipboard.writeText(poi.id);
      setFeedback("POI ID copied.");
    } catch {
      setFeedback("Unable to copy the POI ID.");
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
    const poiName = getPoiFormValue(formData, "poi_name");
    const regionId = getPoiFormValue(formData, "region_id");
    const poiLocation = getPoiFormValue(formData, "poi_location");
    const qrCode = getPoiFormValue(formData, "poi_qr_code");
    const categoryIds = getUniquePoiFormValues(formData, "poi_category_ids");
    const hasRegion = MOCK_REGIONS.some(function findRegion(region) {
      return region.id === regionId;
    });
    if (!poiName || !hasRegion || !poiLocation || !qrCode) {
      setFeedback("Complete all required POI fields.");
      return;
    }
    const hasUnknownCategory = hasUnknownPoiCategory(
      categoryIds,
      MOCK_POI_CATEGORIES,
    );
    if (hasUnknownCategory) {
      setFeedback("One or more selected categories are invalid.");
      return;
    }
    const hasDuplicate = hasDuplicatePoi(
      pois,
      selectedPoi?.id ?? null,
      qrCode,
      poiLocation,
    );
    if (hasDuplicate) {
      setFeedback("POI QR code and location must be unique.");
      return;
    }

    const creationDate = new Date();
    const timestamp = creationDate.toISOString();
    if (sheetMode === "create") {
      const newPoiId = createPoiId(pois, creationDate);
      setPois(function addPoi(currentPois) {
        const poi: PointOfInterest = {
          id: newPoiId,
          region_id: regionId,
          poi_image_url:
            getPoiFormValue(formData, "poi_image_url") || DEFAULT_POI_IMAGE_URL,
          image_checksum_sha256:
            getPoiFormValue(formData, "image_checksum_sha256") || null,
          poi_qr_code: qrCode,
          poi_name: poiName,
          poi_location: poiLocation,
          poi_status: POI_STATUS.INACTIVE,
          latitude: Number(getPoiFormValue(formData, "latitude")),
          longitude: Number(getPoiFormValue(formData, "longitude")),
          trigger_radius_meter: Number(
            getPoiFormValue(formData, "trigger_radius_meter"),
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
      getPoiFormValue(formData, "poi_status"),
    );
    if (requestedStatus === POI_STATUS.ACTIVE && !canActivateSelectedPoi) {
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
            getPoiFormValue(formData, "poi_image_url") || DEFAULT_POI_IMAGE_URL,
          image_checksum_sha256:
            getPoiFormValue(formData, "image_checksum_sha256") || null,
          poi_qr_code: qrCode,
          poi_name: poiName,
          poi_location: poiLocation,
          poi_status: requestedStatus,
          latitude: Number(getPoiFormValue(formData, "latitude")),
          longitude: Number(getPoiFormValue(formData, "longitude")),
          trigger_radius_meter: Number(
            getPoiFormValue(formData, "trigger_radius_meter"),
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
    overviewSummary,
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
    handleCopyPoi,
    handleDeletePoi,
    handleSubmit,
  };
}
