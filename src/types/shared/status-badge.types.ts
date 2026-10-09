/** @file Contract cho StatusBadge dùng chung giữa các feature. */
import type { ReactNode } from "react";

/** Các tone ngữ nghĩa mà StatusBadge hỗ trợ. */
export type StatusBadgeTone =
  | "success"
  | "warning"
  | "info"
  | "destructive"
  | "neutral";

/** Thuộc tính hiển thị của StatusBadge dùng chung. */
export type StatusBadgeProps = {
  label: ReactNode;
  tone?: StatusBadgeTone;
  pulse?: boolean;
  className?: string;
};
