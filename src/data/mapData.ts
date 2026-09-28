import type { MonitoringZone, GeographyData } from "@/types";

// Mock fallback used only when USE_MOCK_DATA is true in src/services/api.ts.
// Mirrors the backend's app/data/zones.py and app/data/geography.py —
// real towns along the Ganga headwaters river system in Uttarakhand,
// India (Bhagirathi, Alaknanda, Mandakini valleys).
export const MAP_CENTER: [number, number] = [30.28, 78.75];

// confidence = probability >= 50 ? probability : 100 - probability
// (mirrors how the backend's model confidence is actually computed —
// how sure the model is of whichever class it picked, not the flood
// probability itself)
export const monitoringZones: MonitoringZone[] = [
  { id: "kedarnath", name: "Kedarnath", lat: 30.7346, lng: 79.0669, risk: "CRITICAL", probability: 88, confidence: 88, rainfall: 98, riverLevel: 210, soilMoisture: 82, radius: 2200 },
  { id: "chamoli", name: "Chamoli", lat: 30.4041, lng: 79.3200, risk: "HIGH", probability: 74, confidence: 74, rainfall: 70, riverLevel: 140, soilMoisture: 71, radius: 1900 },
  { id: "rudraprayag", name: "Rudraprayag", lat: 30.2843, lng: 78.9811, risk: "HIGH", probability: 68, confidence: 68, rainfall: 62, riverLevel: 160, soilMoisture: 66, radius: 1800 },
  { id: "devprayag", name: "Devprayag", lat: 30.1462, lng: 78.5978, risk: "HIGH", probability: 61, confidence: 61, rainfall: 55, riverLevel: 300, soilMoisture: 60, radius: 1700 },
  { id: "joshimath", name: "Joshimath", lat: 30.5553, lng: 79.5655, risk: "MODERATE", probability: 52, confidence: 52, rainfall: 45, riverLevel: 90, soilMoisture: 55, radius: 1600 },
  { id: "uttarkashi", name: "Uttarkashi", lat: 30.7268, lng: 78.4354, risk: "MODERATE", probability: 48, confidence: 52, rainfall: 40, riverLevel: 70, soilMoisture: 50, radius: 1500 },
  { id: "tehri", name: "New Tehri", lat: 30.3781, lng: 78.4805, risk: "MODERATE", probability: 44, confidence: 56, rainfall: 35, riverLevel: 60, soilMoisture: 48, radius: 1500 },
  { id: "srinagar-garhwal", name: "Srinagar (Garhwal)", lat: 30.2280, lng: 78.7862, risk: "MODERATE", probability: 41, confidence: 59, rainfall: 32, riverLevel: 130, soilMoisture: 46, radius: 1400 },
  { id: "rishikesh", name: "Rishikesh", lat: 30.1089, lng: 78.2676, risk: "LOW", probability: 24, confidence: 76, rainfall: 15, riverLevel: 340, soilMoisture: 32, radius: 1400 },
  { id: "dehradun", name: "Dehradun", lat: 30.3165, lng: 78.0322, risk: "LOW", probability: 20, confidence: 80, rainfall: 12, riverLevel: 25, soilMoisture: 30, radius: 1400 },
  { id: "haridwar", name: "Haridwar", lat: 29.9457, lng: 78.1642, risk: "LOW", probability: 18, confidence: 82, rainfall: 10, riverLevel: 380, soilMoisture: 28, radius: 1400 },
];

// Bhagirathi: Uttarkashi -> Tehri -> Devprayag (confluence)
const bhagirathiPath: [number, number][] = [
  [30.7268, 78.4354],
  [30.3781, 78.4805],
  [30.1462, 78.5978],
];

// Alaknanda: Joshimath -> Chamoli -> Rudraprayag -> Srinagar -> Devprayag
const alaknandaPath: [number, number][] = [
  [30.5553, 79.5655],
  [30.4041, 79.3200],
  [30.2843, 78.9811],
  [30.2280, 78.7862],
  [30.1462, 78.5978],
];

// Mandakini: Kedarnath -> Rudraprayag (joins Alaknanda)
const mandakiniPath: [number, number][] = [
  [30.7346, 79.0669],
  [30.2843, 78.9811],
];

// Ganga proper, downstream of the Devprayag confluence
const gangaPath: [number, number][] = [
  [30.1462, 78.5978],
  [30.1089, 78.2676],
  [29.9457, 78.1642],
];

export const riverPaths: [number, number][][] = [
  alaknandaPath,
  bhagirathiPath,
  mandakiniPath,
  gangaPath,
];

export const roadPaths: [number, number][][] = [
  // Rishikesh-Devprayag-Rudraprayag-Chamoli-Joshimath corridor
  [
    [30.1089, 78.2676],
    [30.1462, 78.5978],
    [30.2843, 78.9811],
    [30.4041, 79.3200],
    [30.5553, 79.5655],
  ],
  // Rishikesh-Tehri-Uttarkashi corridor
  [
    [30.1089, 78.2676],
    [30.3781, 78.4805],
    [30.7268, 78.4354],
  ],
  // Dehradun-Rishikesh-Haridwar
  [
    [30.3165, 78.0322],
    [30.1089, 78.2676],
    [29.9457, 78.1642],
  ],
  // Rudraprayag-Kedarnath approach road
  [
    [30.2843, 78.9811],
    [30.7346, 79.0669],
  ],
];

export const settlements: { name: string; lat: number; lng: number }[] = [
  { name: "Dehradun", lat: 30.3165, lng: 78.0322 },
  { name: "Rishikesh", lat: 30.1089, lng: 78.2676 },
  { name: "Haridwar", lat: 29.9457, lng: 78.1642 },
  { name: "Devprayag", lat: 30.1462, lng: 78.5978 },
  { name: "Srinagar (Garhwal)", lat: 30.2280, lng: 78.7862 },
  { name: "Rudraprayag", lat: 30.2843, lng: 78.9811 },
  { name: "New Tehri", lat: 30.3781, lng: 78.4805 },
  { name: "Uttarkashi", lat: 30.7268, lng: 78.4354 },
  { name: "Chamoli", lat: 30.4041, lng: 79.3200 },
  { name: "Joshimath", lat: 30.5553, lng: 79.5655 },
  { name: "Kedarnath", lat: 30.7346, lng: 79.0669 },
];

export const geographyMock: GeographyData = {
  mapCenter: MAP_CENTER,
  riverPaths,
  roadPaths,
  settlements,
};
