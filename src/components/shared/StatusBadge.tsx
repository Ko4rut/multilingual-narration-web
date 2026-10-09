import { cva } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatusBadgeProps } from "@/types/shared/status-badge.types";

const statusBadgeVariants = cva("gap-2 font-medium", {
  variants: {
    tone: {
      success:
        "border-success/40 bg-success/15 text-success-emphasis",
      warning:
        "border-warning/40 bg-warning-bg text-warning",
      info:
        "border-info/40 bg-info/15 text-info",
      destructive:
        "border-destructive/50 bg-destructive/15 text-destructive-emphasis",
      neutral:
        "border-border bg-muted/40 text-foreground",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});

const statusDotVariants = cva("size-1.5 shrink-0 rounded-full", {
  variants: {
    tone: {
      success: "bg-success",
      warning: "bg-warning",
      info: "bg-info",
      destructive: "bg-destructive",
      neutral: "bg-muted-foreground",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});

/** Hiển thị trạng thái bằng nhãn, tone ngữ nghĩa và chấm màu tùy chọn pulse. */
export function StatusBadge({
  label,
  tone = "neutral",
  pulse = false,
  className,
}: StatusBadgeProps) {
  let dotClassName = statusDotVariants({ tone });

  if (pulse) {
    dotClassName = cn(dotClassName, "animate-pulse");
  }

  return (
    <Badge
      variant="outline"
      className={cn(statusBadgeVariants({ tone }), className)}
    >
      {/* Chấm màu biểu thị tone và có thể phát hiệu ứng pulse. */}
      <span className={dotClassName} aria-hidden="true" />
      {/* Nội dung nhãn trạng thái do feature cung cấp. */}
      {label}
    </Badge>
  );
}
