"use client";

import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
} from "@/components/shared/FeatureFormSheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePoiSheet } from "../hooks/use-create-poi-sheet";
import type { CreatePoiSheetProps } from "../types";

export function CreatePoiSheet({
  open,
  onOpenChange,
  regions,
  onSubmit,
}: CreatePoiSheetProps) {
  const { t, regionOptions, statusOptions } = useCreatePoiSheet(regions);

  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode="create"
      entityLabel={t("Point of Interest")}
      description={t(
        "Enter the location details and GPS settings for the new point of interest.",
      )}
      onSubmit={onSubmit}
    >
      <FormField label={t("POI name")} htmlFor="poi-name" required>
        <Input
          id="poi-name"
          name="poi_name"
          placeholder={t("Enter POI name")}
          required
        />
      </FormField>

      <FormField
        label={t("Landmark code")}
        htmlFor="poi-code"
        required
        hint={t("Use a unique code, for example POI-BEN-THANH.")}
      >
        <Input
          id="poi-code"
          name="qr_code"
          placeholder="POI-BEN-THANH"
          required
        />
      </FormField>

      <FormField label={t("Region")} htmlFor="poi-region" required>
        <FormCombobox
          id="poi-region"
          name="region_id"
          options={regionOptions}
          placeholder="Select a region"
          required
        />
      </FormField>

      <FormField label={t("Address")} htmlFor="poi-location" required>
        <Textarea
          id="poi-location"
          name="poi_location"
          placeholder={t("Enter the full address")}
          rows={3}
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
            placeholder="10.7769"
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
            placeholder="106.6953"
            required
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label={t("Trigger radius (meters)")}
          htmlFor="poi-radius"
          required
        >
          <Input
            id="poi-radius"
            name="trigger_radius"
            type="number"
            min={1}
            defaultValue={150}
            required
          />
        </FormField>
        <FormField label={t("Priority")} htmlFor="poi-priority" required>
          <Input
            id="poi-priority"
            name="poi_priority"
            type="number"
            min={1}
            defaultValue={1}
            required
          />
        </FormField>
      </div>

      <FormField label={t("Status")} htmlFor="poi-status" required>
        <FormCombobox
          id="poi-status"
          name="status"
          options={statusOptions}
          defaultValue="active"
          placeholder="Select a status"
          required
        />
      </FormField>

      <FormField
        label={t("Language codes")}
        htmlFor="poi-languages"
        hint={t("Separate language codes with commas, for example VI, EN.")}
      >
        <Input
          id="poi-languages"
          name="languages"
          placeholder="VI, EN"
        />
      </FormField>

      <FormField label={t("Image URL")} htmlFor="poi-image-url">
        <Input
          id="poi-image-url"
          name="image_url"
          type="url"
          placeholder="https://example.com/image.jpg"
        />
      </FormField>
    </FeatureFormSheet>
  );
}
