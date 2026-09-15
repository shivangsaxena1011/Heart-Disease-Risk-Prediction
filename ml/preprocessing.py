"""
Preprocessing module for HeartGuard AI.
Constructs robust scikit-learn ColumnTransformer pipelines for numerical and categorical features.
"""

from typing import List
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

NUMERICAL_FEATURES: List[str] = ["age", "trestbps", "chol", "thalach", "oldpeak"]
CATEGORICAL_FEATURES: List[str] = ["sex", "cp", "fbs", "restecg", "exang", "slope", "ca", "thal"]
ALL_FEATURES: List[str] = NUMERICAL_FEATURES + CATEGORICAL_FEATURES

def create_preprocessor() -> ColumnTransformer:
    """
    Creates the scikit-learn ColumnTransformer for preprocessing.
    - Numerical features are imputed with median and scaled using StandardScaler.
    - Categorical features are imputed with most frequent and one-hot encoded with handle_unknown='ignore'.
    """
    num_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])

    cat_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_pipeline, NUMERICAL_FEATURES),
            ("cat", cat_pipeline, CATEGORICAL_FEATURES),
        ],
        remainder="drop",
    )

    return preprocessor
