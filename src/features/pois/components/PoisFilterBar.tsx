import React from "react";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { Region } from "../types";

interface PoisFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  regions: Region[];
  selectedRegion: string;
  onRegionChange: (regionId: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onAdvancedFilterClick?: () => void;
}

export function PoisFilterBar({
  searchQuery,
  onSearchChange,
  regions,
  selectedRegion,
  onRegionChange,
  selectedStatus,
  onStatusChange,
  onAdvancedFilterClick,
}: PoisFilterBarProps) {
  const { t } = usePreferences();

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-5">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[280px]">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("Search POI name, landmark code, coordinates...")}
          className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-foreground"
            title={t("Clear search")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Region Filter */}
        <div className="relative min-w-[170px]">
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="all">{t("Region: All Locations")}</option>
            {regions.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {reg.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative min-w-[150px]">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="all">{t("Status: All Status")}</option>
            <option value="active">{t("Active")}</option>
            <option value="inactive">{t("Inactive")}</option>
            <option value="maintenance">{t("Maintenance")}</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Advanced Filters Button */}
        <button
          type="button"
          onClick={onAdvancedFilterClick}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-foreground hover:bg-[var(--hover)] active:scale-95 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span>{t("Advanced Filters")}</span>
        </button>
      </div>
    </div>
  );
}
