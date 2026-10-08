"use client";

import { useMemo, useState } from "react";

interface UsePoisPaginationOptions {
  totalItems: number;
  pageSize?: number;
  initialPage?: number;
}

export function usePoisPagination({
  totalItems,
  pageSize = 6,
  initialPage = 1,
}: UsePoisPaginationOptions) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Start item index for current page display
  const startItem = useMemo(() => {
    if (totalItems === 0) {
      return 0;
    }
    return (currentPage - 1) * pageSize + 1;
  }, [currentPage, pageSize, totalItems]);

  // End item index for current page display
  const endItem = useMemo(() => {
    return Math.min(currentPage * pageSize, totalItems);
  }, [currentPage, pageSize, totalItems]);

  // Page numbers array with ellipsis
  const pageNumbers = useMemo(() => {
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
  }, [currentPage, totalPages]);

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const goToPrevPage = () => {
    if (canPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (canNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    startItem,
    endItem,
    pageNumbers,
    canPrev,
    canNext,
    onPrevPage: goToPrevPage,
    onNextPage: goToNextPage,
    onPageChange: goToPage,
    setCurrentPage,
    resetPage,
  };
}
