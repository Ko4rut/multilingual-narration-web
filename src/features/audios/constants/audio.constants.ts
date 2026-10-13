export const AUDIO_SOURCE_TYPE = {
  RECORD: "RECORD",
  TTS: "TTS",
} as const;

export const AUDIO_SOURCE_TYPE_LABELS = {
  [AUDIO_SOURCE_TYPE.RECORD]: "Record",
  [AUDIO_SOURCE_TYPE.TTS]: "TTS",
} as const satisfies Record<
  (typeof AUDIO_SOURCE_TYPE)[keyof typeof AUDIO_SOURCE_TYPE],
  string
>;

export const AUDIO_SOURCE_TYPE_OPTIONS = [
  {
    value: AUDIO_SOURCE_TYPE.RECORD,
    label: AUDIO_SOURCE_TYPE_LABELS[AUDIO_SOURCE_TYPE.RECORD],
  },
  {
    value: AUDIO_SOURCE_TYPE.TTS,
    label: AUDIO_SOURCE_TYPE_LABELS[AUDIO_SOURCE_TYPE.TTS],
  },
] as const;

export const AUDIO_MIME_TYPE_OPTIONS = [
  { value: "audio/mpeg", label: "audio/mpeg" },
  { value: "audio/aac", label: "audio/aac" },
  { value: "audio/ogg", label: "audio/ogg" },
] as const;

export const AUDIO_LANGUAGE_STATUS = {
  SUPPORTED: "SUPPORTED",
  UNSUPPORTED: "UNSUPPORTED",
} as const;

export const AUDIO_CONTENT_STATUS = {
  DRAFT: "DRAFT",
  WAITING_APPROVAL: "WAITING_APPROVAL",
  REJECTED: "REJECTED",
  APPROVED: "APPROVED",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;
