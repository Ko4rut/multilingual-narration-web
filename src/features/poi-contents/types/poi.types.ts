import type { POI_STATUS } from "../constants/poi.constants";

export type PoiStatus = (typeof POI_STATUS)[keyof typeof POI_STATUS];

/** Bản ghi Point_Of_Interests tham chiếu riêng của feature POI content. */
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
