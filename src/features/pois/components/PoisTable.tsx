import React from "react";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import type { PointOfInterest, PoiStatus } from "../types";

interface PoisTableProps {
  pois: PointOfInterest[];
  selectedIds: string[];
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onEdit?: (poi: PointOfInterest) => void;
  onMoreActions?: (poi: PointOfInterest) => void;
}

export function PoisTable({
  pois,
  selectedIds,
  isAllSelected,
  onToggleSelectAll,
  onToggleSelectOne,
  onEdit,
  onMoreActions,
}: PoisTableProps) {
  const { t, locale } = usePreferences();

  // Format coordinates cleanly using clear if-else logic
  const formatCoordinates = (lat: number, lng: number) => {
    let latDirection = "N";
    if (lat < 0) {
      latDirection = "S";
    }

    let lngDirection = "E";
    if (lng < 0) {
      lngDirection = "W";
    }

    const latText = `${Math.abs(lat).toFixed(4)}° ${latDirection}`;
    const lngText = `${Math.abs(lng).toFixed(4)}° ${lngDirection}`;

    return `${latText}, ${lngText}`;
  };

  // Render status badge using clean switch-case and translations
  const renderStatusBadge = (status: PoiStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t("Active")}
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {t("Inactive")}
          </span>
        );
      case "maintenance":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            {t("Maintenance")}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="border-b border-border bg-[var(--hover)]/40 text-muted text-[11px] font-semibold tracking-wider uppercase">
              <th className="py-4 pl-4 pr-2 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all POIs on this page"
                  className="w-4 h-4 rounded border-border accent-accent bg-surface cursor-pointer"
                />
              </th>
              <th className="py-4 px-4">{t("Point of Interest")}</th>
              <th className="py-4 px-4">{t("Location & GPS")}</th>
              <th className="py-4 px-4">{t("Trigger Radius")}</th>
              <th className="py-4 px-4">{t("Languages")}</th>
              <th className="py-4 px-4">{t("Daily Plays")}</th>
              <th className="py-4 px-4">{t("Matrix Status")}</th>
              <th className="py-4 pr-4 pl-2 text-right">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {pois.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p>{t("No Points of Interest found matching your filters.")}</p>
                  </div>
                </td>
              </tr>
            )}

            {pois.map((poi) => {
              const isSelected = selectedIds.includes(poi.id);
              const displayLangs = poi.languages.slice(0, 5);
              const remainingLangsCount = poi.languages.length - 5;

              let rowClass = "transition-colors hover:bg-[var(--hover)]/60";
              if (isSelected) {
                rowClass = "transition-colors bg-[var(--selected)]/40 hover:bg-[var(--hover)]/60";
              }

              return (
                <tr key={poi.id} className={rowClass}>
                  {/* Checkbox */}
                  <td className="py-4 pl-4 pr-2 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectOne(poi.id)}
                      aria-label={`Select ${poi.poi_name}`}
                      className="w-4 h-4 rounded border-border accent-accent bg-surface cursor-pointer"
                    />
                  </td>

                  {/* Point of Interest */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={poi.image_url}
                        alt={poi.poi_name}
                        className="w-11 h-11 rounded-lg object-cover bg-[var(--hover)] border border-border shrink-0"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate hover:text-accent cursor-pointer">
                          {poi.poi_name}
                        </p>
                        <p className="font-mono text-xs text-accent tracking-tight truncate max-w-[210px]" title={poi.qr_code}>
                          {poi.qr_code}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Location & GPS */}
                  <td className="py-4 px-4">
                    <p className="font-medium text-foreground">{poi.region_name}</p>
                    <p className="text-xs text-muted font-mono mt-0.5">
                      {formatCoordinates(poi.latitude, poi.longitude)}
                    </p>
                  </td>

                  {/* Trigger Radius */}
                  <td className="py-4 px-4 font-semibold text-foreground">
                    {poi.trigger_radius} m
                  </td>

                  {/* Languages */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap items-center gap-1.5 max-w-[170px]">
                      {displayLangs.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded bg-[var(--hover)] border border-border text-muted"
                        >
                          {lang}
                        </span>
                      ))}
                      {remainingLangsCount > 0 && (
                        <span
                          className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded bg-accent/15 border border-accent/30 text-accent"
                          title={poi.languages.slice(5).join(", ")}
                        >
                          +{remainingLangsCount}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Daily Plays */}
                  <td className="py-4 px-4 font-semibold text-foreground">
                    {poi.daily_plays.toLocaleString(locale)}
                  </td>

                  {/* Matrix Status */}
                  <td className="py-4 px-4">
                    {renderStatusBadge(poi.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 pr-4 pl-2 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        type="button"
                        onClick={() => onEdit?.(poi)}
                        className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-[var(--hover)] transition-colors cursor-pointer"
                        title={t("Edit POI")}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoreActions?.(poi)}
                        className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-[var(--hover)] transition-colors cursor-pointer"
                        title={t("More Options")}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
