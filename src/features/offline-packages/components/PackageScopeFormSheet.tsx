"use client";

/** Đăng ký phạm vi mới; không sửa trực tiếp category của package đã publish. */
import { Button } from "@/components/ui/button";
import { FeatureFormSheet, FormCombobox, FormField } from "@/components/shared/FeatureFormSheet";
import { usePreferences } from "@/features/settings/hooks/use-preferences";

import type { PackageScopeFormSheetProps } from "../types";
import { NO_CATEGORY_SCOPE } from "../utils";

export function PackageScopeFormSheet({
  open,
  isSaving,
  errorMessage,
  regions,
  languages,
  categories,
  onOpenChange,
  onSubmit,
}: PackageScopeFormSheetProps) {
  const { t } = usePreferences();
  const regionOptions = regions.map(function regionOption(region) {
    return { value: region.id, label: region.region_name };
  });
  const languageOptions = languages
    .filter(function supportedLanguage(language) {
      return language.language_status === "SUPPORTED";
    })
    .map(function languageOption(language) {
      return { value: language.id, label: language.language_name };
    });
  const categoryOptions = [
    { value: NO_CATEGORY_SCOPE, label: t("All POI categories (base scope)") },
    ...categories.map(function categoryOption(category) {
      return { value: category.id, label: category.category_name };
    }),
  ];

  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode="create"
      entityLabel={t("Package scope")}
      description={t("Choose the Region, Language and optional Category for a new package scope.")}
      onSubmit={onSubmit}
      footer={
        <div className="flex w-full justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={function closeForm() { onOpenChange(false); }}
            disabled={isSaving}
          >
            {t("Cancel")}
          </Button>
          <Button type="submit" disabled={isSaving || regions.length === 0 || languageOptions.length === 0}>
            {isSaving && t("Registering...")}
            {!isSaving && t("Register scope")}
          </Button>
        </div>
      }
    >
      <FormField
        label={t("Region")}
        htmlFor="offline-scope-region"
        required
      >
        <FormCombobox
          id="offline-scope-region"
          name="region_id"
          options={regionOptions}
          required
          placeholder="Select a region"
        />
      </FormField>
      <FormField
        label={t("Language")}
        htmlFor="offline-scope-language"
        required
      >
        <FormCombobox
          id="offline-scope-language"
          name="language_id"
          options={languageOptions}
          required
          placeholder="Select a language"
        />
      </FormField>
      <FormField
        label={t("POI Category")}
        htmlFor="offline-scope-category"
        hint={t("Select a specific category to create a scoped package, or leave the base scope.")}
      >
        <FormCombobox
          id="offline-scope-category"
          name="category_id"
          options={categoryOptions}
          defaultValue={NO_CATEGORY_SCOPE}
          placeholder="All POI categories (base scope)"
        />
      </FormField>
      <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
        {t("The Backend worker builds and publishes packages automatically. Existing published packages cannot be recategorized.")}
      </div>
      <p className="text-xs text-muted-foreground">
        {t("Scope registration requires the Backend API. If it is not installed yet, the request will be rejected without changing data.")}
      </p>
      {errorMessage && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          {t(errorMessage)}
        </p>
      )}
    </FeatureFormSheet>
  );
}
