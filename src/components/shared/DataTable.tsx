"use client";

import {
  createContext,
  isValidElement,
  useContext,
  type ReactNode,
} from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RotateCcwIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { COMBOBOX_MATCH_TRIGGER_WIDTH_CLASS } from "@/constants/components";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { useDataTable } from "@/hooks/use-data-table";
import { cn } from "@/lib/utils";
import type {
  DataTableContextValue,
  DataTableContentProps,
  DataTableFilterOption,
  DataTableFilterProps,
  DataTableFiltersProps,
  DataTablePanelProps,
  DataTablePaginationProps,
  DataTableProps,
  DataTableSearchProps,
  DataTableSearchableFilterProps,
  DataTableToolbarActionsProps,
  DataTableToolbarProps,
  ResolvedDataTableColumn,
  ResolvedDataTableFilter,
} from "@/types/shared/data-table.types";

const DataTableContext = createContext<DataTableContextValue | null>(null);

/** Đọc trạng thái bảng dùng chung và bảo đảm component con nằm trong DataTable. */
function useDataTableContext() {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error("DataTable components must be used inside DataTable");
  }
  return context;
}

function renderCellValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground">—</span>;
  }

  if (Array.isArray(value)) {
    return (
      <div className="flex flex-col gap-1">
        {value.map(function renderLine(line, index) {
          return <span key={`${String(line)}-${index}`}>{String(line)}</span>;
        })}
      </div>
    );
  }

  if (isValidElement(value)) {
    return value;
  }

  return String(value);
}

function getCellContent(row: unknown, column: ResolvedDataTableColumn) {
  if (column.cell) {
    return column.cell(row);
  }

  if (column.accessor) {
    const record = Object(row) as Record<PropertyKey, unknown>;
    return renderCellValue(record[column.accessor]);
  }

  return <span className="text-muted-foreground">—</span>;
}

/** Cung cấp dữ liệu, cấu hình cột, bộ lọc và trạng thái phân trang cho toàn bộ bảng. */
function DataTable<TData>({
  data,
  columns,
  getRowId,
  selectedRowId,
  onRowClick,
  filters = [],
  initialPageSize = 10,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const table = useDataTable({ data, columns, filters, initialPageSize });
  const resolvedColumns =
    columns as unknown as readonly ResolvedDataTableColumn[];
  const resolvedFilters =
    filters as unknown as readonly ResolvedDataTableFilter[];

  function resolveRowId(row: unknown, index: number) {
    if (getRowId) {
      return getRowId(row as TData, index);
    }
    return String(index);
  }

  function handleRowClick(row: unknown) {
    onRowClick?.(row as TData);
  }

  let resolvedOnRowClick: ((row: unknown) => void) | undefined;
  if (onRowClick) {
    resolvedOnRowClick = handleRowClick;
  }

  const context: DataTableContextValue = {
    columns: resolvedColumns,
    filters: resolvedFilters,
    paginatedData: table.paginatedData,
    filteredItemCount: table.filteredData.length,
    filterValues: table.filterValues,
    searchQuery: table.searchQuery,
    currentPage: table.currentPage,
    pageSize: table.pageSize,
    startIndex: table.startIndex,
    startItem: table.startItem,
    endItem: table.endItem,
    pageItems: table.pageItems,
    canGoPrevious: table.canGoPrevious,
    canGoNext: table.canGoNext,
    hasActiveFilters: table.hasActiveFilters,
    allFiltersValue: table.allFiltersValue,
    selectedRowId,
    getRowId: resolveRowId,
    onRowClick: resolvedOnRowClick,
    setSearchQuery: table.setSearchQuery,
    setFilterValue: table.setFilterValue,
    resetFilters: table.resetFilters,
    setPageSize: table.setPageSize,
    goToPage: table.goToPage,
    goToPreviousPage: table.goToPreviousPage,
    goToNextPage: table.goToNextPage,
  };

  return (
    <DataTableContext.Provider value={context}>
      {/* Khung gốc để các thành phần compound của bảng dùng chung context. */}
      <section
        data-slot="data-table"
        className={cn("flex min-w-0 flex-col gap-4", className)}
        {...props}
      >
        {children}
      </section>
    </DataTableContext.Provider>
  );
}

/** Khu vực đầu bảng chứa tìm kiếm, bộ lọc và các hành động nghiệp vụ. */
function DataTableToolbar({
  className,
  ...props
}: DataTableToolbarProps) {
  return (
    <div
      data-slot="data-table-toolbar"
      className={cn(
        "flex flex-col gap-3 border-b border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
      {...props}
    />
  );
}

/** Khung bề mặt gom toolbar, nội dung bảng và phân trang thành một panel. */
function DataTablePanel({ className, ...props }: DataTablePanelProps) {
  return (
    <div
      data-slot="data-table-panel"
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

/** Nhóm các nút hành động nằm bên phải toolbar. */
function DataTableToolbarActions({
  className,
  ...props
}: DataTableToolbarActionsProps) {
  return (
    <div
      data-slot="data-table-toolbar-actions"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

/** Ô tìm kiếm đồng bộ trực tiếp với trạng thái lọc của DataTable. */
function DataTableSearch({
  className,
  placeholder = "Search...",
  ...props
}: DataTableSearchProps) {
  const { t } = usePreferences();
  const table = useDataTableContext();

  return (
    <div
      data-slot="data-table-search"
      className="relative w-full lg:max-w-md"
    >
      {/* Biểu tượng nhận diện chức năng tìm kiếm. */}
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      {/* Trường nhập từ khóa được điều khiển bởi context của bảng. */}
      <Input
        {...props}
        type="search"
        value={table.searchQuery}
        onChange={function handleSearchChange(event) {
          table.setSearchQuery(event.target.value);
        }}
        placeholder={t(placeholder)}
        aria-label={props["aria-label"] ?? t(placeholder)}
        className={cn(
          "pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden",
          className,
        )}
      />
      {/* Nút xóa nhanh chỉ xuất hiện khi đang có từ khóa. */}
      {table.searchQuery.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={function clearSearch() {
            table.setSearchQuery("");
          }}
          aria-label={t("Clear search")}
          className="absolute top-1/2 right-2 -translate-y-1/2"
        >
          <XIcon aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}

/** Bộ lọc lựa chọn cho một cấu hình filter được đăng ký trong DataTable. */
function DataTableFilter({ filterId, className }: DataTableFilterProps) {
  const { t } = usePreferences();
  const table = useDataTableContext();
  const filter = table.filters.find(function findFilter(candidate) {
    return candidate.id === filterId;
  });

  if (!filter) {
    return null;
  }

  if (filter.searchable) {
    return <DataTableSearchableFilter filter={filter} className={className} />;
  }

  const selectedValue =
    table.filterValues[filter.id] ?? table.allFiltersValue;

  return (
    <Select
      value={selectedValue}
      onValueChange={function handleFilterChange(value) {
        table.setFilterValue(filter.id, value);
      }}
    >
      {/* Nút mở bộ lọc và hiển thị giá trị hiện tại. */}
      <SelectTrigger
        data-slot="data-table-filter"
        aria-label={t(filter.label)}
        className={cn("min-w-40 bg-background", className)}
      >
        <SelectValue placeholder={t(filter.label)} />
      </SelectTrigger>
      {/* Danh sách gồm lựa chọn tất cả và các tùy chọn của bộ lọc. */}
      <SelectContent>
        <SelectItem value={table.allFiltersValue}>
          {t(filter.allLabel ?? `All ${filter.label}`)}
        </SelectItem>
        {filter.options.map(function renderFilterOption(option) {
          return (
            <SelectItem key={option.value} value={option.value}>
              {t(option.label)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

/** Bộ lọc Combobox cho tập lựa chọn lớn, hỗ trợ tìm theo nhãn hiển thị. */
function DataTableSearchableFilter({
  filter,
  className,
}: DataTableSearchableFilterProps) {
  const { t } = usePreferences();
  const table = useDataTableContext();
  const options: DataTableFilterOption[] = [
    {
      label: t(filter.allLabel ?? `All ${filter.label}`),
      value: table.allFiltersValue,
    },
    ...filter.options.map(function translateOption(option) {
      return {
        label: t(option.label),
        value: option.value,
        description: option.description,
      };
    }),
  ];
  const selectedValue = table.filterValues[filter.id] ?? table.allFiltersValue;
  const selectedOption = options.find(function findSelectedOption(option) {
    return option.value === selectedValue;
  });

  function handleValueChange(option: DataTableFilterOption | null) {
    let nextValue = table.allFiltersValue;

    if (option) {
      nextValue = option.value;
    }

    table.setFilterValue(filter.id, nextValue);
  }

  function getOptionLabel(option: DataTableFilterOption) {
    return option.label;
  }

  function getOptionSearchValue(option: DataTableFilterOption) {
    let searchValue = `${option.label} ${option.value}`;

    if (option.description) {
      searchValue = `${option.label} ${option.description}`;
    }

    return searchValue;
  }

  function renderOption(option: DataTableFilterOption) {
    return (
      <ComboboxItem
        key={option.value}
        value={option}
        className="items-start py-2 data-highlighted:bg-hover! data-highlighted:text-foreground!"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-medium text-foreground">
            {option.label}
          </span>
          {option.description && (
            <span className="truncate font-mono text-xs text-muted-foreground">
              {option.description}
            </span>
          )}
        </div>
      </ComboboxItem>
    );
  }

  return (
    <Combobox
      items={options}
      value={selectedOption ?? options[0]}
      onValueChange={handleValueChange}
      itemToStringLabel={getOptionLabel}
      itemToStringValue={getOptionSearchValue}
    >
      <ComboboxTrigger
        aria-label={t(filter.label)}
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "min-w-72 justify-between bg-background font-normal",
              className,
            )}
          />
        }
      >
        <span className="truncate">
          {selectedOption?.label ?? t(filter.label)}
        </span>
      </ComboboxTrigger>
      <ComboboxContent className={COMBOBOX_MATCH_TRIGGER_WIDTH_CLASS}>
        <ComboboxInput
          aria-label={t(filter.searchPlaceholder ?? filter.label)}
          placeholder={t(filter.searchPlaceholder ?? filter.label)}
          showTrigger={false}
          className="border-transparent! has-[[data-slot=input-group-control]:focus-visible]:border-transparent! has-[[data-slot=input-group-control]:focus-visible]:ring-0! [&_[data-slot=input-group-control]:focus-visible]:outline-none!"
        />
        <ComboboxEmpty>
          {t(filter.emptyMessage ?? "No results found.")}
        </ComboboxEmpty>
        <ComboboxList className="scrollbar-hidden">
          {renderOption}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

/** Tự động dựng toàn bộ bộ lọc đã khai báo trong cấu hình bảng. */
function DataTableFilters({
  className,
  ...props
}: DataTableFiltersProps) {
  const { t } = usePreferences();
  const table = useDataTableContext();

  return (
    <div
      data-slot="data-table-filters"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {table.filters.map(function renderFilter(filter) {
        return <DataTableFilter key={filter.id} filterId={filter.id} />;
      })}
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={!table.hasActiveFilters}
        onClick={table.resetFilters}
        aria-label={t("Reset filters")}
        title={t("Reset filters")}
        className="bg-background"
      >
        <RotateCcwIcon aria-hidden="true" />
      </Button>
    </div>
  );
}

/** Hiển thị header, các hàng dữ liệu của trang hiện tại và empty state. */
function DataTableContent({
  emptyMessage = "No results.",
  className,
}: DataTableContentProps) {
  const { t } = usePreferences();
  const table = useDataTableContext();

  return (
    <Table
      data-slot="data-table-content"
      className={cn("min-w-full", className)}
    >
      {/* Header được dựng từ cấu hình cột. */}
      <TableHeader className="bg-card">
        <TableRow className="hover:bg-transparent">
          {table.columns.map(function renderHeader(column) {
            return (
              <TableHead
                key={column.id}
                className={cn(
                  "h-11 px-4 text-xs font-semibold tracking-wide text-foreground uppercase dark:text-white",
                  column.headerClassName,
                )}
              >
                {column.header}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      {/* Body chứa empty state hoặc các hàng dữ liệu đã phân trang. */}
      <TableBody>
        {/* Trạng thái rỗng sau khi tìm kiếm hoặc lọc. */}
        {table.paginatedData.length === 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={Math.max(table.columns.length, 1)}
              className="h-32 px-4 text-center text-muted-foreground"
            >
              {t(emptyMessage)}
            </TableCell>
          </TableRow>
        )}
        {/* Các hàng dữ liệu của trang hiện tại. */}
        {table.paginatedData.map(function renderRow(row, rowIndex) {
          const rowId = table.getRowId(row, table.startIndex + rowIndex);
          let rowClassName = "";
          let rowTabIndex: number | undefined;
          if (table.onRowClick) {
            rowClassName =
              "cursor-pointer outline-none focus-visible:bg-hover focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";
            rowTabIndex = 0;
          }
          if (table.selectedRowId === rowId) {
            rowClassName = cn(rowClassName, "bg-selected hover:bg-selected");
          }

          return (
            <TableRow
              key={rowId}
              tabIndex={rowTabIndex}
              aria-selected={table.selectedRowId === rowId}
              className={rowClassName}
              onClick={function handleRowClick() {
                table.onRowClick?.(row);
              }}
              onKeyDown={function handleRowKeyDown(event) {
                if (event.key !== "Enter" && event.key !== " ") {
                  return;
                }
                event.preventDefault();
                table.onRowClick?.(row);
              }}
            >
              {table.columns.map(function renderCell(column) {
                return (
                  <TableCell
                    key={column.id}
                    className={cn(
                      "px-4 py-3 text-left align-middle whitespace-normal",
                      column.className,
                    )}
                  >
                    {getCellContent(row, column)}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

/** Hiển thị thống kê kết quả, chọn kích thước trang và điều hướng giữa các trang. */
function DataTablePagination({
  itemLabel = "items",
  pageSizeOptions = [10, 20, 50],
  className,
  ...props
}: DataTablePaginationProps) {
  const { t, locale } = usePreferences();
  const table = useDataTableContext();

  let previousTabIndex = -1;
  if (table.canGoPrevious) {
    previousTabIndex = 0;
  }

  let nextTabIndex = -1;
  if (table.canGoNext) {
    nextTabIndex = 0;
  }

  const showPageSizeSelector = pageSizeOptions.length > 1;

  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        "flex flex-col gap-4 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    >
      {/* Tóm tắt phạm vi bản ghi đang hiển thị. */}
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {t("Showing")} {table.startItem.toLocaleString(locale)}–
        {table.endItem.toLocaleString(locale)} {t("of")} {" "}
        {table.filteredItemCount.toLocaleString(locale)} {t(itemLabel)}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Bộ chọn số hàng trên mỗi trang khi có nhiều hơn một tùy chọn. */}
        {showPageSizeSelector && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t("Rows per page")}</span>
            <Select
              value={String(table.pageSize)}
              onValueChange={function handlePageSizeChange(value) {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger
                size="sm"
                aria-label={t("Rows per page")}
                className="w-18 bg-background"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {pageSizeOptions.map(function renderPageSize(option) {
                  return (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Điều hướng trang trước, số trang và trang kế tiếp. */}
        <Pagination className="mx-0 w-auto justify-start sm:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                href="#"
                aria-disabled={!table.canGoPrevious}
                aria-label={t("Previous page")}
                tabIndex={previousTabIndex}
                onClick={function handlePreviousPage(event) {
                  event.preventDefault();
                  table.goToPreviousPage();
                }}
                className={cn(
                  "size-8 gap-1 p-0 sm:w-auto sm:px-2.5",
                  !table.canGoPrevious && "pointer-events-none opacity-50",
                )}
              >
                <ChevronLeftIcon aria-hidden="true" />
                <span className="hidden sm:inline">{t("Previous")}</span>
              </PaginationLink>
            </PaginationItem>
            {table.pageItems.map(function renderPageItem(page, index) {
              if (page === "ellipsis") {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis className="size-8" />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === table.currentPage}
                    size="icon-sm"
                    onClick={function handlePageClick(event) {
                      event.preventDefault();
                      table.goToPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationLink
                href="#"
                aria-disabled={!table.canGoNext}
                aria-label={t("Next page")}
                tabIndex={nextTabIndex}
                onClick={function handleNextPage(event) {
                  event.preventDefault();
                  table.goToNextPage();
                }}
                className={cn(
                  "size-8 gap-1 p-0 sm:w-auto sm:px-2.5",
                  !table.canGoNext && "pointer-events-none opacity-50",
                )}
              >
                <span className="hidden sm:inline">{t("Next")}</span>
                <ChevronRightIcon aria-hidden="true" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export {
  DataTable,
  DataTableContent,
  DataTableFilter,
  DataTableFilters,
  DataTablePanel,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
  DataTableToolbarActions,
};
