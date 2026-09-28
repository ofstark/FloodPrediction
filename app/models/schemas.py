from typing import Literal
from pydantic import BaseModel

RiskLevel = Literal["LOW", "MODERATE", "HIGH", "CRITICAL"]


class FloodPrediction(BaseModel):
    id: str
    location: str
    region: str
    latitude: float
    longitude: float
    probability: float  # 0-100 — P(flood) from the model
    risk: RiskLevel
    confidence: float | None = None  # 0-100 — how sure the model is of its own classification
    rainfall: float  # mm, last 6h
    riverLevel: float  # proxy: normalized river discharge, meters-equivalent
    soilMoisture: float  # %
    updatedAt: str


class MonitoringZone(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    risk: RiskLevel
    probability: float
    confidence: float | None = None
    rainfall: float
    riverLevel: float
    soilMoisture: float
    radius: int = 1800


class AlertItem(BaseModel):
    id: str
    title: str
    location: str
    severity: RiskLevel | Literal["INFO"]
    timestamp: str
    status: Literal["ACTIVE", "RESOLVED", "MONITORING"]
    description: str | None = None


class PredictRequest(BaseModel):
    latitude: float
    longitude: float
    location: str = "Custom Location"
    region: str = "Custom Region"


class SettlementOut(BaseModel):
    name: str
    lat: float
    lng: float


class GeographyResponse(BaseModel):
    mapCenter: tuple[float, float]
    riverPaths: list[list[tuple[float, float]]]
    roadPaths: list[list[tuple[float, float]]]
    settlements: list[SettlementOut]


class ModelMetrics(BaseModel):
    model_type: str | None = None
    n_estimators: int | None = None
    max_depth: int | None = None
    n_train: int | None = None
    n_test: int | None = None
    flood_rate_in_data: float | None = None
    accuracy: float | None = None
    precision: float | None = None
    recall: float | None = None
    f1_score: float | None = None
    roc_auc: float | None = None
    cross_val_accuracy_mean: float | None = None
    cross_val_accuracy_std: float | None = None
    feature_importances: dict[str, float] | None = None
    trained_on: str | None = None
    error: str | None = None


class HistoricalEventOut(BaseModel):
    id: str
    year: str
    date: str
    title: str
    location: str
    rainfall: str  # RiskLevel or "UNKNOWN" — free-form so real events can omit a quantified level
    riverStatus: str
    impact: str
    verified: bool  # True = real, publicly documented event; False = illustrative placeholder


class HistoricalEventIn(BaseModel):
    id: str
    year: str
    date: str
    title: str
    location: str
    rainfall: str = "UNKNOWN"
    riverStatus: str = "UNKNOWN"
    impact: str
    verified: bool = False


SensorType = Literal[
    "rainfall_mm_6h", "soil_moisture_pct", "river_discharge_m3s", "river_discharge_rate"
]


class IoTReadingIn(BaseModel):
    zone_id: str
    sensor_type: SensorType
    value: float
    device_id: str | None = None


class IoTReadingOut(BaseModel):
    zone_id: str
    sensor_type: str
    value: float
    recorded_at: str  # ISO 8601 UTC
    device_id: str | None = None


class IoTZoneStatus(BaseModel):
    zone_id: str
    zone_name: str
    connected: bool  # has at least one reading within the freshness window
    last_reading_at: str | None = None
    sensor_types: list[str] = []
