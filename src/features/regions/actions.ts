"use server";

import { getApiErrorMessage } from "@/service/api";
import { getRegions } from "./api/region.api";

export async function loadRegions() {
  try {
    return { data: await getRegions(), error: null };
  } catch (error) {
    return {
      data: null,
      error: getApiErrorMessage(error, "Unable to load regions."),
    };
  }
}
