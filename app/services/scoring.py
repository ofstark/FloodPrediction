"""
Tier 1 flood-risk scoring: an explainable, weighted combination of
normalized environmental factors. Kept alongside the Tier 2 trained
model (ml_scoring.py) as a transparent fallback and a sanity-check
baseline — if the ML model's output diverges wildly from this simple
formula for the same inputs, that's worth investigating before trusting
the model blindly.

`classify()` (probability -> LOW/MODERATE/HIGH/CRITICAL) is shared by
both tiers, since the threshold bands are a presentation choice
independent of how the probability was computed.
"""

from app.models.schemas import RiskLevel
from app.services.normalize import normalize_rainfall, normalize_river, normalize_soil, normalize_slope

WEIGHTS = {
    "rainfall": 0.35,
    "river": 0.25,
    "soil": 0.25,
    "slope": 0.15,
}


def classify(probability: float) -> RiskLevel:
    if probability < 30:
        return "LOW"
    if probability < 55:
        return "MODERATE"
    if probability < 75:
        return "HIGH"
    return "CRITICAL"


def compute_risk(
    rainfall_6h_mm: float,
    discharge_m3s: float,
    discharge_rate: float,
    soil_moisture_pct: float,
    slope_score: float,
) -> dict:
    """Tier 1 weighted-formula score — kept as a fallback and a baseline
    for comparison against the trained model's output."""
    rainfall_n = normalize_rainfall(rainfall_6h_mm)
    river_n = normalize_river(discharge_m3s, discharge_rate)
    soil_n = normalize_soil(soil_moisture_pct)
    slope_n = normalize_slope(slope_score)

    score = (
        WEIGHTS["rainfall"] * rainfall_n
        + WEIGHTS["river"] * river_n
        + WEIGHTS["soil"] * soil_n
        + WEIGHTS["slope"] * slope_n
    )
    probability = round(score * 100, 1)

    return {
        "probability": probability,
        "risk": classify(probability),
        "factors": {
            "rainfall": round(rainfall_n * 100, 1),
            "river": round(river_n * 100, 1),
            "soil": round(soil_n * 100, 1),
            "slope": round(slope_n * 100, 1),
        },
    }
