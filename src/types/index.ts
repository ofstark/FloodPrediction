export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type { GeographyData, Settlement } from "./geography";

export interface FloodPrediction {
  id: string;
  location: string;
  region: string;
  latitude: number;
  longitude: number;
  probability: number; // 0-100 — P(flood) from the model
  risk: RiskLevel;
  confidence?: number | null; // 0-100 — how sure the model is of its own classification
  rainfall: number; // mm, last 6h
  riverLevel: number; // meters
  soilMoisture: number; // %
  updatedAt: string; // relative label
}

export interface AlertItem {
  id: string;
  title: string;
  location: string;
  severity: RiskLevel | "INFO";
  timestamp: string;
  status: "ACTIVE" | "RESOLVED" | "MONITORING";
  description?: string;
}

export interface TimeseriesPoint {
  time: string;
  value: number;
}

export interface HistoricalEvent {
  id: string;
  year: string;
  date: string;
  title: string;
  location: string;
  rainfall: RiskLevel | "UNKNOWN";
  riverStatus: RiskLevel | "UNKNOWN";
  impact: string;
  verified: boolean; // true = real, publicly documented event; false = illustrative placeholder
}

export interface MonitoringZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  risk: RiskLevel;
  probability: number;
  confidence?: number | null;
  rainfall: number;
  riverLevel: number;
  soilMoisture: number;
  radius: number;
}

export interface ModelMetrics {
  model_type?: string;
  n_estimators?: number;
  max_depth?: number;
  n_train?: number;
  n_test?: number;
  flood_rate_in_data?: number;
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1_score?: number;
  roc_auc?: number;
  cross_val_accuracy_mean?: number;
  cross_val_accuracy_std?: number;
  feature_importances?: Record<string, number>;
  trained_on?: string;
  error?: string;
}

export type SensorType =
  | "rainfall_mm_6h"
  | "soil_moisture_pct"
  | "river_discharge_m3s"
  | "river_discharge_rate";

export interface IoTReading {
  zone_id: string;
  sensor_type: SensorType | string;
  value: number;
  recorded_at: string;
  device_id?: string | null;
}

export interface IoTZoneStatus {
  zone_id: string;
  zone_name: string;
  connected: boolean;
  last_reading_at?: string | null;
  sensor_types: string[];
}

export interface DataSourceStatus {
  id: string;
  name: string;
  status: "Connected" | "Estimated" | "Available" | "Not Connected";
  description: string;
}

export interface SystemComponentStatus {
  id: string;
  name: string;
  status: "Operational" | "In-Memory" | "Not Connected";
}
