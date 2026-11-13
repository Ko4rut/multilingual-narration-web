"use client";

import { AudioLines, CircleAlert } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { PoiContent } from "../types/poi-content.types";

type PoiContentPublishSectionProps = {
  hasValidAudio: boolean;
  audioDurationSeconds: number | null;
  audioMimeType: string | null;
  archivedContent: PoiContent | null;
};

/** Thông tin chỉ xuất hiện khi content đã được duyệt và sẵn sàng publish. */
export function PoiContentPublishSection({
  hasValidAudio,
  audioDurationSeconds,
  audioMimeType,
  archivedContent,
}: PoiContentPublishSectionProps) {
  const { t, locale } = usePreferences();

  return (
    <>
      <section className="space-y-3 rounded-lg border p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AudioLines
              aria-hidden="true"
              className="mt-0.5 size-4 text-muted-foreground"
            />
            <div>
              <h3 className="text-sm font-medium text-foreground">
                {t("Audio readiness")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("Publishing automatically generates TTS audio when no valid audio exists.")}
              </p>
            </div>
          </div>
          <StatusBadge
            label={t(hasValidAudio ? "Ready" : "Missing audio")}
            tone={hasValidAudio ? "success" : "warning"}
          />
        </div>

        {hasValidAudio && (
          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="text-muted-foreground">{t("Duration")}</dt>
              <dd className="font-medium text-foreground">
                {audioDurationSeconds?.toLocaleString(locale)} {t("seconds")}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("MIME type")}</dt>
              <dd className="font-mono text-foreground">{audioMimeType}</dd>
            </div>
          </dl>
        )}
      </section>

      {archivedContent && (
        <div className="flex gap-2 rounded-lg border border-warning/40 bg-warning-bg p-3 text-xs text-warning">
          <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
          <p>
            {t("Publishing will archive the current live version")} {" "}
            <span className="font-mono">{archivedContent.id}</span> (v
            {archivedContent.content_version}).
          </p>
        </div>
      )}
    </>
  );
}
