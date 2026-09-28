import type { FloodPrediction } from "@/types";

// confidence = probability >= 50 ? probability : 100 - probability
export const predictions: FloodPrediction[] = [
  { id: "kedarnath", location: "Kedarnath", region: "Mandakini Valley", latitude: 30.7346, longitude: 79.0669, probability: 88, confidence: 88, risk: "CRITICAL", rainfall: 98, riverLevel: 210, soilMoisture: 82, updatedAt: "2m ago" },
  { id: "chamoli", location: "Chamoli", region: "Alaknanda Valley", latitude: 30.4041, longitude: 79.3200, probability: 74, confidence: 74, risk: "HIGH", rainfall: 70, riverLevel: 140, soilMoisture: 71, updatedAt: "3m ago" },
  { id: "rudraprayag", location: "Rudraprayag", region: "Alaknanda-Mandakini Confluence", latitude: 30.2843, longitude: 78.9811, probability: 68, confidence: 68, risk: "HIGH", rainfall: 62, riverLevel: 160, soilMoisture: 66, updatedAt: "5m ago" },
  { id: "devprayag", location: "Devprayag", region: "Ganga Origin Confluence", latitude: 30.1462, longitude: 78.5978, probability: 61, confidence: 61, risk: "HIGH", rainfall: 55, riverLevel: 300, soilMoisture: 60, updatedAt: "6m ago" },
  { id: "joshimath", location: "Joshimath", region: "Upper Alaknanda Valley", latitude: 30.5553, longitude: 79.5655, probability: 52, confidence: 52, risk: "MODERATE", rainfall: 45, riverLevel: 90, soilMoisture: 55, updatedAt: "8m ago" },
  { id: "uttarkashi", location: "Uttarkashi", region: "Bhagirathi Valley", latitude: 30.7268, longitude: 78.4354, probability: 48, confidence: 52, risk: "MODERATE", rainfall: 40, riverLevel: 70, soilMoisture: 50, updatedAt: "9m ago" },
  { id: "tehri", location: "New Tehri", region: "Bhagirathi Valley", latitude: 30.3781, longitude: 78.4805, probability: 44, confidence: 56, risk: "MODERATE", rainfall: 35, riverLevel: 60, soilMoisture: 48, updatedAt: "11m ago" },
  { id: "srinagar-garhwal", location: "Srinagar (Garhwal)", region: "Alaknanda Valley", latitude: 30.2280, longitude: 78.7862, probability: 41, confidence: 59, risk: "MODERATE", rainfall: 32, riverLevel: 130, soilMoisture: 46, updatedAt: "12m ago" },
  { id: "rishikesh", location: "Rishikesh", region: "Ganga Plains", latitude: 30.1089, longitude: 78.2676, probability: 24, confidence: 76, risk: "LOW", rainfall: 15, riverLevel: 340, soilMoisture: 32, updatedAt: "14m ago" },
  { id: "dehradun", location: "Dehradun", region: "Doon Valley", latitude: 30.3165, longitude: 78.0322, probability: 20, confidence: 80, risk: "LOW", rainfall: 12, riverLevel: 25, soilMoisture: 30, updatedAt: "16m ago" },
  { id: "haridwar", location: "Haridwar", region: "Ganga Plains", latitude: 29.9457, longitude: 78.1642, probability: 18, confidence: 82, risk: "LOW", rainfall: 10, riverLevel: 380, soilMoisture: 28, updatedAt: "18m ago" },
];
