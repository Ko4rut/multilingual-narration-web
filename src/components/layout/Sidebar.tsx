"use client";

import { ChevronsUpDown, CircleUserRound, LogOut, Mic } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { navigation } from "@/constants/navigation";
import { logout } from "@/features/auth/actions";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import { useSidebarNavigation } from "@/hooks/use-sidebar-navigation";
import type { SidebarNavigationItemProps } from "@/types/sidebar";

/** Hiển thị một liên kết điều hướng và đánh dấu liên kết của trang hiện tại. */
function NavigationItem({ item, isActive, onNavigate }: SidebarNavigationItemProps) {
  const { t } = usePreferences();
  const NavigationGlyph = item.glyph;
  let ariaCurrent: "page" | undefined;

  if (isActive) {
    ariaCurrent = "page";
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={t(item.label)} size="sm" >
        <Link href={item.href} aria-current={ariaCurrent} onClick={onNavigate} >
          <NavigationGlyph aria-hidden="true" />
          <span>{t(item.label)}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/** Hiển thị nút mở hoặc đóng drawer sidebar trên màn hình di động. */
export function MobileSidebarTrigger() {
  const { t } = usePreferences();
  return <SidebarTrigger aria-label={t("Toggle sidebar")} className="mobile-sidebar-trigger"/>
}

/** Kết hợp phần thương hiệu, menu điều hướng và menu tài khoản của sidebar. */
export function Sidebar() {
  const { t } = usePreferences();
  const { closeMobileSidebar, isActive } = useSidebarNavigation();

  return (
    <ShadcnSidebar collapsible="icon" className="border-sidebar-border">

      {/* --- Sidebar Header --- */}
      <SidebarHeader className="min-w-0 flex-row items-center gap-1 p-2">
          <SidebarMenu className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <SidebarMenuItem className="flex h-12 min-w-0 items-center gap-2 px-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Mic aria-hidden="true" className="size-[18px]" />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <strong className="block truncate text-xs font-semibold text-sidebar-accent-foreground"> Multi Lingual Automatic Narration</strong>
                <small className="block truncate text-[9px] tracking-widest text-sidebar-foreground/60"> ENTERPRISE </small>
              </span>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarTrigger aria-label={t("Toggle sidebar")} className="shrink-0 text-sidebar-foreground group-data-[collapsible=icon]:mx-auto"/>
      </SidebarHeader>

      {/* --- Sidebar Content --- */}
      <SidebarContent className="gap-0">
        {/* renderNavigationGroup: hiển thị từng nhóm điều hướng theo cấu hình. */}
        {navigation.map(function renderNavigationGroup(group) {
          return (
            <SidebarGroup key={group.label} className="py-1.5">
              <SidebarGroupLabel className="px-2 text-[9px] uppercase tracking-wide text-sidebar-foreground/55">
                {t(group.label)}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* renderNavigationItem: hiển thị từng mục trong nhóm hiện tại. */}
                  {group.items.map(function renderNavigationItem(item) {
                    return (
                      <NavigationItem
                        key={item.href}
                        item={item}
                        isActive={isActive(item.href)}
                        onNavigate={closeMobileSidebar}
                      />
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {/* --- Sidebar Separator --- */}
      <SidebarSeparator className="mx-2! w-auto!" />

      {/* --- Sidebar Footer --- */}
      <SidebarFooter className="pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild >
                <SidebarMenuButton size="lg" tooltip={t("Demo workspace")} className="data-[state=open]:bg-sidebar-accent">
                  <Avatar>
                    <AvatarFallback className="bg-sidebar-accent text-[10px] font-semibold text-sidebar-accent-foreground"> AD </AvatarFallback>
                    <AvatarBadge className="bg-primary ring-sidebar" />
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left">
                    <strong className="block truncate text-xs font-medium text-sidebar-accent-foreground"> {t("Demo workspace")} </strong>
                    <small className="block truncate text-[9px] text-sidebar-foreground/60"> {t("Sample data")} </small>
                  </div>
                  <ChevronsUpDown className="ml-auto size-3.5 text-sidebar-foreground/60" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" onClick={closeMobileSidebar}>
                      <CircleUserRound /> {t("Profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <form action={logout}>
                    <DropdownMenuItem asChild variant="destructive">
                      <button type="submit" className="w-full">
                        <LogOut />
                        {t("Sign out")}
                      </button>
                    </DropdownMenuItem>
                  </form>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* --- Sidebar Rail --- */}
      <SidebarRail />
    </ShadcnSidebar>
  );
}
