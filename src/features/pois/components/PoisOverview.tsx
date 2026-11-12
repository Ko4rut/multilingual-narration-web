"use client";

import { CircleCheck, CircleOff, Map, MapPinned } from "lucide-react";
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
    regions,
    categories,
    overviewSummary,
    poiCategoryMappings,
    selectedPoi,
    selectedCategoryIds,
    sheetMode,
    isSheetOpen,
    feedback,
    isLoading,
    canActivateSelectedPoi,
    qrCodeDataUrl,
    isQrLoading,
    openCreateSheet,
    openViewSheet,
    openEditSheet,
    editSelectedPoi,
    handleSheetOpenChange,
    handleCopyPoi,
    handleDownloadQrCode,
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
        <Button type="button" onClick={openCreateSheet} disabled={isLoading}>
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
          regions={regions}
          categories={categories}
          onViewPoi={openViewSheet}
          onEditPoi={openEditSheet}
          onCopyPoi={handleCopyPoi}
        />
      </PageLayoutContent>
      <PoiFormSheet
        key={sheetKey}
        open={isSheetOpen}
        mode={sheetMode}
        poi={selectedPoi}
        categoryIds={selectedCategoryIds}
        canActivate={canActivateSelectedPoi}
        regions={regions}
        categories={categories}
        onOpenChange={handleSheetOpenChange}
        onSubmit={handleSubmit}
        onEdit={editSelectedPoi}
        qrCodeDataUrl={qrCodeDataUrl}
        isQrLoading={isQrLoading}
        onDownloadQrCode={handleDownloadQrCode}
      />
    </PageLayout>
  );
}
