export type AudioSourceType = "Recorded" | "TTS";

export type AudioSearchField = "all" | "name" | "poi" | "lang" | "duration" | "checksum" | "date";

export type AudioFile = {
  id: string;
  name: string;
  size: string;
  poi: string;
  lang: string;
  langCode: string;
  type: AudioSourceType;
  duration: string;
  checksum: string;
  date: string;
};


export type AudioOverviewProps = {
  q: string;
  source: string;
  field: string;
  page: number;
};

export type AudioFilterBarProps = {
  initialQ: string;
  initialSource: string;
  initialField: string;
};

export type AudioTableProps = {
  q: string;
  source: string;
  field: string;
  currentPage: number;
};

export type AudioStatusBadgeProps = {
  type: AudioSourceType;
};

export type AudioPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};