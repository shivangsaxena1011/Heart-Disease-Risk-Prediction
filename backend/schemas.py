"""
Pydantic validation schemas for HeartGuard AI.
Strict biological range enforcement and categorical domain validation.
"""

from typing import Any, Dict, List, Literal
from pydantic import BaseModel, Field, field_validator

class HeartAssessmentInput(BaseModel):
    # Step 1: Basic Information
    age: int = Field(
        ...,
        ge=18,
        le=120,
        description="Patient age in years (18-120)",
        examples=[54]
    )
    sex: int = Field(
        ...,
        ge=0,
        le=1,
        description="Biological sex: 1 = Male, 0 = Female",
        examples=[1]
    )

    # Step 2: Clinical Measurements
    trestbps: float = Field(
        ...,
        ge=70.0,
        le=260.0,
        description="Resting blood pressure in mm Hg (70-260)",
        examples=[135.0]
    )
    chol: float = Field(
        ...,
        ge=80.0,
        le=650.0,
        description="Serum cholesterol in mg/dL (80-650)",
        examples=[245.0]
    )
    fbs: int = Field(
        ...,
        ge=0,
        le=1,
        description="Fasting blood sugar > 120 mg/dL (1 = True, 0 = False)",
        examples=[0]
    )
    thalach: float = Field(
        ...,
        ge=60.0,
        le=240.0,
        description="Maximum heart rate achieved in bpm (60-240)",
        examples=[150.0]
    )

    # Step 3: Heart & Exercise Indicators
    cp: int = Field(
        ...,
        ge=1,
        le=4,
        description="Chest pain type: 1 = Typical Angina, 2 = Atypical Angina, 3 = Non-anginal, 4 = Asymptomatic",
        examples=[3]
    )
    restecg: int = Field(
        ...,
        ge=0,
        le=2,
        description="Resting ECG: 0 = Normal, 1 = ST-T Abnormality, 2 = LV Hypertrophy",
        examples=[0]
    )
    exang: int = Field(
        ...,
        ge=0,
        le=1,
        description="Exercise-induced angina: 1 = Yes, 0 = No",
        examples=[0]
    )
    oldpeak: float = Field(
        ...,
        ge=0.0,
        le=8.0,
        description="ST depression induced by exercise relative to rest (0.0-8.0 mm)",
        examples=[1.2]
    )
    slope: int = Field(
        ...,
        ge=1,
        le=3,
        description="Peak exercise ST slope: 1 = Upsloping, 2 = Flat, 3 = Downsloping",
        examples=[2]
    )

    # Step 4: Additional Clinical Information
    ca: int = Field(
        ...,
        ge=0,
        le=3,
        description="Number of major vessels (0-3) colored by fluoroscopy",
        examples=[0]
    )
    thal: int = Field(
        ...,
        description="Thalassemia scan: 3 = Normal, 6 = Fixed defect, 7 = Reversible defect",
        examples=[3]
    )

    @field_validator("thal")
    @classmethod
    def validate_thal(cls, v: int) -> int:
        if v not in [3, 6, 7]:
            raise ValueError("Thalassemia value must be 3 (Normal), 6 (Fixed defect), or 7 (Reversible defect).")
        return v

class FactorAttribution(BaseModel):
    feature: str
    label: str
    patient_value: Any
    impact_score: float
    direction: Literal["elevating", "lowering", "neutral"]

class RiskClassification(BaseModel):
    level: Literal["Lower", "Intermediate", "Higher"]
    title: str
    badge_color: str
    summary: str

class Recommendation(BaseModel):
    category: str
    title: str
    detail: str

class PredictionResponse(BaseModel):
    assessment_id: str
    timestamp: str
    model_name: str
    model_version: str = "HeartGuard Model v1.0"
    raw_prediction: int
    risk_probability: float
    risk_percentage: float
    risk_classification: RiskClassification
    top_contributing_factors: List[FactorAttribution]
    all_factor_attributions: List[FactorAttribution]
    recommendations: List[Recommendation]
    input_summary: Dict[str, Any]
    disclaimer: str
    emergency_notice: str
