/** Bản ghi danh mục POI trả về từ Catalog API. */
export interface PoiCategory {
  id: string;
  category_name: string;
  category_code: string;
}

export interface PoiCategoriesTableProps {
  categories: readonly PoiCategory[];
}
