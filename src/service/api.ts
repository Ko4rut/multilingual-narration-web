import axios, { AxiosError } from "axios";

const backendApiUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1";

/** HTTP client dùng ở server để kết nối MNR Backend. */
export const api = axios.create({
  baseURL: backendApiUrl,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

/** Tạo Authorization header dùng chung cho endpoint yêu cầu Bearer JWT. */
export function bearerAuthorization(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` };
}

export interface ApiPage<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
}

/** Đọc tuần tự toàn bộ các trang cho những bảng hiện đang phân trang ở client. */
export async function getAllApiPages<T>(
  path: string,
  accessToken: string,
): Promise<ApiPage<T>> {
  const limit = 100;
  let offset = 0;
  let total = 0;
  const items: T[] = [];

  do {
    const response = await api.get<ApiPage<T>>(path, {
      params: { offset, limit },
      headers: bearerAuthorization(accessToken),
    });
    items.push(...response.data.items);
    total = response.data.total;
    offset += response.data.items.length;
    if (response.data.items.length === 0) {
      break;
    }
  } while (offset < total);

  return { items, total, offset: 0, limit };
}

/** Chuẩn hóa lỗi Axios thành thông báo có thể trả an toàn cho form. */
export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof AxiosError)) {
    return fallback;
  }
  const detail = error.response?.data?.detail;
  if (typeof detail === "string" && detail.length > 0) {
    return detail;
  }
  if (!error.response) {
    return "Unable to connect to the backend API.";
  }
  return fallback;
}
