import { useState } from "react";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import { MOCK_LANGUAGES } from "../mocks/languageData";
import type { LanguageItem } from "../types";

export function useLanguageOverview() {
  const { t } = usePreferences();
  
  const [languages, setLanguages] = useState<LanguageItem[]>(MOCK_LANGUAGES);

  function handleToggleStatus(id: string) {
    const updatedLanguages = languages.map(function updateLang(lang) {
      if (lang.id === id) {
        return { ...lang, isActive: !lang.isActive };
      }
      return lang;
    });
    
    setLanguages(updatedLanguages);
  }

  const totalCount = languages.length;
  
  const activeCount = languages.filter(function checkActive(lang) {
    return lang.isActive;
  }).length;

  return {
    t,
    languages,
    totalCount,
    activeCount,
    handleToggleStatus,
  };
}
