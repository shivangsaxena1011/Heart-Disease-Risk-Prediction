"""
Model Information & Metrics router for HeartGuard AI.
Serves true training metrics, cross-validation scores, ROC curve coordinates, and feature importances.
"""

import json
import os
from fastapi import APIRouter, HTTPException, status

from ml.predict import ARTIFACTS_DIR, METADATA_PATH, FEATURE_IMPORTANCE_PATH

router = APIRouter()

@router.get(
    "/model-info",
    status_code=status.HTTP_200_OK,
    summary="Retrieve Real Model Performance Metrics",
    description="Returns cross-validation scores, stratified test evaluation metrics, confusion matrix, and feature importances computed on the UCI Cleveland dataset."
)
async def get_model_info():
    try:
        metrics_file = ARTIFACTS_DIR / "metrics.json"
        metadata_file = METADATA_PATH
        importance_file = FEATURE_IMPORTANCE_PATH

        if not os.path.exists(metrics_file) or not os.path.exists(metadata_file):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Model metrics artifacts are not found. Please ensure the training pipeline has executed."
            )

        with open(metrics_file, "r", encoding="utf-8") as f:
            metrics_data = json.load(f)

        with open(metadata_file, "r", encoding="utf-8") as f:
            metadata_data = json.load(f)

        feature_importance_data = []
        if os.path.exists(importance_file):
            with open(importance_file, "r", encoding="utf-8") as f:
                feature_importance_data = json.load(f)

        return {
            "metadata": metadata_data,
            "metrics": metrics_data,
            "feature_importance": feature_importance_data
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load model diagnostics metadata."
        )
