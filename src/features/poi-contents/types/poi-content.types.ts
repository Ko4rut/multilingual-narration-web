import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import type { CONTENT_STATUS } from "../constants/poi-content.constants";

export type ContentStatus =
  (typeof CONTENT_STATUS)[keyof typeof CONTENT_STATUS];

/** Bản ghi Poi_Contents theo tài liệu thiết kế cơ sở dữ liệu. */
export interface PoiContent {
  id: string;
  poi_id: string;
  language_id: string;
  narration_title: string;
  narration_script: string;
  content_version: number;
  content_status: ContentStatus;
  created_by: string;
  approved_by: string | null;
  published_by: string | null;
  created_at: string;
  approved_at: string | null;
  published_at: string | null;
}

export interface PoiContentStatusBadgeProps {
  status: ContentStatus;
}

export interface PoiContentTableProps {
  contents: readonly PoiContent[];
  onViewContent: (content: PoiContent) => void;
  onEditContent: (content: PoiContent) => void;
  onDeleteContent: (content: PoiContent) => void;
}

export interface PoiContentFormSheetProps {
  open: boolean;
  mode: FeatureFormMode;
  content: PoiContent | null;
  poiOptions: readonly { value: string; label: string }[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void;
  onEdit: () => void;
}
