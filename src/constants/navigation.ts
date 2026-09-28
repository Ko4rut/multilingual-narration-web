export const navigation = [
  { label: "Overview", items: [{ href: "/dashboard", label: "Dashboard", icon: "grid" }] },
  { label: "Content", items: [
    { href: "/pois", label: "POI Management", icon: "pin" },
    { href: "/poi-content", label: "POIs Content Management", icon: "file" },
    { href: "/audio", label: "Audio Management", icon: "audio" },
  ] },
  { label: "System", items: [
    { href: "/users", label: "User Management", icon: "users" },
    { href: "/roles", label: "Role-Based Access", icon: "shield" },
    { href: "/languages", label: "Language Management", icon: "language" },
  ] },
  { label: "Settings", items: [{ href: "/settings", label: "General Settings", icon: "settings" }] },
] as const;
