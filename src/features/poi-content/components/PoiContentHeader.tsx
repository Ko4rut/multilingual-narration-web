import React from "react";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";

interface PoiContentHeaderProps {
  onAddClick?: () => void;
  onPeriodClick?: () => void;
}

export function PoiContentHeader({ onAddClick, onPeriodClick }: PoiContentHeaderProps) {
  const { t } = usePreferences();

  return (
    <div className="page-header">
      <div>
        <h1>{t("POIs Content Management")}</h1>
        <p>
          {t("Manage narration content for each Point of Interest across multiple languages")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Date Period Button */}
        <button
          type="button"
          onClick={onPeriodClick}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface border border-border text-foreground font-medium text-sm hover:bg-[var(--hover)] transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{t("Last 90 Days")}</span>
        </button>

        {/* Add New Content Button */}
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-[var(--on-accent)] font-medium text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
          title={t("Add New Content")}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>{t("Add New Content")}</span>
        </button>
      </div>
    </div>
  );
}
