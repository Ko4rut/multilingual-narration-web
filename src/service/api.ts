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
