"use client";

import { useMemo, useState } from "react";
import { MOCK_POI_CONTENTS } from "@/features/poi-contents/mocks/poi-content.mock";
import { POI_STATUS } from "@/features/pois/constants/poi.constants";
import { MOCK_POIS } from "@/features/pois/mocks/pois.mock";
import { canActivatePoi } from "@/features/pois/utils/poi.utils";
import { AUDIO_SOURCE_TYPE } from "../constants/audio.constants";
import { MOCK_AUDIO_FILES } from "../mocks/audios.mock";
import type {
  AudiosOverviewSummary,
  ContentAudio,
} from "../types/audio.types";

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
  const [feedback, setFeedback] = useState<string | null>(null);
  const overviewSummary = useMemo(function getOverviewSummary() {
    return createOverviewSummary(audios);
  }, [audios]);

  async function handleCopyAudio(audio: ContentAudio) {
    try {
      await navigator.clipboard.writeText(audio.id);
      setFeedback("Audio ID copied.");
    } catch {
      setFeedback("Unable to copy the audio ID.");
    }
  }

  function handleDeleteAudio(audio: ContentAudio) {
    const linkedContent = MOCK_POI_CONTENTS.find(function findContent(content) {
      return content.id === audio.poi_content_id;
    });
    const linkedPoi = MOCK_POIS.find(function findPoi(poi) {
      return poi.id === linkedContent?.poi_id;
    });
    if (linkedPoi?.poi_status === POI_STATUS.ACTIVE) {
      const remainingAudios = audios.filter(function keepAudio(candidate) {
        return candidate.id !== audio.id;
      });
      if (!canActivatePoi(linkedPoi.id, MOCK_POI_CONTENTS, remainingAudios)) {
        setFeedback(
          "This audio cannot be deleted because it keeps an active POI available.",
        );
        return;
      }
    }
    setAudios(function removeAudio(currentAudios) {
      return currentAudios.filter(function keepAudio(candidate) {
        return candidate.id !== audio.id;
      });
    });
    setFeedback("Audio deleted from demo data.");
  }

  return {
    audios,
    overviewSummary,
    feedback,
    handleCopyAudio,
    handleDeleteAudio,
  };
}
