import type {
  AUDIO_CONTENT_STATUS,
  AUDIO_LANGUAGE_STATUS,
  AUDIO_SOURCE_TYPE,
} from "../constants/audio.constants";

export type AudioSourceType =
  (typeof AUDIO_SOURCE_TYPE)[keyof typeof AUDIO_SOURCE_TYPE];

/** Trạng thái ngôn ngữ trong dữ liệu tham chiếu riêng của feature audio. */
export type AudioLanguageStatus =
  (typeof AUDIO_LANGUAGE_STATUS)[keyof typeof AUDIO_LANGUAGE_STATUS];

/** Trạng thái content trong dữ liệu tham chiếu riêng của feature audio. */
export type AudioContentStatus =
  (typeof AUDIO_CONTENT_STATUS)[keyof typeof AUDIO_CONTENT_STATUS];

/** Bản ghi Languages được feature audio sử dụng khi lọc dữ liệu. */
export interface AudioLanguage {
  id: string;
  language_code: string;
  language_name: string;
  language_status: AudioLanguageStatus;
}

/** Thông tin POI tối thiểu được feature audio sử dụng khi lọc dữ liệu. */
export interface AudioPoi {
  id: string;
  poi_name: string;
}

/** Bản ghi Poi_Contents riêng của feature audio để tra cứu content và ngôn ngữ. */
export interface AudioPoiContent {
  id: string;
  poi_id: string;
  language_id: string;
  narration_title: string;
  narration_script: string;
  content_version: number;
  content_status: AudioContentStatus;
  created_by: string;
  approved_by: string | null;
  published_by: string | null;
  created_at: string;
  approved_at: string | null;
  published_at: string | null;
}

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

export interface AudiosOverviewSummary {
  totalAudios: number;
  recordedAudios: number;
  ttsAudios: number;
  totalDurationSeconds: number;
}

export interface AudioStatusBadgeProps {
  type: AudioSourceType;
}

export interface AudioTableProps {
  audios: readonly ContentAudio[];
  languages: readonly AudioLanguage[];
  contents: readonly AudioPoiContent[];
  pois: readonly AudioPoi[];
  selectedAudioId: string | null;
  onPreviewAudio: (audio: ContentAudio) => void;
  onEditAudio: (audio: ContentAudio) => void;
  onCopyAudio: (audio: ContentAudio) => void;
  onDeleteAudio: (audio: ContentAudio) => void;
}

/** Thuộc tính khu vực nghe thử và lựa chọn bản ghi âm thanh. */
export interface AudioPreviewProps {
  contents: readonly AudioPoiContent[];
  selectedAudio: ContentAudio | null;
}

/** Thuộc tính sheet chỉnh sửa đường dẫn nguồn của một bản ghi audio. */
export interface AudioEditSheetProps {
  open: boolean;
  audio: ContentAudio | null;
  errorMessage: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void;
}
