import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import type { LANGUAGE_STATUS } from "../constants/language.constants";

/** Trạng thái hỗ trợ ngôn ngữ được định nghĩa trong thiết kế cơ sở dữ liệu. */
export type LanguageStatus =
  (typeof LANGUAGE_STATUS)[keyof typeof LANGUAGE_STATUS];

/** Bản ghi ngôn ngữ dùng chung cho nội dung và gói dữ liệu ngoại tuyến. */
export interface Language {
  id: string;
  language_code: string;
  language_name: string;
  language_status: LanguageStatus;
}

/** Các chỉ số tổng hợp hiển thị ở đầu trang quản lý ngôn ngữ. */
export interface LanguagesOverviewSummary {
  totalLanguages: number;
  supportedLanguages: number;
  unsupportedLanguages: number;
  isoCodeLengths: number;
}

/** Thuộc tính bảng ngôn ngữ và các hành động trên từng bản ghi. */
export interface LanguagesTableProps {
  languages: readonly Language[];
  onViewLanguage: (language: Language) => void;
  onEditLanguage: (language: Language) => void;
  onToggleStatus: (language: Language) => void;
}

/** Thuộc tính Badge thể hiện trạng thái hỗ trợ ngôn ngữ. */
export interface LanguageStatusBadgeProps {
  status: LanguageStatus;
}

/** Thuộc tính Sheet dùng để thêm, xem và chỉnh sửa ngôn ngữ. */
export interface LanguageFormSheetProps {
  open: boolean;
  mode: FeatureFormMode;
  language: Language | null;
  errorMessage: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void;
  onEdit: () => void;
}
