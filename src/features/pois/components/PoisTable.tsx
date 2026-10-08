import React from "react";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import type { PointOfInterest } from "../types";
import { formatCoordinates } from "../utils";
import { PoisStatusBadge } from "./PoisStatusBadge";
import { PoiLanguageBadges } from "./PoiLanguageBadges";

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
                    <PoiLanguageBadges languages={poi.languages} />
                  </td>

                  {/* Daily Plays */}
                  <td className="py-4 px-4 font-semibold text-foreground">
                    {poi.daily_plays.toLocaleString(locale)}
                  </td>

                  {/* Matrix Status */}
                  <td className="py-4 px-4">
                    <PoisStatusBadge status={poi.status} />
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
