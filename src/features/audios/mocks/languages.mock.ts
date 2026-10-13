import { AUDIO_LANGUAGE_STATUS } from "../constants/audio.constants";
import type { AudioLanguage } from "../types/audio.types";

/** Dữ liệu Languages riêng của feature audio, bám sát bảng trong thiết kế CSDL. */
export const MOCK_AUDIO_LANGUAGES: AudioLanguage[] = [
  {
    id: "language-en",
    language_code: "en",
    language_name: "English",
    language_status: AUDIO_LANGUAGE_STATUS.SUPPORTED,
  },
  {
    id: "language-vi",
    language_code: "vi",
    language_name: "Vietnamese",
    language_status: AUDIO_LANGUAGE_STATUS.SUPPORTED,
  },
  {
    id: "language-fr",
    language_code: "fr",
    language_name: "French",
    language_status: AUDIO_LANGUAGE_STATUS.SUPPORTED,
  },
  {
    id: "language-ja",
    language_code: "ja",
    language_name: "Japanese",
    language_status: AUDIO_LANGUAGE_STATUS.SUPPORTED,
  },
  {
    id: "language-zh",
    language_code: "zh",
    language_name: "Chinese",
    language_status: AUDIO_LANGUAGE_STATUS.SUPPORTED,
  },
  {
    id: "language-ko",
    language_code: "ko",
    language_name: "Korean",
    language_status: AUDIO_LANGUAGE_STATUS.SUPPORTED,
  },
  {
    id: "language-th",
    language_code: "th",
    language_name: "Thai",
    language_status: AUDIO_LANGUAGE_STATUS.SUPPORTED,
  },
  {
    id: "language-de",
    language_code: "de",
    language_name: "German",
    language_status: AUDIO_LANGUAGE_STATUS.UNSUPPORTED,
  },
  {
    id: "language-es",
    language_code: "es",
    language_name: "Spanish",
    language_status: AUDIO_LANGUAGE_STATUS.UNSUPPORTED,
  },
];
