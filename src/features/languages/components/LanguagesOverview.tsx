"use client";

import {
  CircleCheck,
  CircleOff,
  Globe2,
  Languages,
  Plus,
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
import { useLanguages } from "../hooks/use-languages";
import { LanguageFormSheet } from "./LanguageFormSheet";
import { LanguagesTable } from "./LanguagesTable";

/** Trang tổng quan và quản lý danh mục ngôn ngữ của hệ thống. */
export function LanguageOverview() {
  const { t, locale } = usePreferences();
  const {
    languages,
    overviewSummary,
    selectedLanguage,
    sheetMode,
    isSheetOpen,
    formError,
    feedback,
    openCreateSheet,
    openViewSheet,
    openEditSheet,
    editSelectedLanguage,
    handleSheetOpenChange,
    handleToggleStatus,
    handleSubmit,
  } = useLanguages();
  let sheetKey = "create";
  if (selectedLanguage) {
    sheetKey = `${sheetMode}-${selectedLanguage.id}`;
  }

  return (
    <PageLayout>
      <PageLayoutHeader
        title="Language Management"
        description="Manage supported languages for narration content"
      >
        <Button type="button" onClick={openCreateSheet}>
          <Plus aria-hidden="true" />
          {t("Add Language")}
        </Button>
      </PageLayoutHeader>

      <PageLayoutOverview aria-label={t("Language overview")}>
        <PageLayoutStat
          label="Total Languages"
          value={overviewSummary.totalLanguages.toLocaleString(locale)}
          description="Catalog entries"
          icon={<Languages />}
        />
        <PageLayoutStat
          label="Supported Languages"
          value={overviewSummary.supportedLanguages.toLocaleString(locale)}
          description="Available for new content"
          icon={<CircleCheck />}
          iconClassName="bg-success/10 text-success"
        />
        <PageLayoutStat
          label="Unsupported Languages"
          value={overviewSummary.unsupportedLanguages.toLocaleString(locale)}
          description="Distribution paused"
          icon={<CircleOff />}
          iconClassName="bg-warning/10 text-warning"
        />
        <PageLayoutStat
          label="ISO Standards"
          value={overviewSummary.isoCodeLengths.toLocaleString(locale)}
          description="2- or 3-letter codes"
          icon={<Globe2 />}
        />
      </PageLayoutOverview>

      {feedback && (
        <p role="status" className="text-xs text-success">
          {t(feedback)}
        </p>
      )}

      <PageLayoutContent>
        <LanguagesTable
          languages={languages}
          onViewLanguage={openViewSheet}
          onEditLanguage={openEditSheet}
          onToggleStatus={handleToggleStatus}
        />
      </PageLayoutContent>

      <LanguageFormSheet
        key={sheetKey}
        open={isSheetOpen}
        mode={sheetMode}
        language={selectedLanguage}
        errorMessage={formError}
        onOpenChange={handleSheetOpenChange}
        onSubmit={handleSubmit}
        onEdit={editSelectedLanguage}
      />
    </PageLayout>
  );
}
