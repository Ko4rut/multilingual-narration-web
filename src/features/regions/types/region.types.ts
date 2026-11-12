/** Bản ghi khu vực trả về từ Catalog API. */
export interface Region {
  id: string;
  region_name: string;
  region_code: string;
}

export interface RegionsTableProps {
  regions: readonly Region[];
}
