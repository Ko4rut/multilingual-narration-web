"use client";

import { FeatureFormSheet, FormField } from "@/components/shared/FeatureFormSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { PoiCategoryFormSheetProps } from "../types/poi-category.types";

/** Shared create/view/edit sheet. Category code is immutable after creation. */
export function PoiCategoryFormSheet({
  open,
  mode,
  category,
  isSaving,
  errorMessage,
  onOpenChange,
  onEdit,
  onSubmit,
}: PoiCategoryFormSheetProps) {
  const { t } = usePreferences();
  const isView = mode === "view";
  const isCreate = mode === "create";
  let description = "Create a reusable category for classifying points of interest.";
  if (isView) {
    description = "View a category shared by POIs and offline packages.";
  }
  if (mode === "edit") {
    description = "Edit the category name. Its code stays fixed to protect package keys.";
  }

  function closeSheet() {
    onOpenChange(false);
  }

  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel={t("POI Category")}
      description={t(description)}
      onSubmit={onSubmit}
      footer={
        <div className="flex w-full justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={closeSheet}
          >
            {t(isView ? "Close" : "Cancel")}
          </Button>
          {isView && (
            <Button type="button" onClick={onEdit}>
              {t("Edit")}
            </Button>
          )}
          {!isView && (
            <Button type="submit" disabled={isSaving}>
              {isSaving && t("Saving Category...")}
              {!isSaving && isCreate && t("Create Category")}
              {!isSaving && !isCreate && t("Save changes")}
            </Button>
          )}
        </div>
      }
    >
      {category && (
        <FormField
          label={t("Category ID")}
          htmlFor="poi-category-id"
          hint={t("This identifier is assigned by the Backend.")}
        >
          <Input
            id="poi-category-id"
            value={category.id}
            readOnly
            disabled
            className="font-mono text-xs"
          />
        </FormField>
      )}

      <FormField
        label={t("Category name")}
        htmlFor="poi-category-name"
        required
      >
        <Input
          id="poi-category-name"
          name="category_name"
          defaultValue={category?.category_name ?? ""}
          placeholder={t("Enter Category name")}
          maxLength={120}
          disabled={isView || isSaving}
          required
          autoFocus={isCreate}
        />
      </FormField>

      <FormField
        label={t("Category code")}
        htmlFor="poi-category-code"
        hint={t("Use lowercase letters, digits and hyphens. Code cannot change after creation because offline package keys depend on it.")}
        required
      >
        <Input
          id="poi-category-code"
          name="category_code"
          defaultValue={category?.category_code ?? ""}
          placeholder="museum"
          minLength={1}
          maxLength={30}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          autoCapitalize="none"
          spellCheck={false}
          className="font-mono lowercase"
          readOnly={!isCreate}
          disabled={isView || isSaving}
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
