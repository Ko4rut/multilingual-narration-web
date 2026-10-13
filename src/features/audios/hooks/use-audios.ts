"use client";

import { useMemo, useState } from "react";
import { POI_STATUS } from "@/features/pois/constants/poi.constants";
import { MOCK_POIS } from "@/features/pois/mocks/pois.mock";
import { canActivatePoi } from "@/features/pois/utils/poi.utils";
import { AUDIO_SOURCE_TYPE } from "../constants/audio.constants";
import { MOCK_AUDIO_FILES } from "../mocks/audios.mock";
import { MOCK_AUDIO_LANGUAGES } from "../mocks/languages.mock";
import { MOCK_AUDIO_POI_CONTENTS } from "../mocks/poi-contents.mock";
import { MOCK_AUDIO_POIS } from "../mocks/pois.mock";
import type {
  AudiosOverviewSummary,
  ContentAudio,
} from "../types/audio.types";
import {
  getAudioFormValue,
  isValidAudioUrl,
} from "../utils/audio.utils";

function createOverviewSummary(
  audios: readonly ContentAudio[],
): AudiosOverviewSummary {
  let recordedAudios = 0;
  let ttsAudios = 0;
  let totalDurationSeconds = 0;

  audios.forEach(function addAudioToSummary(audio) {
    if (audio.audio_source_type === AUDIO_SOURCE_TYPE.RECORD) {
      recordedAudios += 1;
    }
    if (audio.audio_source_type === AUDIO_SOURCE_TYPE.TTS) {
      ttsAudios += 1;
    }
    totalDurationSeconds += audio.audio_duration_sec;
  });

  return {
    totalAudios: audios.length,
    recordedAudios,
    ttsAudios,
    totalDurationSeconds,
  };
}

export function useAudios() {
  const [audios, setAudios] = useState<ContentAudio[]>(
    function initializeAudios() {
      return [...MOCK_AUDIO_FILES];
    },
  );
  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);
  const [editingAudioId, setEditingAudioId] = useState<string | null>(null);
  const [isEditSheetOpen, setEditSheetOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const overviewSummary = useMemo(function getOverviewSummary() {
    return createOverviewSummary(audios);
  }, [audios]);
  const selectedAudio =
    audios.find(function findSelectedAudio(audio) {
      return audio.id === selectedAudioId;
    }) ?? null;
  const editingAudio =
    audios.find(function findEditingAudio(audio) {
      return audio.id === editingAudioId;
    }) ?? null;

  function handleSelectAudio(audio: ContentAudio) {
    const hasAudio = audios.some(function findAudio(candidate) {
      return candidate.id === audio.id;
    });
    if (hasAudio) {
      setSelectedAudioId(audio.id);
    }
  }

  function openEditAudioSheet(audio: ContentAudio) {
    setEditingAudioId(audio.id);
    setSelectedAudioId(audio.id);
    setEditSheetOpen(true);
    setFormError(null);
    setFeedback(null);
  }

  function handleEditSheetOpenChange(open: boolean) {
    setEditSheetOpen(open);
    if (!open) {
      setEditingAudioId(null);
      setFormError(null);
    }
  }

  function handleEditAudio(formData: FormData) {
    if (!editingAudio) {
      return;
    }
    const audioUrl = getAudioFormValue(formData, "audio_url");
    if (!isValidAudioUrl(audioUrl)) {
      setFormError("Enter a valid HTTPS audio URL.");
      return;
    }

    setAudios(function updateAudios(currentAudios) {
      return currentAudios.map(function updateAudio(audio) {
        if (audio.id !== editingAudio.id) {
          return audio;
        }
        return {
          ...audio,
          audio_url: audioUrl,
          last_updated_at: new Date().toISOString(),
        };
      });
    });
    setSelectedAudioId(editingAudio.id);
    setEditSheetOpen(false);
    setEditingAudioId(null);
    setFormError(null);
    setFeedback("Audio URL updated in demo data.");
  }

  async function handleCopyAudio(audio: ContentAudio) {
    try {
      await navigator.clipboard.writeText(audio.id);
      setFeedback("Audio ID copied.");
    } catch {
      setFeedback("Unable to copy the audio ID.");
    }
  }

  function handleDeleteAudio(audio: ContentAudio) {
    const remainingAudios = audios.filter(function keepAudio(candidate) {
      return candidate.id !== audio.id;
    });
    const linkedContent = MOCK_AUDIO_POI_CONTENTS.find(function findContent(content) {
      return content.id === audio.poi_content_id;
    });
    const linkedPoi = MOCK_POIS.find(function findPoi(poi) {
      return poi.id === linkedContent?.poi_id;
    });
    if (linkedPoi?.poi_status === POI_STATUS.ACTIVE) {
      if (!canActivatePoi(linkedPoi.id, MOCK_AUDIO_POI_CONTENTS, remainingAudios)) {
        setFeedback(
          "This audio cannot be deleted because it keeps an active POI available.",
        );
        return;
      }
    }
    setAudios(remainingAudios);
    if (selectedAudioId === audio.id) {
      setSelectedAudioId(remainingAudios[0]?.id ?? null);
    }
    setFeedback("Audio deleted from demo data.");
  }

  return {
    audios,
    overviewSummary,
    audioContents: MOCK_AUDIO_POI_CONTENTS,
    audioLanguages: MOCK_AUDIO_LANGUAGES,
    audioPois: MOCK_AUDIO_POIS,
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
  };
}
