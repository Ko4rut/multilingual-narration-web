import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import type { DataTableFilterOption } from "@/types/shared/data-table.types";
import type {
  CONTENT_STATUS,
  CONTENT_WORKFLOW_ACTION,
} from "../constants/poi-content.constants";
import type { ContentAudio } from "@/features/audios/types/audio.types";
import type { Language } from "./language.types";
import type { PointOfInterest } from "./poi.types";

/** Tập giá trị trạng thái hợp lệ của nội dung thuyết minh. */
export type ContentStatus =
  (typeof CONTENT_STATUS)[keyof typeof CONTENT_STATUS];

/** Tập hành động có thể xuất hiện ở cột quy trình của nội dung. */
export type ContentWorkflowAction =
  (typeof CONTENT_WORKFLOW_ACTION)[keyof typeof CONTENT_WORKFLOW_ACTION];

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
  audio?: ContentAudio | null;
}

export interface PoiContentPage { items: PoiContent[]; total: number; offset: number; limit: number; }
export interface PoiContentOptions { pois: Pick<PointOfInterest, "id" | "poi_name">[]; languages: Language[]; }
export interface PoiContentCreatePayload { poi_id: string; language_id: string; narration_title: string; narration_script: string; }
export interface PoiContentUpdatePayload { narration_title: string; narration_script: string; }
export type ReviewDecision = "APPROVE" | "REJECT";

/** Các chỉ số tổng quan được tính từ danh sách POI content hiện tại. */
export interface PoiContentsOverviewSummary {
  totalContents: number;
  publishedContents: number;
  pendingContents: number;
  coveredLanguages: number;
}

/** Thuộc tính hiển thị badge trạng thái của POI content. */
export interface PoiContentStatusBadgeProps {
  status: ContentStatus;
}

/** Thuộc tính hiển thị metadata workflow bằng các trường form chỉ đọc. */
export interface PoiContentWorkflowFieldsProps {
  content: PoiContent | null;
  createdByFallback?: string;
}

/** Thuộc tính của bảng POI content và các thao tác trên từng hàng. */
export interface PoiContentTableProps {
  contents: readonly PoiContent[];
  onCopyContent: (content: PoiContent) => void;
  onViewContent: (content: PoiContent) => void;
  onEditContent: (content: PoiContent) => void;
  pois: readonly PointOfInterest[];
  languages: readonly Language[];
  onSubmitContent: (content: PoiContent) => void;
  onReviewContent: (content: PoiContent) => void;
  onPublishContent: (content: PoiContent) => void;
  disabledWorkflowContentId: string | null;
}

/** Thuộc tính điều khiển sheet tạo mới, xem và chỉnh sửa POI content. */
export interface PoiContentFormSheetProps {
  open: boolean;
  mode: FeatureFormMode;
  content: PoiContent | null;
  contents: readonly PoiContent[];
  poiOptions: readonly DataTableFilterOption[];
  onOpenChange: (open: boolean) => void;
  languages: readonly Language[];
  onSubmit: (formData: FormData) => void | Promise<void>;
  onEdit: () => void;
  hasValidAudio: boolean;
  isPublishing: boolean;
  audioDurationSeconds: number | null;
  audioMimeType: string | null;
  archivedContent: PoiContent | null;
  workflowError: string | null;
  onSubmitForApproval: () => void;
  onApprove: () => void;
  onReject: () => void;
  onPublish: () => void | Promise<void>;
}

/** Thuộc tính của combobox tìm kiếm và chọn POI trong form content. */
export interface PoiContentPoiComboboxProps {
  id: string;
  name: string;
  options: readonly DataTableFilterOption[];
  defaultValue: string | null;
  disabled?: boolean;
  required?: boolean;
  onValueChange?: (value: string | null) => void;
}

/** Thuộc tính của nút hành động quy trình được hiển thị theo trạng thái content. */
export interface PoiContentWorkflowActionProps {
  content: PoiContent;
  disabled: boolean;
  onSubmit: (content: PoiContent) => void;
  onReview: (content: PoiContent) => void;
  onPublish: (content: PoiContent) => void;
}
