"use server";

import { getAccessToken } from "@/features/auth/session";
import { getPoiContentOptions, getPoiContents } from "@/features/poi-contents/api/poi-contents.api";
import { getApiErrorMessage } from "@/service/api";
import { getAudios } from "./api/audios.api";

export async function loadAudioManagement() {
  try {
    const token = await getAccessToken();
    if (!token) return { data: null, error: "Your API session has expired. Please sign in again." };
    const [audios, contents, options] = await Promise.all([
      getAudios(token),
      getPoiContents(token),
      getPoiContentOptions(token),
    ]);
    return { data: { audios, contents, options }, error: null };
  } catch (error) {
    return { data: null, error: getApiErrorMessage(error, "Unable to load audio records.") };
  }
}
