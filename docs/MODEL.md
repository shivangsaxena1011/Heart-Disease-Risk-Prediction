# Machine Learning Model Report: HeartGuard AI

This document provides a comprehensive technical overview of the machine learning algorithms, preprocessing strategies, hyperparameter configurations, and empirical validation metrics implemented in HeartGuard AI.

---

## 1. Candidate Algorithms & Theoretical Foundations

Six supervised classification algorithms were trained and benchmarked:

1. **K-Nearest Neighbors (KNN)**:
   - Distance metric: Euclidean with inverse distance weighting (`weights='distance'`).
   - Neighbors: $k=7$.
   - Strengths: Non-parametric, capable of capturing localized non-linear clusters in standardized clinical feature spaces.

2. **Logistic Regression**:
   - Solver: L-BFGS with L2 regularization penalty ($C=0.8$).
   - Strengths: Calibrated log-odds probabilities, high interpretability, linear benchmark.

3. **Random Forest Classifier**:
   - Ensemble of 120 decision trees with bootstrap aggregation.
   - Max depth: 6, min samples split: 4.
   - Strengths: Resilient against overfitting, captures complex multi-feature interactions.

4. **Gradient Boosting Classifier**:
   - Sequential boosting with shallow estimators (`n_estimators=100`, `learning_rate=0.05`, `max_depth=3`).
   - Strengths: Minimizes empirical loss via gradient descent in function space.

5. **Support Vector Machine (SVM)**:
   - Kernel: Radial Basis Function (RBF) with $C=1.0$ and Platt scaling calibration for posterior probabilities.
   - Strengths: High-dimensional margin maximization.

6. **Decision Tree Classifier**:
   - Single CART tree with Gini impurity criterion (`max_depth=4`, `min_samples_split=6`).
   - Strengths: Baseline interpretability.

---

## 2. Preprocessing & Feature Engineering Pipeline

The preprocessing layer is encapsulated in a scikit-learn `ColumnTransformer`:

- **Numerical Features** (`age`, `trestbps`, `chol`, `thalach`, `oldpeak`):
  - Missing values imputed using the median.
  - Standardized via `StandardScaler` ($\mu = 0, \sigma = 1$).

- **Categorical Features** (`sex`, `cp`, `fbs`, `restecg`, `exang`, `slope`, `ca`, `thal`):
  - Missing values imputed using the modal frequency.
  - Encoded using `OneHotEncoder(handle_unknown='ignore', sparse_output=False)`.

---

## 3. Empirical Test Set Evaluation Metrics (Holdout $N = 61$)

| Model Architecture | Accuracy | Precision | Recall (Sensitivity) | F1-Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression (Selected)** | **88.52%** | **83.87%** | **92.86%** | **88.14%** | **96.75%** |
| **K-Nearest Neighbors** | 90.16% | 86.67% | 92.86% | 89.66% | 96.43% |
| **Support Vector Machine** | 88.52% | 83.87% | 92.86% | 88.14% | 96.43% |
| **Gradient Boosting** | 88.52% | 83.87% | 92.86% | 88.14% | 95.13% |
| **Random Forest** | 86.89% | 81.25% | 92.86% | 86.67% | 94.37% |
| **Decision Tree** | 78.69% | 74.19% | 82.14% | 77.97% | 85.98% |

---

## 4. Confusion Matrix of the Selected Model ($N = 61$)

$$\begin{pmatrix} \text{True Negative (TN) = 28} & \text{False Positive (FP) = 5} \\ \text{False Negative (FN) = 2} & \text{True Positive (TP) = 26} \end{pmatrix}$$

- **Sensitivity (Recall)**: $26 / (26 + 2) = 92.86\%$
- **Specificity**: $28 / (28 + 5) = 84.85\%$
- **Diagnostic Accuracy**: $(28 + 26) / 61 = 88.52\%$
- **ROC-AUC**: $96.75\%$

---

## 5. Model Selection Rationale

In clinical risk screening, **discriminatory capacity across thresholds (ROC-AUC)** and **minimizing False Negatives (Type II Error)** are paramount. Logistic Regression achieved the highest ROC-AUC (**96.75%**) and matched the highest recall (**92.86%**). Unlike distance-weighted non-parametric models, Logistic Regression yields smooth, well-calibrated posterior probabilities via the logistic sigmoid link function, aligning with established cardiovascular risk equations (Framingham, SCORE2).
