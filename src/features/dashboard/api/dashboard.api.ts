import { api, bearerAuthorization } from "@/service/api";
import type { ListeningDashboardSummary } from "../types";

export async function getListeningDashboardSummary(
  accessToken: string,
): Promise<ListeningDashboardSummary> {
  const response = await api.get<ListeningDashboardSummary>(
    "/listening/dashboard",
    { headers: bearerAuthorization(accessToken) },
  );
  return response.data;
}
