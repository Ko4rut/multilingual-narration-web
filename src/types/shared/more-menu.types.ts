/** Các callback hành động mà MoreMenu có thể cung cấp cho một bản ghi. */
export type MoreMenuProps = {
  onView?: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
};
