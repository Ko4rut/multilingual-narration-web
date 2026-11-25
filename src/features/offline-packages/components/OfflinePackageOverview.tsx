"use client";

/** Màn hình quản lý các scope/release offline, giữ thao tác publish ở worker. */
import { Boxes, FolderCheck, Layers3, RefreshCw, Tags } from "lucide-react";

import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutOverview,
  PageLayoutStat,
} from "@/components/shared/PageLayout";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/settings/hooks/use-preferences";

import { useOfflinePackageManagement } from "../hooks/use-offline-package-management";
import { summarizeOfflinePackages } from "../utils";
import { OfflinePackageDetailSheet } from "./OfflinePackageDetailSheet";
import { OfflinePackageTable } from "./OfflinePackageTable";
import { PackageScopeFormSheet } from "./PackageScopeFormSheet";

export function OfflinePackageOverview() {
  const { t, locale } = usePreferences();
  const management = useOfflinePackageManagement();
  const summary = summarizeOfflinePackages(management.data.packages);

  return (
    <PageLayout>
      <PageLayoutHeader
        title="Offline Packages"
        description="Manage published packages and category-specific scopes."
      >
        <Button
          type="button"
          variant="outline"
          onClick={management.refresh}
          disabled={management.isLoading}
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          {t("Refresh")}
        </Button>
        <Button
          type="button"
          disabled={management.isLoading || management.loadError !== null}
          onClick={management.openScopeForm}
        >
          <Layers3 aria-hidden="true" className="size-4" />
          {t("Create package scope")}
        </Button>
      </PageLayoutHeader>

      <PageLayoutOverview aria-label={t("Offline packages overview")}>
        <PageLayoutStat
          label="Total packages"
          value={summary.total.toLocaleString(locale)}
          description="Registered package records"
          icon={<Boxes />}
        />
        <PageLayoutStat
          label="Published packages"
          value={summary.published.toLocaleString(locale)}
          description="Available to Mobile"
          icon={<FolderCheck />}
          iconClassName="bg-success/10 text-success"
        />
        <PageLayoutStat
          label="Building packages"
          value={summary.building.toLocaleString(locale)}
          description="Waiting for publication"
          icon={<Layers3 />}
        />
        <PageLayoutStat
          label="Category scopes"
          value={summary.categories.toLocaleString(locale)}
          description="Packages scoped to one POI category"
          icon={<Tags />}
        />
      </PageLayoutOverview>

      <div className="rounded-xl border border-border bg-card px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        {t("Packages are built and published automatically by the Backend. Creating a scope does not directly publish a package.")}
      </div>

      {management.isLoading && (
        <p role="status" className="text-sm text-muted-foreground">
          {t("Loading offline packages...")}
        </p>
      )}
      {management.loadError && (
        <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {t(management.loadError)}
        </div>
      )}
      {management.feedback && (
        <p role="status" className="rounded-lg border border-success/40 bg-success/10 p-3 text-xs text-success">
          {t(management.feedback)}
        </p>
      )}

      {!management.isLoading && management.loadError === null && (
        <PageLayoutContent>
          <OfflinePackageTable
            packages={management.data.packages}
            regions={management.data.regions}
            languages={management.data.languages}
            categories={management.data.categories}
            selectedPackageId={management.selectedPackage?.id ?? null}
            onSelectPackage={management.openPackageDetails}
          />
        </PageLayoutContent>
      )}

      <OfflinePackageDetailSheet
        open={management.isDetailOpen}
        packageRecord={management.selectedPackage}
        items={management.items}
        isLoadingItems={management.isLoadingItems}
        itemsError={management.itemsError}
        regions={management.data.regions}
        languages={management.data.languages}
        categories={management.data.categories}
        onOpenChange={management.changeDetailsOpen}
      />
      <PackageScopeFormSheet
        open={management.isScopeOpen}
        isSaving={management.isSavingScope}
        errorMessage={management.scopeError}
        regions={management.data.regions}
        languages={management.data.languages}
        categories={management.data.categories}
        onOpenChange={management.changeScopeOpen}
        onSubmit={management.submitScope}
      />
    </PageLayout>
  );
}
