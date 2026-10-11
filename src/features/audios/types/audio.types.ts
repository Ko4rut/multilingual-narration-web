import type { AUDIO_SOURCE_TYPE } from "../constants/audio.constants";

export type AudioSourceType =
  (typeof AUDIO_SOURCE_TYPE)[keyof typeof AUDIO_SOURCE_TYPE];

/** Bản ghi Content_Audios theo tài liệu thiết kế cơ sở dữ liệu. */
export interface ContentAudio {
  id: string;
  poi_content_id: string;
  audio_url: string;
  audio_size: number;
  audio_source_type: AudioSourceType;
  audio_duration_sec: number;
  audio_mime_type: string;
  audio_checksum_sha256: string;
  created_at: string;
  last_updated_at: string | null;
}

export interface AudioStatusBadgeProps {
  type: AudioSourceType;
}

export interface AudioTableProps {
  audios: readonly ContentAudio[];
  onCopyAudio: (audio: ContentAudio) => void;
  onDeleteAudio: (audio: ContentAudio) => void;
}
