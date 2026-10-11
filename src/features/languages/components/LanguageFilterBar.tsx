"use client";

import { Search } from "lucide-react";
import { useLanguageFilterBar } from "../hooks/use-language-filter-bar";
import type { LanguageFilterBarProps } from "../types/language.types";

export function LanguageFilterBar({
  initialQ,
  totalCount,
  supportedCount,
}: LanguageFilterBarProps) {
  const { t, searchValue, handleSearchChange } = useLanguageFilterBar(initialQ);

  return (
    <div className="card mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border-border bg-surface p-3">
      <div className="relative w-full md:w-100">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={searchValue || ""}
          onChange={handleSearchChange}
          placeholder={t("Search language name or ISO code...")}
          className="w-full rounded-md border border-border bg-background py-2 pr-3 pl-9 text-sm focus-visible:outline-accent"
        />
      </div>

      <div className="flex items-center gap-4 px-2 text-sm">
        <span className="text-muted">
          {t("Total:")} {" "}
          <strong className="font-medium text-foreground">
            {totalCount} {t("Languages")}
          </strong>
        </span>
        <span className="text-muted">
          {t("Supported:")} {" "}
          <strong className="font-medium text-accent">
            {supportedCount} {t("Supported")}
          </strong>
        </span>
      </div>
    </div>
  );
}
