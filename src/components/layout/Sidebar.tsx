"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/constants/navigation";
import { Icon } from "@/components/ui/Icon";

export function Sidebar() {
  const pathname = usePathname();
  return <aside className="sidebar">
    <Link className="brand" href="/dashboard" aria-label="MANS home"><span className="brand-mark"><Icon name="mic" /></span><span><strong>MANS</strong><small>ENTERPRISE</small></span></Link>
    <nav aria-label="Main navigation">{navigation.map((group) => <div className="nav-group" key={group.label}><p className="nav-label">{group.label}</p>{group.items.map((item) => {
      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
      return <Link key={item.href} href={item.href} className={`nav-link${active ? " active" : ""}`} aria-current={active ? "page" : undefined}><Icon name={item.icon} /><span>{item.label}</span></Link>;
    })}</div>)}</nav>
    <div className="workspace-badge"><span className="avatar">M</span><div><strong>Demo workspace</strong><small>Sample data</small></div><span className="status-dot" /></div>
  </aside>;
}
