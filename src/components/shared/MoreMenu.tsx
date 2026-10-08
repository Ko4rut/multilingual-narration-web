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
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import type { MoreMenuProps } from "@/types/components";

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
