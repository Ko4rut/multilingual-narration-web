/**
 * Adapter FastAPI cho Offline Package Admin.
 * Admin đọc các bản ghi hiện hữu; scope registration chỉ dùng API server-side.
 */
import { api, bearerAuthorization, getAllApiPages } from "@/service/api";
import type {
  OfflineCatalogCategory,
  OfflineCatalogLanguage,
  OfflineCatalogRegion,
  OfflinePackage,
  OfflinePackageItem,
  OfflinePackageManagementData,
  PackageScopePayload,
} from "../types";

export async function getOfflinePackageManagement(
  accessToken: string,
): Promise<OfflinePackageManagementData> {
  const [page, regions, languages, categories] = await Promise.all([
    getAllApiPages<OfflinePackage>("/admin/offline/packages", accessToken),
    api.get<OfflineCatalogRegion[]>("/catalog/regions"),
    api.get<OfflineCatalogLanguage[]>("/catalog/languages"),
    api.get<OfflineCatalogCategory[]>("/catalog/categories"),
  ]);

  return {
    packages: page.items,
    regions: regions.data,
    languages: languages.data,
    categories: categories.data,
  };
}

export async function getOfflinePackageItems(
  accessToken: string,
  packageId: string,
): Promise<OfflinePackageItem[]> {
  const response = await api.get<OfflinePackageItem[]>(
    "/admin/offline/packages/" + encodeURIComponent(packageId) + "/items",
    { headers: bearerAuthorization(accessToken) },
  );
  return response.data;
}

/**
 * Endpoint scope registration được đề xuất cho Backend nhưng chưa triển khai.
 * Server action báo lỗi thật (không thêm package giả vào UI) nếu API là 404.
 */
export async function registerOfflinePackageScope(
  accessToken: string,
  payload: PackageScopePayload,
): Promise<void> {
  await api.post("/admin/offline/package-scopes", payload, {
    headers: bearerAuthorization(accessToken),
  });
}
