"""
Trains the flood-risk classifier (Tier 2) and saves it for the API to load.

HONEST DISCLOSURE, read this before presenting the "accuracy" numbers
anywhere: there is no public, labeled, historical flood dataset bundled
here. Getting real ground-truth records (which locations flooded, when,
given what conditions) requires either a government archive (e.g. NDMA,
state disaster management authorities) or your own compiled event log.

In the absence of that, this script generates a SYNTHETIC dataset where
the labels are produced by a domain-informed rule (heavier rainfall +
faster-rising river + saturated soil + steep terrain => higher flood
probability, plus interaction effects and random noise) rather than by
real recorded outcomes. Training and evaluating a real scikit-learn
classifier on that data is still a genuine, working ML pipeline — the
model, the train/test split, the cross-validation, and the metrics are
all real. What's synthetic is the ground truth the model is learning
from, which is why the "accuracy" figure means "how well the model
learned the synthetic rule," not "how well it predicts real floods."

Replace `generate_synthetic_dataset()` with a loader for real historical
records the moment you have them — nothing else in this file, or in
app/services/ml_scoring.py, needs to change: same features in, same
model type, same save path out.

Run with:
    python -m app.ml.train_model
"""

import json
import pathlib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import joblib

from app.services.normalize import normalize_rainfall, normalize_river, normalize_soil, normalize_slope

MODEL_DIR = pathlib.Path(__file__).parent
MODEL_PATH = MODEL_DIR / "model.joblib"
METRICS_PATH = MODEL_DIR / "metrics.json"

FEATURE_NAMES = ["rainfall", "river", "soil_moisture", "slope"]
RANDOM_STATE = 42


def sigmoid(x: np.ndarray) -> np.ndarray:
    return 1 / (1 + np.exp(-x))


def generate_synthetic_dataset(n_samples: int = 6000, seed: int = RANDOM_STATE):
    """Generates domain-informed synthetic (features, labels).

    Raw values are sampled from distributions roughly shaped like real
    environmental readings (rainfall is right-skewed — mostly light,
    occasionally heavy; river discharge is log-normal; etc.), then run
    through the SAME normalize_* functions the live API uses, so the
    model trains on exactly the feature space it will see in production.
    """
    rng = np.random.default_rng(seed)

    rainfall_mm = np.clip(rng.exponential(scale=22, size=n_samples), 0, 160)
    discharge = np.clip(rng.lognormal(mean=3.2, sigma=1.0, size=n_samples), 0, 650)
    discharge_rate = np.clip(rng.normal(loc=3, scale=16, size=n_samples), -50, 110)
    soil_moisture = np.clip(rng.normal(loc=45, scale=22, size=n_samples), 0, 100)
    slope_score = np.clip(rng.uniform(0, 100, size=n_samples), 0, 100)

    rainfall_n = np.array([normalize_rainfall(v) for v in rainfall_mm])
    river_n = np.array([normalize_river(d, r) for d, r in zip(discharge, discharge_rate)])
    soil_n = np.array([normalize_soil(v) for v in soil_moisture])
    slope_n = np.array([normalize_slope(v) for v in slope_score])

    # Domain-informed ground truth rule (this is the synthetic part —
    # see module docstring). Coefficients are hand-set to reflect the
    # same rough priorities as the Tier 1 formula, plus interaction
    # terms a linear weighted-sum couldn't capture, plus noise so the
    # relationship isn't perfectly learnable (as real data wouldn't be).
    z = (
        4.2 * rainfall_n
        + 3.4 * river_n
        + 2.6 * soil_n
        + 1.6 * slope_n
        + 2.2 * (rainfall_n * soil_n)          # saturated soil amplifies rainfall's effect
        + 1.8 * (river_n * rainfall_n)         # rising river during active rain is worse
        - 4.6                                    # baseline shift so most samples are low-risk
    )
    noise = rng.normal(0, 0.6, size=n_samples)
    p_true = sigmoid(z + noise)
    labels = rng.binomial(1, p_true)

    X = np.column_stack([rainfall_n, river_n, soil_n, slope_n])
    return X, labels


def train_and_evaluate():
    X, y = generate_synthetic_dataset()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=250,
        max_depth=6,
        min_samples_leaf=8,
        random_state=RANDOM_STATE,
        class_weight="balanced",
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    cv_scores = cross_val_score(model, X, y, cv=5, scoring="accuracy")

    metrics = {
        "model_type": "RandomForestClassifier",
        "n_estimators": 250,
        "max_depth": 6,
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
        "flood_rate_in_data": round(float(np.mean(y)), 4),
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "precision": round(float(precision_score(y_test, y_pred)), 4),
        "recall": round(float(recall_score(y_test, y_pred)), 4),
        "f1_score": round(float(f1_score(y_test, y_pred)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, y_proba)), 4),
        "cross_val_accuracy_mean": round(float(cv_scores.mean()), 4),
        "cross_val_accuracy_std": round(float(cv_scores.std()), 4),
        "feature_importances": {
            name: round(float(imp), 4)
            for name, imp in zip(FEATURE_NAMES, model.feature_importances_)
        },
        "trained_on": "synthetic domain-informed dataset — see app/ml/train_model.py docstring",
    }

    joblib.dump(model, MODEL_PATH)
    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"Model saved to {MODEL_PATH}")
    print(f"Metrics saved to {METRICS_PATH}")
    print(json.dumps(metrics, indent=2))
    return metrics


if __name__ == "__main__":
    train_and_evaluate()
