"""
Inference & Explainability Engine for HeartGuard AI.
Loads the trained pipeline and generates calibrated risk probabilities,
categorical risk classifications, localized feature attributions, and clinical educational recommendations.
"""

import json
import os
from typing import Any, Dict, List
import joblib
import numpy as np
import pandas as pd

try:
    from ml.preprocessing import ALL_FEATURES, CATEGORICAL_FEATURES, NUMERICAL_FEATURES
except ImportError:
    from preprocessing import ALL_FEATURES, CATEGORICAL_FEATURES, NUMERICAL_FEATURES

from pathlib import Path

ARTIFACTS_DIR = Path(__file__).resolve().parent / "artifacts"
MODEL_PATH = ARTIFACTS_DIR / "heart_disease_model.joblib"
METADATA_PATH = ARTIFACTS_DIR / "metadata.json"
FEATURE_IMPORTANCE_PATH = ARTIFACTS_DIR / "feature_importance.json"

_model = None
_metadata = None
_feature_importance = None

# Baseline clinical medians from the training population for counterfactual attribution
CLINICAL_BASELINES = {
    "age": 55.0,
    "sex": 1.0,
    "cp": 3.0,
    "trestbps": 130.0,
    "chol": 240.0,
    "fbs": 0.0,
    "restecg": 0.0,
    "thalach": 150.0,
    "exang": 0.0,
    "oldpeak": 0.8,
    "slope": 1.0,
    "ca": 0.0,
    "thal": 3.0,
}

FEATURE_LABELS = {
    "thal": "Thalassemia Perfusion",
    "ca": "Fluoroscopy Major Vessels",
    "cp": "Chest Pain Presentation",
    "oldpeak": "ST Depression (Exercise)",
    "thalach": "Maximum Heart Rate Achieved",
    "exang": "Exercise-Induced Angina",
    "age": "Patient Age",
    "trestbps": "Resting Blood Pressure",
    "chol": "Serum Cholesterol",
    "slope": "Peak Exercise ST Slope",
    "sex": "Biological Sex",
    "restecg": "Resting ECG Results",
    "fbs": "Fasting Blood Sugar",
}

class ModelWeightsWrapper:
    """
    Mathematically exact drop-in fallback for the trained Logistic Regression pipeline.
    Guarantees 100% reliable inference even across divergent Scikit-Learn or Python versions.
    """
    def __init__(self, weights: Dict[str, Any]):
        self.intercept = float(weights["intercept"])
        self.coef = np.array(weights["coef"], dtype=float)
        self.num_features = weights["num_features"]
        self.num_scaler_mean = np.array(weights["num_scaler_mean"], dtype=float)
        self.num_scaler_scale = np.array(weights["num_scaler_scale"], dtype=float)
        self.cat_features = weights["cat_features"]
        self.cat_categories = weights["cat_categories"]

    def _transform_row(self, row: Dict[str, Any]) -> np.ndarray:
        num_vals = np.array([float(row.get(k, 0.0)) for k in self.num_features], dtype=float)
        num_scaled = (num_vals - self.num_scaler_mean) / self.num_scaler_scale

        cat_encoded = []
        for feat, cats in zip(self.cat_features, self.cat_categories):
            val = row.get(feat, 0)
            for c in cats:
                cat_encoded.append(1.0 if val == c else 0.0)

        return np.concatenate([num_scaled, np.array(cat_encoded, dtype=float)])

    def predict_proba(self, df: pd.DataFrame) -> np.ndarray:
        probas = []
        for _, row in df.iterrows():
            x = self._transform_row(row.to_dict())
            z = self.intercept + np.dot(self.coef, x)
            p1 = float(1.0 / (1.0 + np.exp(-z)))
            probas.append([1.0 - p1, p1])
        return np.array(probas, dtype=float)

    def predict(self, df: pd.DataFrame) -> np.ndarray:
        probas = self.predict_proba(df)
        return (probas[:, 1] >= 0.5).astype(int)

def load_artifacts():
    global _model, _metadata, _feature_importance
    if _model is None:
        if os.path.exists(MODEL_PATH):
            try:
                _model = joblib.load(MODEL_PATH)
            except Exception:
                _model = None
        
        if _model is None:
            weights_path = ARTIFACTS_DIR / "model_weights.json"
            if os.path.exists(weights_path):
                with open(weights_path, "r", encoding="utf-8") as f:
                    weights_data = json.load(f)
                _model = ModelWeightsWrapper(weights_data)

    if _metadata is None and os.path.exists(METADATA_PATH):
        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            _metadata = json.load(f)
    if _feature_importance is None and os.path.exists(FEATURE_IMPORTANCE_PATH):
        with open(FEATURE_IMPORTANCE_PATH, "r", encoding="utf-8") as f:
            _feature_importance = json.load(f)

def get_risk_classification(probability: float) -> Dict[str, Any]:
    """
    Classifies risk into clearly stated screening tiers.
    Thresholds are strictly defined for educational screening, not diagnostic labels.
    """
    if probability < 0.35:
        return {
            "level": "Lower",
            "title": "Lower Model-Estimated Risk",
            "badge_color": "emerald",
            "summary": "The model estimates lower statistical alignment with patterns observed in coronary artery disease patients.",
        }
    elif probability <= 0.65:
        return {
            "level": "Intermediate",
            "title": "Intermediate Model-Estimated Risk",
            "badge_color": "amber",
            "summary": "The model indicates moderate statistical alignment with cardiovascular risk markers.",
        }
    else:
        return {
            "level": "Higher",
            "title": "Higher Model-Estimated Risk",
            "badge_color": "rose",
            "summary": "The model identifies notable statistical correspondence with patterns observed in coronary artery disease cohorts.",
        }

def compute_local_contributions(model, input_df: pd.DataFrame, base_proba: float) -> List[Dict[str, Any]]:
    """
    Calculates localized feature contributions via marginal counterfactual perturbations.
    Replaces each feature with its population baseline and observes the shift in estimated probability.
    Positive delta means this patient's feature increased risk compared to baseline.
    """
    contributions = []
    
    for feat in ALL_FEATURES:
        perturbed = input_df.copy()
        perturbed.at[0, feat] = CLINICAL_BASELINES.get(feat, 0.0)
        try:
            perturbed_proba = float(model.predict_proba(perturbed)[0, 1])
            # impact is base_proba - perturbed_proba: if removing the patient's value drops probability,
            # then patient's value elevated the risk.
            impact = base_proba - perturbed_proba
        except Exception:
            impact = 0.0

        raw_val = input_df.at[0, feat]
        val = int(raw_val) if float(raw_val).is_integer() else float(raw_val)
        contributions.append({
            "feature": feat,
            "label": FEATURE_LABELS.get(feat, feat),
            "patient_value": val,
            "impact_score": round(float(impact), 4),
            "direction": "elevating" if impact > 0.005 else ("lowering" if impact < -0.005 else "neutral"),
        })

    # Sort by absolute impact magnitude
    contributions.sort(key=lambda x: abs(x["impact_score"]), reverse=True)
    return contributions

def generate_educational_recommendations(data: Dict[str, Any], risk_level: str) -> List[Dict[str, str]]:
    """
    Produces non-prescriptive, lifestyle and communication prompts.
    Never prescribes drugs or clinical interventions.
    """
    recommendations = []

    if risk_level == "Higher":
        recommendations.append({
            "category": "Medical Consultation",
            "title": "Schedule a Comprehensive Clinical Review",
            "detail": "Discuss these screening results and cardiovascular risk markers with a licensed primary care physician or cardiologist for proper diagnostic assessment."
        })
    elif risk_level == "Intermediate":
        recommendations.append({
            "category": "Preventative Discussion",
            "title": "Discuss Cardiovascular Health at Next Checkup",
            "detail": "Review your overall heart health, family history, and routine lipid/metabolic panels with your healthcare provider."
        })
    else:
        recommendations.append({
            "category": "Continued Maintenance",
            "title": "Maintain Cardiovascular Wellness",
            "detail": "Lower model-estimated risk does not guarantee the absence of cardiovascular conditions. Continue routine periodic wellness screenings."
        })

    # Specific physiological indicators
    if data.get("trestbps", 0) >= 130:
        recommendations.append({
            "category": "Vascular Health",
            "title": "Blood Pressure Monitoring",
            "detail": f"Resting blood pressure ({data['trestbps']} mmHg) exceeds standard optimal thresholds (<120 mmHg). Consider tracking blood pressure at rest."
        })

    if data.get("chol", 0) >= 200:
        recommendations.append({
            "category": "Lipid Profile",
            "title": "Cholesterol & Dietary Factors",
            "detail": f"Total cholesterol ({data['chol']} mg/dL) is in the borderline or elevated clinical range. Discuss a complete lipid fraction panel (LDL, HDL, Triglycerides) with your doctor."
        })

    if data.get("exang") == 1:
        recommendations.append({
            "category": "Symptom Observation",
            "title": "Exertion Discomfort Protocol",
            "detail": "Report any recurring chest tightness or discomfort induced by physical exercise directly to a healthcare provider."
        })

    # General lifestyle guidance
    recommendations.append({
        "category": "Lifestyle & Activity",
        "title": "Aerobic Exercise & Balanced Diet",
        "detail": "Adopt regular moderate aerobic exercise (such as 150 minutes of brisk walking per week) and a Mediterranean or DASH-style diet rich in fiber, whole grains, and lean proteins, subject to physician clearance."
    })

    return recommendations

def predict_heart_disease_risk(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main inference interface for API and tests.
    Validates feature vector, executes preprocessing & model pipeline,
    and returns comprehensive structured results.
    """
    load_artifacts()
    if _model is None:
        raise RuntimeError("ML model artifacts are not available. Please run training pipeline.")

    # Convert to single-row DataFrame with expected columns
    df_input = pd.DataFrame([input_data])[ALL_FEATURES]

    # Predict probability and raw prediction
    proba = float(_model.predict_proba(df_input)[0, 1])
    raw_pred = int(_model.predict(df_input)[0])

    risk_info = get_risk_classification(proba)
    contributions = compute_local_contributions(_model, df_input, proba)
    recommendations = generate_educational_recommendations(input_data, risk_info["level"])

    return {
        "model_name": _metadata.get("selected_model", "Trained ML Model") if _metadata else "Trained Model",
        "model_version": _metadata.get("model_version", "HeartGuard Model v1.0") if _metadata else "HeartGuard Model v1.0",
        "raw_prediction": raw_pred,
        "risk_probability": round(proba, 4),
        "risk_percentage": round(proba * 100, 1),
        "risk_classification": risk_info,
        "top_contributing_factors": contributions[:5],
        "all_factor_attributions": contributions,
        "recommendations": recommendations,
        "input_summary": input_data,
        "disclaimer": (
            "HeartGuard AI is an educational and academic screening demonstration. "
            "This model-estimated output is not a medical diagnosis and should never replace "
            "professional medical advice, diagnosis, or emergency evaluation."
        ),
        "emergency_notice": (
            "If you or someone nearby is experiencing acute chest pressure, radiating arm/jaw pain, "
            "severe shortness of breath, or sudden faintness, seek emergency medical services (e.g. 911/112) immediately."
        )
    }

if __name__ == "__main__":
    import sys
    try:
        raw_input = sys.argv[1] if len(sys.argv) > 1 else sys.stdin.read()
        if not raw_input.strip():
            sys.stderr.write(json.dumps({"error": "No input payload provided"}) + "\n")
            sys.exit(1)
        data = json.loads(raw_input)
        res = predict_heart_disease_risk(data)
        print(json.dumps(res))
    except Exception as exc:
        sys.stderr.write(json.dumps({"error": str(exc)}) + "\n")
        sys.exit(1)
