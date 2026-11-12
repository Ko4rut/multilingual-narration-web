import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "mans-session";
export const ACCESS_TOKEN_COOKIE = "mans-access-token";
export const SESSION_SECONDS = 60 * 60 * 8;
// AUTH_SECRET ký cookie session của lớp Next.js; production phải inject giá trị
// entropy cao, không dùng fallback chỉ dành cho phát triển cục bộ bên dưới.
const secret = process.env.AUTH_SECRET ?? "mans-local-demo-session-only";
const sign = (value: string) => createHmac("sha256", secret).update(value).digest("hex");

export function createSession() {
  const expires = String(Date.now() + SESSION_SECONDS * 1000);
  return `${expires}.${sign(expires)}`;
}

export function validSession(value?: string) {
  if (!value) return false;
  const [expires, signature, extra] = value.split(".");
  if (extra || !expires || !signature || !/^\d+$/.test(expires) || Number(expires) <= Date.now()) return false;
  const expected = Buffer.from(sign(expires));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function requireSession() {
  if (!validSession((await cookies()).get(SESSION_COOKIE)?.value)) redirect("/login");
}

/** Đọc access token sau khi xác nhận phiên Next.js còn hợp lệ. */
export async function getAccessToken() {
  await requireSession();
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}
