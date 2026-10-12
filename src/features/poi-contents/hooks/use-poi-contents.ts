"use client";

import { useMemo, useState } from "react";
import { MOCK_AUDIO_FILES } from "@/features/audios/mocks/audios.mock";
import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import {
  CONTENT_STATUS,
  DEFAULT_CONTENT_AUTHOR_ID,
} from "../constants/poi-content.constants";
import { LANGUAGE_STATUS } from "../constants/language.constants";
import {
  DEFAULT_MOCK_LANGUAGE_ID,
  MOCK_LANGUAGES,
} from "../mocks/languages.mock";
import { MOCK_POI_CONTENTS } from "../mocks/poi-content.mock";
import { MOCK_POIS } from "../mocks/poi.mock";
import type { PoiContent } from "../types/poi-content.types";
import {
  canDeletePoiContent,
  createPoiContentId,
  createPoiContentsOverviewSummary,
  createPoiFormOptions,
  getNextPoiContentVersion,
  getPoiContentFormValue,
} from "../utils/poi-content.utils";

export function usePoiContents() {
  const [contents, setContents] = useState<PoiContent[]>(
    function initializeContents() {
      return [...MOCK_POI_CONTENTS];
    },
  );
  const [sheetMode, setSheetMode] = useState<FeatureFormMode>("create");
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const overviewSummary = useMemo(function getOverviewSummary() {
    return createPoiContentsOverviewSummary(contents);
  }, [contents]);
  const selectedContent =
    contents.find(function findSelectedContent(content) {
      return content.id === selectedContentId;
    }) ?? null;
  const poiOptions = createPoiFormOptions(MOCK_POIS);

  function openCreateSheet() {
    setSelectedContentId(null);
    setSheetMode("create");
    setSheetOpen(true);
    setFeedback(null);
  }

  function openViewSheet(content: PoiContent) {
    setSelectedContentId(content.id);
    setSheetMode("view");
    setSheetOpen(true);
  }

  function openEditSheet(content: PoiContent) {
    setSelectedContentId(content.id);
    setSheetMode("edit");
    setSheetOpen(true);
    setFeedback(null);
  }

  function editSelectedContent() {
    if (!selectedContent) {
      return;
    }
    setSheetMode("edit");
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setSelectedContentId(null);
    }
  }

  async function handleCopyContent(content: PoiContent) {
    try {
      await navigator.clipboard.writeText(content.id);
      setFeedback("Content ID copied.");
    } catch {
      setFeedback("Unable to copy the content ID.");
    }
  }

  function handleDeleteContent(content: PoiContent) {
    if (!canDeletePoiContent(content, contents, MOCK_POIS, MOCK_AUDIO_FILES)) {
      setFeedback(
        "This content cannot be deleted because it keeps an active POI available.",
      );
      return;
    }
    setContents(function removeContent(currentContents) {
      return currentContents.filter(function keepContent(candidate) {
        return candidate.id !== content.id;
      });
    });
    setFeedback("Content deleted from demo data.");
  }

  function handleSubmit(formData: FormData) {
    let poiId = getPoiContentFormValue(formData, "poi_id");
    let languageId = getPoiContentFormValue(formData, "language_id");
    const title = getPoiContentFormValue(formData, "narration_title");
    const script = getPoiContentFormValue(formData, "narration_script");
    if (selectedContent && sheetMode !== "create") {
      poiId = selectedContent.poi_id;
      languageId = selectedContent.language_id;
    }
    const hasPoi = MOCK_POIS.some(function findPoi(poi) {
      return poi.id === poiId;
    });
    const hasLanguage = MOCK_LANGUAGES.some(
      function findSupportedLanguage(language) {
        return (
          language.id === languageId &&
          language.language_status === LANGUAGE_STATUS.SUPPORTED
        );
      },
    );
    if (!hasPoi || !hasLanguage || !title || !script) {
      setFeedback("Complete all required content fields.");
      return;
    }

    if (sheetMode === "create") {
      setContents(function addContent(currentContents) {
        const creationDate = new Date();
        const content: PoiContent = {
          id: createPoiContentId(currentContents, creationDate),
          poi_id: poiId,
          language_id: languageId || DEFAULT_MOCK_LANGUAGE_ID,
          narration_title: title,
          narration_script: script,
          content_version: getNextPoiContentVersion(
            currentContents,
            poiId,
            languageId,
          ),
          content_status: CONTENT_STATUS.DRAFT,
          created_by: DEFAULT_CONTENT_AUTHOR_ID,
          approved_by: null,
          published_by: null,
          created_at: creationDate.toISOString(),
          approved_at: null,
          published_at: null,
        };
        return [content, ...currentContents];
      });
      setSheetOpen(false);
      setFeedback("Draft content created in demo data.");
      return;
    }

    if (!selectedContent) {
      return;
    }
    if (
      selectedContent.content_status === CONTENT_STATUS.PUBLISHED ||
      selectedContent.content_status === CONTENT_STATUS.ARCHIVED
    ) {
      setContents(function createReplacementVersion(currentContents) {
        const creationDate = new Date();
        const replacement: PoiContent = {
          ...selectedContent,
          id: createPoiContentId(currentContents, creationDate),
          narration_title: title,
          narration_script: script,
          content_version: getNextPoiContentVersion(
            currentContents,
            selectedContent.poi_id,
            selectedContent.language_id,
          ),
          content_status: CONTENT_STATUS.DRAFT,
          created_by: DEFAULT_CONTENT_AUTHOR_ID,
          approved_by: null,
          published_by: null,
          created_at: creationDate.toISOString(),
          approved_at: null,
          published_at: null,
        };
        return [replacement, ...currentContents];
      });
      setSheetOpen(false);
      setFeedback(
        "A new draft version was created; the published version was preserved.",
      );
      return;
    }
    setContents(function updateContents(currentContents) {
      return currentContents.map(function updateContent(content) {
        if (content.id !== selectedContent.id) {
          return content;
        }
        return {
          ...content,
          narration_title: title,
          narration_script: script,
        };
      });
    });
    setSheetOpen(false);
    setFeedback("Content updated in demo data.");
  }

  return {
    contents,
    overviewSummary,
    poiOptions,
    selectedContent,
    sheetMode,
    isSheetOpen,
    feedback,
    openCreateSheet,
    openViewSheet,
    openEditSheet,
    editSelectedContent,
    handleSheetOpenChange,
    handleCopyContent,
    handleDeleteContent,
    handleSubmit,
  };
}
