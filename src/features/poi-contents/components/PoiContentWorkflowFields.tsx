"use client";

import { FormField } from "@/components/shared/FeatureFormSheet";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { PoiContentWorkflowFieldsProps } from "../types/poi-content.types";
import { formatPoiContentTimestamp } from "../utils/poi-content.utils";

export function PoiContentWorkflowFields({
  content,
  createdByFallback = "—",
}: PoiContentWorkflowFieldsProps) {
  const { t, locale } = usePreferences();

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField label={t("Created by")} htmlFor="workflow-created-by">
        <Input
          id="workflow-created-by"
          value={content?.created_by ?? createdByFallback}
          disabled
          readOnly
        />
      </FormField>
      <FormField label={t("Created at")} htmlFor="workflow-created-at">
        <Input
          id="workflow-created-at"
          value={formatPoiContentTimestamp(content?.created_at ?? null, locale)}
          disabled
          readOnly
        />
      </FormField>
      <FormField label={t("Approved by")} htmlFor="workflow-approved-by">
        <Input
          id="workflow-approved-by"
          value={content?.approved_by ?? "—"}
          disabled
          readOnly
        />
      </FormField>
      <FormField label={t("Approved at")} htmlFor="workflow-approved-at">
        <Input
          id="workflow-approved-at"
          value={formatPoiContentTimestamp(content?.approved_at ?? null, locale)}
          disabled
          readOnly
        />
      </FormField>
      <FormField label={t("Published by")} htmlFor="workflow-published-by">
        <Input
          id="workflow-published-by"
          value={content?.published_by ?? "—"}
          disabled
          readOnly
        />
      </FormField>
      <FormField label={t("Published at")} htmlFor="workflow-published-at">
        <Input
          id="workflow-published-at"
          value={formatPoiContentTimestamp(content?.published_at ?? null, locale)}
          disabled
          readOnly
        />
      </FormField>
    </div>
  );
}
