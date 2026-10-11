"use client";

import { useState } from "react";
import { MOCK_AUDIO_FILES } from "@/features/audios/mocks/audioData";
import { LANGUAGE_STATUS } from "@/features/languages/constants/language.constants";
import {
  DEFAULT_MOCK_LANGUAGE_ID,
  MOCK_LANGUAGES,
} from "@/features/languages/mocks/languages.mock";
import { POI_STATUS } from "@/features/pois/constants/poi.constants";
import { MOCK_POIS } from "@/features/pois/mocks/pois.mock";
import { canActivatePoi } from "@/features/pois/utils/utils";
import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import {
  CONTENT_STATUS,
  DEFAULT_CONTENT_AUTHOR_ID,
} from "../constants/poi-content.constants";
import { MOCK_POI_CONTENTS } from "../mocks/poi-content.mock";
import type { PoiContent } from "../types/poi-content.types";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function createContentId(contents: readonly PoiContent[]) {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  let sequence = contents.length + 1;
  let id = `cont-${day}${month}${year}-${String(sequence).padStart(4, "0")}`;
  while (
    contents.some(function hasContent(candidate) {
      return candidate.id === id;
    })
  ) {
    sequence += 1;
    id = `cont-${day}${month}${year}-${String(sequence).padStart(4, "0")}`;
  }
  return id;
}

function getNextVersion(
  contents: readonly PoiContent[],
  poiId: string,
  languageId: string,
) {
  const versions = contents.flatMap(function getMatchingVersion(content) {
    if (content.poi_id !== poiId || content.language_id !== languageId) {
      return [];
    }
    return [content.content_version];
  });
  if (versions.length === 0) {
    return 1;
  }
  return Math.max(...versions) + 1;
}

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
  const selectedContent =
    contents.find(function findSelectedContent(content) {
      return content.id === selectedContentId;
    }) ?? null;
  const poiOptions = MOCK_POIS.map(function createPoiOption(poi) {
    return { value: poi.id, label: `${poi.poi_name} (${poi.id})` };
  });

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

  function handleDeleteContent(content: PoiContent) {
    const linkedPoi = MOCK_POIS.find(function findPoi(poi) {
      return poi.id === content.poi_id;
    });
    if (linkedPoi?.poi_status === POI_STATUS.ACTIVE) {
      const remainingContents = contents.filter(function keepContent(candidate) {
        return candidate.id !== content.id;
      });
      if (!canActivatePoi(linkedPoi.id, remainingContents, MOCK_AUDIO_FILES)) {
        setFeedback(
          "This content cannot be deleted because it keeps an active POI available.",
        );
        return;
      }
    }
    setContents(function removeContent(currentContents) {
      return currentContents.filter(function keepContent(candidate) {
        return candidate.id !== content.id;
      });
    });
    setFeedback("Content deleted from demo data.");
  }

  function handleSubmit(formData: FormData) {
    let poiId = getFormValue(formData, "poi_id");
    let languageId = getFormValue(formData, "language_id");
    const title = getFormValue(formData, "narration_title");
    const script = getFormValue(formData, "narration_script");
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
        const content: PoiContent = {
          id: createContentId(currentContents),
          poi_id: poiId,
          language_id: languageId || DEFAULT_MOCK_LANGUAGE_ID,
          narration_title: title,
          narration_script: script,
          content_version: getNextVersion(currentContents, poiId, languageId),
          content_status: CONTENT_STATUS.DRAFT,
          created_by: DEFAULT_CONTENT_AUTHOR_ID,
          approved_by: null,
          published_by: null,
          created_at: new Date().toISOString(),
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
        const replacement: PoiContent = {
          ...selectedContent,
          id: createContentId(currentContents),
          narration_title: title,
          narration_script: script,
          content_version: getNextVersion(
            currentContents,
            selectedContent.poi_id,
            selectedContent.language_id,
          ),
          content_status: CONTENT_STATUS.DRAFT,
          created_by: DEFAULT_CONTENT_AUTHOR_ID,
          approved_by: null,
          published_by: null,
          created_at: new Date().toISOString(),
          approved_at: null,
          published_at: null,
        };
        return [replacement, ...currentContents];
      });
      setSheetOpen(false);
      setFeedback("A new draft version was created; the published version was preserved.");
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
    handleDeleteContent,
    handleSubmit,
  };
}
