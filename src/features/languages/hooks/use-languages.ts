"use client";

import { useMemo, useState } from "react";
import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import { LANGUAGE_STATUS } from "../constants/language.constants";
import { MOCK_LANGUAGES } from "../mocks/languages.mock";
import type { Language, LanguageStatus } from "../types/language.types";
import {
  createLanguageId,
  createLanguagesOverviewSummary,
  getLanguageFormValue,
  hasDuplicateLanguage,
  isValidLanguageCode,
  normalizeLanguageCode,
  parseLanguageStatus,
} from "../utils/language.utils";

/** Điều phối dữ liệu mẫu và các luồng thêm, xem, sửa, đổi trạng thái ngôn ngữ. */
export function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>(
    function initializeLanguages() {
      return [...MOCK_LANGUAGES];
    },
  );
  const [sheetMode, setSheetMode] = useState<FeatureFormMode>("create");
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(
    null,
  );
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const selectedLanguage =
    languages.find(function findSelectedLanguage(language) {
      return language.id === selectedLanguageId;
    }) ?? null;
  const overviewSummary = useMemo(function getOverviewSummary() {
    return createLanguagesOverviewSummary(languages);
  }, [languages]);

  function openCreateSheet() {
    setSelectedLanguageId(null);
    setSheetMode("create");
    setSheetOpen(true);
    setFormError(null);
    setFeedback(null);
  }

  function openViewSheet(language: Language) {
    setSelectedLanguageId(language.id);
    setSheetMode("view");
    setSheetOpen(true);
    setFormError(null);
  }

  function openEditSheet(language: Language) {
    setSelectedLanguageId(language.id);
    setSheetMode("edit");
    setSheetOpen(true);
    setFormError(null);
    setFeedback(null);
  }

  function editSelectedLanguage() {
    if (!selectedLanguage) {
      return;
    }
    setSheetMode("edit");
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setSelectedLanguageId(null);
      setFormError(null);
    }
  }

  function handleToggleStatus(language: Language) {
    let nextStatus: LanguageStatus = LANGUAGE_STATUS.SUPPORTED;
    let nextFeedback = "Language support enabled for new content.";
    if (language.language_status === LANGUAGE_STATUS.SUPPORTED) {
      nextStatus = LANGUAGE_STATUS.UNSUPPORTED;
      nextFeedback = "Language support paused; historical data was preserved.";
    }

    setLanguages(function updateLanguages(currentLanguages) {
      return currentLanguages.map(function updateLanguage(candidate) {
        if (candidate.id !== language.id) {
          return candidate;
        }
        return { ...candidate, language_status: nextStatus };
      });
    });
    setFeedback(nextFeedback);
  }

  function handleSubmit(formData: FormData) {
    const languageName = getLanguageFormValue(formData, "language_name");
    const languageCode = normalizeLanguageCode(
      getLanguageFormValue(formData, "language_code"),
    );
    const languageStatus = parseLanguageStatus(
      getLanguageFormValue(formData, "language_status"),
    );

    if (!languageName || !languageCode) {
      setFormError("Complete all required language fields.");
      return;
    }
    if (!isValidLanguageCode(languageCode)) {
      setFormError("Language code must use 2 or 3 lowercase letters.");
      return;
    }
    if (
      hasDuplicateLanguage(
        languages,
        selectedLanguage?.id ?? null,
        languageCode,
        languageName,
      )
    ) {
      setFormError("Language code and name must be unique.");
      return;
    }

    if (sheetMode === "create") {
      setLanguages(function addLanguage(currentLanguages) {
        const language: Language = {
          id: createLanguageId(currentLanguages, languageCode),
          language_code: languageCode,
          language_name: languageName,
          language_status: languageStatus,
        };
        return [language, ...currentLanguages];
      });
      setSheetOpen(false);
      setFormError(null);
      setFeedback("Language created in demo data.");
      return;
    }

    if (!selectedLanguage) {
      return;
    }
    setLanguages(function updateLanguages(currentLanguages) {
      return currentLanguages.map(function updateLanguage(language) {
        if (language.id !== selectedLanguage.id) {
          return language;
        }
        return {
          ...language,
          language_code: languageCode,
          language_name: languageName,
          language_status: languageStatus,
        };
      });
    });
    setSheetOpen(false);
    setFormError(null);
    setFeedback("Language updated in demo data.");
  }

  return {
    languages,
    overviewSummary,
    selectedLanguage,
    sheetMode,
    isSheetOpen,
    formError,
    feedback,
    openCreateSheet,
    openViewSheet,
    openEditSheet,
    editSelectedLanguage,
    handleSheetOpenChange,
    handleToggleStatus,
    handleSubmit,
  };
}
