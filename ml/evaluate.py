"""
Model Evaluation and Diagnostic Reporter for HeartGuard AI.
Loads trained artifacts and outputs a detailed performance analysis report.
"""

import json
import os
import joblib
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

try:
    from ml.preprocessing import ALL_FEATURES
except ImportError:
    from preprocessing import ALL_FEATURES

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "heart.csv")

def evaluate():
    model_path = os.path.join(ARTIFACTS_DIR, "heart_disease_model.joblib")
    metrics_path = os.path.join(ARTIFACTS_DIR, "metrics.json")
    
    if not os.path.exists(model_path):
        print("Model artifact not found. Run train.py first.")
        return

    model = joblib.load(model_path)
    df = pd.read_csv(DATA_PATH)
    df["target_binary"] = (df["target"] > 0).astype(int)

    X = df[ALL_FEATURES]
    y = df["target_binary"]

    y_pred = model.predict(X)
    y_proba = model.predict_proba(X)[:, 1]

    print("=" * 60)
    print("HeartGuard AI - Evaluation on Full Dataset")
    print("=" * 60)
    print(classification_report(y, y_pred, target_names=["Lower Risk", "Higher Risk"]))
    print(f"ROC-AUC Score: {roc_auc_score(y, y_proba):.4f}")
    print("\nConfusion Matrix:")
    print(confusion_matrix(y, y_pred))

    if os.path.exists(metrics_path):
        with open(metrics_path, "r", encoding="utf-8") as f:
            saved_metrics = json.load(f)
        print("\nSelected Model in Stratified Test Split:")
        print(f"Selected: {saved_metrics.get('best_model')}")
        sel = saved_metrics.get("selected_metrics", {})
        print(f"Test Accuracy:  {sel.get('test_accuracy'):.4f}")
        print(f"Test Precision: {sel.get('test_precision'):.4f}")
        print(f"Test Recall:    {sel.get('test_recall'):.4f}")
        print(f"Test F1 Score:  {sel.get('test_f1'):.4f}")
        print(f"Test ROC-AUC:   {sel.get('test_roc_auc'):.4f}")

if __name__ == "__main__":
    evaluate()
