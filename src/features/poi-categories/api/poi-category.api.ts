import { api, bearerAuthorization } from "@/service/api";
import type { PoiCategory, PoiCategoryCreatePayload, PoiCategoryUpdatePayload } from "../types/poi-category.types";

/** Public read endpoint shared by Web, POI and Mobile. */
export async function getPoiCategories(): Promise<PoiCategory[]> {
  const response = await api.get<PoiCategory[]>("/catalog/categories");
  return response.data;
}

/** Proposed write endpoints: require an implementation in the Backend Catalog domain. */
export async function createPoiCategory(token: string, payload: PoiCategoryCreatePayload): Promise<PoiCategory> {
  const response = await api.post<PoiCategory>("/admin/catalog/categories", payload, {
    headers: bearerAuthorization(token),
  });
  return response.data;
}
export async function updatePoiCategory(
  token: string, categoryId: string, payload: PoiCategoryUpdatePayload,
): Promise<PoiCategory> {
  const response = await api.patch<PoiCategory>(
    "/admin/catalog/categories/" + encodeURIComponent(categoryId),
    payload,
    { headers: bearerAuthorization(token) },
  );
  return response.data;
}
export async function deletePoiCategory(token: string, categoryId: string): Promise<void> {
  await api.delete("/admin/catalog/categories/" + encodeURIComponent(categoryId), {
    headers: bearerAuthorization(token),
  });
}
