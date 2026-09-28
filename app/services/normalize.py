"""
Pure feature-normalization functions — converts raw environmental
readings into the 0-1 feature space both the Tier 1 weighted formula
(scoring.py) and the Tier 2 trained model (ml_scoring.py, train_model.py)
operate on.

Deliberately dependency-free (no pydantic, no FastAPI) so the model
training script can import these without needing the full app installed.
"""


def normalize_rainfall(rainfall_6h_mm: float) -> float:
    """0mm -> 0.0, 100mm+ in 6h -> 1.0 (heavy-rain threshold)."""
    return min(rainfall_6h_mm / 100, 1.0)


def normalize_river(discharge_m3s: float, discharge_rate: float) -> float:
    """Combines absolute discharge level with its rate of rise.
    Since discharge scale varies wildly by river size, this leans
    mostly on the *rate of change* as the signal, with a small
    contribution from absolute magnitude."""
    rate_component = min(max(discharge_rate, 0) / 50, 1.0)  # 50 m3/s/day rise = severe
    level_component = min(discharge_m3s / 500, 1.0)  # crude magnitude signal
    return round(0.7 * rate_component + 0.3 * level_component, 3)


def normalize_soil(soil_moisture_pct: float) -> float:
    return min(soil_moisture_pct / 100, 1.0)


def normalize_slope(slope_score: float) -> float:
    return min(slope_score / 100, 1.0)
