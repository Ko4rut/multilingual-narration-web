export const ROLE_PRESENTATION: Readonly<
  Record<string, { description: string; indicatorClassName: string }>
> = {
  "role-super-admin": {
    description: "Full system access",
    indicatorClassName: "bg-destructive",
  },
  "role-content-admin": {
    description: "Manage POIs, content and audio",
    indicatorClassName: "bg-info",
  },
  "role-system-admin": {
    description: "Manage users, roles and system settings",
    indicatorClassName: "bg-success",
  },
  "role-content-moderator": {
    description: "Review and publish narration content",
    indicatorClassName: "bg-warning",
  },
};

export const DEFAULT_ROLE_PRESENTATION = {
  description: "Custom access role",
  indicatorClassName: "bg-primary",
} as const;
