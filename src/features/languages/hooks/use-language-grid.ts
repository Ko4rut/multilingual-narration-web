import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import type { LanguageGridProps } from "../types";

export function useLanguageGrid({ q, languages }: Omit<LanguageGridProps, "onToggleStatus">) {
  const { t } = usePreferences();
  
  const filteredLanguages = languages.filter(function applyFilters(lang) {
    if (!q) {
      return true;
    }
    const lowerQ = q.toLowerCase();
    
    return (
      lang.name.toLowerCase().includes(lowerQ) || 
      lang.code.toLowerCase().includes(lowerQ)
    );
  });

  const isEmpty = filteredLanguages.length === 0;

  return {
    t,
    filteredLanguages,
    isEmpty
  };
}
