import type { DataTableFilterOption } from "@/types/shared/data-table.types";

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

export const LANGUAGE_STATUS_OPTIONS: readonly DataTableFilterOption[] = [
  {
    value: LANGUAGE_STATUS.SUPPORTED,
    label: LANGUAGE_STATUS_LABELS[LANGUAGE_STATUS.SUPPORTED],
  },
  {
    value: LANGUAGE_STATUS.UNSUPPORTED,
    label: LANGUAGE_STATUS_LABELS[LANGUAGE_STATUS.UNSUPPORTED],
  },
];

export const LANGUAGE_CODE_PATTERN = /^[a-z]{2,3}$/;
