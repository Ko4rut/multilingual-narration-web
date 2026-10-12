import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import type { CONTENT_STATUS } from "../constants/poi-content.constants";

/** Tập giá trị trạng thái hợp lệ của nội dung thuyết minh. */
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

/** Thuộc tính của bảng POI content và các thao tác trên từng hàng. */
export interface PoiContentTableProps {
  contents: readonly PoiContent[];
  onCopyContent: (content: PoiContent) => void;
  onViewContent: (content: PoiContent) => void;
  onEditContent: (content: PoiContent) => void;
  onDeleteContent: (content: PoiContent) => void;
}

/** Thuộc tính điều khiển sheet tạo mới, xem và chỉnh sửa POI content. */
export interface PoiContentFormSheetProps {
  open: boolean;
  mode: FeatureFormMode;
  content: PoiContent | null;
  poiOptions: readonly { value: string; label: string }[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void;
  onEdit: () => void;
}
