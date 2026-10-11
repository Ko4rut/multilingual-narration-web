"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout";
import { useLanguageOverview } from "../hooks/use-language-overview";
import type { LanguageOverviewProps } from "../types/language.types";
import { LanguageFilterBar } from "./LanguageFilterBar";
import { LanguageGrid } from "./LanguageGrid";

export function LanguageOverview({ q }: LanguageOverviewProps) {
  const {
    t,
    languages,
    totalCount,
    supportedCount,
    handleToggleStatus,
  } = useLanguageOverview();

  return (
    <PageLayout>
      <PageLayoutHeader
        title={t("Language Management")}
        description={t("Manage supported languages for narration content")}
      >
        <div className="flex items-center gap-3">
          <Button type="button">
            <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
            {t("Add Language")}
          </Button>
        </div>
      </PageLayoutHeader>

      <PageLayoutContent>
        <LanguageFilterBar
          initialQ={q}
          totalCount={totalCount}
          supportedCount={supportedCount}
        />

        <LanguageGrid
          q={q}
          languages={languages}
          onToggleStatus={handleToggleStatus}
        />
      </PageLayoutContent>
    </PageLayout>
  );
}
