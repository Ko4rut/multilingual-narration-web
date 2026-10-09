import type { ComponentProps, ReactNode } from "react";

/** Thuộc tính HTML được chuyển tiếp tới vùng gốc của PageLayout. */
export type PageLayoutProps = ComponentProps<"section">;

/** Thuộc tính tiêu đề, mô tả và HTML attributes của header trang. */
export type PageLayoutHeaderProps = Omit<
  ComponentProps<"header">,
  "title"
> & {
  title: string;
  description?: string;
};

/** Thuộc tính HTML được chuyển tiếp tới vùng nội dung chính của trang. */
export type PageLayoutContentProps = ComponentProps<"div">;

/** Thuộc tính HTML được chuyển tiếp tới vùng tổng quan của trang. */
export type PageLayoutOverviewProps = ComponentProps<"section">;

/** Thuộc tính của một chỉ số tổng quan gồm nhãn, giá trị và icon tùy chọn. */
export type PageLayoutStatProps = Omit<
  ComponentProps<"div">,
  "children"
> & {
  label: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
  iconClassName?: string;
};
