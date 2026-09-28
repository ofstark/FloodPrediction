import type { ModelMetrics } from "@/types";
import { USE_MOCK_DATA, mockDelay, apiGet } from "./api";

const mockMetrics: ModelMetrics = {
  model_type: "RandomForestClassifier",
  n_estimators: 250,
  max_depth: 6,
  n_train: 4800,
  n_test: 1200,
  flood_rate_in_data: 0.32,
  accuracy: 0.73,
  precision: 0.57,
  recall: 0.64,
  f1_score: 0.6,
  roc_auc: 0.79,
  cross_val_accuracy_mean: 0.73,
  cross_val_accuracy_std: 0.01,
  feature_importances: { rainfall: 0.46, soil_moisture: 0.25, river: 0.17, slope: 0.12 },
  trained_on: "synthetic domain-informed dataset",
};

/** GET /api/model/metrics — validation metrics for the trained Tier 2
 * classifier (accuracy, precision, recall, F1, ROC-AUC, feature
 * importances). See the backend's app/ml/train_model.py docstring for
 * what these numbers do and don't mean before presenting them anywhere. */
export async function getModelMetrics(): Promise<ModelMetrics> {
  if (USE_MOCK_DATA) return mockDelay(mockMetrics);
  return apiGet<ModelMetrics>("/model/metrics");
}
