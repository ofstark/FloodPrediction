import type { FloodPrediction } from "@/types";
import { predictions as mockPredictions } from "@/data/predictions";
import { USE_MOCK_DATA, mockDelay, apiGet, apiPost } from "./api";

/** GET /api/predictions — future FastAPI endpoint. */
export async function getPredictions(): Promise<FloodPrediction[]> {
  if (USE_MOCK_DATA) return mockDelay(mockPredictions);
  return apiGet<FloodPrediction[]>("/predictions");
}

/** POST /api/predict — future FastAPI endpoint for on-demand inference. */
export async function requestPrediction(
  payload: Partial<FloodPrediction>
): Promise<FloodPrediction> {
  if (USE_MOCK_DATA) return mockDelay({ ...mockPredictions[0], ...payload });
  return apiPost<FloodPrediction>("/predict", payload);
}
