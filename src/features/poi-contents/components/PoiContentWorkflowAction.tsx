"use client";

import { Button } from "@/components/ui/button";
import {
  CONTENT_STATUS,
  CONTENT_WORKFLOW_ACTION,
} from "../constants/poi-content.constants";
import type { PoiContentWorkflowActionProps } from "../types/poi-content.types";
import { getPoiContentWorkflowAction } from "../utils/poi-content.utils";

export function PoiContentWorkflowAction({
  content,
  disabled,
  onSubmit,
  onReview,
  onPublish,
}: PoiContentWorkflowActionProps) {
  const action = getPoiContentWorkflowAction(content.content_status);
  const publishDisabled =
    disabled || content.content_status === CONTENT_STATUS.PUBLISHED;

  if (action === CONTENT_WORKFLOW_ACTION.SUBMIT) {
    return (
      <Button
        type="button"
        size="xs"
        variant="outline"
        disabled={disabled}
        onClick={function submitContent() {
          onSubmit(content);
        }}
      >
        SUBMIT
      </Button>
    );
  }

  if (action === CONTENT_WORKFLOW_ACTION.RESUBMIT) {
    return (
      <Button
        type="button"
        size="xs"
        variant="outline"
        disabled={disabled}
        onClick={function resubmitContent() {
          onSubmit(content);
        }}
      >
        SUBMIT
      </Button>
    );
  }

  if (action === CONTENT_WORKFLOW_ACTION.REVIEW) {
    return (
      <Button
        type="button"
        size="xs"
        variant="secondary"
        disabled={disabled}
        onClick={function reviewContent() {
          onReview(content);
        }}
      >
        REVIEW
      </Button>
    );
  }

  if (action === CONTENT_WORKFLOW_ACTION.PUBLISH) {
    return (
      <Button
        type="button"
        size="xs"
        disabled={publishDisabled}
        onClick={function publishContent() {
          onPublish(content);
        }}
      >
        PUBLISH
      </Button>
    );
  }

  return <span className="text-xs text-muted-foreground">—</span>;
}
