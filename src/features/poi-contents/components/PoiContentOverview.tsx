"use client";

import {
  CircleCheck,
  Clock3,
  FileText,
  Languages,
  Plus,
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
import { PoiContentPublishSheet } from "./PoiContentPublishSheet";
import { PoiContentReviewSheet } from "./PoiContentReviewSheet";
import { PoiContentTable } from "./PoiContentTable";

export function PoiContentOverview() {
  const { t, locale } = usePreferences();
  const {
    contents,
    overviewSummary,
    poiOptions,
    selectedContent,
    sheetMode,
    isSheetOpen,
    reviewContent,
    isReviewSheetOpen,
    reviewNote,
    publishContent,
    isPublishSheetOpen,
    publishAudio,
    archivedContent,
    workflowError,
    feedback,
    openCreateSheet,
    openViewSheet,
    openEditSheet,
    editSelectedContent,
    handleSheetOpenChange,
    handleCopyContent,
    handleDeleteContent,
    handleSubmit,
    handleSubmitForApproval,
    openReviewSheet,
    handleReviewSheetOpenChange,
    handleReviewNoteChange,
    handleApproveContent,
    handleRejectContent,
    openPublishSheet,
    handlePublishSheetOpenChange,
    handleGenerateAudio,
    handlePublishContent,
  } = usePoiContents();
  let sheetKey = "create";
  if (selectedContent) {
    sheetKey = `${sheetMode}-${selectedContent.id}`;
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
        <Button type="button" onClick={openCreateSheet}>
          <Plus aria-hidden="true" />
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
          onCopyContent={handleCopyContent}
          onViewContent={openViewSheet}
          onEditContent={openEditSheet}
          onDeleteContent={handleDeleteContent}
          onSubmitContent={handleSubmitForApproval}
          onReviewContent={openReviewSheet}
          onPublishContent={openPublishSheet}
        />
      </PageLayoutContent>
      <PoiContentFormSheet
        key={sheetKey}
        open={isSheetOpen}
        mode={sheetMode}
        content={selectedContent}
        poiOptions={poiOptions}
        onOpenChange={handleSheetOpenChange}
        onSubmit={handleSubmit}
        onEdit={editSelectedContent}
      />
      <PoiContentReviewSheet
        open={isReviewSheetOpen}
        content={reviewContent}
        reviewNote={reviewNote}
        errorMessage={workflowError}
        onOpenChange={handleReviewSheetOpenChange}
        onReviewNoteChange={handleReviewNoteChange}
        onApprove={handleApproveContent}
        onReject={handleRejectContent}
      />
      <PoiContentPublishSheet
        open={isPublishSheetOpen}
        content={publishContent}
        hasValidAudio={Boolean(publishAudio)}
        audioDurationSeconds={publishAudio?.audio_duration_sec ?? null}
        audioMimeType={publishAudio?.audio_mime_type ?? null}
        archivedContent={archivedContent}
        errorMessage={workflowError}
        onOpenChange={handlePublishSheetOpenChange}
        onGenerateAudio={handleGenerateAudio}
        onPublish={handlePublishContent}
      />
    </PageLayout>
  );
}
