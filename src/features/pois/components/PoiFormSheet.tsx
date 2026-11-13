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
        required={isCreateMode}
      >
        {imagePreviewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagePreviewUrl}
            alt={t("POI image preview")}
            className="aspect-video w-full rounded-lg border border-border bg-white object-cover"
          />
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-white px-6 text-center">
            <p className="text-sm text-slate-600">
              {t("Select an image to preview it here.")}
            </p>
            <p className="text-xs text-slate-400">
              {t("JPEG, PNG or WebP. Maximum file size: 10 MB.")}
            </p>
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

      <div className="grid grid-cols-2 items-start gap-3">
        {/* Left: QR Code */}
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex max-w-[180px] items-center justify-between gap-2">
            <FormField label={t("POI QR code")}>
              <></>
            </FormField>

            {poi && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onDownloadQrCode}
                disabled={isQrLoading || !qrCodeDataUrl}
                className="size-7 shrink-0"
                title={t("Download QR code")}
                aria-label={t("Download QR code")}
              >
                <Download aria-hidden="true" className="size-4" />
              </Button>
            )}
          </div>

          <div className="flex aspect-square w-full max-w-[180px] items-center justify-center overflow-hidden rounded-md bg-white p-1.5">
            {poi && qrCodeDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeDataUrl}
                alt={t("POI QR code")}
                className="block size-full object-contain"
              />
            )}

            {poi && isQrLoading && !qrCodeDataUrl && (
              <LoaderCircle
                aria-label={t("Loading QR code…")}
                className="size-5 animate-spin text-slate-500"
              />
            )}

            {isCreateMode && (
              <p className="px-2 text-center text-xs text-slate-500">
                {t("QR code will be generated after creation.")}
              </p>
            )}
          </div>
        </div>

        {/* Right: Location & Trigger Radius */}
        <div className="flex min-w-0 flex-col gap-3">
          <FormField
            label={t("Longitude")}
            htmlFor="poi-longitude"
            required
          >
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

          <FormField
            label={t("Latitude")}
            htmlFor="poi-latitude"
            required
          >
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
        </div>
      </div>


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
