import { AUDIO_SOURCE_TYPE } from "@/features/audios/constants/audio.constants";
import type { ContentAudio } from "@/features/audios/types/audio.types";
import { DEFAULT_MOCK_LANGUAGE_ID } from "@/features/languages/mocks/languages.mock";
import { CONTENT_STATUS } from "@/features/poi-contents/constants/poi-content.constants";
import type { PoiContent } from "@/features/poi-contents/types/poi-content.types";

/**
 * Utility functions for POI data transformations and formatting
 */

/**
 * Format latitude and longitude coordinates into a human-readable GPS string.
 * Example: 10.7720° N, 106.6983° E
 */
export function formatCoordinates(lat: number, lng: number): string {
  let latDirection = "N";
  if (lat < 0) {
    latDirection = "S";
  }

  let lngDirection = "E";
  if (lng < 0) {
    lngDirection = "W";
  }

  const latText = `${Math.abs(lat).toFixed(4)}° ${latDirection}`;
  const lngText = `${Math.abs(lng).toFixed(4)}° ${lngDirection}`;

  return `${latText}, ${lngText}`;
}

function isValidAudio(audio: ContentAudio) {
  const hasSupportedSource =
    audio.audio_source_type === AUDIO_SOURCE_TYPE.RECORD ||
    audio.audio_source_type === AUDIO_SOURCE_TYPE.TTS;

  return (
    hasSupportedSource &&
    audio.audio_url.length > 0 &&
    audio.audio_size > 0 &&
    audio.audio_duration_sec > 0 &&
    audio.audio_mime_type.startsWith("audio/") &&
    audio.audio_checksum_sha256.length === 64
  );
}

/** Kiểm tra đầy đủ điều kiện kích hoạt POI được mô tả trong thiết kế DB. */
export function canActivatePoi(
  poiId: string,
  contents: readonly PoiContent[],
  audios: readonly ContentAudio[],
) {
  return contents.some(function hasPublishableEnglishContent(content) {
    if (content.poi_id !== poiId) {
      return false;
    }
    if (content.language_id !== DEFAULT_MOCK_LANGUAGE_ID) {
      return false;
    }
    if (content.content_status !== CONTENT_STATUS.PUBLISHED) {
      return false;
    }

    const audio = audios.find(function findContentAudio(candidate) {
      return candidate.poi_content_id === content.id;
    });
    if (!audio) {
      return false;
    }
    return isValidAudio(audio);
  });
}
