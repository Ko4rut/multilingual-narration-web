import type { Period } from "../types";

export function parsePeriod(value: string | string[] | undefined): Period {
  if (value === "7" || value === "90") {
    return value;
  }

  return "30";
}
