export type ContentStatus =
  | "published"
  | "pending_review"
  | "approved"
  | "draft"
  | "rejected";

export interface LanguageOption {
  id: string;
  code: string;
  name: string;
}

export interface PoiOption {
  id: string;
  name: string;
  image_url: string;
  location: string;
}

export interface PoiContentItem {
  id: string;
  poi_id: string;
  poi_name: string;
  poi_image_url: string;
  poi_location: string;
  language_id: string;
  language_code: string;
  language_name: string;
  narration_title: string;
  narration_script: string;
  content_status: ContentStatus;
  created_by_id: string;
  created_by_name: string;
  created_by_avatar: string;
  published_at: string;
  audio_url?: string;
  audio_size?: number;
  audio_source_type?: string;
}

export interface PoiContentFilterState {
  searchQuery: string;
  languageFilter: string;
  statusFilter: string;
  periodFilter: string;
  page: number;
  pageSize: number;
}
