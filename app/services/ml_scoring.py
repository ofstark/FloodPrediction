"""
Tier 2 flood-risk scoring: a trained RandomForestClassifier, replacing
the Tier 1 hand-set weights with a model fit on data (see app/ml/train_model.py
for what "fit on data" means here — read that docstring before quoting
accuracy numbers anywhere; the honest caveat matters).

The model and its saved validation metrics are loaded once at import
time (process startup), not per-request — inference on a pre-loaded
scikit-learn RandomForest is fast (sub-millisecond), so there's no need
to cache predictions the way the slow external API calls are cached.
"""

import json
import pathlib
import joblib

from app.models.schemas import RiskLevel
from app.services.normalize import normalize_rainfall, normalize_river, normalize_soil, normalize_slope
from app.services.scoring import classify, compute_risk as compute_risk_tier1

_ML_DIR = pathlib.Path(__file__).parent.parent / "ml"
_MODEL_PATH = _ML_DIR / "model.joblib"
_METRICS_PATH = _ML_DIR / "metrics.json"

_model = None
_metrics: dict | None = None
_load_error: str | None = None

try:
    _model = joblib.load(_MODEL_PATH)
    with open(_METRICS_PATH) as f:
        _metrics = json.load(f)
except FileNotFoundError as exc:
    # Model hasn't been trained yet — run `python -m app.ml.train_model`.
    # The API falls back to Tier 1 scoring below rather than failing to
    # start, so a missing model doesn't take down the whole service.
    _load_error = str(exc)


def is_model_loaded() -> bool:
    return _model is not None


def get_metrics() -> dict:
    if _metrics is not None:
        return _metrics
    return {"error": _load_error or "Model not trained yet — run `python -m app.ml.train_model`."}


def compute_risk(
    rainfall_6h_mm: float,
    discharge_m3s: float,
    discharge_rate: float,
    soil_moisture_pct: float,
    slope_score: float,
) -> dict:
    """Tier 2 (trained model) score. Falls back to Tier 1 if the model
    failed to load, so the API stays functional either way."""
    rainfall_n = normalize_rainfall(rainfall_6h_mm)
    river_n = normalize_river(discharge_m3s, discharge_rate)
    soil_n = normalize_soil(soil_moisture_pct)
    slope_n = normalize_slope(slope_score)

    if _model is None:
        result = compute_risk_tier1(
            rainfall_6h_mm, discharge_m3s, discharge_rate, soil_moisture_pct, slope_score
        )
        result["model_used"] = "tier1_fallback"
        result["confidence"] = None
        return result

    features = [[rainfall_n, river_n, soil_n, slope_n]]
    proba = _model.predict_proba(features)[0]  # [p(no_flood), p(flood)]
    probability = round(float(proba[1]) * 100, 1)
    # Confidence = how sure the model is of whichever class it picked,
    # NOT the flood probability itself — a model that's 95% sure risk is
    # LOW has confidence 95%, not probability 95%. Different concepts.
    confidence = round(float(max(proba)) * 100, 1)

    return {
        "probability": probability,
        "risk": classify(probability),
        "confidence": confidence,
        "model_used": "random_forest_v1",
        "factors": {
            "rainfall": round(rainfall_n * 100, 1),
            "river": round(river_n * 100, 1),
            "soil": round(soil_n * 100, 1),
            "slope": round(slope_n * 100, 1),
        },
    }
