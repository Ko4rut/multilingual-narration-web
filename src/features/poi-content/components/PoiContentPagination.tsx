import React from "react";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";

interface PoiContentPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function PoiContentPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PoiContentPaginationProps) {
  const { t, locale } = usePreferences();

  // Calculate start item number clearly
  let startItem = (currentPage - 1) * pageSize + 1;
  if (totalItems === 0) {
    startItem = 0;
  }

  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis without complex nested logic
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
      return pages;
    }

    if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      return pages;
    }

    pages.push(1, "...", currentPage, "...", totalPages);
    return pages;
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 text-sm">
      {/* Items Count */}
      <p className="text-muted text-xs">
        {t("Showing")} <span className="font-semibold text-foreground">{startItem}-{endItem}</span> {t("of")}{" "}
        <span className="font-semibold text-foreground">{totalItems.toLocaleString(locale)}</span> {t("contents")}
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:bg-[var(--hover)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, idx) => {
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
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
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
