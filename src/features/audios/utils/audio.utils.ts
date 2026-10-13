import type { AudioPoiContent } from "../types/audio.types";

/** Định dạng thời lượng giây thành phút và giây để hiển thị nhất quán. */
export function formatAudioDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/** Lấy content được liên kết với một bản ghi audio. */
export function findAudioPoiContent(
  contentId: string,
  contents: readonly AudioPoiContent[],
) {
  return contents.find(function findContent(content) {
    return content.id === contentId;
  });
}

/** Đọc và chuẩn hóa một giá trị chuỗi từ dữ liệu form audio. */
export function getAudioFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

/** Kiểm tra URL audio sử dụng giao thức HTTPS trước khi cập nhật dữ liệu. */
export function isValidAudioUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}


