import type { ProfileLanguageOption } from "../types/profile.types";

export const PROFILE_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "vi", label: "Tiếng Việt" },
] as const satisfies readonly ProfileLanguageOption[];
