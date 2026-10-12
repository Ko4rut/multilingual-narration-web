"use client";

import { CircleCheck, CircleOff, Map, MapPinned, Plus } from "lucide-react";
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutOverview,
  PageLayoutStat,
} from "@/components/shared/PageLayout";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { usePois } from "../hooks/use-pois";
import { PoiFormSheet } from "./PoiFormSheet";
import { PoisTable } from "./PoisTable";

export function PoisOverview() {
  const { t, locale } = usePreferences();
  const {
    pois,
    overviewSummary,
    poiCategoryMappings,
    selectedPoi,
    selectedCategoryIds,
    sheetMode,
    isSheetOpen,
    feedback,
    canActivateSelectedPoi,
    openCreateSheet,
    openViewSheet,
    openEditSheet,
    editSelectedPoi,
    handleSheetOpenChange,
    handleCopyPoi,
    handleDeletePoi,
    handleSubmit,
  } = usePois();
  let sheetKey = "create";
  if (selectedPoi) {
    sheetKey = `${sheetMode}-${selectedPoi.id}`;
  }
  const isCopySuccess = feedback === "POI ID copied.";
  let feedbackClassName = "text-xs text-muted-foreground";
  if (isCopySuccess) {
    feedbackClassName = "flex items-center gap-1.5 text-xs text-success";
  }

  return (
    <PageLayout>
      <PageLayoutHeader
        title="Point of Interest Management"
        description="Manage POI location, activation and synchronization metadata."
      >
        <Button type="button" onClick={openCreateSheet}>
          <Plus aria-hidden="true" />
          {t("Add POI")}
        </Button>
      </PageLayoutHeader>
      <PageLayoutOverview aria-label={t("POI overview")}>
        <PageLayoutStat
          label="Total POIs"
          value={overviewSummary.totalPois.toLocaleString(locale)}
          description="Registered locations"
          icon={<MapPinned />}
        />
        <PageLayoutStat
          label="Active POIs"
          value={overviewSummary.activePois.toLocaleString(locale)}
          description="Ready for visitors"
          icon={<CircleCheck />}
          iconClassName="bg-success/10 text-success"
        />
        <PageLayoutStat
          label="Inactive POIs"
          value={overviewSummary.inactivePois.toLocaleString(locale)}
          description="Awaiting publication"
          icon={<CircleOff />}
          iconClassName="bg-warning/10 text-warning"
        />
        <PageLayoutStat
          label="Regions Covered"
          value={overviewSummary.coveredRegions.toLocaleString(locale)}
          description="Unique regions"
          icon={<Map />}
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
        <PoisTable
          pois={pois}
          categoryMappings={poiCategoryMappings}
          onViewPoi={openViewSheet}
          onEditPoi={openEditSheet}
          onCopyPoi={handleCopyPoi}
          onDeletePoi={handleDeletePoi}
        />
      </PageLayoutContent>
      <PoiFormSheet
        key={sheetKey}
        open={isSheetOpen}
        mode={sheetMode}
        poi={selectedPoi}
        categoryIds={selectedCategoryIds}
        canActivate={canActivateSelectedPoi}
        onOpenChange={handleSheetOpenChange}
        onSubmit={handleSubmit}
        onEdit={editSelectedPoi}
      />
    </PageLayout>
  );
}
