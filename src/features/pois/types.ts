export type PoiStatus = "active" | "inactive" | "maintenance";

/** Thuộc tính của badge ánh xạ trạng thái POI sang giao diện dùng chung. */
export interface PoisStatusBadgeProps {
  status: PoiStatus;
}

export interface Region {
  id: string;
  name: string;
}

export interface PoiCategory {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  language_code: string;
  language_name: string;
  is_active: boolean;
}

export interface PointOfInterest {
  id: string;
  region_id: string;
  image_url: string;
  qr_code: string;
  poi_priority: number;
  poi_name: string;
  latitude: number;
  longitude: number;
  trigger_radius: number; // in meters
  poi_location: string;
  created_by: string;
  is_active: boolean;
  status: PoiStatus;
  created_at: string;
  // Joined fields for display
  region_name: string;
  languages: string[];
  daily_plays: number;
}

export interface PoiFilterState {
  searchQuery: string;
  regionId: string;
  status: string;
  page: number;
  pageSize: number;
}

export interface PoisHeaderProps {
  onAddClick: () => void;
}

export interface CreatePoiSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regions: readonly Region[];
  onSubmit: (formData: FormData) => void;
}
