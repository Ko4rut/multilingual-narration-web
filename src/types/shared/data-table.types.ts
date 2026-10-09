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
}

/** Cấu hình bộ lọc và cách lấy giá trị lọc từ mỗi bản ghi. */
export interface DataTableFilter<TData> {
  id: string;
  label: string;
  options: readonly DataTableFilterOption[];
  getValue: (row: TData) => string;
  allLabel?: string;
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
