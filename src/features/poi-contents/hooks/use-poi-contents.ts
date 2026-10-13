"use client";

import { useMemo, useState } from "react";
import { MOCK_AUDIO_FILES } from "@/features/audios/mocks/audios.mock";
import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import {
  CONTENT_STATUS,
  DEFAULT_CONTENT_AUTHOR_ID,
  DEFAULT_CONTENT_PUBLISHER_ID,
  DEFAULT_CONTENT_REVIEWER_ID,
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
  createMockPoiContentTtsAudio,
  createPoiContentId,
  createPoiContentsOverviewSummary,
  createPoiFilterOptions,
  findPublishedPoiContentVersion,
  findValidPoiContentAudio,
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
  const [reviewContentId, setReviewContentId] = useState<string | null>(null);
  const [isReviewSheetOpen, setReviewSheetOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [publishContentId, setPublishContentId] = useState<string | null>(null);
  const [isPublishSheetOpen, setPublishSheetOpen] = useState(false);
  const [audios, setAudios] = useState(function initializeAudios() {
    return [...MOCK_AUDIO_FILES];
  });
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const overviewSummary = useMemo(function getOverviewSummary() {
    return createPoiContentsOverviewSummary(contents);
  }, [contents]);
  const selectedContent =
    contents.find(function findSelectedContent(content) {
      return content.id === selectedContentId;
    }) ?? null;
  const reviewContent =
    contents.find(function findReviewContent(content) {
      return content.id === reviewContentId;
    }) ?? null;
  const publishContent =
    contents.find(function findPublishContent(content) {
      return content.id === publishContentId;
    }) ?? null;
  let publishAudio = null;
  let archivedContent = null;
  if (publishContent) {
    publishAudio = findValidPoiContentAudio(publishContent.id, audios);
    archivedContent = findPublishedPoiContentVersion(publishContent, contents);
  }
  const poiOptions = createPoiFilterOptions(MOCK_POIS);

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
    if (!canDeletePoiContent(content, contents, MOCK_POIS, audios)) {
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

  function handleSubmitForApproval(content: PoiContent) {
    if (
      content.content_status !== CONTENT_STATUS.DRAFT &&
      content.content_status !== CONTENT_STATUS.REJECTED
    ) {
      setFeedback("Only draft or rejected content can be submitted for approval.");
      return;
    }

    setContents(function submitContent(currentContents) {
      return currentContents.map(function updateContent(candidate) {
        if (candidate.id !== content.id) {
          return candidate;
        }
        return {
          ...candidate,
          content_status: CONTENT_STATUS.WAITING_APPROVAL,
          approved_by: null,
          approved_at: null,
          published_by: null,
          published_at: null,
        };
      });
    });
    setFeedback("Content submitted for approval.");
  }

  function openReviewSheet(content: PoiContent) {
    if (content.content_status !== CONTENT_STATUS.WAITING_APPROVAL) {
      setFeedback("Only content waiting for approval can be reviewed.");
      return;
    }
    setReviewContentId(content.id);
    setReviewNote("");
    setWorkflowError(null);
    setReviewSheetOpen(true);
  }

  function handleReviewSheetOpenChange(open: boolean) {
    setReviewSheetOpen(open);
    if (!open) {
      setReviewContentId(null);
      setReviewNote("");
      setWorkflowError(null);
    }
  }

  function handleReviewNoteChange(value: string) {
    setReviewNote(value);
    setWorkflowError(null);
  }

  function handleApproveContent() {
    if (!reviewContent) {
      return;
    }
    if (reviewContent.created_by === DEFAULT_CONTENT_REVIEWER_ID) {
      setWorkflowError("Authors cannot approve their own content.");
      return;
    }
    const approvedAt = new Date().toISOString();
    setContents(function approveContent(currentContents) {
      return currentContents.map(function updateContent(content) {
        if (content.id !== reviewContent.id) {
          return content;
        }
        return {
          ...content,
          content_status: CONTENT_STATUS.APPROVED,
          approved_by: DEFAULT_CONTENT_REVIEWER_ID,
          approved_at: approvedAt,
        };
      });
    });
    handleReviewSheetOpenChange(false);
    setFeedback("Content approved and ready for publishing.");
  }

  function handleRejectContent() {
    if (!reviewContent) {
      return;
    }
    if (!reviewNote.trim()) {
      setWorkflowError("Enter a review note before rejecting content.");
      return;
    }
    setContents(function rejectContent(currentContents) {
      return currentContents.map(function updateContent(content) {
        if (content.id !== reviewContent.id) {
          return content;
        }
        return {
          ...content,
          content_status: CONTENT_STATUS.REJECTED,
          approved_by: null,
          approved_at: null,
          published_by: null,
          published_at: null,
        };
      });
    });
    handleReviewSheetOpenChange(false);
    setFeedback("Content rejected and returned for revision.");
  }

  function openPublishSheet(content: PoiContent) {
    if (content.content_status !== CONTENT_STATUS.APPROVED) {
      setFeedback("Only approved content can be published.");
      return;
    }
    setPublishContentId(content.id);
    setWorkflowError(null);
    setPublishSheetOpen(true);
  }

  function handlePublishSheetOpenChange(open: boolean) {
    setPublishSheetOpen(open);
    if (!open) {
      setPublishContentId(null);
      setWorkflowError(null);
    }
  }

  function handleGenerateAudio() {
    if (!publishContent) {
      return;
    }
    const existingAudio = findValidPoiContentAudio(publishContent.id, audios);
    if (existingAudio) {
      return;
    }
    const generatedAudio = createMockPoiContentTtsAudio(
      publishContent,
      audios,
      new Date(),
    );
    setAudios(function addGeneratedAudio(currentAudios) {
      return [generatedAudio, ...currentAudios];
    });
    setWorkflowError(null);
    setFeedback("TTS audio generated and validated.");
  }

  function handlePublishContent() {
    if (!publishContent) {
      return;
    }
    const validAudio = findValidPoiContentAudio(publishContent.id, audios);
    if (!validAudio) {
      setWorkflowError("Generate or attach a valid audio file before publishing.");
      return;
    }
    const publishedAt = new Date().toISOString();
    setContents(function publishContentVersion(currentContents) {
      return currentContents.map(function updateContent(content) {
        if (
          content.id !== publishContent.id &&
          content.poi_id === publishContent.poi_id &&
          content.language_id === publishContent.language_id &&
          content.content_status === CONTENT_STATUS.PUBLISHED
        ) {
          return {
            ...content,
            content_status: CONTENT_STATUS.ARCHIVED,
          };
        }
        if (content.id !== publishContent.id) {
          return content;
        }
        return {
          ...content,
          content_status: CONTENT_STATUS.PUBLISHED,
          published_by: DEFAULT_CONTENT_PUBLISHER_ID,
          published_at: publishedAt,
        };
      });
    });
    handlePublishSheetOpenChange(false);
    setFeedback("Content published successfully.");
  }

  return {
    contents,
    overviewSummary,
    poiOptions,
    selectedContent,
    sheetMode,
    isSheetOpen,
    reviewContent,
    isReviewSheetOpen,
    reviewNote,
    publishContent,
    isPublishSheetOpen,
    publishAudio,
    archivedContent,
    workflowError,
    feedback,
    openCreateSheet,
    openViewSheet,
    openEditSheet,
    editSelectedContent,
    handleSheetOpenChange,
    handleCopyContent,
    handleDeleteContent,
    handleSubmit,
    handleSubmitForApproval,
    openReviewSheet,
    handleReviewSheetOpenChange,
    handleReviewNoteChange,
    handleApproveContent,
    handleRejectContent,
    openPublishSheet,
    handlePublishSheetOpenChange,
    handleGenerateAudio,
    handlePublishContent,
  };
}
