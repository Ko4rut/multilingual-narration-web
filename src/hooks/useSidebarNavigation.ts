"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

export function useSidebarNavigation() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMobileSidebar() {
    setOpenMobile(false);
  }

  return { closeMobileSidebar, isActive };
}
