"use client";

import { AudioLines, Bot, Clock3, Mic2 } from "lucide-react";
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutOverview,
  PageLayoutStat,
} from "@/components/shared/PageLayout";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { useAudios } from "../hooks/use-audios";
import { AudioEditSheet } from "./AudioEditSheet";
import { AudioPreview } from "./AudioPreview";
import { AudioTable } from "./AudioTable";

export function AudioOverview() {
  const { t, locale } = usePreferences();
  const {
    audios,
    overviewSummary,
    audioContents,
    audioLanguages,
    audioPois,
    selectedAudio,
    editingAudio,
    isEditSheetOpen,
    formError,
    feedback,
    handleSelectAudio,
    openEditAudioSheet,
    handleEditSheetOpenChange,
    handleEditAudio,
    handleCopyAudio,
    handleDeleteAudio,
  } = useAudios();
  const totalDurationMinutes = Math.round(
    overviewSummary.totalDurationSeconds / 60,
  );

  return (
    <PageLayout>
      <PageLayoutHeader
        title="Audio Management"
        description="Manage audio assets and integrity metadata linked to POI content."
      />
      <PageLayoutOverview aria-label={t("Audio overview")}>
        <PageLayoutStat
          label="Total Audio"
          value={overviewSummary.totalAudios.toLocaleString(locale)}
          description="Audio assets"
          icon={<AudioLines />}
        />
        <PageLayoutStat
          label="Recorded Audio"
          value={overviewSummary.recordedAudios.toLocaleString(locale)}
          description="Human recordings"
          icon={<Mic2 />}
          iconClassName="bg-success/10 text-success"
        />
        <PageLayoutStat
          label="TTS Audio"
          value={overviewSummary.ttsAudios.toLocaleString(locale)}
          description="Generated narration"
          icon={<Bot />}
        />
        <PageLayoutStat
          label="Total Duration"
          value={`${totalDurationMinutes.toLocaleString(locale)} ${t("minutes")}`}
          description="Across all audio assets"
          icon={<Clock3 />}
          iconClassName="bg-warning/10 text-warning"
        />
      </PageLayoutOverview>
      <AudioPreview
        contents={audioContents}
        selectedAudio={selectedAudio}
      />
      {feedback && (
        <p className="text-xs text-muted-foreground" role="status">
          {t(feedback)}
        </p>
      )}
      <PageLayoutContent>
        <AudioTable
          audios={audios}
          languages={audioLanguages}
          contents={audioContents}
          pois={audioPois}
          selectedAudioId={selectedAudio?.id ?? null}
          onPreviewAudio={handleSelectAudio}
          onEditAudio={openEditAudioSheet}
          onCopyAudio={handleCopyAudio}
          onDeleteAudio={handleDeleteAudio}
        />
      </PageLayoutContent>
      <AudioEditSheet
        key={editingAudio?.id ?? "audio-edit-sheet"}
        open={isEditSheetOpen}
        audio={editingAudio}
        errorMessage={formError}
        onOpenChange={handleEditSheetOpenChange}
        onSubmit={handleEditAudio}
      />
    </PageLayout>
  );
}
