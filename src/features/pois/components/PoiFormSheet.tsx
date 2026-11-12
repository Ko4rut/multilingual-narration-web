"use client";

import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
  FormMultiCombobox,
} from "@/components/shared/FeatureFormSheet";
import { Download, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  regions,
  categories,
  onOpenChange,
  onSubmit,
  onEdit,
  qrCodeDataUrl,
  isQrLoading,
  onDownloadQrCode,
}: PoiFormSheetProps) {
  const {
    t,
    regionOptions,
    categoryOptions,
    statusOptions,
    description,
    imagePreviewUrl,
    handleImageChange,
  } = usePoiFormSheet(mode, canActivate, regions, categories, poi?.poi_image_url);
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
      <FormField
        label={t("POI image")}
        htmlFor="poi-image"
        hint={t("JPEG, PNG or WebP. Maximum file size: 10 MB.")}
        required={isCreateMode}
      >
        {imagePreviewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagePreviewUrl}
            alt={t("POI image preview")}
            className="aspect-video w-full rounded-lg border border-border bg-muted object-cover"
          />
        )}
        {!imagePreviewUrl && (
          <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 px-6 text-center text-xs text-muted-foreground">
            {t("Select an image to preview it here.")}
          </div>
        )}
        {!isViewMode && (
          <Input
            id="poi-image"
            name="poi_image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            required={isCreateMode}
          />
        )}
      </FormField>

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

      {poi && (
        <section className="overflow-hidden rounded-xl border border-border bg-muted/20">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-medium text-foreground">
              {t("POI QR code")}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t("Visitors scan this code to open the POI narration.")}
            </p>
          </div>
          <div className="flex min-h-64 items-center justify-center bg-white p-5">
            {qrCodeDataUrl && (
              // QR được trả dưới dạng data URL, không cần pipeline tối ưu ảnh của Next.js.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeDataUrl}
                alt={t("POI QR code")}
                className="size-56 object-contain"
              />
            )}
            {isQrLoading && !qrCodeDataUrl && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                {t("Loading QR code…")}
              </div>
            )}
          </div>
          <div className="flex justify-end border-t border-border px-4 py-3">
            <Button
              type="button"
              variant="outline"
              onClick={onDownloadQrCode}
              disabled={isQrLoading || !qrCodeDataUrl}
            >
              <Download aria-hidden="true" />
              {t("Download QR code")}
            </Button>
          </div>
        </section>
      )}

      {isCreateMode && (
        <p className="text-xs text-muted-foreground">
          {t("The QR code will be generated automatically after the POI is created.")}
        </p>
      )}

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
