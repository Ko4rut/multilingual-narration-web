import { createDashboardMock } from "../mocks/dashboard.mock";
import type { DashboardData, Period } from "../types";

// Replace this adapter with a server-side API call when the backend is ready.
export async function getDashboard(period: Period): Promise<DashboardData> {
  return createDashboardMock(period);
}
