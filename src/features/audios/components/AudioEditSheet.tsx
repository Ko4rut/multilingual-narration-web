"use client";

import {
  FeatureFormSheet,
  FormField,
} from "@/components/shared/FeatureFormSheet";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { AudioEditSheetProps } from "../types/audio.types";

/** Hiển thị form thay thế URL nguồn của bản ghi audio đang chọn. */
export function AudioEditSheet({
  open,
  audio,
  errorMessage,
  onOpenChange,
  onSubmit,
}: AudioEditSheetProps) {
  const { t } = usePreferences();

  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      entityLabel={t("Audio record")}
      description={t("Replace the audio source URL for this record.")}
      onSubmit={onSubmit}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label={t("Audio ID")} htmlFor="audio-id">
          <Input
            id="audio-id"
            value={audio?.id ?? ""}
            className="font-mono"
            disabled
            readOnly
          />
        </FormField>

        <FormField label={t("Source type")} htmlFor="audio-source-type">
          <Input
            id="audio-source-type"
            value={audio?.audio_source_type ?? ""}
            disabled
            readOnly
          />
        </FormField>
      </div>

      <FormField label={t("Narration content")} htmlFor="audio-content-id">
        <Input
          id="audio-content-id"
          value={audio?.poi_content_id ?? ""}
          className="font-mono"
          disabled
          readOnly
        />
      </FormField>

      <FormField
        label={t("Audio URL")}
        htmlFor="audio-url"
        hint={t("Only HTTPS audio URLs are accepted.")}
        required
      >
        <Input
          id="audio-url"
          name="audio_url"
          type="url"
          defaultValue={audio?.audio_url ?? ""}
          placeholder="https://example.com/audio.mp3"
          aria-invalid={Boolean(errorMessage)}
          autoCapitalize="none"
          autoComplete="url"
          spellCheck={false}
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
