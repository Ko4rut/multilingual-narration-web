"use client";

import { useEffect, useMemo, useState } from "react";
import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import {
  createPoiContentAction,
  loadPoiContentManagement,
  publishPoiContentAction,
  reviewPoiContentAction,
  submitPoiContentAction,
  updatePoiContentAction,
} from "../actions";
import { CONTENT_STATUS } from "../constants/poi-content.constants";
import type { Language } from "../types/language.types";
import type { PoiContent } from "../types/poi-content.types";
import type { PointOfInterest } from "../types/poi.types";
import { createPoiContentsOverviewSummary, createPoiFilterOptions, findPublishedPoiContentVersion, getPoiContentFormValue, isPoiContentEditable, isValidPoiContentAudio } from "../utils/poi-content.utils";

export function usePoiContents() {
  const [contents, setContents] = useState<PoiContent[]>([]);
  const [pois, setPois] = useState<PointOfInterest[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [sheetMode, setSheetMode] = useState<FeatureFormMode>("create");
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const [isPublishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(function loadContents() {
    let active = true;
    async function load() {
      const result = await loadPoiContentManagement();
      if (!active) return;
      if (!result.data) { setFeedback(result.error); setLoading(false); return; }
      setContents(result.data.contents);
      setPois(result.data.options.pois);
      setLanguages(result.data.options.languages);
      setLoading(false);
    }
    void load();
    return function cancel() { active = false; };
  }, []);

  const overviewSummary = useMemo(function getSummary() { return createPoiContentsOverviewSummary(contents); }, [contents]);
  const selectedContent = contents.find(function find(item) { return item.id === selectedContentId; }) ?? null;
  const publishAudio = selectedContent?.audio ?? null;
  const hasValidPublishAudio = publishAudio !== null && isValidPoiContentAudio(publishAudio);
  let archivedContent = null;
  if (selectedContent) archivedContent = findPublishedPoiContentVersion(selectedContent, contents);
  const poiOptions = createPoiFilterOptions(pois);

  function replaceContent(updated: PoiContent) {
    setContents(function replace(current) { return current.map(function map(item) { if (item.id === updated.id) return updated; return item; }); });
  }
  function openCreateSheet() { setSelectedContentId(null); setSheetMode("create"); setSheetOpen(true); setFeedback(null); setWorkflowError(null); }
  function openViewSheet(content: PoiContent) { setSelectedContentId(content.id); setSheetMode("view"); setSheetOpen(true); setWorkflowError(null); }
  function openWorkflowSheet(content: PoiContent) { openViewSheet(content); }
  function openEditSheet(content: PoiContent) {
    if (!isPoiContentEditable(content.content_status)) return;
    setSelectedContentId(content.id); setSheetMode("edit"); setSheetOpen(true); setFeedback(null);
  }
  function editSelectedContent() {
    if (selectedContent && isPoiContentEditable(selectedContent.content_status)) setSheetMode("edit");
  }
  function handleSheetOpenChange(open: boolean) {
    if (isPublishing && !open) return;
    setSheetOpen(open);
    if (!open) { setSelectedContentId(null); setWorkflowError(null); }
  }
  async function handleCopyContent(content: PoiContent) { try { await navigator.clipboard.writeText(content.id); setFeedback("Content ID copied."); } catch { setFeedback("Unable to copy the content ID."); } }

  async function handleSubmit(formData: FormData) {
    const narration_title = getPoiContentFormValue(formData, "narration_title");
    const narration_script = getPoiContentFormValue(formData, "narration_script");
    if (!selectedContent || sheetMode === "create") {
      const result = await createPoiContentAction({ poi_id: getPoiContentFormValue(formData, "poi_id"), language_id: getPoiContentFormValue(formData, "language_id"), narration_title, narration_script });
      if (!result.data) { setFeedback(result.error); return; }
      setContents(function add(current) { return [result.data, ...current]; });
      setFeedback("Draft content created successfully.");
      setSheetOpen(false);
      return;
    }
    if (!isPoiContentEditable(selectedContent.content_status)) {
      setFeedback("Approved or published content cannot be edited.");
      return;
    }
    const result = await updatePoiContentAction(selectedContent.id, { narration_title, narration_script });
    if (!result.data) { setFeedback(result.error); return; }
    replaceContent(result.data);
    setFeedback("Content updated successfully.");
    setSheetOpen(false);
  }

  async function handleSubmitForApproval() {
    if (!selectedContent) return;
    const result = await submitPoiContentAction(selectedContent.id);
    if (!result.data) { setWorkflowError(result.error); return; }
    replaceContent(result.data);
    setFeedback("Content submitted for approval.");
    setWorkflowError(null);
  }
  async function review(decision: "APPROVE" | "REJECT") {
    if (!selectedContent) return;
    const result = await reviewPoiContentAction(selectedContent.id, decision);
    if (!result.data) { setWorkflowError(result.error); return; }
    replaceContent(result.data);
    setWorkflowError(null);
    let successMessage = "Content rejected and returned for revision.";
    if (decision === "APPROVE") successMessage = "Content approved and ready for publishing.";
    setFeedback(successMessage);
  }
  function handleApproveContent() { void review("APPROVE"); }
  function handleRejectContent() { void review("REJECT"); }
  async function handlePublishContent() {
    if (!selectedContent || isPublishing) return;
    setPublishing(true);
    setWorkflowError(null);
    try {
      const result = await publishPoiContentAction(selectedContent.id);
      if (!result.data) {
        setWorkflowError(result.error);
        return;
      }
      setContents(function publish(current) {
        return current.map(function map(item) {
          if (item.id === result.data.id) return result.data;
          if (item.poi_id === result.data.poi_id && item.language_id === result.data.language_id && item.content_status === CONTENT_STATUS.PUBLISHED) return { ...item, content_status: CONTENT_STATUS.ARCHIVED };
          return item;
        });
      });
      setFeedback("Content published successfully. TTS audio was generated automatically when required.");
    } finally {
      setPublishing(false);
    }
  }

  return { contents, pois, languages, overviewSummary, poiOptions, selectedContent, sheetMode, isSheetOpen, publishAudio, hasValidPublishAudio, archivedContent, workflowError, feedback, isLoading, isPublishing, openCreateSheet, openViewSheet, openWorkflowSheet, openEditSheet, editSelectedContent, handleSheetOpenChange, handleCopyContent, handleSubmit, handleSubmitForApproval, handleApproveContent, handleRejectContent, handlePublishContent };
}
