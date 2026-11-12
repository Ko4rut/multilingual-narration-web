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
import { createPoiContentsOverviewSummary, createPoiFilterOptions, findPublishedPoiContentVersion, getPoiContentFormValue } from "../utils/poi-content.utils";

export function usePoiContents() {
  const [contents, setContents] = useState<PoiContent[]>([]);
  const [pois, setPois] = useState<PointOfInterest[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [sheetMode, setSheetMode] = useState<FeatureFormMode>("create");
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [reviewContentId, setReviewContentId] = useState<string | null>(null);
  const [isReviewSheetOpen, setReviewSheetOpen] = useState(false);
  const [publishContentId, setPublishContentId] = useState<string | null>(null);
  const [isPublishSheetOpen, setPublishSheetOpen] = useState(false);
  const [workflowError, setWorkflowError] = useState<string | null>(null);
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
  const reviewContent = contents.find(function find(item) { return item.id === reviewContentId; }) ?? null;
  const publishContent = contents.find(function find(item) { return item.id === publishContentId; }) ?? null;
  const publishAudio = publishContent?.audio ?? null;
  let archivedContent = null;
  if (publishContent) archivedContent = findPublishedPoiContentVersion(publishContent, contents);
  const poiOptions = createPoiFilterOptions(pois);

  function replaceContent(updated: PoiContent) {
    setContents(function replace(current) { return current.map(function map(item) { if (item.id === updated.id) return updated; return item; }); });
  }
  function openCreateSheet() { setSelectedContentId(null); setSheetMode("create"); setSheetOpen(true); setFeedback(null); }
  function openViewSheet(content: PoiContent) { setSelectedContentId(content.id); setSheetMode("view"); setSheetOpen(true); }
  function openEditSheet(content: PoiContent) { setSelectedContentId(content.id); setSheetMode("edit"); setSheetOpen(true); setFeedback(null); }
  function editSelectedContent() { if (selectedContent) setSheetMode("edit"); }
  function handleSheetOpenChange(open: boolean) { setSheetOpen(open); if (!open) setSelectedContentId(null); }
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
    const result = await updatePoiContentAction(selectedContent.id, { narration_title, narration_script });
    if (!result.data) { setFeedback(result.error); return; }
    replaceContent(result.data);
    setFeedback("Content updated successfully.");
    setSheetOpen(false);
  }

  async function handleSubmitForApproval(content: PoiContent) {
    const result = await submitPoiContentAction(content.id);
    if (!result.data) { setFeedback(result.error); return; }
    replaceContent(result.data);
    setFeedback("Content submitted for approval.");
  }
  function openReviewSheet(content: PoiContent) { setReviewContentId(content.id); setWorkflowError(null); setReviewSheetOpen(true); }
  function handleReviewSheetOpenChange(open: boolean) { setReviewSheetOpen(open); if (!open) { setReviewContentId(null); setWorkflowError(null); } }
  async function review(decision: "APPROVE" | "REJECT") {
    if (!reviewContent) return;
    const result = await reviewPoiContentAction(reviewContent.id, decision);
    if (!result.data) { setWorkflowError(result.error); return; }
    replaceContent(result.data);
    handleReviewSheetOpenChange(false);
    let successMessage = "Content rejected and returned for revision.";
    if (decision === "APPROVE") successMessage = "Content approved and ready for publishing.";
    setFeedback(successMessage);
  }
  function handleApproveContent() { void review("APPROVE"); }
  function handleRejectContent() { void review("REJECT"); }
  function openPublishSheet(content: PoiContent) { setPublishContentId(content.id); setWorkflowError(null); setPublishSheetOpen(true); }
  function handlePublishSheetOpenChange(open: boolean) { setPublishSheetOpen(open); if (!open) { setPublishContentId(null); setWorkflowError(null); } }
  async function handlePublishContent() {
    if (!publishContent) return;
    const result = await publishPoiContentAction(publishContent.id);
    if (!result.data) { setWorkflowError(result.error); return; }
    setContents(function publish(current) {
      return current.map(function map(item) {
        if (item.id === result.data.id) return result.data;
        if (item.poi_id === result.data.poi_id && item.language_id === result.data.language_id && item.content_status === CONTENT_STATUS.PUBLISHED) return { ...item, content_status: CONTENT_STATUS.ARCHIVED };
        return item;
      });
    });
    handlePublishSheetOpenChange(false);
    setFeedback("Content published successfully. TTS audio was generated automatically when required.");
  }

  return { contents, pois, languages, overviewSummary, poiOptions, selectedContent, sheetMode, isSheetOpen, reviewContent, isReviewSheetOpen, publishContent, isPublishSheetOpen, publishAudio, archivedContent, workflowError, feedback, isLoading, openCreateSheet, openViewSheet, openEditSheet, editSelectedContent, handleSheetOpenChange, handleCopyContent, handleSubmit, handleSubmitForApproval, openReviewSheet, handleReviewSheetOpenChange, handleApproveContent, handleRejectContent, openPublishSheet, handlePublishSheetOpenChange, handlePublishContent };
}
