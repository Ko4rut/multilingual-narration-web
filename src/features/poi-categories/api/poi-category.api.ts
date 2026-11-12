import { api } from "@/service/api";
import type { PoiCategory } from "../types/poi-category.types";

/** Lấy danh sách danh mục POI ở chế độ chỉ đọc. */
export async function getPoiCategories() {
  const response = await api.get<PoiCategory[]>("/catalog/categories");
  return response.data;
}
