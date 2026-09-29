"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/constants/navigation";
import { Icon } from "@/components/ui/Icon";

import { logout } from "@/features/auth/actions";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import { PreferenceControls } from "@/features/preferences/components/PreferenceControls";

export function Sidebar() {
  const { t } = usePreferences();
  const pathname = usePathname();
  return <aside className="sidebar">
    <Link className="brand" href="/dashboard" aria-label="MANS home"><span className="brand-mark"><Icon name="mic" /></span><span><strong>MANS</strong><small>ENTERPRISE</small></span></Link>
    <nav aria-label="Main navigation">{navigation.map((group) => <div className="nav-group" key={t(group.label)}><p className="nav-label">{t(group.label)}</p>{group.items.map((item) => {
      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
      return <Link key={item.href} href={item.href} className={`nav-link${active ? " active" : ""}`} aria-current={active ? "page" : undefined}><Icon name={item.icon} /><span>{t(item.label)}</span></Link>;
    })}</div>)}</nav>
    <div className="workspace-badge"><span className="avatar">M</span><div><strong>{t("Demo workspace")}</strong><small>{t("Sample data")}</small></div><span className="status-dot" /></div>
    <PreferenceControls />
    <form action={logout}><button className="button" type="submit">{t("Sign out")}</button></form>
  </aside>;
}
