import type { LANGUAGE_STATUS } from "../constants/language.constants";

export type LanguageStatus =
  (typeof LANGUAGE_STATUS)[keyof typeof LANGUAGE_STATUS];

export interface Language {
  id: string;
  language_code: string;
  language_name: string;
  language_status: LanguageStatus;
}

export interface LanguageOverviewProps {
  q: string;
  status: string;
  page: number;
}

export interface LanguageFilterBarProps {
  initialQ: string;
  totalCount: number;
  supportedCount: number;
}

export interface LanguageTableProps {
  q: string;
  status: string;
  currentPage: number;
}

export interface LanguageGridProps {
  q: string;
  languages: Language[];
  onToggleStatus: (id: string) => void;
}

export interface LanguagePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
