import type { ComponentProps, ReactNode } from "react";

/** Cấu hình một cột và cách DataTable đọc hoặc render dữ liệu của cột đó. */
export interface DataTableColumn<TData> {
  id: string;
  header: ReactNode;
  accessor?: keyof TData;
  cell?: (row: TData) => ReactNode;
  searchValue?: (row: TData) => string;
  className?: string;
  headerClassName?: string;
}

/** Một lựa chọn giá trị có thể xuất hiện trong bộ lọc DataTable. */
export interface DataTableFilterOption {
  label: string;
  value: string;
  description?: string;
}

/** Cấu hình bộ lọc và cách lấy giá trị lọc từ mỗi bản ghi. */
export interface DataTableFilter<TData> {
  id: string;
  label: string;
  options: readonly DataTableFilterOption[];
  getValue: (row: TData) => string | readonly string[];
  allLabel?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

/** Cấu hình cột đã được chuẩn hóa để DataTable lưu trong context dùng chung. */
export interface ResolvedDataTableColumn {
  id: string;
  header: ReactNode;
  accessor?: PropertyKey;
  cell?: (row: unknown) => ReactNode;
  className?: string;
  headerClassName?: string;
}

/** Cấu hình bộ lọc đã loại bỏ hàm đọc dữ liệu trước khi đưa vào context. */
export interface ResolvedDataTableFilter {
  id: string;
  label: string;
  options: readonly DataTableFilterOption[];
  allLabel?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

/** Một mục điều hướng được hiển thị dưới dạng số trang hoặc dấu rút gọn. */
export type DataTablePageItem = number | "ellipsis";

/** Trạng thái và hành động được chia sẻ cho các compound component của DataTable. */
export interface DataTableContextValue {
  columns: readonly ResolvedDataTableColumn[];
  filters: readonly ResolvedDataTableFilter[];
  paginatedData: readonly unknown[];
  filteredItemCount: number;
  filterValues: Record<string, string>;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  startIndex: number;
  startItem: number;
  endItem: number;
  pageItems: readonly DataTablePageItem[];
  canGoPrevious: boolean;
  canGoNext: boolean;
  allFiltersValue: string;
  getRowId: (row: unknown, index: number) => string;
  setSearchQuery: (value: string) => void;
  setFilterValue: (filterId: string, value: string) => void;
  setPageSize: (value: number) => void;
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

/** Thuộc tính gốc của DataTable và dữ liệu bảng cần điều phối. */
export interface DataTableProps<TData>
  extends Omit<ComponentProps<"section">, "children"> {
  data: readonly TData[];
  columns: readonly DataTableColumn<TData>[];
  getRowId?: (row: TData, index: number) => string;
  filters?: readonly DataTableFilter<TData>[];
  initialPageSize?: number;
  children: ReactNode;
}

/** Thuộc tính HTML được chuyển tiếp tới thanh công cụ của DataTable. */
export type DataTableToolbarProps = ComponentProps<"div">;

/** Thuộc tính HTML cho vùng chứa các hành động trên thanh công cụ. */
export type DataTableToolbarActionsProps = ComponentProps<"div">;

/** Thuộc tính HTML cho panel bao quanh nội dung DataTable. */
export type DataTablePanelProps = ComponentProps<"div">;

/** Thuộc tính ô tìm kiếm, ngoại trừ các giá trị do DataTable tự quản lý. */
export type DataTableSearchProps = Omit<
  ComponentProps<"input">,
  "type" | "value" | "onChange"
>;

/** Thuộc tính xác định bộ lọc mà control hiện tại đang điều khiển. */
export interface DataTableFilterProps {
  filterId: string;
  className?: string;
}

/** Thuộc tính của bộ lọc tìm kiếm dành cho tập lựa chọn lớn. */
export interface DataTableSearchableFilterProps {
  filter: ResolvedDataTableFilter;
  className?: string;
}

/** Thuộc tính HTML cho vùng chứa danh sách bộ lọc DataTable. */
export type DataTableFiltersProps = ComponentProps<"div">;

/** Thuộc tính cho vùng nội dung và thông báo khi bảng không có dữ liệu. */
export interface DataTableContentProps {
  emptyMessage?: string;
  className?: string;
}

/** Thuộc tính hiển thị và cấu hình phân trang của DataTable. */
export interface DataTablePaginationProps
  extends Omit<ComponentProps<"div">, "children"> {
  itemLabel?: string;
  pageSizeOptions?: readonly number[];
}

/** Dữ liệu đầu vào để hook DataTable điều phối tìm kiếm, lọc và phân trang. */
export interface UseDataTableOptions<TData> {
  data: readonly TData[];
  columns: readonly DataTableColumn<TData>[];
  filters: readonly DataTableFilter<TData>[];
  initialPageSize: number;
}
