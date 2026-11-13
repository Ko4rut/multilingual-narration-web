"use client";

import {
  CircleCheck,
  Clock3,
  FileText,
  Languages,
  Send,
} from "lucide-react";
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutOverview,
  PageLayoutStat,
} from "@/components/shared/PageLayout";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { usePoiContents } from "../hooks/use-poi-contents";
import { PoiContentFormSheet } from "./PoiContentFormSheet";
import { PoiContentTable } from "./PoiContentTable";

export function PoiContentOverview() {
  const { t, locale } = usePreferences();
  const {
    contents,
    pois,
    languages,
    overviewSummary,
    poiOptions,
    selectedContent,
    sheetMode,
    isSheetOpen,
    publishAudio,
    hasValidPublishAudio,
    archivedContent,
    workflowError,
    feedback,
    isLoading,
    isPublishing,
    openCreateSheet,
    openViewSheet,
    openWorkflowSheet,
    openEditSheet,
    editSelectedContent,
    handleSheetOpenChange,
    handleCopyContent,
    handleSubmit,
    handleSubmitForApproval,
    handleApproveContent,
    handleRejectContent,
    handlePublishContent,
  } = usePoiContents();
  let sheetKey = "create";
  if (selectedContent) {
    sheetKey = `${sheetMode}-${selectedContent.id}-${selectedContent.content_status}`;
  }
  const isCopySuccess = feedback === "Content ID copied.";
  let feedbackClassName = "text-xs text-muted-foreground";
  if (isCopySuccess) {
    feedbackClassName = "flex items-center gap-1.5 text-xs text-success";
  }

  return (
    <PageLayout>
      <PageLayoutHeader
        title="POIs Content Management"
        description="Manage multilingual narration versions and publishing workflows."
      >
        <Button type="button" onClick={openCreateSheet} disabled={isLoading}>
          {t("Add New Content")}
        </Button>
      </PageLayoutHeader>
      <PageLayoutOverview aria-label={t("Content overview")}>
        <PageLayoutStat
          label="Total Content"
          value={overviewSummary.totalContents.toLocaleString(locale)}
          description="Narration versions"
          icon={<FileText />}
        />
        <PageLayoutStat
          label="Published Content"
          value={overviewSummary.publishedContents.toLocaleString(locale)}
          description="Live narration versions"
          icon={<Send />}
          iconClassName="bg-success/10 text-success"
        />
        <PageLayoutStat
          label="In Review"
          value={overviewSummary.pendingContents.toLocaleString(locale)}
          description="Waiting or approved"
          icon={<Clock3 />}
          iconClassName="bg-warning/10 text-warning"
        />
        <PageLayoutStat
          label="Languages Covered"
          value={overviewSummary.coveredLanguages.toLocaleString(locale)}
          description="Across content records"
          icon={<Languages />}
        />
      </PageLayoutOverview>
      {feedback && (
        <p className={feedbackClassName} role="status">
          {isCopySuccess && (
            <CircleCheck aria-hidden="true" className="size-4 shrink-0" />
          )}
          {t(feedback)}
        </p>
      )}
      <PageLayoutContent>
        <PoiContentTable
          contents={contents}
          pois={pois}
          languages={languages}
          onCopyContent={handleCopyContent}
          onViewContent={openViewSheet}
          onEditContent={openEditSheet}
          onSubmitContent={openWorkflowSheet}
          onReviewContent={openWorkflowSheet}
          onPublishContent={openWorkflowSheet}
          disabledWorkflowContentId={
            isPublishing ? selectedContent?.id ?? null : null
          }
        />
      </PageLayoutContent>
      <PoiContentFormSheet
        key={sheetKey}
        open={isSheetOpen}
        mode={sheetMode}
        content={selectedContent}
        contents={contents}
        poiOptions={poiOptions}
        languages={languages}
        onOpenChange={handleSheetOpenChange}
        onSubmit={handleSubmit}
        onEdit={editSelectedContent}
        hasValidAudio={hasValidPublishAudio}
        isPublishing={isPublishing}
        audioDurationSeconds={publishAudio?.audio_duration_sec ?? null}
        audioMimeType={publishAudio?.audio_mime_type ?? null}
        archivedContent={archivedContent}
        workflowError={workflowError}
        onSubmitForApproval={handleSubmitForApproval}
        onApprove={handleApproveContent}
        onReject={handleRejectContent}
        onPublish={handlePublishContent}
      />
    </PageLayout>
  );
}
