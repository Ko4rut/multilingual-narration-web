import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACCESS_TOKEN_COOKIE,
  requireSession,
} from "@/features/auth/session";
import { getListeningDashboardSummary } from "../api/dashboard.api";
import { createDashboardMock } from "../mocks/dashboard.mock";
import type { DashboardData, Period } from "../types";

export async function getDashboard(period: Period): Promise<DashboardData> {
  await requireSession();
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    redirect("/login");
  }

  const summary = await getListeningDashboardSummary(accessToken);
  return createDashboardMock(period, summary.total_listening_sessions);
}
