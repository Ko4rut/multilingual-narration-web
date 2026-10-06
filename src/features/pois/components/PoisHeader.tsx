import React from "react";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";

interface PoisHeaderProps {
  onAddClick?: () => void;
}

export function PoisHeader({ onAddClick }: PoisHeaderProps) {
  const { t } = usePreferences();

  return (
    <div className="page-header">
      <div>
        <h1>{t("Point of Interest Management")}</h1>
        <p>
          {t("Manage point of interest listings, GPS coordinates, geofence trigger radiuses, and automated audio assets.")}
        </p>
      </div>
      <div>
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-[var(--on-accent)] font-medium text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
          title={t("Add POI")}
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
          <span>{t("Add POI")}</span>
        </button>
      </div>
    </div>
  );
}
