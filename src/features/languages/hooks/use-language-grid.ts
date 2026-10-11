import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { LanguageGridProps } from "../types/language.types";

export function useLanguageGrid({ q, languages }: Omit<LanguageGridProps, "onToggleStatus">) {
  const { t } = usePreferences();
  
  const filteredLanguages = languages.filter(function applyFilters(lang) {
    if (!q) {
      return true;
    }
    const lowerQ = q.toLowerCase();
    
    return (
      lang.language_name.toLowerCase().includes(lowerQ) ||
      lang.language_code.toLowerCase().includes(lowerQ)
    );
  });

  const isEmpty = filteredLanguages.length === 0;

  return {
    t,
    filteredLanguages,
    isEmpty
  };
}
