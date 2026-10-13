"use client";

import { ClipboardCheck, Rocket, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { CONTENT_WORKFLOW_ACTION } from "../constants/poi-content.constants";
import type { PoiContentWorkflowActionProps } from "../types/poi-content.types";
import { getPoiContentWorkflowAction } from "../utils/poi-content.utils";

export function PoiContentWorkflowAction({
  content,
  onSubmit,
  onReview,
  onPublish,
}: PoiContentWorkflowActionProps) {
  const { t } = usePreferences();
  const action = getPoiContentWorkflowAction(content.content_status);

  if (action === CONTENT_WORKFLOW_ACTION.SUBMIT) {
    return (
      <Button
        type="button"
        size="xs"
        variant="outline"
        onClick={function submitContent() {
          onSubmit(content);
        }}
      >
        <Send aria-hidden="true" />
        {t("Submit for approval")}
      </Button>
    );
  }

  if (action === CONTENT_WORKFLOW_ACTION.RESUBMIT) {
    return (
      <Button
        type="button"
        size="xs"
        variant="outline"
        onClick={function resubmitContent() {
          onSubmit(content);
        }}
      >
        <Send aria-hidden="true" />
        {t("Resubmit")}
      </Button>
    );
  }

  if (action === CONTENT_WORKFLOW_ACTION.REVIEW) {
    return (
      <Button
        type="button"
        size="xs"
        variant="secondary"
        onClick={function reviewContent() {
          onReview(content);
        }}
      >
        <ClipboardCheck aria-hidden="true" />
        {t("Review")}
      </Button>
    );
  }

  if (action === CONTENT_WORKFLOW_ACTION.PUBLISH) {
    return (
      <Button
        type="button"
        size="xs"
        onClick={function publishContent() {
          onPublish(content);
        }}
      >
        <Rocket aria-hidden="true" />
        {t("Publish")}
      </Button>
    );
  }

  return <span className="text-xs text-muted-foreground">—</span>;
}
