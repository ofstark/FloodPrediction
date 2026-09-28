import type { HistoricalEvent } from "@/types";
import { historicalEvents as mockEvents } from "@/data/historical";
import { USE_MOCK_DATA, mockDelay, apiGet } from "./api";

/** GET /api/historical/events — real, publicly documented events plus
 * any illustrative placeholders, persisted in the backend's SQLite
 * store (seeded with Kedarnath 2013 and Chamoli 2021). */
export async function getHistoricalEvents(): Promise<HistoricalEvent[]> {
  if (USE_MOCK_DATA) return mockDelay(mockEvents);
  return apiGet<HistoricalEvent[]>("/historical/events");
}
