import type { ContentAudio } from "@/features/audios/types/audio.types";
import type { Locale } from "@/i18n/types";
import type { DataTableFilterOption } from "@/types/shared/data-table.types";
import {
  CONTENT_STATUS,
  CONTENT_WORKFLOW_ACTION,
} from "../constants/poi-content.constants";
import type { Language } from "../types/language.types";
import type {
  ContentWorkflowAction,
  PoiContent,
  PoiContentsOverviewSummary,
} from "../types/poi-content.types";
import type { PointOfInterest } from "../types/poi.types";

/** Đọc một trường chuỗi từ FormData và loại bỏ khoảng trắng ở hai đầu. */
export function getPoiContentFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

/** Tạo mã content dạng cont-ddmmyy-xxxx và tránh trùng dữ liệu hiện có. */
export function createPoiContentId(
  contents: readonly PoiContent[],
  creationDate: Date,
) {
  const day = String(creationDate.getDate()).padStart(2, "0");
  const month = String(creationDate.getMonth() + 1).padStart(2, "0");
  const year = String(creationDate.getFullYear()).slice(-2);
  let sequence = contents.length + 1;
  let id = `cont-${day}${month}${year}-${String(sequence).padStart(4, "0")}`;

  while (
    contents.some(function hasContent(candidate) {
      return candidate.id === id;
    })
  ) {
    sequence += 1;
    id = `cont-${day}${month}${year}-${String(sequence).padStart(4, "0")}`;
  }

  return id;
}

/** Tính phiên bản content kế tiếp của cùng một POI và ngôn ngữ. */
export function getNextPoiContentVersion(
  contents: readonly PoiContent[],
  poiId: string,
  languageId: string,
) {
  const versions = contents.flatMap(function getMatchingVersion(content) {
    if (content.poi_id !== poiId || content.language_id !== languageId) {
      return [];
    }
    return [content.content_version];
  });
  if (versions.length === 0) {
    return 1;
  }
  return Math.max(...versions) + 1;
}

/** Tổng hợp số content, trạng thái quy trình và số ngôn ngữ được bao phủ. */
export function createPoiContentsOverviewSummary(
  contents: readonly PoiContent[],
): PoiContentsOverviewSummary {
  const publishedContents = contents.filter(function findPublishedContent(
    content,
  ) {
    return content.content_status === CONTENT_STATUS.PUBLISHED;
  }).length;
  const pendingContents = contents.filter(function findPendingContent(content) {
    return (
      content.content_status === CONTENT_STATUS.WAITING_APPROVAL ||
      content.content_status === CONTENT_STATUS.APPROVED
    );
  }).length;

  return {
    totalContents: contents.length,
    publishedContents,
    pendingContents,
    coveredLanguages: new Set(
      contents.map(function getLanguageId(content) {
        return content.language_id;
      }),
    ).size,
  };
}

/** Định dạng timestamp của content hoặc trả về dấu gạch khi chưa có dữ liệu. */
export function formatPoiContentTimestamp(value: string | null,locale: Locale) {
  if (!value)
    return "—";
  return new Date(value).toLocaleString(locale);
}

/** Tìm ngôn ngữ tham chiếu của content theo ID. */
export function findPoiContentLanguage(
  languageId: string,
  languages: readonly Language[],
) {
  return (
    languages.find(function findLanguage(language) {
      return language.id === languageId;
    }) ?? null
  );
}

/** Tìm POI tham chiếu của content theo ID. */
export function findPoiContentPoi(
  poiId: string,
  pois: readonly PointOfInterest[],
) {
  return (
    pois.find(function findPoi(poi) {
      return poi.id === poiId;
    }) ?? null
  );
}

/** Chuyển danh sách ngôn ngữ thành các lựa chọn lọc của DataTable. */
export function createLanguageFilterOptions(
  languages: readonly Language[],
): readonly DataTableFilterOption[] {
  return languages.map(function createLanguageOption(language) {
    return { value: language.id, label: language.language_name };
  });
}

/** Chuyển danh sách POI thành lựa chọn lọc có tên và mã hiển thị riêng. */
export function createPoiFilterOptions(
  pois: readonly PointOfInterest[],
): readonly DataTableFilterOption[] {
  return pois.map(function createPoiOption(poi) {
    return {
      value: poi.id,
      label: poi.poi_name,
      description: poi.id,
    };
  });
}

/** Chỉ bản nháp hoặc nội dung bị từ chối mới được sửa trực tiếp. */
export function isPoiContentEditable(
  status: PoiContent["content_status"],
) {
  return (
    status === CONTENT_STATUS.DRAFT ||
    status === CONTENT_STATUS.REJECTED
  );
}

/** Xác định hành động tiếp theo được phép hiển thị từ trạng thái content hiện tại. */
export function getPoiContentWorkflowAction(
  status: PoiContent["content_status"],
): ContentWorkflowAction | null {
  if (status === CONTENT_STATUS.DRAFT) {
    return CONTENT_WORKFLOW_ACTION.SUBMIT;
  }
  if (status === CONTENT_STATUS.REJECTED) {
    return CONTENT_WORKFLOW_ACTION.RESUBMIT;
  }
  if (status === CONTENT_STATUS.WAITING_APPROVAL) {
    return CONTENT_WORKFLOW_ACTION.REVIEW;
  }
  if (
    status === CONTENT_STATUS.APPROVED ||
    status === CONTENT_STATUS.PUBLISHED
  ) {
    return CONTENT_WORKFLOW_ACTION.PUBLISH;
  }
  return null;
}

/** Kiểm tra audio có đủ metadata tối thiểu để content được xuất bản hay không. */
export function isValidPoiContentAudio(audio: ContentAudio) {
  const supportedMimeTypes = new Set([
    "audio/mpeg",
    "audio/aac",
    "audio/ogg",
    "audio/wav",
    "audio/mp4",
    "audio/webm",
  ]);
  return (
    /^https?:\/\/[^/\s]+/.test(audio.audio_url) &&
    audio.audio_size > 0 &&
    audio.audio_duration_sec > 0 &&
    supportedMimeTypes.has(audio.audio_mime_type) &&
    (audio.audio_source_type === "RECORD" || audio.audio_source_type === "TTS") &&
    /^[a-f0-9]{64}$/i.test(audio.audio_checksum_sha256)
  );
}

/** Tìm audio hợp lệ đang liên kết với một content. */
export function findValidPoiContentAudio(
  contentId: string,
  audios: readonly ContentAudio[],
) {
  return (
    audios.find(function findAudio(audio) {
      return (
        audio.poi_content_id === contentId && isValidPoiContentAudio(audio)
      );
    }) ?? null
  );
}

/** Tìm phiên bản đang xuất bản của cùng POI và ngôn ngữ để chuẩn bị lưu trữ. */
export function findPublishedPoiContentVersion(
  content: PoiContent,
  contents: readonly PoiContent[],
) {
  return (
    contents.find(function findPublishedContent(candidate) {
      return (
        candidate.id !== content.id &&
        candidate.poi_id === content.poi_id &&
        candidate.language_id === content.language_id &&
        candidate.content_status === CONTENT_STATUS.PUBLISHED
      );
    }) ?? null
  );
}
