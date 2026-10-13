import {
  LANGUAGE_CODE_PATTERN,
  LANGUAGE_STATUS,
} from "../constants/language.constants";
import type {
  Language,
  LanguagesOverviewSummary,
  LanguageStatus,
} from "../types/language.types";

/** Đọc một trường chuỗi từ FormData và loại bỏ khoảng trắng ở hai đầu. */
export function getLanguageFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

/** Chuẩn hóa mã ngôn ngữ về chữ thường để so sánh và lưu trữ nhất quán. */
export function normalizeLanguageCode(value: string) {
  return value.trim().toLocaleLowerCase();
}

/** Kiểm tra mã ngôn ngữ theo định dạng ISO 639 gồm hai hoặc ba chữ cái thường. */
export function isValidLanguageCode(value: string) {
  return LANGUAGE_CODE_PATTERN.test(value);
}

/** Trả về tên tiêu chuẩn ISO 639 tương ứng với độ dài mã ngôn ngữ. */
export function getLanguageIsoStandard(languageCode: string) {
  if (languageCode.length === 2) {
    return "ISO 639-1";
  }
  return "ISO 639-2";
}

/** Chuyển giá trị từ form thành trạng thái ngôn ngữ hợp lệ. */
export function parseLanguageStatus(value: string): LanguageStatus {
  if (value === LANGUAGE_STATUS.UNSUPPORTED) {
    return LANGUAGE_STATUS.UNSUPPORTED;
  }
  return LANGUAGE_STATUS.SUPPORTED;
}

/** Kiểm tra mã hoặc tên ngôn ngữ có trùng với bản ghi khác hay không. */
export function hasDuplicateLanguage(
  languages: readonly Language[],
  selectedLanguageId: string | null,
  languageCode: string,
  languageName: string,
) {
  const normalizedName = languageName.toLocaleLowerCase();

  return languages.some(function findDuplicateLanguage(language) {
    if (language.id === selectedLanguageId) {
      return false;
    }
    return (
      language.language_code.toLocaleLowerCase() === languageCode ||
      language.language_name.toLocaleLowerCase() === normalizedName
    );
  });
}

/** Tạo mã định danh ổn định từ mã ISO và tránh trùng dữ liệu hiện có. */
export function createLanguageId(
  languages: readonly Language[],
  languageCode: string,
) {
  const baseId = `language-${languageCode}`;
  let id = baseId;
  let sequence = 2;

  while (
    languages.some(function hasLanguage(candidate) {
      return candidate.id === id;
    })
  ) {
    id = `${baseId}-${sequence}`;
    sequence += 1;
  }

  return id;
}

/** Tổng hợp số ngôn ngữ theo trạng thái và độ dài mã ISO đang được sử dụng. */
export function createLanguagesOverviewSummary(
  languages: readonly Language[],
): LanguagesOverviewSummary {
  const supportedLanguages = languages.filter(
    function findSupportedLanguage(language) {
      return language.language_status === LANGUAGE_STATUS.SUPPORTED;
    },
  ).length;
  const isoCodeLengths = new Set(
    languages.map(function getIsoCodeLength(language) {
      return language.language_code.length;
    }),
  ).size;

  return {
    totalLanguages: languages.length,
    supportedLanguages,
    unsupportedLanguages: languages.length - supportedLanguages,
    isoCodeLengths,
  };
}
