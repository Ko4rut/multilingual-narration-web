export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  DISABLED: "DISABLED",
} as const;

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: "Active",
  [USER_STATUS.DISABLED]: "Disabled",
} as const satisfies Record<
  (typeof USER_STATUS)[keyof typeof USER_STATUS],
  string
>;

export const USER_STATUS_OPTIONS = [
  {
    value: USER_STATUS.ACTIVE,
    label: USER_STATUS_LABELS[USER_STATUS.ACTIVE],
  },
  {
    value: USER_STATUS.DISABLED,
    label: USER_STATUS_LABELS[USER_STATUS.DISABLED],
  },
] as const;
