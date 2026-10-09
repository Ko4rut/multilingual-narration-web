"use client";

import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  PageLayoutContentProps,
  PageLayoutHeaderProps,
  PageLayoutOverviewProps,
  PageLayoutProps,
  PageLayoutStatProps,
} from "@/types/shared/page-layout.types";

/** Khung bố cục dọc chuẩn cho các trang trong khu vực quản trị. */
function PageLayout({ className, ...props }: PageLayoutProps) {
  return (
    <section
      data-slot="page-layout"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-6",
        className,
      )}
      {...props}
    />
  );
}

/** Header trang gồm tiêu đề, mô tả tùy chọn và vùng hành động bên phải. */
function PageLayoutHeader({
  title,
  description,
  children,
  className,
  ...props
}: PageLayoutHeaderProps) {
  const { t } = usePreferences();

  return (
    <header
      data-slot="page-layout-header"
      className={cn(
        "flex shrink-0 flex-col gap-8 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    >
      {/* Khối nhận diện trang với tiêu đề và mô tả. */}
      <div className="flex min-w-0 flex-col gap-2">
        <h1>{t(title)}</h1>
        {description && (
          <p className="text-xs tracking-[0.2px] text-muted-foreground">
            {t(description)}
          </p>
        )}
      </div>
      {/* Vùng hành động tùy chọn như nút tạo mới hoặc export. */}
      {children && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {children}
        </div>
      )}
    </header>
  );
}

/** Vùng nội dung chính bảo đảm chiều rộng co giãn an toàn trong layout. */
function PageLayoutContent({
  children,
  className,
  ...props
}: PageLayoutContentProps) {
  return (
    <div
      data-slot="page-layout-content"
      className={cn("min-w-0 pb-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/** Lưới responsive chứa các thẻ thống kê tổng quan của trang. */
function PageLayoutOverview({
  className,
  ...props
}: PageLayoutOverviewProps) {
  return (
    <section
      data-slot="page-layout-overview"
      className={cn(
        "grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
      {...props}
    />
  );
}

/** Thẻ thống kê hiển thị nhãn, giá trị, mô tả và biểu tượng tùy chọn. */
function PageLayoutStat({
  label,
  value,
  description,
  icon,
  iconClassName,
  className,
  ...props
}: PageLayoutStatProps) {
  const { t } = usePreferences();

  return (
    <Card
      data-slot="page-layout-stat"
      className={cn("gap-0 py-0", className)}
      {...props}
    >
      <CardContent className="flex min-h-24 items-center justify-between gap-4 p-4">
        {/* Nội dung văn bản của chỉ số thống kê. */}
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {t(label)}
          </p>
          <p className="text-2xl leading-none font-semibold text-card-foreground">
            {value}
          </p>
          {description && (
            <p className="text-[10px] text-muted-foreground">
              {t(description)}
            </p>
          )}
        </div>
        {/* Biểu tượng minh họa tùy chọn của chỉ số. */}
        {icon && (
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4",
              iconClassName,
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutOverview,
  PageLayoutStat,
};
