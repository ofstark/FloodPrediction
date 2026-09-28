import type { IoTZoneStatus } from "@/types";
import { USE_MOCK_DATA, mockDelay, apiGet } from "./api";

// Mock fallback: every zone shows as not-yet-connected — accurate for
// a deployment with no physical sensors installed yet, and it's the
// honest default rather than faking sensor connectivity.
const mockStatus: IoTZoneStatus[] = [
  { zone_id: "kedarnath", zone_name: "Kedarnath", connected: false, sensor_types: [] },
  { zone_id: "chamoli", zone_name: "Chamoli", connected: false, sensor_types: [] },
  { zone_id: "rudraprayag", zone_name: "Rudraprayag", connected: false, sensor_types: [] },
  { zone_id: "devprayag", zone_name: "Devprayag", connected: false, sensor_types: [] },
  { zone_id: "joshimath", zone_name: "Joshimath", connected: false, sensor_types: [] },
  { zone_id: "uttarkashi", zone_name: "Uttarkashi", connected: false, sensor_types: [] },
  { zone_id: "tehri", zone_name: "New Tehri", connected: false, sensor_types: [] },
  { zone_id: "srinagar-garhwal", zone_name: "Srinagar (Garhwal)", connected: false, sensor_types: [] },
  { zone_id: "rishikesh", zone_name: "Rishikesh", connected: false, sensor_types: [] },
  { zone_id: "dehradun", zone_name: "Dehradun", connected: false, sensor_types: [] },
  { zone_id: "haridwar", zone_name: "Haridwar", connected: false, sensor_types: [] },
];

/** GET /api/iot/status — per-zone: is a real sensor currently feeding
 * this location data, or is it running purely on the public API
 * estimate? A zone shows connected only if it has a reading within the
 * backend's freshness window (30 minutes by default). */
export async function getIoTStatus(): Promise<IoTZoneStatus[]> {
  if (USE_MOCK_DATA) return mockDelay(mockStatus);
  return apiGet<IoTZoneStatus[]>("/iot/status");
}
