import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import type { POI_STATUS } from "../constants/poi.constants";
import type { PoiCategoryMapping } from "./poi-category-mapping.types";

/** Tập giá trị trạng thái hợp lệ của POI. */
export type PoiStatus = (typeof POI_STATUS)[keyof typeof POI_STATUS];

/** Bản ghi Point_Of_Interests theo tài liệu thiết kế cơ sở dữ liệu. */
export interface PointOfInterest {
  id: string;
  region_id: string;
  poi_image_url: string;
  image_checksum_sha256: string | null;
  poi_qr_code: string;
  poi_name: string;
  poi_location: string;
  poi_status: PoiStatus;
  latitude: number;
  longitude: number;
  trigger_radius_meter: number;
  created_by: string;
  last_updated_by: string;
  created_at: string;
  last_updated_at: string;
}

/** Các chỉ số tổng quan được tính từ danh sách POI hiện tại. */
export interface PoisOverviewSummary {
  totalPois: number;
  activePois: number;
  inactivePois: number;
  coveredRegions: number;
}

/** Thuộc tính hiển thị badge trạng thái của POI. */
export interface PoisStatusBadgeProps {
  status: PoiStatus;
}

/** Thuộc tính của bảng POI và các thao tác trên từng hàng. */
export interface PoisTableProps {
  pois: readonly PointOfInterest[];
  categoryMappings: readonly PoiCategoryMapping[];
  onViewPoi: (poi: PointOfInterest) => void;
  onEditPoi: (poi: PointOfInterest) => void;
  onCopyPoi: (poi: PointOfInterest) => void;
  onDeletePoi: (poi: PointOfInterest) => void;
}

/** Thuộc tính điều khiển sheet tạo mới, xem và chỉnh sửa POI. */
export interface PoiFormSheetProps {
  open: boolean;
  mode: FeatureFormMode;
  poi: PointOfInterest | null;
  categoryIds: readonly string[];
  canActivate: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void;
  onEdit: () => void;
}
