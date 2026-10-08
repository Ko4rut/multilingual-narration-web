"use client";

import { Calendar, Plus } from "lucide-react";
import type { AudioOverviewProps } from "../types";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { AudioFilterBar } from "./AudioFilterBar";
import { AudioTable } from "./AudioTable";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";

export function AudioOverview({ q, source, field, page }: AudioOverviewProps) {  const { t } = usePreferences();

  return (
    <>
      <PageHeader
        title={t("Audio Management")}
        description={t("Manage audio narration files, upload recordings and generate TTS audio")}
      >
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline">
            <Calendar aria-hidden="true" className="w-4 h-4 mr-2 text-muted" />
            {t("Last 90 Days")}
          </Button>
          <Button type="button">
            <Plus aria-hidden="true" className="w-4 h-4 mr-2" />
            {t("Upload Audio")}
          </Button>
        </div>
      </PageHeader>
      
      <AudioFilterBar initialQ={q} initialSource={source} initialField={field} />
      <AudioTable q={q} source={source} field={field} currentPage={page} />
    </>
  );
}