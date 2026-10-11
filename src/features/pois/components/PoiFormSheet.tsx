"use client";

import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
  FormMultiCombobox,
} from "@/components/shared/FeatureFormSheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { POI_STATUS } from "../constants/poi.constants";
import { usePoiFormSheet } from "../hooks/use-poi-form-sheet";
import type { PoiFormSheetProps } from "../types/poi.types";

export function PoiFormSheet({
  open,
  mode,
  poi,
  categoryIds,
  canActivate,
  onOpenChange,
  onSubmit,
  onEdit,
}: PoiFormSheetProps) {
  const {
    t,
    regionOptions,
    categoryOptions,
    statusOptions,
    description,
  } = usePoiFormSheet(mode, canActivate);
  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";

  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel={t("Point of Interest")}
      description={description}
      onSubmit={onSubmit}
      canEdit={isViewMode}
      onEdit={onEdit}
    >
      <FormField label={t("POI name")} htmlFor="poi-name" required>
        <Input
          id="poi-name"
          name="poi_name"
          defaultValue={poi?.poi_name ?? ""}
          placeholder={t("Enter POI name")}
          disabled={isViewMode}
          required
        />
      </FormField>

      <FormField label={t("QR code")} htmlFor="poi-qr-code" required>
        <Input
          id="poi-qr-code"
          name="poi_qr_code"
          defaultValue={poi?.poi_qr_code ?? ""}
          placeholder="MANS:POI:LANDMARK"
          disabled={isViewMode}
          required
        />
      </FormField>

      <FormField label={t("Region")} htmlFor="poi-region" required>
        <FormCombobox
          id="poi-region"
          name="region_id"
          options={regionOptions}
          defaultValue={poi?.region_id ?? null}
          placeholder="Select a region"
          disabled={isViewMode}
          required
        />
      </FormField>

      <FormField
        label={t("Categories")}
        htmlFor="poi-categories"
        hint={t("A POI can belong to multiple categories.")}
      >
        <FormMultiCombobox
          id="poi-categories"
          name="poi_category_ids"
          options={categoryOptions}
          defaultValue={categoryIds}
          placeholder="Select categories"
          disabled={isViewMode}
        />
      </FormField>

      <FormField label={t("Address")} htmlFor="poi-location" required>
        <Textarea
          id="poi-location"
          name="poi_location"
          defaultValue={poi?.poi_location ?? ""}
          placeholder={t("Enter the full address")}
          rows={3}
          disabled={isViewMode}
          required
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label={t("Latitude")} htmlFor="poi-latitude" required>
          <Input
            id="poi-latitude"
            name="latitude"
            type="number"
            min={-90}
            max={90}
            step="any"
            defaultValue={poi?.latitude ?? ""}
            disabled={isViewMode}
            required
          />
        </FormField>
        <FormField label={t("Longitude")} htmlFor="poi-longitude" required>
          <Input
            id="poi-longitude"
            name="longitude"
            type="number"
            min={-180}
            max={180}
            step="any"
            defaultValue={poi?.longitude ?? ""}
            disabled={isViewMode}
            required
          />
        </FormField>
      </div>

      <FormField
        label={t("Trigger radius (meters)")}
        htmlFor="poi-trigger-radius"
        required
      >
        <Input
          id="poi-trigger-radius"
          name="trigger_radius_meter"
          type="number"
          min={1}
          step="any"
          defaultValue={poi?.trigger_radius_meter ?? 100}
          disabled={isViewMode}
          required
        />
      </FormField>

      <FormField label={t("Image URL")} htmlFor="poi-image-url" required>
        <Input
          id="poi-image-url"
          name="poi_image_url"
          type="url"
          defaultValue={poi?.poi_image_url ?? ""}
          placeholder="https://example.com/poi.jpg"
          disabled={isViewMode}
          required
        />
      </FormField>

      <FormField
        label={t("Image checksum")}
        htmlFor="poi-image-checksum"
      >
        <Input
          id="poi-image-checksum"
          name="image_checksum_sha256"
          defaultValue={poi?.image_checksum_sha256 ?? ""}
          placeholder={t("Optional SHA-256 checksum")}
          minLength={64}
          maxLength={64}
          disabled={isViewMode}
        />
      </FormField>

      <FormField
        label={t("Status")}
        htmlFor="poi-status"
        hint={t("Active requires published English content with valid audio.")}
        required
      >
        <FormCombobox
          id="poi-status"
          name="poi_status"
          options={statusOptions}
          defaultValue={poi?.poi_status ?? POI_STATUS.INACTIVE}
          placeholder="Select a status"
          disabled={isViewMode || isCreateMode}
          required
        />
      </FormField>
    </FeatureFormSheet>
  );
}
