import { LANGUAGE_STATUS } from "../constants/language.constants";
import type { LanguageStatus } from "../types/language.types";

export function parseLanguageSearchQuery(
  value: string | string[] | undefined,
): string {
  const val = Array.isArray(value) ? value[0] : value;
  return val || "";
}

export function parseLanguageStatus(
  value: string | string[] | undefined,
): LanguageStatus | "all" {
  const val = Array.isArray(value) ? value[0] : value;

  if (
    val === LANGUAGE_STATUS.SUPPORTED ||
    val === LANGUAGE_STATUS.UNSUPPORTED
  ) {
    return val;
  }
  return "all";
}

export function parseLanguagePage(
  value: string | string[] | undefined,
): number {
  const val = Array.isArray(value) ? value[0] : value;

  if (!val) {
    return 1;
  }

  const parsed = parseInt(val, 10);
  if (isNaN(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}
