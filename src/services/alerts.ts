import type { AlertItem } from "@/types";
import { alerts as mockAlerts } from "@/data/alerts";
import { USE_MOCK_DATA, mockDelay, apiGet } from "./api";

/** GET /api/alerts — future FastAPI endpoint. */
export async function getAlerts(): Promise<AlertItem[]> {
  if (USE_MOCK_DATA) return mockDelay(mockAlerts);
  return apiGet<AlertItem[]>("/alerts");
}
