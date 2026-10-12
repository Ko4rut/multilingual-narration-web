import type { Role } from "../types/role.types";

export const MOCK_ROLES: readonly Role[] = [
  {
    id: "role-super-admin",
    name: "Super Administrator",
    created_at: "2026-01-05T08:00:00+07:00",
    last_updated_at: "2026-09-20T09:30:00+07:00",
  },
  {
    id: "role-content-admin",
    name: "Content Administrator",
    created_at: "2026-01-05T08:10:00+07:00",
    last_updated_at: "2026-09-18T14:15:00+07:00",
  },
  {
    id: "role-system-admin",
    name: "System Administrator",
    created_at: "2026-01-05T08:20:00+07:00",
    last_updated_at: "2026-08-11T10:45:00+07:00",
  },
  {
    id: "role-content-moderator",
    name: "Content Moderator",
    created_at: "2026-01-05T08:30:00+07:00",
    last_updated_at: null,
  },
];
