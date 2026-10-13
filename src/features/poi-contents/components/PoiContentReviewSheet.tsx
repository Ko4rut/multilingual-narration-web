"use client";

import type { ChangeEvent } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { MOCK_LANGUAGES } from "../mocks/languages.mock";
import { MOCK_POIS } from "../mocks/poi.mock";
import type { PoiContentReviewSheetProps } from "../types/poi-content.types";
import {
  findPoiContentLanguage,
  findPoiContentPoi,
  formatPoiContentTimestamp,
} from "../utils/poi-content.utils";
import { PoiContentStatusBadge } from "./PoiContentStatusBadge";

export function PoiContentReviewSheet({
  open,
  content,
  reviewNote,
  errorMessage,
  onOpenChange,
  onReviewNoteChange,
  onApprove,
  onReject,
}: PoiContentReviewSheetProps) {
  const { t, locale } = usePreferences();
  let poi = null;
  let language = null;
  if (content) {
    poi = findPoiContentPoi(content.poi_id, MOCK_POIS);
    language = findPoiContentLanguage(content.language_id, MOCK_LANGUAGES);
  }

  function handleReviewNoteChange(
    event: ChangeEvent<HTMLTextAreaElement>,
  ) {
    onReviewNoteChange(event.target.value);
  }

  function handleClose() {
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-hidden sm:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle>{t("Review narration content")}</SheetTitle>
          <SheetDescription className="text-xs">
            {t("Read the submitted version before approving or returning it for revision.")}
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
                <dt className="text-muted-foreground">{t("Version")}</dt>
                <dd className="font-medium text-foreground">
                  v{content.content_version}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted-foreground">{t("Created")}</dt>
                <dd className="font-medium text-foreground">
                  {formatPoiContentTimestamp(content.created_at, locale)}
                </dd>
              </div>
              <div className="col-span-2 space-y-1">
                <dt className="text-muted-foreground">{t("Created by")}</dt>
                <dd className="font-mono text-foreground">
                  {content.created_by}
                </dd>
              </div>
            </dl>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-foreground">
                {t("Narration script")}
              </p>
              <div className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border bg-background p-3 text-sm leading-6 text-foreground">
                {content.narration_script}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="content-review-note"
                className="text-xs font-medium text-foreground"
              >
                {t("Review note")}
              </label>
              <Textarea
                id="content-review-note"
                value={reviewNote}
                onChange={handleReviewNoteChange}
                placeholder={t("Explain what must be revised when rejecting content.")}
                rows={4}
              />
              <p className="text-[10px] text-muted-foreground">
                {t("A review note is required when rejecting content.")}
              </p>
            </div>

            {errorMessage && (
              <p className="text-xs text-destructive" role="alert">
                {t(errorMessage)}
              </p>
            )}
          </div>
        )}

        <SheetFooter className="border-t">
          <div className="flex w-full flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("Cancel")}
            </Button>
            <Button type="button" variant="destructive" onClick={onReject}>
              <X aria-hidden="true" />
              {t("Reject")}
            </Button>
            <Button type="button" onClick={onApprove}>
              <Check aria-hidden="true" />
              {t("Approve")}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
