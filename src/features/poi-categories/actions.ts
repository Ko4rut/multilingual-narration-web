"use server";

import { getApiErrorMessage } from "@/service/api";
import { getPoiCategories } from "./api/poi-category.api";

export async function loadPoiCategories() {
  try {
    return { data: await getPoiCategories(), error: null };
  } catch (error) {
    return {
      data: null,
      error: getApiErrorMessage(error, "Unable to load POI categories."),
    };
  }
}
