"use client";

import { Plus } from "lucide-react";
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { usePois } from "../hooks/use-pois";
import { PoiFormSheet } from "./PoiFormSheet";
import { PoisTable } from "./PoisTable";

export function PoisOverview() {
  const { t } = usePreferences();
  const {
    pois,
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
    handleDeletePoi,
    handleSubmit,
  } = usePois();
  let sheetKey = "create";
  if (selectedPoi) {
    sheetKey = `${sheetMode}-${selectedPoi.id}`;
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
      {feedback && (
        <p className="text-xs text-muted-foreground" role="status">
          {t(feedback)}
        </p>
      )}
      <PageLayoutContent>
        <PoisTable
          pois={pois}
          categoryMappings={poiCategoryMappings}
          onViewPoi={openViewSheet}
          onEditPoi={openEditSheet}
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
