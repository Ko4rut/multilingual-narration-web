"use client";

import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
} from "@/components/shared/FeatureFormSheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CONTENT_STATUS } from "../constants/poi-content.constants";
import { usePoiContentFormSheet } from "../hooks/use-poi-content-form-sheet";
import { DEFAULT_MOCK_LANGUAGE_ID } from "../mocks/languages.mock";
import type { PoiContentFormSheetProps } from "../types/poi-content.types";

export function PoiContentFormSheet({
  open,
  mode,
  content,
  poiOptions,
  onOpenChange,
  onSubmit,
  onEdit,
}: PoiContentFormSheetProps) {
  const { t, languageOptions, statusOptions, description } =
    usePoiContentFormSheet(mode);
  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";

  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel={t("Narration content")}
      description={description}
      onSubmit={onSubmit}
      canEdit={isViewMode}
      onEdit={onEdit}
    >
      <FormField label={t("Point of Interest")} htmlFor="content-poi" required>
        <FormCombobox
          id="content-poi"
          name="poi_id"
          options={poiOptions}
          defaultValue={content?.poi_id ?? null}
          placeholder="Select a POI"
          disabled={!isCreateMode}
          required
        />
      </FormField>

      <FormField label={t("Language")} htmlFor="content-language" required>
        <FormCombobox
          id="content-language"
          name="language_id"
          options={languageOptions}
          defaultValue={content?.language_id ?? DEFAULT_MOCK_LANGUAGE_ID}
          placeholder="Select a language"
          disabled={!isCreateMode}
          required
        />
      </FormField>

      <FormField
        label={t("Narration title")}
        htmlFor="content-title"
        required
      >
        <Input
          id="content-title"
          name="narration_title"
          defaultValue={content?.narration_title ?? ""}
          placeholder={t("Enter narration title")}
          disabled={isViewMode}
          required
        />
      </FormField>

      <FormField
        label={t("Narration script")}
        htmlFor="content-script"
        required
      >
        <Textarea
          id="content-script"
          name="narration_script"
          defaultValue={content?.narration_script ?? ""}
          placeholder={t("Enter the narration script")}
          rows={10}
          disabled={isViewMode}
          required
        />
      </FormField>

      <FormField label={t("Version")} htmlFor="content-version">
        <Input
          id="content-version"
          value={content?.content_version ?? 1}
          disabled
          readOnly
        />
      </FormField>

      <FormField
        label={t("Content status")}
        htmlFor="content-status"
        hint={t("New content starts as draft; approval and publishing are separate workflows.")}
      >
        <FormCombobox
          id="content-status"
          name="content_status"
          options={statusOptions}
          defaultValue={content?.content_status ?? CONTENT_STATUS.DRAFT}
          disabled
        />
      </FormField>
    </FeatureFormSheet>
  );
}
