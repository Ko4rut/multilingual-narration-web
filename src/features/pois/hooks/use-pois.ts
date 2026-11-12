"use client";

import { useEffect, useMemo, useState } from "react";
import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import { createPoiAction, loadPoiManagement, loadPoiQrCodeAction, updatePoiAction } from "../actions";
import { POI_STATUS } from "../constants/poi.constants";
import type { PoiCategoryMapping } from "../types/poi-category-mapping.types";
import type { PoiCategory } from "../types/poi-category.types";
import type { PointOfInterest, PoiCreatePayload } from "../types/poi.types";
import type { Region } from "../types/region.types";
import { createPoisOverviewSummary, createPoiUpdatePayload, getPoiFormValue, getUniquePoiFormValues } from "../utils/poi.utils";

export function usePois() {
  const [pois, setPois] = useState<PointOfInterest[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [categories, setCategories] = useState<PoiCategory[]>([]);
  const [sheetMode, setSheetMode] = useState<FeatureFormMode>("create");
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isQrLoading, setQrLoading] = useState(false);

  useEffect(function loadPois() {
    let active = true;
    async function load() {
      const result = await loadPoiManagement();
      if (!active) return;
      if (!result.data) {
        setFeedback(result.error);
        setLoading(false);
        return;
      }
      setPois(result.data.pois);
      setRegions(result.data.options.regions);
      setCategories(result.data.options.categories);
      setLoading(false);
    }
    void load();
    return function cancel() { active = false; };
  }, []);

  const overviewSummary = useMemo(function getOverviewSummary() { return createPoisOverviewSummary(pois); }, [pois]);
  const selectedPoi = pois.find(function findSelectedPoi(poi) { return poi.id === selectedPoiId; }) ?? null;
  const selectedCategoryIds = selectedPoi?.category_ids ?? [];
  const canActivateSelectedPoi = selectedPoi?.can_activate ?? false;
  const poiCategoryMappings = useMemo(function createMappings() {
    return pois.flatMap(function mapPoi(poi): PoiCategoryMapping[] {
      return poi.category_ids.map(function mapCategory(categoryId) { return { poi_id: poi.id, poi_category_id: categoryId }; });
    });
  }, [pois]);

  function resetQrCode() { setQrCodeDataUrl(null); setQrLoading(false); }
  function openCreateSheet() { setSelectedPoiId(null); setSheetMode("create"); setSheetOpen(true); setFeedback(null); resetQrCode(); }
  function openViewSheet(poi: PointOfInterest) { setSelectedPoiId(poi.id); setSheetMode("view"); setSheetOpen(true); resetQrCode(); }
  function openEditSheet(poi: PointOfInterest) { setSelectedPoiId(poi.id); setSheetMode("edit"); setSheetOpen(true); setFeedback(null); resetQrCode(); }
  function editSelectedPoi() { if (selectedPoi) setSheetMode("edit"); }
  function handleSheetOpenChange(open: boolean) { setSheetOpen(open); if (!open) { setSelectedPoiId(null); resetQrCode(); } }

  async function handleCopyPoi(poi: PointOfInterest) {
    try { await navigator.clipboard.writeText(poi.id); setFeedback("POI ID copied."); }
    catch { setFeedback("Unable to copy the POI ID."); }
  }

  async function handleLoadQrCode() {
    if (!selectedPoi) return;
    setQrLoading(true);
    const result = await loadPoiQrCodeAction(selectedPoi.id);
    setQrLoading(false);
    if (!result.data) { setFeedback(result.error); return; }
    setQrCodeDataUrl(result.data);
  }

  async function handleDownloadQrCode() {
    if (!selectedPoi) return;
    let dataUrl = qrCodeDataUrl;
    if (!dataUrl) {
      setQrLoading(true);
      const result = await loadPoiQrCodeAction(selectedPoi.id);
      setQrLoading(false);
      if (!result.data) { setFeedback(result.error); return; }
      dataUrl = result.data;
      setQrCodeDataUrl(dataUrl);
    }
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${selectedPoi.id}-qr.png`;
    link.click();
  }

  async function handleSubmit(formData: FormData) {
    const payload: PoiCreatePayload = {
      poi_name: getPoiFormValue(formData, "poi_name"),
      region_id: getPoiFormValue(formData, "region_id"),
      poi_location: getPoiFormValue(formData, "poi_location"),
      poi_image_url: getPoiFormValue(formData, "poi_image_url"),
      category_ids: getUniquePoiFormValues(formData, "poi_category_ids"),
      latitude: Number(getPoiFormValue(formData, "latitude")),
      longitude: Number(getPoiFormValue(formData, "longitude")),
      trigger_radius_meter: Number(getPoiFormValue(formData, "trigger_radius_meter")),
      poi_status: POI_STATUS.INACTIVE,
    };
    if (selectedPoi && sheetMode === "edit") payload.poi_status = (getPoiFormValue(formData, "poi_status") || selectedPoi.poi_status) as PoiCreatePayload["poi_status"];
    let result;
    if (selectedPoi && sheetMode === "edit") {
      const changes = createPoiUpdatePayload(selectedPoi, payload);
      if (Object.keys(changes).length === 0) {
        setFeedback("No POI changes to save.");
        return;
      }
      result = await updatePoiAction(selectedPoi.id, changes);
    } else {
      result = await createPoiAction(payload);
    }
    if (!result.data) { setFeedback(result.error); return; }
    setPois(function save(current) {
      const exists = current.some(function match(poi) { return poi.id === result.data.id; });
      if (!exists) return [result.data, ...current];
      return current.map(function replace(poi) { if (poi.id === result.data.id) return result.data; return poi; });
    });
    setSheetOpen(false);
    let successMessage = "POI created successfully.";
    if (sheetMode === "edit") successMessage = "POI updated successfully.";
    setFeedback(successMessage);
  }

  return { pois, regions, categories, overviewSummary, poiCategoryMappings, selectedPoi, selectedCategoryIds, sheetMode, isSheetOpen, feedback, isLoading, canActivateSelectedPoi, qrCodeDataUrl, isQrLoading, openCreateSheet, openViewSheet, openEditSheet, editSelectedPoi, handleSheetOpenChange, handleCopyPoi, handleLoadQrCode, handleDownloadQrCode, handleSubmit };
}
