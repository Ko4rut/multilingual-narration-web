"use client";

import { useEffect, useMemo, useState } from "react";
import { loadAudioManagement } from "../actions";
import { AUDIO_SOURCE_TYPE } from "../constants/audio.constants";
import type { AudioLanguage, AudioPoi, AudioPoiContent, AudiosOverviewSummary, ContentAudio } from "../types/audio.types";

function createOverviewSummary(audios: readonly ContentAudio[]): AudiosOverviewSummary {
  let recordedAudios = 0;
  let ttsAudios = 0;
  let totalDurationSeconds = 0;
  audios.forEach(function add(audio) {
    if (audio.audio_source_type === AUDIO_SOURCE_TYPE.RECORD) recordedAudios += 1;
    if (audio.audio_source_type === AUDIO_SOURCE_TYPE.TTS) ttsAudios += 1;
    totalDurationSeconds += audio.audio_duration_sec;
  });
  return { totalAudios: audios.length, recordedAudios, ttsAudios, totalDurationSeconds };
}

export function useAudios() {
  const [audios, setAudios] = useState<ContentAudio[]>([]);
  const [audioContents, setAudioContents] = useState<AudioPoiContent[]>([]);
  const [audioLanguages, setAudioLanguages] = useState<AudioLanguage[]>([]);
  const [audioPois, setAudioPois] = useState<AudioPoi[]>([]);
  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(function loadAudioData() {
    let active = true;
    async function load() {
      const result = await loadAudioManagement();
      if (!active) return;
      if (!result.data) { setFeedback(result.error); setLoading(false); return; }
      setAudios(result.data.audios);
      setAudioContents(result.data.contents);
      setAudioLanguages(result.data.options.languages);
      setAudioPois(result.data.options.pois);
      setSelectedAudioId(result.data.audios[0]?.id ?? null);
      setLoading(false);
    }
    void load();
    return function cancel() { active = false; };
  }, []);

  const overviewSummary = useMemo(function getSummary() { return createOverviewSummary(audios); }, [audios]);
  const selectedAudio = audios.find(function find(audio) { return audio.id === selectedAudioId; }) ?? null;

  function handleSelectAudio(audio: ContentAudio) { setSelectedAudioId(audio.id); }
  async function handleCopyAudio(audio: ContentAudio) { try { await navigator.clipboard.writeText(audio.id); setFeedback("Audio ID copied."); } catch { setFeedback("Unable to copy the audio ID."); } }

  return { audios, overviewSummary, audioContents, audioLanguages, audioPois, selectedAudio, feedback, isLoading, handleSelectAudio, handleCopyAudio };
}
