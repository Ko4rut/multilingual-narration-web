import type { LANGUAGE_STATUS } from "../constants/language.constants";

/** Tập giá trị trạng thái hợp lệ của ngôn ngữ trong feature POI content. */
export type LanguageStatus =
  (typeof LANGUAGE_STATUS)[keyof typeof LANGUAGE_STATUS];

/** Bản ghi Languages được POI content sử dụng làm dữ liệu tham chiếu. */
export interface Language {
  id: string;
  language_code: string;
  language_name: string;
  language_status: LanguageStatus;
}
