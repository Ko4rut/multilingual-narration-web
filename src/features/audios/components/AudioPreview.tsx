"use client";

import { ExternalLink, Music2, RotateCcw, RotateCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { useAudioPreview } from "../hooks/use-audio-preview";
import type {
  AudioPoiContent,
  AudioPreviewProps,
} from "../types/audio.types";
import {
  findAudioPoiContent,
  formatAudioDuration,
} from "../utils/audio.utils";
import { AudioStatusBadge } from "./AudioStatusBadge";

/** Phát bản ghi audio đang được quản trị viên chọn từ bảng dữ liệu. */
export function AudioPreview({
  contents,
  selectedAudio,
}: AudioPreviewProps) {
  const { t, locale } = usePreferences();
  const { audioRef, rewindTenSeconds, forwardTenSeconds } = useAudioPreview();
  const byteFormatter = new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "megabyte",
    maximumFractionDigits: 2,
  });
  let selectedContent: AudioPoiContent | null = null;
  if (selectedAudio) {
    selectedContent =
      findAudioPoiContent(selectedAudio.poi_content_id, contents) ?? null;
  }

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardContent className="p-5">
        {selectedAudio && (
          <div className="space-y-4">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-primary">
                <Music2 aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="truncate text-sm font-medium text-foreground">
                  {selectedContent?.narration_title ?? selectedAudio.poi_content_id}
                </p>
                <p className="truncate font-mono text-xs text-success">
                  {selectedAudio.poi_content_id}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatAudioDuration(selectedAudio.audio_duration_sec)}
                  <span aria-hidden="true"> · </span>
                  {selectedAudio.audio_mime_type}
                  <span aria-hidden="true"> · </span>
                  {byteFormatter.format(selectedAudio.audio_size / 1_000_000)}
                </p>
              </div>
              <div className="shrink-0">
                <AudioStatusBadge type={selectedAudio.audio_source_type} />
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <audio
                key={`${selectedAudio.id}-${selectedAudio.audio_url}`}
                ref={audioRef}
                controls
                preload="metadata"
                className="h-10 min-w-0 flex-1"
              >
                <source
                  src={selectedAudio.audio_url}
                  type={selectedAudio.audio_mime_type}
                />
                {t("Your browser does not support audio playback.")}
              </audio>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("Rewind 10 seconds")}
                  title={t("Rewind 10 seconds")}
                  onClick={rewindTenSeconds}
                >
                  <span
                    aria-hidden="true"
                    className="relative flex size-6 items-center justify-center"
                  >
                    <RotateCcw className="size-6" />
                    <span className="absolute text-[length:var(--type-micro)] font-bold leading-none">
                      10
                    </span>
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("Forward 10 seconds")}
                  title={t("Forward 10 seconds")}
                  onClick={forwardTenSeconds}
                >
                  <span
                    aria-hidden="true"
                    className="relative flex size-6 items-center justify-center"
                  >
                    <RotateCw className="size-6" />
                    <span className="absolute text-[length:var(--type-micro)] font-bold leading-none">
                      10
                    </span>
                  </span>
                </Button>
              </div>
            </div>
            <a
              href={selectedAudio.audio_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <span className="truncate">{selectedAudio.audio_url}</span>
              <ExternalLink aria-hidden="true" className="size-3 shrink-0" />
            </a>
          </div>
        )}

        {!selectedAudio && (
          <p className="text-sm text-muted-foreground">
            {t("Select an audio row from the table to preview it.")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
