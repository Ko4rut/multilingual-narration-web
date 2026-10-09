import type { navigation } from "@/constants/navigation";

/** Một mục điều hướng được suy ra trực tiếp từ cấu hình navigation. */
export type NavigationItem = (typeof navigation)[number]["items"][number];

/** Thuộc tính cần thiết để Sidebar render một liên kết điều hướng. */
export type SidebarNavigationItemProps = {
  item: NavigationItem;
  isActive: boolean;
  onNavigate: () => void;
};

/** Thông tin tài khoản tối thiểu được hiển thị ở footer của Sidebar. */
export type SidebarAccount = {
  fullName: string;
  email: string;
  initials: string;
};
