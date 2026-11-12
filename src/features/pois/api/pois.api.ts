import { api, bearerAuthorization, getAllApiPages } from "@/service/api";
import type { PointOfInterest, PoiCreatePayload, PoiFormOptions, PoiUpdatePayload } from "../types/poi.types";

type PoiApiRecord = Omit<PointOfInterest, "latitude" | "longitude" | "trigger_radius_meter"> & {
  latitude: number | string;
  longitude: number | string;
  trigger_radius_meter: number | string;
};

function normalizePoi(poi: PoiApiRecord): PointOfInterest {
  return {
    ...poi,
    latitude: Number(poi.latitude),
    longitude: Number(poi.longitude),
    trigger_radius_meter: Number(poi.trigger_radius_meter),
  };
}

export async function getPois(accessToken: string) {
  const response = await getAllApiPages<PoiApiRecord>("/admin/pois", accessToken);
  return response.items.map(normalizePoi);
}

export async function getPoiOptions(accessToken: string) {
  const response = await api.get<PoiFormOptions>("/admin/pois/options", { headers: bearerAuthorization(accessToken) });
  return response.data;
}

export async function createPoi(accessToken: string, payload: PoiCreatePayload) {
  const response = await api.post<PoiApiRecord>("/admin/pois", payload, { headers: bearerAuthorization(accessToken) });
  return normalizePoi(response.data);
}

export async function updatePoi(accessToken: string, poiId: string, payload: PoiUpdatePayload) {
  const response = await api.patch<PoiApiRecord>(`/admin/pois/${encodeURIComponent(poiId)}`, payload, { headers: bearerAuthorization(accessToken) });
  return normalizePoi(response.data);
}

export async function getPoiQrCode(accessToken: string, poiId: string) {
  const response = await api.get<ArrayBuffer>(
    `/admin/pois/${encodeURIComponent(poiId)}/qr-code`,
    {
      headers: bearerAuthorization(accessToken),
      responseType: "arraybuffer",
    },
  );
  return `data:image/png;base64,${Buffer.from(response.data).toString("base64")}`;
}
