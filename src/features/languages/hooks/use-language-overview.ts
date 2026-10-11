import { useState } from "react";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { LANGUAGE_STATUS } from "../constants/language.constants";
import { MOCK_LANGUAGES } from "../mocks/languages.mock";
import type { Language, LanguageStatus } from "../types/language.types";

export function useLanguageOverview() {
  const { t } = usePreferences();

  const [languages, setLanguages] = useState<Language[]>(MOCK_LANGUAGES);

  function handleToggleStatus(id: string) {
    const updatedLanguages = languages.map(function updateLang(lang) {
      if (lang.id === id) {
        let languageStatus: LanguageStatus = LANGUAGE_STATUS.SUPPORTED;
        if (lang.language_status === LANGUAGE_STATUS.SUPPORTED) {
          languageStatus = LANGUAGE_STATUS.UNSUPPORTED;
        }
        return { ...lang, language_status: languageStatus };
      }
      return lang;
    });

    setLanguages(updatedLanguages);
  }

  const totalCount = languages.length;

  const supportedCount = languages.filter(function checkSupported(lang) {
    return lang.language_status === LANGUAGE_STATUS.SUPPORTED;
  }).length;

  return {
    t,
    languages,
    totalCount,
    supportedCount,
    handleToggleStatus,
  };
}
