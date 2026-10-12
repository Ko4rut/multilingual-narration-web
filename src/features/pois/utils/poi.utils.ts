import { AUDIO_SOURCE_TYPE } from "@/features/audios/constants/audio.constants";
import type { ContentAudio } from "@/features/audios/types/audio.types";
import { DEFAULT_MOCK_LANGUAGE_ID } from "@/features/languages/mocks/languages.mock";
import { CONTENT_STATUS } from "@/features/poi-contents/constants/poi-content.constants";
import type { PoiContent } from "@/features/poi-contents/types/poi-content.types";
import type { Locale } from "@/i18n/types";
import type { DataTableFilterOption } from "@/types/shared/data-table.types";
import {
  POI_STATUS,
  POI_STATUS_OPTIONS,
} from "../constants/poi.constants";
import type { PoiCategoryMapping } from "../types/poi-category-mapping.types";
import type { PoiCategory } from "../types/poi-category.types";
import type {
  PointOfInterest,
  PoisOverviewSummary,
  PoiStatus,
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

/** Chuẩn hóa giá trị trạng thái form về một trạng thái POI hợp lệ. */
export function parsePoiStatus(value: string): PoiStatus {
  const matchedStatus = POI_STATUS_OPTIONS.find(function findStatus(option) {
    return option.value === value;
  });
  return matchedStatus?.value ?? POI_STATUS.INACTIVE;
}

/** Tạo mã POI dạng poi-ddmmyy-xxxx và tránh trùng với dữ liệu hiện có. */
export function createPoiId(
  pois: readonly PointOfInterest[],
  creationDate: Date,
) {
  const day = String(creationDate.getDate()).padStart(2, "0");
  const month = String(creationDate.getMonth() + 1).padStart(2, "0");
  const year = String(creationDate.getFullYear()).slice(-2);
  let sequence = pois.length + 1;
  let id = `poi-${day}${month}${year}-${String(sequence).padStart(4, "0")}`;

  while (
    pois.some(function hasPoi(candidate) {
      return candidate.id === id;
    })
  ) {
    sequence += 1;
    id = `poi-${day}${month}${year}-${String(sequence).padStart(4, "0")}`;
  }

  return id;
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

/** Kiểm tra POI khác có trùng QR code hoặc địa điểm hay không. */
export function hasDuplicatePoi(
  pois: readonly PointOfInterest[],
  selectedPoiId: string | null,
  qrCode: string,
  location: string,
) {
  return pois.some(function findDuplicatePoi(poi) {
    if (poi.id === selectedPoiId) {
      return false;
    }
    return poi.poi_qr_code === qrCode || poi.poi_location === location;
  });
}

/** Kiểm tra danh sách mã category có chứa giá trị không tồn tại hay không. */
export function hasUnknownPoiCategory(
  categoryIds: readonly string[],
  categories: readonly PoiCategory[],
) {
  return categoryIds.some(function findUnknownCategory(categoryId) {
    return !categories.some(function findCategory(category) {
      return category.id === categoryId;
    });
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

/** Kiểm tra file audio có đủ metadata bắt buộc để xuất bản hay không. */
function isValidAudio(audio: ContentAudio) {
  const hasSupportedSource =
    audio.audio_source_type === AUDIO_SOURCE_TYPE.RECORD ||
    audio.audio_source_type === AUDIO_SOURCE_TYPE.TTS;

  return (
    hasSupportedSource &&
    audio.audio_url.length > 0 &&
    audio.audio_size > 0 &&
    audio.audio_duration_sec > 0 &&
    audio.audio_mime_type.startsWith("audio/") &&
    audio.audio_checksum_sha256.length === 64
  );
}

/** Kiểm tra đầy đủ điều kiện kích hoạt POI được mô tả trong thiết kế DB. */
export function canActivatePoi(
  poiId: string,
  contents: readonly PoiContent[],
  audios: readonly ContentAudio[],
) {
  return contents.some(function hasPublishableEnglishContent(content) {
    if (content.poi_id !== poiId) {
      return false;
    }
    if (content.language_id !== DEFAULT_MOCK_LANGUAGE_ID) {
      return false;
    }
    if (content.content_status !== CONTENT_STATUS.PUBLISHED) {
      return false;
    }

    const audio = audios.find(function findContentAudio(candidate) {
      return candidate.poi_content_id === content.id;
    });
    if (!audio) {
      return false;
    }
    return isValidAudio(audio);
  });
}
