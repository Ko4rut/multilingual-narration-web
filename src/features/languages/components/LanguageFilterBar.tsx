"use client";

import { Search } from "lucide-react";
import { useLanguageFilterBar } from "../hooks/useLanguageFilterBar";
import type { LanguageFilterBarProps } from "../types";

export function LanguageFilterBar({ 
  initialQ, 
  totalCount, 
  activeCount 
}: LanguageFilterBarProps) {
  const { t, searchValue, handleSearchChange } = useLanguageFilterBar(initialQ);

  return (
    <div className="card mb-6 bg-surface border-border flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg">
      <div className="w-full md:w-100 relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input 
          type="text" 
          value={searchValue || ""}
          onChange={handleSearchChange}
          placeholder={t("Search language name or ISO code...")}
          className="w-full bg-background border border-border rounded-md py-2 pl-9 pr-3 text-sm focus-visible:outline-accent"
        />
      </div>
      
      <div className="flex items-center gap-4 px-2 text-sm">
        <span className="text-muted">{t("Total:")} <strong className="text-foreground font-medium">{totalCount} {t("Languages")}</strong></span>
        <span className="text-muted">{t("Active:")} <strong className="text-accent font-medium">{activeCount} {t("Active")}</strong></span>
      </div>
    </div>
  );
}