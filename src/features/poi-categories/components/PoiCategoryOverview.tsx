"use client";

import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PageLayout, PageLayoutContent, PageLayoutHeader,
} from "@/components/shared/PageLayout";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { usePoiCategories } from "../hooks/use-poi-categories";
import { PoiCategoryDeleteSheet } from "./PoiCategoryDeleteSheet";
import { PoiCategoryFormSheet } from "./PoiCategoryFormSheet";
import { PoiCategoriesTable } from "./PoiCategoriesTable";

/** Management screen for centrally defined POI Categories. */
export function PoiCategoryOverview() {
  const { t, locale } = usePreferences();
  const categories = usePoiCategories();
  let formKey = "category-create";
  if (categories.selectedCategory) {
    formKey = categories.sheetMode + "-" + categories.selectedCategory.id;
  }

  return (
    <PageLayout>
      <PageLayoutHeader
        title="POI Categories"
        description="Manage categories shared by POIs and offline packages."
      >
        <Button
          type="button"
          variant="outline"
          disabled={categories.isLoading}
          onClick={categories.reload}
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          {t("Refresh")}
        </Button>
        <Button
          type="button"
          onClick={categories.openCreateSheet}
          disabled={categories.isLoading || categories.errorMessage !== null}
        >
          <Plus aria-hidden="true" className="size-4" />
          {t("Add Category")}
        </Button>
      </PageLayoutHeader>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <p className="text-sm text-foreground">
          {t("Total Categories")}:{" "}
          <strong>{categories.categories.length.toLocaleString(locale)}</strong>
        </p>
        <p className="text-xs text-muted-foreground">
          {t("Category codes remain fixed after creation to protect offline package keys.")}
        </p>
      </div>

      {categories.feedback && (
        <p role="status" className="text-xs text-success">{t(categories.feedback)}</p>
      )}
      {categories.isLoading && (
        <p role="status" className="text-xs text-muted-foreground">
          {t("Loading POI categories...")}
        </p>
      )}
      {categories.errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {t(categories.errorMessage)}
        </p>
      )}

      {!categories.isLoading && (
        <PageLayoutContent>
          <PoiCategoriesTable
            categories={categories.categories}
            selectedCategoryId={categories.selectedCategory?.id ?? null}
            onViewCategory={categories.openViewSheet}
            onEditCategory={categories.openEditSheet}
            onDeleteCategory={categories.openDeleteSheet}
          />
        </PageLayoutContent>
      )}

      <PoiCategoryFormSheet
        key={formKey}
        open={categories.isSheetOpen}
        mode={categories.sheetMode}
        category={categories.selectedCategory}
        isSaving={categories.isSaving}
        errorMessage={categories.formError}
        onOpenChange={categories.changeSheetOpen}
        onEdit={categories.editSelectedCategory}
        onSubmit={categories.submitForm}
      />

      <PoiCategoryDeleteSheet
        open={categories.isDeleteOpen}
        category={categories.deleteCategory}
        confirmationCode={categories.deleteConfirmationCode}
        isDeleting={categories.isDeleting}
        errorMessage={categories.deleteError}
        onConfirmationCodeChange={categories.setDeleteConfirmationCode}
        onOpenChange={categories.changeDeleteOpen}
        onConfirm={categories.confirmDelete}
      />
    </PageLayout>
  );
}
