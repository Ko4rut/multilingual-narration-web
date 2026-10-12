import type { RoleAction } from "../types/role.types";

export const MOCK_ACTIONS: readonly RoleAction[] = [
  { id: "acts-view", name: "View" },
  { id: "acts-add", name: "Add" },
  { id: "acts-edit", name: "Edit" },
  { id: "acts-delete", name: "Delete" },
  { id: "acts-publish", name: "Publish" },
  { id: "acts-approve", name: "Approve" },
];
