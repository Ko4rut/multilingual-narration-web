export const POI_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export const POI_STATUS_LABELS = {
  [POI_STATUS.ACTIVE]: "Active",
  [POI_STATUS.INACTIVE]: "Inactive",
} as const satisfies Record<(typeof POI_STATUS)[keyof typeof POI_STATUS], string>;

export const POI_STATUS_OPTIONS = [
  {
    value: POI_STATUS.ACTIVE,
    label: POI_STATUS_LABELS[POI_STATUS.ACTIVE],
  },
  {
    value: POI_STATUS.INACTIVE,
    label: POI_STATUS_LABELS[POI_STATUS.INACTIVE],
  },
] as const;

export const DEFAULT_POI_IMAGE_URL = "/icon.svg";
export const DEFAULT_MANAGEMENT_USER_ID = "user-010126-0001";
