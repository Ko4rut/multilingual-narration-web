"use client";

import { useRef } from "react";

const AUDIO_SEEK_STEP_SECONDS = 10;

/** Điều khiển tua lùi và tua tới cho trình phát audio nghe thử. */
export function useAudioPreview() {
  const audioRef = useRef<HTMLAudioElement>(null);

  function seekBy(seconds: number) {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    let nextTime = Math.max(0, audio.currentTime + seconds);
    if (Number.isFinite(audio.duration)) {
      nextTime = Math.min(nextTime, audio.duration);
    }
    audio.currentTime = nextTime;
  }

  function rewindTenSeconds() {
    seekBy(-AUDIO_SEEK_STEP_SECONDS);
  }

  function forwardTenSeconds() {
    seekBy(AUDIO_SEEK_STEP_SECONDS);
  }

  return {
    audioRef,
    rewindTenSeconds,
    forwardTenSeconds,
  };
}
