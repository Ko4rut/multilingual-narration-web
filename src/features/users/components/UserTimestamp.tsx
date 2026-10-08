import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import type { UserTimestampProps } from "../types/user.types";

export function UserTimestamp({ value }: UserTimestampProps) {
  const { locale } = usePreferences();

  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}
