import React from "react";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { PoiContentItem } from "../types";
import { PoiContentStatusBadge } from "./PoiContentStatusBadge";

interface PoiContentTableProps {
  contents: PoiContentItem[];
  onEdit?: (item: PoiContentItem) => void;
  onMoreActions?: (item: PoiContentItem) => void;
}

export function PoiContentTable({
  contents,
  onEdit,
  onMoreActions,
}: PoiContentTableProps) {
  const { t } = usePreferences();

  return (
    <div className="w-full bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[980px]">
          <thead>
            <tr className="border-b border-border bg-[var(--hover)]/40 text-muted text-[11px] font-semibold tracking-wider uppercase">
              <th className="py-4 pl-4 pr-3">{t("Point of Interest")}</th>
              <th className="py-4 px-3">{t("Language")}</th>
              <th className="py-4 px-3">{t("Narration Title")}</th>
              <th className="py-4 px-3">{t("Content Status")}</th>
              <th className="py-4 px-3">{t("Created By")}</th>
              <th className="py-4 px-3">{t("Published At")}</th>
              <th className="py-4 pr-4 pl-2 text-right">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {contents.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p>{t("No content found matching your filters.")}</p>
                  </div>
                </td>
              </tr>
            )}

            {contents.map((item) => {
              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-[var(--hover)]/60"
                >
                  {/* Point of Interest */}
                  <td className="py-4 pl-4 pr-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.poi_image_url}
                        alt={item.poi_name}
                        className="w-10 h-10 rounded-lg object-cover bg-[var(--hover)] border border-border shrink-0"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate hover:text-accent cursor-pointer">
                          {item.poi_name}
                        </p>
                        <p className="text-xs text-muted truncate">
                          {item.poi_location}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Language */}
                  <td className="py-4 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--hover)] border border-border text-foreground">
                      <span className="text-[10px] font-bold uppercase text-muted tracking-wider">
                        {item.language_code}
                      </span>
                      <span>{item.language_name}</span>
                    </span>
                  </td>

                  {/* Narration Title */}
                  <td className="py-4 px-3">
                    <p className="font-medium text-foreground max-w-[220px] truncate" title={item.narration_title}>
                      {item.narration_title}
                    </p>
                  </td>

                  {/* Content Status */}
                  <td className="py-4 px-3">
                    <PoiContentStatusBadge status={item.content_status} />
                  </td>

                  {/* Created By */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.created_by_avatar}
                        alt={item.created_by_name}
                        className="w-6 h-6 rounded-full object-cover shrink-0 border border-border"
                        loading="lazy"
                      />
                      <span className="text-sm text-foreground truncate max-w-[120px]">
                        {item.created_by_name}
                      </span>
                    </div>
                  </td>

                  {/* Published At */}
                  <td className="py-4 px-3 text-muted text-xs whitespace-nowrap">
                    {item.published_at}
                  </td>

                  {/* Actions */}
                  <td className="py-4 pr-4 pl-2 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        type="button"
                        onClick={() => onEdit?.(item)}
                        className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-[var(--hover)] transition-colors cursor-pointer"
                        title={t("Edit POI")}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoreActions?.(item)}
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
