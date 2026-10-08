export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  DISABLED: "DISABLED",
} as const;

export const USER_ROLE = {
  SUPER_ADMIN: "role-super-admin",
  CONTENT_MANAGER: "role-content-manager",
  AUDIO_EDITOR: "role-audio-editor",
  VIEWER: "role-viewer",
} as const;

export const USER_STATUS_OPTIONS = [
  { value: USER_STATUS.ACTIVE, label: "Active" },
  { value: USER_STATUS.DISABLED, label: "Disabled" },
] as const;

export const USER_ROLE_OPTIONS = [
  { value: USER_ROLE.SUPER_ADMIN, label: "Super Admin" },
  { value: USER_ROLE.CONTENT_MANAGER, label: "Content Manager" },
  { value: USER_ROLE.AUDIO_EDITOR, label: "Audio Editor" },
  { value: USER_ROLE.VIEWER, label: "Viewer" },
] as const;

export const USER_ROLE_LABELS: Readonly<Record<string, string>> = {
  [USER_ROLE.SUPER_ADMIN]: "Super Admin",
  [USER_ROLE.CONTENT_MANAGER]: "Content Manager",
  [USER_ROLE.AUDIO_EDITOR]: "Audio Editor",
  [USER_ROLE.VIEWER]: "Viewer",
};
