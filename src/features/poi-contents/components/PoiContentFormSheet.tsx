"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
} from "@/components/shared/FeatureFormSheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTENT_STATUS,
  DEFAULT_CONTENT_AUTHOR_ID,
} from "../constants/poi-content.constants";
import { usePoiContentFormSheet } from "../hooks/use-poi-content-form-sheet";
import type { PoiContentFormSheetProps } from "../types/poi-content.types";
import {
  getNextPoiContentVersion,
  isPoiContentEditable,
} from "../utils/poi-content.utils";
import { PoiContentPoiCombobox } from "./PoiContentPoiCombobox";
import { PoiContentPublishSection } from "./PoiContentPublishSection";
import { PoiContentWorkflowFields } from "./PoiContentWorkflowFields";

export function PoiContentFormSheet({
  open,
  mode,
  content,
  contents,
  poiOptions,
  languages,
  onOpenChange,
  onSubmit,
  onEdit,
  hasValidAudio,
  isPublishing,
  audioDurationSeconds,
  audioMimeType,
  archivedContent,
  workflowError,
  onSubmitForApproval,
  onApprove,
  onReject,
  onPublish,
}: PoiContentFormSheetProps) {
  const { t, languageOptions, statusOptions, description } =
    usePoiContentFormSheet(mode, languages);
  const defaultLanguageId = languages.find(function findEnglish(language) {
    return language.language_code === "en";
  })?.id ?? "";
  const [selectedPoiId, setSelectedPoiId] = useState(content?.poi_id ?? "");
  const [selectedLanguageId, setSelectedLanguageId] = useState(
    content?.language_id ?? defaultLanguageId,
  );
  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";
  const canEdit =
    isViewMode &&
    content !== null &&
    isPoiContentEditable(content.content_status);
  const displayedVersion = content?.content_version ?? (
    selectedPoiId && selectedLanguageId
      ? getNextPoiContentVersion(contents, selectedPoiId, selectedLanguageId)
      : "—"
  );
  const isWaitingApproval =
    content?.content_status === CONTENT_STATUS.WAITING_APPROVAL;
  const isApproved = content?.content_status === CONTENT_STATUS.APPROVED;

  let workflowFooter;
  if (isViewMode && content) {
    const hasWorkflowAction = canEdit || isWaitingApproval || isApproved;
    workflowFooter = hasWorkflowAction ? (
      <div className="flex w-full flex-wrap justify-end gap-2">
        {canEdit && (
          <>
            <Button type="button" variant="outline" onClick={onEdit}>
              {t("Edit")}
            </Button>
            <Button type="button" onClick={onSubmitForApproval}>
              SUBMIT
            </Button>
          </>
        )}
        {isWaitingApproval && (
          <>
            <Button type="button" variant="destructive" onClick={onReject}>
              REJECT
            </Button>
            <Button type="button" onClick={onApprove}>
              APPROVE
            </Button>
          </>
        )}
        {isApproved && (
          <Button
            type="button"
            onClick={onPublish}
            disabled={isPublishing}
            aria-busy={isPublishing}
          >
            {isPublishing && (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            )}
            {isPublishing ? t("Generating audio and publishing…") : "PUBLISH"}
          </Button>
        )}
      </div>
    ) : false;
  }

  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel={t("Narration content")}
      description={description}
      onSubmit={onSubmit}
      canEdit={canEdit}
      onEdit={onEdit}
      footer={workflowFooter}
    >
      <FormField label={t("Point of Interest")} htmlFor="content-poi" required>
        <PoiContentPoiCombobox
          id="content-poi"
          name="poi_id"
          options={poiOptions}
          defaultValue={content?.poi_id ?? null}
          onValueChange={function selectPoi(value) {
            setSelectedPoiId(value ?? "");
          }}
          disabled={!isCreateMode}
          required
        />
      </FormField>

      <FormField label={t("Language")} htmlFor="content-language" required>
        <FormCombobox
          id="content-language"
          name="language_id"
          options={languageOptions}
          defaultValue={content?.language_id ?? defaultLanguageId}
          onValueChange={function selectLanguage(value) {
            setSelectedLanguageId(value ?? "");
          }}
          placeholder="Select a language"
          disabled={!isCreateMode}
          required
        />
      </FormField>

      <FormField
        label={t("Narration title")}
        htmlFor="content-title"
        required
      >
        <Input
          id="content-title"
          name="narration_title"
          defaultValue={content?.narration_title ?? ""}
          placeholder={t("Enter narration title")}
          disabled={isViewMode}
          required
        />
      </FormField>

      <FormField
        label={t("Narration script")}
        htmlFor="content-script"
        required
      >
        <Textarea
          id="content-script"
          name="narration_script"
          defaultValue={content?.narration_script ?? ""}
          placeholder={t("Enter the narration script")}
          rows={10}
          disabled={isViewMode}
          required
        />
      </FormField>

      <div className="grid grid-cols-[20%_minmax(0,1fr)] gap-4">
        <FormField label={t("Version")} htmlFor="content-version">
          <Input
            id="content-version"
            value={displayedVersion}
            disabled
            readOnly
          />
        </FormField>

        <FormField
          label={t("Content status")}
          htmlFor="content-status"
          hint={t(
            "New content starts as draft; approval and publishing are separate workflows.",
          )}
        >
          <FormCombobox
            id="content-status"
            name="content_status"
            options={statusOptions}
            defaultValue={content?.content_status ?? CONTENT_STATUS.DRAFT}
            disabled
          />
        </FormField>
      </div>

      <PoiContentWorkflowFields
        content={content}
        createdByFallback={DEFAULT_CONTENT_AUTHOR_ID}
      />

      {isApproved && (
        <PoiContentPublishSection
          hasValidAudio={hasValidAudio}
          audioDurationSeconds={audioDurationSeconds}
          audioMimeType={audioMimeType}
          archivedContent={archivedContent}
        />
      )}

      {workflowError && (
        <p className="text-xs text-destructive" role="alert">
          {t(workflowError)}
        </p>
      )}
    </FeatureFormSheet>
  );
}
