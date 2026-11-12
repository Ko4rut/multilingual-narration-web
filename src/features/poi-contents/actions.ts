"use server";

import { getAccessToken } from "@/features/auth/session";
import { getApiErrorMessage } from "@/service/api";
import {
  createPoiContent,
  getPoiContentOptions,
  getPoiContents,
  publishPoiContent,
  reviewPoiContent,
  submitPoiContent,
  updatePoiContent,
} from "./api/poi-contents.api";
import type { PoiContentCreatePayload, PoiContentUpdatePayload, ReviewDecision } from "./types/poi-content.types";

async function runContentAction<T>(operation: (token: string) => Promise<T>, fallback: string) {
  try {
    const token = await getAccessToken();
    if (!token) return { data: null, error: "Your API session has expired. Please sign in again." };
    return { data: await operation(token), error: null };
  } catch (error) {
    return { data: null, error: getApiErrorMessage(error, fallback) };
  }
}

export async function loadPoiContentManagement() {
  return await runContentAction(async function load(token) {
    const [contents, options] = await Promise.all([getPoiContents(token), getPoiContentOptions(token)]);
    return { contents, options };
  }, "Unable to load POI content.");
}

export async function createPoiContentAction(payload: PoiContentCreatePayload) {
  return await runContentAction(function create(token) { return createPoiContent(token, payload); }, "Unable to create POI content.");
}

export async function updatePoiContentAction(id: string, payload: PoiContentUpdatePayload) {
  return await runContentAction(function update(token) { return updatePoiContent(token, id, payload); }, "Unable to update POI content.");
}

export async function submitPoiContentAction(id: string) {
  return await runContentAction(function submit(token) { return submitPoiContent(token, id); }, "Unable to submit POI content.");
}

export async function reviewPoiContentAction(id: string, decision: ReviewDecision) {
  return await runContentAction(function review(token) { return reviewPoiContent(token, id, decision); }, "Unable to review POI content.");
}

export async function publishPoiContentAction(id: string) {
  return await runContentAction(function publish(token) { return publishPoiContent(token, id); }, "Unable to publish POI content.");
}
