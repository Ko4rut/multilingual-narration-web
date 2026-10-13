import { AUDIO_SOURCE_TYPE } from "../constants/audio.constants";
import type { ContentAudio } from "../types/audio.types";

/** Dữ liệu mẫu bám sát các cột của bảng Content_Audios. */
export const MOCK_AUDIO_FILES: ContentAudio[] = [
  {
    id: "audio-030226-0001",
    poi_content_id: "cont-010226-0001",
    audio_url: "https://mdn.github.io/webaudio-examples/audio-basics/outfoxing.mp3",
    audio_size: 1831788,
    audio_source_type: AUDIO_SOURCE_TYPE.RECORD,
    audio_duration_sec: 97,
    audio_mime_type: "audio/mpeg",
    audio_checksum_sha256: "7f00803ccfb5be334f83e570aa58a1f7860e1fed9a5d8cec07b12d0e480c9fe7",
    created_at: "2026-02-03T09:45:00+07:00",
    last_updated_at: "2026-02-03T10:05:00+07:00",
  },
  {
    id: "audio-050226-0002",
    poi_content_id: "cont-040226-0002",
    audio_url: "https://mdn.github.io/webaudio-examples/media-source-buffer/viper.mp3",
    audio_size: 1314238,
    audio_source_type: AUDIO_SOURCE_TYPE.TTS,
    audio_duration_sec: 41,
    audio_mime_type: "audio/mpeg",
    audio_checksum_sha256: "600e0c5dd0f62a078cd42c854f0d18b66bc0ca48c63b952b88f4c9d6c8971d38",
    created_at: "2026-02-05T16:00:00+07:00",
    last_updated_at: null,
  },
  {
    id: "audio-120226-0003",
    poi_content_id: "cont-100226-0003",
    audio_url: "https://mdn.github.io/webaudio-examples/media-source-buffer/viper.ogg",
    audio_size: 678516,
    audio_source_type: AUDIO_SOURCE_TYPE.TTS,
    audio_duration_sec: 41,
    audio_mime_type: "audio/ogg",
    audio_checksum_sha256: "02c3fffefe8537f37f8002d0eff2ed3c49a98876a2f180ac432152674ccbb4ab",
    created_at: "2026-02-12T13:20:00+07:00",
    last_updated_at: "2026-02-12T13:48:00+07:00",
  },
  {
    id: "audio-070326-0007",
    poi_content_id: "cont-050326-0007",
    audio_url: "https://mdn.github.io/webaudio-examples/stereo-panner-node/viper.ogg",
    audio_size: 678516,
    audio_source_type: AUDIO_SOURCE_TYPE.RECORD,
    audio_duration_sec: 41,
    audio_mime_type: "audio/ogg",
    audio_checksum_sha256: "02c3fffefe8537f37f8002d0eff2ed3c49a98876a2f180ac432152674ccbb4ab",
    created_at: "2026-03-07T09:55:00+07:00",
    last_updated_at: "2026-03-07T10:12:00+07:00",
  },
];
