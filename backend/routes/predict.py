"""
Prediction router for HeartGuard AI.
Processes incoming risk screening requests, runs inference, and returns calibrated results.
"""

from datetime import datetime, timezone
import uuid
from fastapi import APIRouter, HTTPException, status
from backend.schemas import HeartAssessmentInput, PredictionResponse
from ml.predict import predict_heart_disease_risk

router = APIRouter()

@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Estimate Heart Disease Risk",
    description="Processes patient clinical features through the trained ML pipeline to output model-estimated cardiovascular risk and feature attributions."
)
async def predict_risk(payload: HeartAssessmentInput):
    try:
        data_dict = payload.model_dump()
        result = predict_heart_disease_risk(data_dict)
        
        assessment_id = f"HG-{uuid.uuid4().hex[:8].upper()}"
        timestamp = datetime.now(timezone.utc).isoformat()

        response_payload = {
            "assessment_id": assessment_id,
            "timestamp": timestamp,
            **result
        }
        return response_payload
    except Exception as e:
        # Prevent leaking filesystem or python tracebacks
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while computing the risk screening prediction. Please try again."
        )
