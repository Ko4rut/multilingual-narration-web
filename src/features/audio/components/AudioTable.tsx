"use client";

import { Music, ChevronLeft, ChevronRight, PlayCircle, Download, Trash2, Search } from "lucide-react";
import { AudioStatusBadge } from "./AudioStatusBadge";
import { Button } from "@/components/ui/button";
import { useAudioTable } from "../hooks/useAudioTable";
import type { AudioTableProps } from "../types";

export function AudioTable({ q, source, field, currentPage }: AudioTableProps) {
  const {
    t,
    totalItems,
    paginatedFiles,
    startIndex,
    endIndex,
    validPage,
    totalPages,
    paginationItems,
    handlePageChange,
    handlePrev,
    handleNext
  } = useAudioTable({ q, source, field, currentPage });

  if (totalItems === 0) {
    return (
      <div className="card bg-surface border-border p-16 text-center rounded-xl flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center mb-4">
           <Search className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-lg font-medium text-foreground">{t("No audio files found")}</h3>
        <p className="text-muted mt-2 text-sm max-w-75">
          {t("We couldn't find anything matching your current filters. Try adjusting your search query.")}
        </p>
      </div>
    );
  }

  return (
    <div className="card bg-surface border-border p-0 overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface border-b border-border text-muted font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 w-12"><input type="checkbox" className="w-4 h-4 rounded border-border bg-background accent-accent cursor-pointer" aria-label={t("Select all")} /></th>
              <th className="px-6 py-4">{t("Audio File")}</th>
              <th className="px-6 py-4">{t("Linked POI")}</th>
              <th className="px-6 py-4">{t("Language")}</th>
              <th className="px-6 py-4">{t("Source Type")}</th>
              <th className="px-6 py-4">{t("Duration")}</th>
              <th className="px-6 py-4">{t("Checksum")}</th>
              <th className="px-6 py-4">{t("Uploaded At")}</th>
              <th className="px-6 py-4">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedFiles.map(function renderRow(file) {
              return (
                <tr key={file.id} className="hover:bg-hover transition-colors">
                  <td className="px-6 py-4 w-12"><input type="checkbox" className="w-4 h-4 rounded border-border bg-background accent-accent cursor-pointer" aria-label={t("Select row")} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center text-accent"><Music className="w-4 h-4" /></div>
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-muted text-xs mt-0.5">{file.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">{file.poi}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-background border border-border text-xs font-medium">
                      <span className="bg-surface border border-border text-muted text-[10px] px-1 rounded-sm">{file.langCode}</span>
                      {file.lang}
                    </span>
                  </td>
                  <td className="px-6 py-4"><AudioStatusBadge type={file.type} /></td>
                  <td className="px-6 py-4 text-foreground">{file.duration}</td>
                  <td className="px-6 py-4 text-muted font-mono text-xs">{file.checksum}</td>
                  <td className="px-6 py-4 text-muted">{file.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="text-accent " title={t("Play")}><PlayCircle className="w-5 h-5" /></Button>
                      <Button variant="ghost" size="icon" className="text-muted " title={t("Download")}><Download className="w-5 h-5" /></Button>
                      <Button variant="ghost" size="icon" className="text-muted " title={t("Delete")}><Trash2 className="w-5 h-5" /></Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between px-6 py-4 border-t border-border text-sm text-muted">
        <div>{t("Showing")} {startIndex + 1}-{endIndex} {t("of")} {totalItems} {t("audio files")}</div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={handlePrev} disabled={validPage === 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {paginationItems.map(function renderPageBtn(item, index) {
            if (item === "...") {
              return <span key={`ellipsis-${index}`} className="px-1 text-muted tracking-widest">...</span>;
            }

            if (item === validPage) {
              return (
                <Button key={`page-${item}`} size="icon-sm" className="font-medium cursor-default">
                  {item}
                </Button>
              );
            }

            return (
              <Button key={`page-${item}`} variant="ghost" size="icon-sm" onClick={function() { handlePageChange(item as number); }}>
                {item}
              </Button>
            );
          })}

          <Button variant="ghost" size="icon-sm" onClick={handleNext} disabled={validPage === totalPages}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}