import { api, bearerAuthorization, getAllApiPages } from "@/service/api";
import type { PoiContent, PoiContentCreatePayload, PoiContentOptions, PoiContentUpdatePayload, ReviewDecision } from "../types/poi-content.types";

export async function getPoiContents(accessToken: string) {
  const response = await getAllApiPages<PoiContent>("/admin/poi-contents", accessToken);
  return response.items;
}

export async function getPoiContentOptions(accessToken: string) {
  const response = await api.get<PoiContentOptions>("/admin/poi-contents/options", { headers: bearerAuthorization(accessToken) });
  return response.data;
}

export async function createPoiContent(accessToken: string, payload: PoiContentCreatePayload) {
  const response = await api.post<PoiContent>("/admin/poi-contents", payload, { headers: bearerAuthorization(accessToken) });
  return response.data;
}

export async function updatePoiContent(accessToken: string, id: string, payload: PoiContentUpdatePayload) {
  const response = await api.patch<PoiContent>(`/admin/poi-contents/${encodeURIComponent(id)}`, payload, { headers: bearerAuthorization(accessToken) });
  return response.data;
}

async function postWorkflow(accessToken: string, id: string, action: string, body?: object) {
  const response = await api.post<PoiContent>(`/admin/poi-contents/${encodeURIComponent(id)}/${action}`, body, { headers: bearerAuthorization(accessToken) });
  return response.data;
}

export function submitPoiContent(accessToken: string, id: string) { return postWorkflow(accessToken, id, "submit"); }
export function reviewPoiContent(accessToken: string, id: string, decision: ReviewDecision) { return postWorkflow(accessToken, id, "review", { decision }); }
export async function publishPoiContent(accessToken: string, id: string) {
  const response = await api.post<PoiContent>(
    `/admin/poi-contents/${encodeURIComponent(id)}/publish`,
    undefined,
    {
      headers: bearerAuthorization(accessToken),
      // Publish có thể phải chờ provider TTS sinh và lưu MP3 đồng bộ.
      timeout: 120_000,
    },
  );
  return response.data;
}
