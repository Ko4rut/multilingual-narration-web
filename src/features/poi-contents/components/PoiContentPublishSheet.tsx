"use client";

import { AudioLines, CircleAlert, Rocket } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { MOCK_LANGUAGES } from "../mocks/languages.mock";
import { MOCK_POIS } from "../mocks/poi.mock";
import type { PoiContentPublishSheetProps } from "../types/poi-content.types";
import {
  findPoiContentLanguage,
  findPoiContentPoi,
  formatPoiContentTimestamp,
} from "../utils/poi-content.utils";
import { PoiContentStatusBadge } from "./PoiContentStatusBadge";

export function PoiContentPublishSheet({
  open,
  content,
  hasValidAudio,
  audioDurationSeconds,
  audioMimeType,
  archivedContent,
  errorMessage,
  onOpenChange,
  onGenerateAudio,
  onPublish,
}: PoiContentPublishSheetProps) {
  const { t, locale } = usePreferences();
  let poi = null;
  let language = null;
  if (content) {
    poi = findPoiContentPoi(content.poi_id, MOCK_POIS);
    language = findPoiContentLanguage(content.language_id, MOCK_LANGUAGES);
  }

  function handleClose() {
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-hidden sm:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle>{t("Publish narration content")}</SheetTitle>
          <SheetDescription className="text-xs">
            {t("Validate the approved version and its audio before making it live.")}
          </SheetDescription>
        </SheetHeader>

        {content && (
          <div className="flex-1 space-y-5 overflow-y-auto p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">
                  {content.narration_title}
                </p>
                <p className="font-mono text-xs text-success">{content.id}</p>
              </div>
              <PoiContentStatusBadge status={content.content_status} />
            </div>

            <dl className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-3 text-xs">
              <div className="space-y-1">
                <dt className="text-muted-foreground">{t("POI")}</dt>
                <dd className="font-medium text-foreground">
                  {poi?.poi_name ?? content.poi_id}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted-foreground">{t("Language")}</dt>
                <dd className="font-medium text-foreground">
                  {t(language?.language_name ?? content.language_id)}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted-foreground">{t("Approved by")}</dt>
                <dd className="font-mono text-foreground">
                  {content.approved_by ?? "—"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted-foreground">{t("Approved")}</dt>
                <dd className="font-medium text-foreground">
                  {formatPoiContentTimestamp(content.approved_at, locale)}
                </dd>
              </div>
            </dl>

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
                      {t("A valid audio asset is required before publishing.")}
                    </p>
                  </div>
                </div>
                {hasValidAudio && (
                  <StatusBadge label={t("Ready")} tone="success" />
                )}
                {!hasValidAudio && (
                  <StatusBadge label={t("Missing audio")} tone="warning" />
                )}
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
                    <dd className="font-mono text-foreground">
                      {audioMimeType}
                    </dd>
                  </div>
                </dl>
              )}

              {!hasValidAudio && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onGenerateAudio}
                >
                  <AudioLines aria-hidden="true" />
                  {t("Generate TTS audio")}
                </Button>
              )}
            </section>

            {archivedContent && (
              <div className="flex gap-2 rounded-lg border border-warning/40 bg-warning-bg p-3 text-xs text-warning">
                <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
                <p>
                  {t("Publishing will archive the current live version")}{" "}
                  <span className="font-mono">{archivedContent.id}</span> (v
                  {archivedContent.content_version}).
                </p>
              </div>
            )}

            {errorMessage && (
              <p className="text-xs text-destructive" role="alert">
                {t(errorMessage)}
              </p>
            )}
          </div>
        )}

        <SheetFooter className="border-t">
          <div className="flex w-full justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              disabled={!hasValidAudio}
              onClick={onPublish}
            >
              <Rocket aria-hidden="true" />
              {t("Publish content")}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
