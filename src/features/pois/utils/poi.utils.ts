import type { Locale } from "@/i18n/types";
import type { DataTableFilterOption } from "@/types/shared/data-table.types";
import { POI_STATUS } from "../constants/poi.constants";
import type { PoiCategoryMapping } from "../types/poi-category-mapping.types";
import type { PoiCategory } from "../types/poi-category.types";
import type {
  PointOfInterest,
  PoiCreatePayload,
  PoiUpdatePayload,
  PoisOverviewSummary,
} from "../types/poi.types";
import type { Region } from "../types/region.types";

/** Đọc một trường chuỗi từ FormData và loại bỏ khoảng trắng ở hai đầu. */
export function getPoiFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

/** Chỉ giữ các trường thực sự thay đổi để PATCH không tải lại ảnh không cần thiết. */
export function createPoiUpdatePayload(
  current: PointOfInterest,
  next: PoiCreatePayload,
): PoiUpdatePayload {
  const changes: PoiUpdatePayload = {};
  const scalarFields = [
    "region_id",
    "poi_name",
    "poi_location",
    "poi_image_url",
    "latitude",
    "longitude",
    "trigger_radius_meter",
    "poi_status",
  ] as const;

  scalarFields.forEach(function collectChangedField(field) {
    if (current[field] !== next[field]) {
      changes[field] = next[field] as never;
    }
  });

  const currentCategories = [...current.category_ids].sort();
  const nextCategories = [...next.category_ids].sort();
  if (currentCategories.join("\u0000") !== nextCategories.join("\u0000")) {
    changes.category_ids = next.category_ids;
  }
  return changes;
}

/** Đọc danh sách giá trị chuỗi duy nhất của một trường FormData. */
export function getUniquePoiFormValues(formData: FormData, key: string) {
  const values = formData.getAll(key).flatMap(function parseFormValue(value) {
    if (typeof value !== "string") {
      return [];
    }
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return [];
    }
    return [trimmedValue];
  });
  return [...new Set(values)];
}

/** Tổng hợp số lượng POI, trạng thái hoạt động và khu vực được bao phủ. */
export function createPoisOverviewSummary(
  pois: readonly PointOfInterest[],
): PoisOverviewSummary {
  const activePois = pois.filter(function findActivePoi(poi) {
    return poi.poi_status === POI_STATUS.ACTIVE;
  }).length;

  return {
    totalPois: pois.length,
    activePois,
    inactivePois: pois.length - activePois,
    coveredRegions: new Set(
      pois.map(function getRegionId(poi) {
        return poi.region_id;
      }),
    ).size,
  };
}

/** Lấy các mã category đã được gán cho một POI. */
export function getPoiCategoryIds(
  poiId: string | null,
  mappings: readonly PoiCategoryMapping[],
) {
  if (!poiId) {
    return [];
  }
  return mappings.flatMap(function findPoiCategoryId(mapping) {
    if (mapping.poi_id !== poiId) {
      return [];
    }
    return [mapping.poi_category_id];
  });
}

/** Tìm thông tin khu vực tham chiếu của POI theo ID. */
export function findPoiRegion(regionId: string, regions: readonly Region[]) {
  return (
    regions.find(function findRegion(region) {
      return region.id === regionId;
    }) ?? null
  );
}

/** Chuyển danh sách khu vực thành các lựa chọn lọc của DataTable. */
export function createRegionFilterOptions(
  regions: readonly Region[],
): readonly DataTableFilterOption[] {
  return regions.map(function createRegionOption(region) {
    return { value: region.id, label: region.region_name };
  });
}

/** Chuyển danh sách category thành các lựa chọn lọc của DataTable. */
export function createPoiCategoryFilterOptions(
  categories: readonly PoiCategory[],
): readonly DataTableFilterOption[] {
  return categories.map(function createCategoryOption(category) {
    return { value: category.id, label: category.category_name };
  });
}

/** Định dạng tọa độ thành chuỗi GPS dễ đọc, ví dụ 10.7720° N, 106.6983° E. */
export function formatCoordinates(lat: number, lng: number): string {
  let latDirection = "N";
  if (lat < 0) {
    latDirection = "S";
  }

  let lngDirection = "E";
  if (lng < 0) {
    lngDirection = "W";
  }

  const latText = `${Math.abs(lat).toFixed(4)}° ${latDirection}`;
  const lngText = `${Math.abs(lng).toFixed(4)}° ${lngDirection}`;

  return `${latText}, ${lngText}`;
}

/** Định dạng timestamp của POI theo locale hiện tại. */
export function formatPoiTimestamp(value: string, locale: Locale) {
  return new Date(value).toLocaleString(locale);
}
