import { api } from "@/service/api";
import type { Region } from "../types/region.types";

/** Lấy danh sách khu vực ở chế độ chỉ đọc. */
export async function getRegions() {
  const response = await api.get<Region[]>("/catalog/regions");
  return response.data;
}
