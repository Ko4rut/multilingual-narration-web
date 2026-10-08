import React from "react";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";

interface PoisPaginationProps {
  currentPage: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  pageNumbers: (number | string)[];
  canPrev: boolean;
  canNext: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
}

export function PoisPagination({
  currentPage,
  totalItems,
  startItem,
  endItem,
  pageNumbers,
  canPrev,
  canNext,
  onPrevPage,
  onNextPage,
  onPageChange,
}: PoisPaginationProps) {
  const { t, locale } = usePreferences();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 text-sm">
      {/* Items Count */}
      <p className="text-muted text-xs">
        {t("Showing")} <span className="font-semibold text-foreground">{startItem}-{endItem}</span> {t("of")}{" "}
        <span className="font-semibold text-foreground">{totalItems.toLocaleString(locale)}</span> {t("POIs")}
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={onPrevPage}
          disabled={!canPrev}
          className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-[var(--hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, idx) => {
          if (page === "...") {
            return (
              <span key={`dots-${idx}`} className="px-2 py-1 text-xs text-muted">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          let buttonStyle = "border border-border text-muted hover:text-foreground hover:bg-[var(--hover)]";
          if (isActive) {
            buttonStyle = "bg-accent text-[var(--on-accent)] font-semibold shadow-sm";
          }

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${buttonStyle}`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={onNextPage}
          disabled={!canNext}
          className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-[var(--hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
