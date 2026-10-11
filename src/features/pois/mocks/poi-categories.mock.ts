import type { PoiCategory } from "../types/poi-category.types";

/** Danh mục POI mẫu; category_code hợp lệ cho việc tạo package_key. */
export const MOCK_POI_CATEGORIES: PoiCategory[] = [
  {
    id: "poi-category-0001",
    category_name: "Historical Site",
    category_code: "historical-site",
  },
  {
    id: "poi-category-0002",
    category_name: "Museum",
    category_code: "museum",
  },
  {
    id: "poi-category-0003",
    category_name: "Religious Site",
    category_code: "religious-site",
  },
  {
    id: "poi-category-0004",
    category_name: "Market",
    category_code: "market",
  },
  {
    id: "poi-category-0005",
    category_name: "Architecture",
    category_code: "architecture",
  },
  {
    id: "poi-category-0006",
    category_name: "Park and Nature",
    category_code: "park-and-nature",
  },
  {
    id: "poi-category-0007",
    category_name: "Entertainment",
    category_code: "entertainment",
  },
  {
    id: "poi-category-0008",
    category_name: "Modern Landmark",
    category_code: "modern-landmark",
  },
];
