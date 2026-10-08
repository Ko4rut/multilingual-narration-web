import type { ComponentProps, ReactNode } from "react";

export interface DataTableColumn<TData> {
  id: string;
  header: ReactNode;
  accessor?: keyof TData;
  cell?: (row: TData) => ReactNode;
  searchValue?: (row: TData) => string;
  className?: string;
  headerClassName?: string;
}

export interface DataTableFilterOption {
  label: string;
  value: string;
}

export interface DataTableFilter<TData> {
  id: string;
  label: string;
  options: readonly DataTableFilterOption[];
  getValue: (row: TData) => string;
  allLabel?: string;
}

export interface DataTableProps<TData>
  extends Omit<ComponentProps<"section">, "children"> {
  data: readonly TData[];
  columns: readonly DataTableColumn<TData>[];
  getRowId?: (row: TData, index: number) => string;
  filters?: readonly DataTableFilter<TData>[];
  initialPageSize?: number;
  children: ReactNode;
}

export type DataTableToolbarProps = ComponentProps<"div">;

export type DataTableToolbarActionsProps = ComponentProps<"div">;

export type DataTablePanelProps = ComponentProps<"div">;

export type DataTableSearchProps = Omit<
  ComponentProps<"input">,
  "type" | "value" | "onChange"
>;

export interface DataTableFilterProps {
  filterId: string;
  className?: string;
}

export type DataTableFiltersProps = ComponentProps<"div">;

export interface DataTableContentProps {
  emptyMessage?: string;
  className?: string;
}

export interface DataTablePaginationProps
  extends Omit<ComponentProps<"div">, "children"> {
  itemLabel?: string;
  pageSizeOptions?: readonly number[];
}

export interface UseDataTableOptions<TData> {
  data: readonly TData[];
  columns: readonly DataTableColumn<TData>[];
  filters: readonly DataTableFilter<TData>[];
  initialPageSize: number;
}
