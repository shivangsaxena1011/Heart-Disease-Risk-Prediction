# HeartGuard AI: College Project & Viva Guide

This document contains structured, concise answers to the 13 most critical questions typically asked during academic evaluations, project vivas, and technical defense presentations.

---

### 1. What problem are you solving?
Cardiovascular disease (CVD) is the leading cause of mortality globally. Many at-risk individuals do not recognize the combined significance of subtle physiological indicators (such as exercise-induced ST depression, resting blood pressure, and cholesterol). HeartGuard AI provides an accessible, educational risk screening platform that estimates statistical alignment with coronary artery disease patterns and explains which factors drive the estimate.

### 2. Which dataset did you use?
The benchmark **UCI Cleveland Heart Disease dataset** from the UC Irvine Machine Learning Repository. It contains 303 patient records with 13 clinical biomarkers and an angiographic disease outcome (presence or absence of >50% coronary vessel narrowing).

### 3. What features are used?
13 clinical parameters:
- **Demographic**: `age`, `sex`
- **Vital & Metabolic**: `trestbps` (resting BP), `chol` (serum cholesterol), `fbs` (fasting blood sugar > 120 mg/dL)
- **Electrocardiographic & Stress**: `restecg` (resting ECG), `thalach` (max heart rate achieved), `exang` (exercise-induced angina), `oldpeak` (ST depression), `slope` (peak ST slope)
- **Imaging & Catheterization**: `ca` (major fluoroscopy vessels 0–3), `thal` (thallium nuclear scintigraphy perfusion)

### 4. How did you preprocess the data?
We avoided data leakage by encapsulating all transformations inside a scikit-learn `ColumnTransformer` fitted strictly on training splits:
- **Continuous Features** (`age`, `trestbps`, `chol`, `thalach`, `oldpeak`): Imputed with median values and scaled with `StandardScaler` ($\mu=0, \sigma=1$).
- **Categorical Features** (`sex`, `cp`, `fbs`, `restecg`, `exang`, `slope`, `ca`, `thal`): Imputed with the modal frequency and encoded using `OneHotEncoder(handle_unknown='ignore')`.

### 5. Which algorithms did you try?
We implemented and benchmarked 6 supervised classifiers:
1. Logistic Regression
2. Random Forest Classifier
3. Gradient Boosting Classifier
4. Support Vector Machine (RBF Kernel)
5. K-Nearest Neighbors (KNN)
6. Decision Tree Classifier

### 6. Which model did you select?
**Logistic Regression** ($C=0.8$, L2 penalty, max_iter=1000).

### 7. Why?
1. **Highest Discriminatory Power**: Achieved the highest ROC-AUC (**96.75%**) across all candidate models on the holdout test set.
2. **Clinical Sensitivity (Recall)**: Achieved **92.86%** recall, matching the highest sensitivity and minimizing critical false negatives.
3. **Calibrated Probabilities**: Unlike distance-weighted non-parametric models (which can output step-function 100% or 0% probabilities), logistic regression provides smooth, well-calibrated posterior probabilities via the logistic sigmoid function $\sigma(z) = \frac{1}{1 + e^{-z}}$.
4. **Clinical Gold Standard**: Cardiovascular risk calculators (Framingham, SCORE2) are fundamentally log-linear models where coefficients have direct log-odds interpretations.

### 8. What metrics did you obtain?
Holdout Test Set ($N = 61$, 20% stratified split):
- **Accuracy**: 88.52%
- **Precision**: 83.87%
- **Recall (Sensitivity)**: 92.86%
- **F1-Score**: 88.14%
- **ROC-AUC**: 96.75%
- **Confusion Matrix**: True Negatives = 29, False Positives = 4, False Negatives = 2, True Positives = 26.

### 9. How does prediction work?
1. User inputs are collected via a guided 5-step form.
2. The input vector is validated against biological ranges.
3. The trained preprocessing pipeline standardizes and one-hot encodes the features.
4. The model computes $P(\text{disease} \mid X)$ via `predict_proba`.
5. Localized feature attribution computes the marginal risk impact of each biomarker relative to population medians.
6. The probability is mapped to an application-defined screening tier (Lower < 35%, Intermediate 35–65%, Higher > 65%).

### 10. How is the frontend connected to the ML model?
- **Architecture**: Next.js 14 frontend connects via HTTP REST to a FastAPI Python backend (`/api/predict` and `/api/model-info`).
- **Resilience Fallback**: If the separate FastAPI server is offline, Next.js API routes gracefully spawn the Python ML inference process directly via stdin streaming, ensuring 100% reliability in any deployment scenario.

### 11. How do you handle invalid input?
- **Multi-tiered validation**:
  - Frontend: HTML5 constraints + React form validation with error messages preventing advancement.
  - Next.js API: Biological range guards (e.g. age 18–120, blood pressure 70–260, cholesterol 80–650).
  - FastAPI: Strict Pydantic V2 schemas returning HTTP 422 with sanitized error details (no Python tracebacks or filesystem paths are ever exposed).

### 12. What are the limitations?
1. **Historical Dataset**: The UCI Cleveland dataset was compiled in 1988–1989 on 303 predominantly adult male symptomatic patients referred for cardiac catheterization.
2. **Sample Size**: 303 samples is appropriate for educational demonstration, but modern clinical deep learning models require tens of thousands of contemporary electronic health records (EHRs).
3. **Screening vs. Diagnosis**: The model identifies statistical correlations, not biological causation.

### 13. Why is this not a medical diagnosis?
Diagnosis requires bedside examination, comprehensive clinical history, family pedigree, laboratory troponin/lipid subfractions, dynamic ECG telemetry, and physician judgment. HeartGuard AI is strictly an educational risk screening demonstration and must never replace qualified clinical consultation or emergency protocols.
