"use client";

import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
} from "@/components/shared/FeatureFormSheet";
import { Input } from "@/components/ui/input";
import { LANGUAGE_STATUS } from "../constants/language.constants";
import { useLanguageFormSheet } from "../hooks/use-language-form-sheet";
import type { LanguageFormSheetProps } from "../types/language.types";

/** Form dùng chung cho thao tác tạo, xem và cập nhật ngôn ngữ. */
export function LanguageFormSheet({
  open,
  mode,
  language,
  errorMessage,
  onOpenChange,
  onSubmit,
  onEdit,
}: LanguageFormSheetProps) {
  const { t, description, statusOptions } = useLanguageFormSheet(mode);
  const isViewMode = mode === "view";

  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel={t("Language")}
      description={description}
      onSubmit={onSubmit}
      canEdit={isViewMode}
      onEdit={onEdit}
    >
      <FormField label={t("Language name")} htmlFor="language-name" required>
        <Input
          id="language-name"
          name="language_name"
          defaultValue={language?.language_name ?? ""}
          placeholder={t("Enter language name")}
          disabled={isViewMode}
          required
        />
      </FormField>

      <FormField
        label={t("ISO language code")}
        htmlFor="language-code"
        hint={t("Use a lowercase 2- or 3-letter ISO 639 code.")}
        required
      >
        <Input
          id="language-code"
          name="language_code"
          defaultValue={language?.language_code ?? ""}
          placeholder="en"
          minLength={2}
          maxLength={3}
          pattern="[a-z]{2,3}"
          autoCapitalize="none"
          spellCheck={false}
          className="font-mono lowercase"
          disabled={isViewMode}
          required
        />
      </FormField>

      <FormField
        label={t("Status")}
        htmlFor="language-status"
        hint={t("Unsupported languages keep historical data but cannot be used for new content.")}
        required
      >
        <FormCombobox
          id="language-status"
          name="language_status"
          options={statusOptions}
          defaultValue={language?.language_status ?? LANGUAGE_STATUS.SUPPORTED}
          placeholder="Select a status"
          disabled={isViewMode}
          required
        />
      </FormField>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"
        >
          {t(errorMessage)}
        </p>
      )}
    </FeatureFormSheet>
  );
}
