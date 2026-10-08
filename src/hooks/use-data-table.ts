"use client";

import { useMemo, useState } from "react";
import type {
  DataTableColumn,
  DataTableFilter,
  UseDataTableOptions,
} from "@/types/data-table";

const ALL_FILTERS = "__all__";

function getColumnValue<TData>(row: TData, column: DataTableColumn<TData>) {
  if (column.searchValue) {
    return column.searchValue(row);
  }

  if (column.accessor) {
    const value = row[column.accessor];
    if (Array.isArray(value)) {
      return value.join(" ");
    }
    return String(value ?? "");
  }

  return "";
}

function createInitialFilters<TData>(filters: readonly DataTableFilter<TData>[]) {
  return filters.reduce<Record<string, string>>(function addFilter(result, filter) {
    result[filter.id] = ALL_FILTERS;
    return result;
  }, {});
}

function createPageItems(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  const visiblePages: (number | "ellipsis")[] = [];

  if (totalPages <= 5) {
    for (let page = 1; page <= totalPages; page += 1) {
      visiblePages.push(page);
    }
    return visiblePages;
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage, "ellipsis", totalPages];
}

export function useDataTable<TData>({
  data,
  columns,
  filters,
  initialPageSize,
}: UseDataTableOptions<TData>) {
  const [searchQuery, setSearchQueryState] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    function initializeFilters() {
      return createInitialFilters(filters);
    },
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const filteredData = useMemo(function filterData() {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

    return data.filter(function filterRow(row) {
      const matchesFilters = filters.every(function matchFilter(filter) {
        const selectedValue = filterValues[filter.id] ?? ALL_FILTERS;
        if (selectedValue === ALL_FILTERS) {
          return true;
        }
        return filter.getValue(row) === selectedValue;
      });

      if (!matchesFilters) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return columns.some(function matchColumn(column) {
        return getColumnValue(row, column)
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      });
    });
  }, [columns, data, filterValues, filters, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
  let startItem = 0;
  if (filteredData.length > 0) {
    startItem = startIndex + 1;
  }
  const endItem = Math.min(startIndex + pageSize, filteredData.length);
  const pageItems = createPageItems(activePage, totalPages);

  function setSearchQuery(value: string) {
    setSearchQueryState(value);
    setCurrentPage(1);
  }

  function setFilterValue(filterId: string, value: string) {
    setFilterValues(function updateFilterValues(currentValues) {
      return { ...currentValues, [filterId]: value };
    });
    setCurrentPage(1);
  }

  function setPageSize(value: number) {
    setPageSizeState(value);
    setCurrentPage(1);
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
  }

  function goToPreviousPage() {
    goToPage(activePage - 1);
  }

  function goToNextPage() {
    goToPage(activePage + 1);
  }

  return {
    searchQuery,
    filterValues,
    filteredData,
    paginatedData,
    currentPage: activePage,
    pageSize,
    totalPages,
    startIndex,
    startItem,
    endItem,
    pageItems,
    canGoPrevious: activePage > 1,
    canGoNext: activePage < totalPages,
    allFiltersValue: ALL_FILTERS,
    setSearchQuery,
    setFilterValue,
    setPageSize,
    goToPage,
    goToPreviousPage,
    goToNextPage,
  };
}
