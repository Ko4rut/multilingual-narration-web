/** Hợp đồng quản lý Offline Package theo schema FastAPI hiện tại. */
export type OfflinePackageStatus = "BUILDING" | "PUBLISHED" | "FAILED";

export interface OfflinePackage {
  id: string;
  region_id: string;
  language_id: string;
  category_id: string | null;
  package_key: string;
  package_name: string;
  package_url: string | null;
  package_version: number;
  package_checksum_sha256: string | null;
  package_status: OfflinePackageStatus;
  total_size: number | null;
  schema_version: number;
  created_at: string;
  last_updated_at: string;
  published_at: string | null;
}

export interface OfflinePackageItem {
  id: string;
  package_id: string;
  poi_id: string;
  poi_content_id: string;
  audio_id: string;
  content_version: number;
  created_at: string;
  last_updated_at: string;
}

export interface OfflineCatalogRegion {
  id: string;
  region_name: string;
  region_code: string;
}

export interface OfflineCatalogLanguage {
  id: string;
  language_code: string;
  language_name: string;
  language_status: string;
}

export interface OfflineCatalogCategory {
  id: string;
  category_name: string;
  category_code: string;
}

export interface OfflinePackageManagementData {
  packages: OfflinePackage[];
  regions: OfflineCatalogRegion[];
  languages: OfflineCatalogLanguage[];
  categories: OfflineCatalogCategory[];
}

export interface PackageScopePayload {
  region_id: string;
  language_id: string;
  category_id: string | null;
}

export interface OfflinePackageTableProps {
  packages: OfflinePackage[];
  regions: OfflineCatalogRegion[];
  languages: OfflineCatalogLanguage[];
  categories: OfflineCatalogCategory[];
  selectedPackageId: string | null;
  onSelectPackage(packageRecord: OfflinePackage): void;
}

export interface OfflinePackageDetailSheetProps {
  open: boolean;
  packageRecord: OfflinePackage | null;
  items: OfflinePackageItem[];
  isLoadingItems: boolean;
  itemsError: string | null;
  regions: OfflineCatalogRegion[];
  languages: OfflineCatalogLanguage[];
  categories: OfflineCatalogCategory[];
  onOpenChange(open: boolean): void;
}

export interface PackageScopeFormSheetProps {
  open: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  regions: OfflineCatalogRegion[];
  languages: OfflineCatalogLanguage[];
  categories: OfflineCatalogCategory[];
  onOpenChange(open: boolean): void;
  onSubmit(data: FormData): void;
}
