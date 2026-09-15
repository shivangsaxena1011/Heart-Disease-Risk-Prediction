# Dataset Specification: UCI Cleveland Heart Disease

## 1. Overview & Provenance

The **Cleveland Heart Disease Database** is a benchmark clinical dataset made available through the University of California, Irvine (UCI) Machine Learning Repository. Originally gathered by Dr. Robert Detrano, M.D., Ph.D., at the Cleveland Clinic Foundation in Ohio, it represents patient records evaluated for suspected coronary artery disease.

- **Repository**: [UCI Machine Learning Repository - Heart Disease](https://archive.ics.uci.edu/dataset/45/heart+disease)
- **Total Records**: 303 patient profiles
- **Total Features**: 13 input features + 1 angiographic target feature
- **Class Distribution**: 164 Negative (54.1%), 139 Positive (45.9%)

---

## 2. Feature Dictionary

| Attribute | Name | Type | Valid Domain | Clinical Meaning |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `age` | Continuous | 29 – 77 (years) | Age of patient in solar years. |
| 2 | `sex` | Binary | 0 = Female, 1 = Male | Biological sex. |
| 3 | `cp` | Nominal | 1, 2, 3, 4 | Chest pain presentation: (1) Typical Angina, (2) Atypical Angina, (3) Non-Anginal, (4) Asymptomatic. |
| 4 | `trestbps` | Continuous | 94 – 200 (mm Hg) | Resting systolic blood pressure on hospital admission. |
| 5 | `chol` | Continuous | 126 – 564 (mg/dL) | Serum total cholesterol level. |
| 6 | `fbs` | Binary | 0 = False, 1 = True | Fasting blood glucose > 120 mg/dL. |
| 7 | `restecg` | Nominal | 0, 1, 2 | Resting electrocardiogram: (0) Normal, (1) ST-T wave abnormality, (2) Left ventricular hypertrophy. |
| 8 | `thalach` | Continuous | 71 – 202 (bpm) | Maximum heart rate achieved during graded stress test. |
| 9 | `exang` | Binary | 0 = No, 1 = Yes | Exercise-induced angina pectoris. |
| 10 | `oldpeak` | Continuous | 0.0 – 6.2 (mm) | ST depression induced by exercise relative to rest. |
| 11 | `slope` | Ordinal | 1, 2, 3 | Peak exercise ST segment slope: (1) Upsloping, (2) Flat, (3) Downsloping. |
| 12 | `ca` | Discrete | 0, 1, 2, 3 | Number of major coronary vessels colored by fluoroscopy. |
| 13 | `thal` | Nominal | 3, 6, 7 | Nuclear thallium scintigraphy: (3) Normal, (6) Fixed Defect, (7) Reversible Defect. |
| 14 | `target` | Discrete | 0, 1, 2, 3, 4 | Coronary artery stenosis: (0) < 50% narrowing, (1–4) > 50% narrowing. Binarized to 0 vs. 1. |

---

## 3. Data Cleaning & Imputation Protocol

- `ca` contained 4 missing entries (`?`). These were imputed using the most frequent class (`0`).
- `thal` contained 2 missing entries (`?`). These were imputed using the most frequent class (`3.0`).
- Target labels $1, 2, 3, 4$ were binarized to $1$ (elevated risk presence) vs. $0$ (lower risk presence), mirroring standard clinical cardiology literature.
