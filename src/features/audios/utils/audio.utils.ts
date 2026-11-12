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

