"use client";

import { useMemo } from "react";
import { LANGUAGE_STATUS } from "@/features/languages/constants/language.constants";
import { MOCK_LANGUAGES } from "@/features/languages/mocks/languages.mock";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { FeatureFormMode, FormComboboxOption } from "@/types/shared/feature-form.types";
import { CONTENT_STATUS_OPTIONS } from "../constants/poi-content.constants";

export function usePoiContentFormSheet(mode: FeatureFormMode) {
  const { t } = usePreferences();
  const languageOptions = useMemo<FormComboboxOption[]>(
    function createLanguageOptions() {
      return MOCK_LANGUAGES.flatMap(function createLanguageOption(language) {
        if (language.language_status !== LANGUAGE_STATUS.SUPPORTED) {
          return [];
        }
        return [{ value: language.id, label: t(language.language_name) }];
      });
    },
    [t],
  );
  const statusOptions = useMemo<FormComboboxOption[]>(
    function createStatusOptions() {
      return CONTENT_STATUS_OPTIONS.map(function translateStatus(option) {
        return { value: option.value, label: t(option.label) };
      });
    },
    [t],
  );

  let description = t("Create a draft narration version for a POI and language.");
  if (mode === "view") {
    description = t("Review narration content and workflow metadata.");
  }
  if (mode === "edit") {
    description = t("Update editable narration fields for this content version.");
  }

  return { t, languageOptions, statusOptions, description };
}
