import { getAllApiPages } from "@/service/api";
import type { ContentAudio } from "../types/audio.types";

export async function getAudios(accessToken: string) {
  const response = await getAllApiPages<ContentAudio>("/admin/audios", accessToken);
  return response.items;
}
