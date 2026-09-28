import type { MonitoringZone } from "@/types";
import { monitoringZones } from "@/data/mapData";
import { USE_MOCK_DATA, mockDelay, apiGet } from "./api";

/** GET /api/locations — future FastAPI endpoint. */
export async function getMonitoringZones(): Promise<MonitoringZone[]> {
  if (USE_MOCK_DATA) return mockDelay(monitoringZones);
  return apiGet<MonitoringZone[]>("/locations");
}

/** GET /api/risk-map — future FastAPI endpoint for full GIS risk layer data. */
export async function getRiskMapLayer(): Promise<MonitoringZone[]> {
  if (USE_MOCK_DATA) return mockDelay(monitoringZones);
  return apiGet<MonitoringZone[]>("/risk-map");
}
