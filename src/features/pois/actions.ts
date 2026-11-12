"use server";

import { getAccessToken } from "@/features/auth/session";
import { getApiErrorMessage } from "@/service/api";
import { createPoi, getPoiOptions, getPoiQrCode, getPois, updatePoi } from "./api/pois.api";
import type { PoiCreatePayload, PoiUpdatePayload } from "./types/poi.types";

export async function loadPoiManagement() {
  try {
    const token = await getAccessToken();
    if (!token) return { data: null, error: "Your API session has expired. Please sign in again." };
    const [pois, options] = await Promise.all([getPois(token), getPoiOptions(token)]);
    return { data: { pois, options }, error: null };
  } catch (error) {
    return { data: null, error: getApiErrorMessage(error, "Unable to load POIs.") };
  }
}

export async function createPoiAction(payload: PoiCreatePayload) {
  try {
    const token = await getAccessToken();
    if (!token) return { data: null, error: "Your API session has expired. Please sign in again." };
    return { data: await createPoi(token, payload), error: null };
  } catch (error) {
    return { data: null, error: getApiErrorMessage(error, "Unable to create POI.") };
  }
}

export async function updatePoiAction(poiId: string, payload: PoiUpdatePayload) {
  try {
    const token = await getAccessToken();
    if (!token) return { data: null, error: "Your API session has expired. Please sign in again." };
    return { data: await updatePoi(token, poiId, payload), error: null };
  } catch (error) {
    return { data: null, error: getApiErrorMessage(error, "Unable to update POI.") };
  }
}

export async function loadPoiQrCodeAction(poiId: string) {
  try {
    const token = await getAccessToken();
    if (!token) return { data: null, error: "Your API session has expired. Please sign in again." };
    return { data: await getPoiQrCode(token, poiId), error: null };
  } catch (error) {
    return { data: null, error: getApiErrorMessage(error, "Unable to load the POI QR code.") };
  }
}
