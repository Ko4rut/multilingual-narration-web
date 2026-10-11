"use client";

import { Plus } from "lucide-react";
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { usePoiContents } from "../hooks/use-poi-contents";
import { PoiContentFormSheet } from "./PoiContentFormSheet";
import { PoiContentTable } from "./PoiContentTable";

export function PoiContentOverview() {
  const { t } = usePreferences();
  const {
    contents,
    poiOptions,
    selectedContent,
    sheetMode,
    isSheetOpen,
    feedback,
    openCreateSheet,
    openViewSheet,
    openEditSheet,
    editSelectedContent,
    handleSheetOpenChange,
    handleDeleteContent,
    handleSubmit,
  } = usePoiContents();
  let sheetKey = "create";
  if (selectedContent) {
    sheetKey = `${sheetMode}-${selectedContent.id}`;
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
      {feedback && (
        <p className="text-xs text-muted-foreground" role="status">
          {t(feedback)}
        </p>
      )}
      <PageLayoutContent>
        <PoiContentTable
          contents={contents}
          onViewContent={openViewSheet}
          onEditContent={openEditSheet}
          onDeleteContent={handleDeleteContent}
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
    </PageLayout>
  );
}
