"use client";

import { useState } from "react";
import { MOCK_POI_CONTENTS } from "@/features/poi-contents/mocks/poi-content.mock";
import { POI_STATUS } from "@/features/pois/constants/poi.constants";
import { MOCK_POIS } from "@/features/pois/mocks/pois.mock";
import { canActivatePoi } from "@/features/pois/utils/utils";
import { MOCK_AUDIO_FILES } from "../mocks/audioData";
import type { ContentAudio } from "../types/audio.types";

export function useAudios() {
  const [audios, setAudios] = useState<ContentAudio[]>(
    function initializeAudios() {
      return [...MOCK_AUDIO_FILES];
    },
  );
  const [feedback, setFeedback] = useState<string | null>(null);

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

  return { audios, feedback, handleCopyAudio, handleDeleteAudio };
}
