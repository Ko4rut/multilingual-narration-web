import {
  AudioLines,
  Files,
  Languages,
  LayoutDashboard,
  Map,
  MapPin,
  Settings,
  ShieldCheck,
  Tags,
  Users,
} from "lucide-react";

export const navigation = [
  { label: "Overview", items: [
    { href: "/dashboard", label: "Dashboard", glyph: LayoutDashboard }
  ] },
  { label: "Content", items: [
    { href: "/pois", label: "POI Management", glyph: MapPin },
    { href: "/poi-content", label: "POIs Content Management", glyph: Files },
    { href: "/audio", label: "Audio Management", glyph: AudioLines },
  ] },
  { label: "Catalog", items: [
    { href: "/languages", label: "Language Management", glyph: Languages },
    { href: "/regions", label: "Regions", glyph: Map },
    { href: "/poi-categories", label: "POI Categories", glyph: Tags },
  ] },
  { label: "System", items: [
    { href: "/users", label: "User Management", glyph: Users },
    { href: "/roles", label: "Access Control", glyph: ShieldCheck },
  ] },
  { label: "Settings", items: [{ href: "/settings", label: "General Settings", glyph: Settings }] },
] as const;
