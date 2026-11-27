"use server";

import { isAxiosError } from "axios";
import { getAccessToken } from "@/features/auth/session";
import { getApiErrorMessage } from "@/service/api";
import {
  createPoiCategory, deletePoiCategory, getPoiCategories, updatePoiCategory,
} from "./api/poi-category.api";
import type { PoiCategory, PoiCategoryCreatePayload, PoiCategoryUpdatePayload } from "./types/poi-category.types";
import { CATEGORY_CODE_PATTERN } from "./utils/poi-category.utils";

type Result<T> = { data: T | null; error: string | null };
const SESSION_ERROR = "Your API session has expired. Please sign in again.";

function mutationError(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 404 || error.response?.status === 405) {
      return "Category write API is not available on the Backend yet.";
    }
    if (error.response?.status === 409) {
      return getApiErrorMessage(error, "Category is referenced by other records or is duplicated.");
    }
  }
  return getApiErrorMessage(error, fallback);
}
function validName(name: unknown): name is string {
  return typeof name === "string" && name.trim().length > 0 && name.trim().length <= 120;
}
function validId(id: unknown): id is string {
  return typeof id === "string" && id.length > 0 && id.length <= 50;
}

export async function loadPoiCategories(): Promise<Result<PoiCategory[]>> {
  try {
    return { data: await getPoiCategories(), error: null };
  } catch (error) {
    return { data: null, error: getApiErrorMessage(error, "Unable to load POI categories.") };
  }
}
export async function createPoiCategoryAction(payload: PoiCategoryCreatePayload): Promise<Result<PoiCategory>> {
  if (!validName(payload.category_name) || typeof payload.category_code !== "string" ||
      payload.category_code.length > 30 || !CATEGORY_CODE_PATTERN.test(payload.category_code)) {
    return { data: null, error: "Complete the category name and code using a valid format." };
  }
  try {
    const token = await getAccessToken();
    if (!token) {
      return { data: null, error: SESSION_ERROR };
    }
    const data = await createPoiCategory(token, {
      category_name: payload.category_name.trim(),
      category_code: payload.category_code,
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: mutationError(error, "Unable to create Category.") };
  }
}
export async function updatePoiCategoryAction(
  categoryId: string, payload: PoiCategoryUpdatePayload,
): Promise<Result<PoiCategory>> {
  if (!validId(categoryId) || !validName(payload.category_name)) {
    return { data: null, error: "Enter a valid category name." };
  }
  try {
    const token = await getAccessToken();
    if (!token) {
      return { data: null, error: SESSION_ERROR };
    }
    const data = await updatePoiCategory(token, categoryId, {
      category_name: payload.category_name.trim(),
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: mutationError(error, "Unable to update Category.") };
  }
}
export async function deletePoiCategoryAction(categoryId: string): Promise<Result<boolean>> {
  if (!validId(categoryId)) {
    return { data: null, error: "Invalid Category ID." };
  }
  try {
    const token = await getAccessToken();
    if (!token) {
      return { data: null, error: SESSION_ERROR };
    }
    await deletePoiCategory(token, categoryId);
    return { data: true, error: null };
  } catch (error) {
    return { data: null, error: mutationError(error, "Unable to delete Category.") };
  }
}
