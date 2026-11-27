/** Hàm thuần định dạng thông tin package cho UI và bảng lọc. */
import type {
  OfflineCatalogCategory,
  OfflineCatalogLanguage,
  OfflineCatalogRegion,
  OfflinePackage,
  OfflinePackageStatus,
} from "./types";

export const NO_CATEGORY_SCOPE = "__none__";

export function getRegionName(
  regionId: string,
  regions: OfflineCatalogRegion[],
): string {
  return regions.find(function findRegion(item) {
    return item.id === regionId;
  })?.region_name ?? regionId;
}

export function getLanguageName(
  languageId: string,
  languages: OfflineCatalogLanguage[],
): string {
  return languages.find(function findLanguage(item) {
    return item.id === languageId;
  })?.language_name ?? languageId;
}

export function getCategoryName(
  categoryId: string | null,
  categories: OfflineCatalogCategory[],
): string {
  if (categoryId === null) {
    return "All POI categories";
  }
  return categories.find(function findCategory(item) {
    return item.id === categoryId;
  })?.category_name ?? categoryId;
}

export function formatPackageBytes(
  bytes: number | null,
  locale: string,
): string {
  if (bytes === null) {
    return "Unknown size";
  }
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(bytes / (1024 * 1024)) + " MiB";
}

export function formatPackageDate(
  value: string | null,
  locale: string,
): string {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString(locale);
}

export function getPackageStatusLabel(status: OfflinePackageStatus): string {
  if (status === "PUBLISHED") {
    return "Published";
  }
  if (status === "BUILDING") {
    return "Building";
  }
  return "Failed";
}

export function getPackageStatusTone(status: OfflinePackageStatus):
  "success" | "warning" | "destructive" {
  if (status === "PUBLISHED") {
    return "success";
  }
  if (status === "BUILDING") {
    return "warning";
  }
  return "destructive";
}

export function summarizeOfflinePackages(packages: OfflinePackage[]) {
  return {
    total: packages.length,
    published: packages.filter(function isPublished(item) {
      return item.package_status === "PUBLISHED";
    }).length,
    building: packages.filter(function isBuilding(item) {
      return item.package_status === "BUILDING";
    }).length,
    categories: packages.filter(function hasCategory(item) {
      return item.category_id !== null;
    }).length,
  };
}
