import type { ManagementFunction } from "../types/role.types";

export const MOCK_MANAGEMENT_FUNCTIONS: readonly ManagementFunction[] = [
  { id: "func-dashboard", name: "Dashboard" },
  { id: "func-pois", name: "POI Management" },
  { id: "func-poi-content", name: "POIs Content Management" },
  { id: "func-audio", name: "Audio Management" },
  { id: "func-users", name: "User Management" },
  { id: "func-roles", name: "Role-Based Access" },
  { id: "func-languages", name: "Language Management" },
  { id: "func-settings", name: "General Settings" },
];
