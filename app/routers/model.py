from fastapi import APIRouter
from app.models.schemas import ModelMetrics
from app.services import ml_scoring

router = APIRouter(prefix="/api", tags=["model"])


@router.get("/model/metrics", response_model=ModelMetrics)
async def get_model_metrics():
    """Validation metrics from the last training run of the Tier 2
    classifier — accuracy, precision, recall, F1, ROC-AUC, feature
    importances. See app/ml/train_model.py's docstring for what these
    numbers do and don't mean (the model is trained on a synthetic,
    domain-informed dataset, not real historical flood records)."""
    return ModelMetrics(**ml_scoring.get_metrics())
