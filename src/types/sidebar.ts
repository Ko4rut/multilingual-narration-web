import type { navigation } from "@/constants/navigation";

export type NavigationItem = (typeof navigation)[number]["items"][number];

export type SidebarNavigationItemProps = {
  item: NavigationItem;
  isActive: boolean;
  onNavigate: () => void;
};
