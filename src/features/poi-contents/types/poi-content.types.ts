import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import type { DataTableFilterOption } from "@/types/shared/data-table.types";
import type {
  CONTENT_STATUS,
  CONTENT_WORKFLOW_ACTION,
} from "../constants/poi-content.constants";

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
}

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
  onDeleteContent: (content: PoiContent) => void;
  onSubmitContent: (content: PoiContent) => void;
  onReviewContent: (content: PoiContent) => void;
  onPublishContent: (content: PoiContent) => void;
}

/** Thuộc tính điều khiển sheet tạo mới, xem và chỉnh sửa POI content. */
export interface PoiContentFormSheetProps {
  open: boolean;
  mode: FeatureFormMode;
  content: PoiContent | null;
  poiOptions: readonly DataTableFilterOption[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void;
  onEdit: () => void;
}

/** Thuộc tính của combobox tìm kiếm và chọn POI trong form content. */
export interface PoiContentPoiComboboxProps {
  id: string;
  name: string;
  options: readonly DataTableFilterOption[];
  defaultValue: string | null;
  disabled?: boolean;
  required?: boolean;
}

/** Thuộc tính của nút hành động quy trình được hiển thị theo trạng thái content. */
export interface PoiContentWorkflowActionProps {
  content: PoiContent;
  onSubmit: (content: PoiContent) => void;
  onReview: (content: PoiContent) => void;
  onPublish: (content: PoiContent) => void;
}

/** Thuộc tính điều khiển sheet phê duyệt hoặc từ chối nội dung. */
export interface PoiContentReviewSheetProps {
  open: boolean;
  content: PoiContent | null;
  reviewNote: string;
  errorMessage: string | null;
  onOpenChange: (open: boolean) => void;
  onReviewNoteChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
}

/** Thuộc tính điều khiển sheet kiểm tra audio và xuất bản nội dung. */
export interface PoiContentPublishSheetProps {
  open: boolean;
  content: PoiContent | null;
  hasValidAudio: boolean;
  audioDurationSeconds: number | null;
  audioMimeType: string | null;
  archivedContent: PoiContent | null;
  errorMessage: string | null;
  onOpenChange: (open: boolean) => void;
  onGenerateAudio: () => void;
  onPublish: () => void;
}
