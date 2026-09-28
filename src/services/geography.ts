import type { GeographyData } from "@/types";
import { geographyMock } from "@/data/mapData";
import { USE_MOCK_DATA, mockDelay, apiGet } from "./api";

/** GET /api/geography — future/live FastAPI endpoint for static basin
 * geometry (river course, roads, settlements, map center). Unlike
 * predictions/alerts this rarely changes, so callers can cache the
 * result for the session instead of polling. */
export async function getGeography(): Promise<GeographyData> {
  if (USE_MOCK_DATA) return mockDelay(geographyMock);
  return apiGet<GeographyData>("/geography");
}
