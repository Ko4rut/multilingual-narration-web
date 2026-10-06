import {
  AudioLines,
  Files,
  Languages,
  LayoutDashboard,
  MapPin,
  Settings,
  ShieldCheck,
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
  { label: "System", items: [
    { href: "/users", label: "User Management", glyph: Users },
    { href: "/roles", label: "Access Control", glyph: ShieldCheck },
    { href: "/languages", label: "Language Management", glyph: Languages },
  ] },
  { label: "Settings", items: [{ href: "/settings", label: "General Settings", glyph: Settings }] },
] as const;
