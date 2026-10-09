"use client";

import { Copy, Ellipsis, Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { MoreMenuProps } from "@/types/shared/more-menu.types";

/**
 * Menu thao tác nhanh cho một bản ghi.
 * Chỉ hiển thị những hành động đã được truyền callback tương ứng.
 */
export function MoreMenu({
  onView,
  onEdit,
  onCopy,
  onDelete,
}: MoreMenuProps) {
  const { t } = usePreferences();

  return (
    <DropdownMenu>
      {/* Nút ba chấm dùng để mở menu hành động. */}
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t("Open menu")}
        >
          <Ellipsis aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      {/* Danh sách chỉ render những hành động có callback tương ứng. */}
      <DropdownMenuContent align="end" className="w-36">
        {onView && (
          <DropdownMenuItem
            onClick={onView}
            className="text-foreground focus:bg-secondary focus:text-foreground [&_svg]:text-foreground!"
          >
            <Eye aria-hidden="true" />
            {t("View")}
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem
            onClick={onEdit}
            className="text-foreground focus:bg-secondary focus:text-foreground [&_svg]:text-foreground!"
          >
            <Pencil aria-hidden="true" />
            {t("Edit")}
          </DropdownMenuItem>
        )}
        {onCopy && (
          <DropdownMenuItem
            onClick={onCopy}
            className="text-foreground focus:bg-secondary focus:text-foreground [&_svg]:text-foreground!"
          >
            <Copy aria-hidden="true" />
            {t("Copy ID")}
          </DropdownMenuItem>
        )}
        {/* Phân tách hành động xóa có tính phá hủy khỏi các hành động thường. */}
        {onDelete && <DropdownMenuSeparator />}
        {onDelete && (
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 aria-hidden="true" />
            {t("Delete")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
