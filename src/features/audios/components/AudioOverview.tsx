"use client";

import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { useAudios } from "../hooks/use-audios";
import { AudioTable } from "./AudioTable";

export function AudioOverview() {
  const { t } = usePreferences();
  const { audios, feedback, handleCopyAudio, handleDeleteAudio } = useAudios();

  return (
    <PageLayout>
      <PageLayoutHeader
        title="Audio Management"
        description="Manage audio assets and integrity metadata linked to POI content."
      />
      {feedback && (
        <p className="text-xs text-muted-foreground" role="status">
          {t(feedback)}
        </p>
      )}
      <PageLayoutContent>
        <AudioTable
          audios={audios}
          onCopyAudio={handleCopyAudio}
          onDeleteAudio={handleDeleteAudio}
        />
      </PageLayoutContent>
    </PageLayout>
  );
}
