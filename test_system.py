"""
Comprehensive End-to-End Test Suite for HeartGuard AI.
Verifies data integrity, ML pipeline, inference, validation guards, and API responses.
"""

import json
import os
import sys
import pytest
from starlette.testclient import TestClient
from backend.main import app
from ml.predict import predict_heart_disease_risk

client = TestClient(app)

def test_artifacts_exist():
    artifacts_dir = os.path.join("ml", "artifacts")
    assert os.path.exists(os.path.join(artifacts_dir, "heart_disease_model.joblib")), "Model artifact missing"
    assert os.path.exists(os.path.join(artifacts_dir, "preprocessor.joblib")), "Preprocessor artifact missing"
    assert os.path.exists(os.path.join(artifacts_dir, "metrics.json")), "Metrics artifact missing"
    assert os.path.exists(os.path.join(artifacts_dir, "metadata.json")), "Metadata artifact missing"
    assert os.path.exists(os.path.join(artifacts_dir, "feature_importance.json")), "Feature importance artifact missing"

def test_metrics_integrity():
    with open(os.path.join("ml", "artifacts", "metrics.json"), "r") as f:
        data = json.load(f)
    assert "models" in data
    assert len(data["models"]) >= 6
    for model_name in ["Logistic Regression", "Random Forest", "Gradient Boosting", "Support Vector Machine", "K-Nearest Neighbors", "Decision Tree"]:
        assert model_name in data["models"]
        m = data["models"][model_name]
        assert 0.6 <= m["test_accuracy"] <= 1.0
        assert 0.6 <= m["test_roc_auc"] <= 1.0
        assert "confusion_matrix" in m
        assert len(m["roc_curve"]) > 0

def test_inference_low_risk():
    low_risk_case = {
        "age": 35,
        "sex": 0,
        "cp": 2,
        "trestbps": 110.0,
        "chol": 170.0,
        "fbs": 0,
        "restecg": 0,
        "thalach": 175.0,
        "exang": 0,
        "oldpeak": 0.0,
        "slope": 1,
        "ca": 0,
        "thal": 3
    }
    res = predict_heart_disease_risk(low_risk_case)
    assert "risk_probability" in res
    assert 0.0 <= res["risk_probability"] <= 1.0
    assert res["risk_classification"]["level"] in ["Lower", "Intermediate"]
    assert len(res["top_contributing_factors"]) > 0
    assert len(res["recommendations"]) > 0

def test_inference_high_risk():
    high_risk_case = {
        "age": 65,
        "sex": 1,
        "cp": 4,
        "trestbps": 160.0,
        "chol": 290.0,
        "fbs": 1,
        "restecg": 2,
        "thalach": 110.0,
        "exang": 1,
        "oldpeak": 2.8,
        "slope": 2,
        "ca": 2,
        "thal": 7
    }
    res = predict_heart_disease_risk(high_risk_case)
    assert "risk_probability" in res
    assert res["risk_classification"]["level"] == "Higher"
    assert res["risk_percentage"] >= 65.0

def test_api_predict_endpoint_valid():
    valid_payload = {
        "age": 55,
        "sex": 1,
        "cp": 3,
        "trestbps": 135.0,
        "chol": 240.0,
        "fbs": 0,
        "restecg": 0,
        "thalach": 145.0,
        "exang": 0,
        "oldpeak": 1.0,
        "slope": 1,
        "ca": 0,
        "thal": 3
    }
    resp = client.post("/api/predict", json=valid_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["assessment_id"].startswith("HG-")
    assert "risk_classification" in data
    assert "disclaimer" in data
    assert "emergency_notice" in data

def test_api_predict_endpoint_validation_errors():
    # Negative cholesterol
    bad_chol = {
        "age": 55, "sex": 1, "cp": 3, "trestbps": 135.0,
        "chol": -100.0, "fbs": 0, "restecg": 0, "thalach": 145.0,
        "exang": 0, "oldpeak": 1.0, "slope": 1, "ca": 0, "thal": 3
    }
    resp = client.post("/api/predict", json=bad_chol)
    assert resp.status_code == 422

    # Underage
    bad_age = bad_chol.copy()
    bad_age["chol"] = 200.0
    bad_age["age"] = 10
    resp = client.post("/api/predict", json=bad_age)
    assert resp.status_code == 422

    # Invalid Thalassemia code
    bad_thal = bad_chol.copy()
    bad_thal["chol"] = 200.0
    bad_thal["thal"] = 5
    resp = client.post("/api/predict", json=bad_thal)
    assert resp.status_code == 422

def test_api_model_info():
    resp = client.get("/api/model-info")
    assert resp.status_code == 200
    data = resp.json()
    assert "metadata" in data
    assert "metrics" in data
    assert "feature_importance" in data
    assert data["metadata"]["total_samples"] == 303

def test_api_health_check():
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert data["model_loaded"] is True
    assert "model_version" in data
    assert data["model_version"] == "HeartGuard Model v1.0"

def test_exact_feature_mapping():
    from ml.preprocessing import ALL_FEATURES, NUMERICAL_FEATURES, CATEGORICAL_FEATURES
    from backend.schemas import HeartAssessmentInput
    
    schema_fields = list(HeartAssessmentInput.model_fields.keys())
    assert set(ALL_FEATURES) == set(schema_fields), "Feature names mismatch between ML and Schema"
    assert len(ALL_FEATURES) == 13
    assert len(NUMERICAL_FEATURES) == 5
    assert len(CATEGORICAL_FEATURES) == 8

    # Verify matching heart.csv columns
    dataset_path = os.path.join("ml", "data", "heart.csv")
    if os.path.exists(dataset_path):
        import pandas as pd
        df = pd.read_csv(dataset_path)
        for feat in ALL_FEATURES:
            assert feat in df.columns, f"Feature {feat} missing from heart.csv dataset"

if __name__ == "__main__":
    print("Running HeartGuard AI Comprehensive Test Suite...")
    test_artifacts_exist()
    print("[PASS] 1. Artifacts exist")
    test_metrics_integrity()
    print("[PASS] 2. Metrics integrity verified")
    test_exact_feature_mapping()
    print("[PASS] 3. Exact feature mapping across Dataset, ML, and Schemas verified")
    test_inference_low_risk()
    print("[PASS] 4. Low risk inference verified")
    test_inference_high_risk()
    print("[PASS] 5. High risk inference verified")
    test_api_health_check()
    print("[PASS] 6. Health check endpoint verified")
    test_api_predict_endpoint_valid()
    print("[PASS] 7. API valid prediction verified")
    test_api_predict_endpoint_validation_errors()
    print("[PASS] 8. API validation rejections verified")
    test_api_model_info()
    print("[PASS] 9. API model info verified")
    print("\nALL 9 SYSTEM TESTS PASSED PERFECTLY!")
