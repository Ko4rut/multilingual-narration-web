import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import { LANGUAGE_STATUS_OPTIONS } from "../constants/language.constants";

/** Chuẩn bị nội dung dịch và lựa chọn trạng thái cho form ngôn ngữ. */
export function useLanguageFormSheet(mode: FeatureFormMode) {
  const { t } = usePreferences();
  let description = t("Create a language for narration content.");

  if (mode === "view") {
    description = t("Review the language and its content availability.");
  }
  if (mode === "edit") {
    description = t("Update the language and its content availability.");
  }

  const statusOptions = LANGUAGE_STATUS_OPTIONS.map(
    function createStatusOption(option) {
      return { value: option.value, label: t(option.label) };
    },
  );

  return { t, description, statusOptions };
}
