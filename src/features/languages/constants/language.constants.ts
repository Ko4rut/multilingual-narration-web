export const LANGUAGE_STATUS = {
  SUPPORTED: "SUPPORTED",
  UNSUPPORTED: "UNSUPPORTED",
} as const;

export const LANGUAGE_STATUS_LABELS = {
  [LANGUAGE_STATUS.SUPPORTED]: "Supported",
  [LANGUAGE_STATUS.UNSUPPORTED]: "Unsupported",
} as const satisfies Record<
  (typeof LANGUAGE_STATUS)[keyof typeof LANGUAGE_STATUS],
  string
>;

export const LANGUAGE_ITEMS_PER_PAGE = 10;
