import { LANGUAGE_STATUS } from "../constants/language.constants";
import type { Language } from "../types/language.types";

/** Dữ liệu mẫu bám sát các cột của bảng Languages. */
export const MOCK_LANGUAGES: Language[] = [
  {
    id: "language-en",
    language_code: "en",
    language_name: "English",
    language_status: LANGUAGE_STATUS.SUPPORTED,
  },
  {
    id: "language-vi",
    language_code: "vi",
    language_name: "Vietnamese",
    language_status: LANGUAGE_STATUS.SUPPORTED,
  },
  {
    id: "language-fr",
    language_code: "fr",
    language_name: "French",
    language_status: LANGUAGE_STATUS.SUPPORTED,
  },
  {
    id: "language-ja",
    language_code: "ja",
    language_name: "Japanese",
    language_status: LANGUAGE_STATUS.SUPPORTED,
  },
  {
    id: "language-zh",
    language_code: "zh",
    language_name: "Chinese",
    language_status: LANGUAGE_STATUS.SUPPORTED,
  },
  {
    id: "language-ko",
    language_code: "ko",
    language_name: "Korean",
    language_status: LANGUAGE_STATUS.SUPPORTED,
  },
  {
    id: "language-th",
    language_code: "th",
    language_name: "Thai",
    language_status: LANGUAGE_STATUS.SUPPORTED,
  },
  {
    id: "language-de",
    language_code: "de",
    language_name: "German",
    language_status: LANGUAGE_STATUS.UNSUPPORTED,
  },
  {
    id: "language-es",
    language_code: "es",
    language_name: "Spanish",
    language_status: LANGUAGE_STATUS.UNSUPPORTED,
  },
];

export const DEFAULT_MOCK_LANGUAGE_ID =
  MOCK_LANGUAGES.find(function findEnglishLanguage(language) {
    return language.language_code === "en";
  })?.id ?? "";
