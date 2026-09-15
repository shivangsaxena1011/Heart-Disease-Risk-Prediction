# HeartGuard AI

> **AI-Powered Heart Disease Risk Screening**  
> *An Academic Machine Learning Healthcare Engineering Platform*

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E?logo=scikit-learn)](https://scikit-learn.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)](https://python.org/)

---

## 1. Overview

**HeartGuard AI** is a production-quality healthcare web application designed for academic evaluation, portfolio showcase, and clinical machine learning demonstration. The platform processes 13 clinical cardiovascular parameters through a trained machine learning pipeline to estimate coronary artery disease risk.

The application adheres strictly to medical software boundaries: it presents calibrated statistical risk screening and localized feature attributions while maintaining clear non-diagnostic language and prominent emergency medical disclaimers.

---

## 2. Key Features

- **Guided 5-Step Clinical Assessment Wizard**:
  - Step 1: Demographics & Basic Info (Age, Biological Sex)
  - Step 2: Clinical Measurements (Resting BP, Cholesterol, Fasting Blood Sugar, Max Heart Rate)
  - Step 3: Cardiac Stress & ECG Indicators (Chest Pain Presentation, Resting ECG, Exercise Angina, ST Depression, ST Slope)
  - Step 4: Specialized Imaging (Fluoroscopy Major Vessels, Thalassemia Nuclear Perfusion)
  - Step 5: Review & Confirmation Summary verifying all 13 clinical inputs before inference.
- **Explainable AI & Localized Attribution**:
  - Deconstructs individual predictions into marginal feature contributions showing which specific clinical markers elevated or reduced the patient's risk score relative to cohort baselines.
- **Model Insights Dashboard**:
  - Genuine, un-fabricated evaluation metrics computed directly from stratified cross-validation and test holdouts.
  - Interactive Confusion Matrix (True Positives, True Negatives, False Positives, False Negatives).
  - High-resolution ROC Curve (Receiver Operating Characteristic) plotted from actual test set coordinates.
  - Global Feature Importance bar charts.
- **Downloadable AI Risk Screening Report**:
  - Generates a clinical-style, vector-formatted PDF summary report (via jsPDF) with patient inputs, probability score, contributing factors, recommendations, and emergency notices.
- **Privacy-by-Design**:
  - Zero permanent server-side database storage of personal health data.
  - Assessment history is retained strictly within the user's browser `localStorage`, with one-click data purge functionality.
- **Strict Clinical & Legal Safeguards**:
  - Always uses terminology like *"Model-Estimated Risk"* and *"Screening Probability"*, never diagnostic assertions.
  - Embedded emergency protocols for acute cardiovascular symptoms.

---

## 3. Technology Stack

- **Machine Learning Core**: Python, Scikit-Learn, Pandas, NumPy, Joblib, SciPy.
- **Backend Service**: FastAPI, Uvicorn, Pydantic V2, Starlette.
- **Frontend Architecture**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS.
- **Data Visualization & Icons**: Recharts, Lucide React, jsPDF.

---

## 4. Dataset & Machine Learning Pipeline

The model is trained on the benchmark **UCI Cleveland Heart Disease dataset** (303 records, 13 clinical input attributes + angiographic disease status).

### Preprocessing Pipeline
```
Raw Clinical Vector
        │
        ├── Numerical Features ──> SimpleImputer(median) ──> StandardScaler()
        │
        └── Categorical Features ─> SimpleImputer(mode) ───> OneHotEncoder(ignore)
        │
        ▼
ColumnTransformer Matrix ──> Supervised Classifier (.joblib)
```

### Evaluated Models Comparison (Holdout Test Split $N = 61$)

| Model Architecture | Accuracy | Precision | Recall (Sensitivity) | F1 Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression (Selected)** | **88.52%** | **83.87%** | **92.86%** | **88.14%** | **96.75%** |
| **K-Nearest Neighbors** | 90.16% | 86.67% | 92.86% | 89.66% | 96.43% |
| **Support Vector Machine** | 88.52% | 83.87% | 92.86% | 88.14% | 96.43% |
| **Gradient Boosting** | 88.52% | 83.87% | 92.86% | 88.14% | 95.13% |
| **Random Forest** | 86.89% | 81.25% | 92.86% | 86.67% | 94.37% |
| **Decision Tree** | 78.69% | 74.19% | 82.14% | 77.97% | 85.98% |

*Model Selection Rationale*: Logistic Regression was selected for achieving the highest discriminatory power across all candidate models (96.75% ROC-AUC) and 92.86% recall, providing smooth, calibrated posterior probabilities that avoid arbitrary step discontinuities.

---

## 5. Project Directory Structure

```
heartguard-ai/
├── app/
│   ├── layout.tsx              # Root clinical layout with Navbar & Footer
│   ├── page.tsx                # Healthcare AI landing page
│   ├── assessment/page.tsx     # 5-step guided risk assessment wizard
│   ├── results/page.tsx        # Risk gauge, explainability, PDF export, session history
│   ├── model/page.tsx          # Real model comparison, confusion matrix & ROC curve
│   ├── how-it-works/page.tsx   # End-to-end data pipeline flow diagram
│   ├── about/page.tsx          # College academic overview & tech stack
│   ├── privacy/page.tsx        # Privacy policy & local data purge action
│   ├── disclaimer/page.tsx     # Medical disclaimer & emergency protocol
│   └── api/
│       ├── predict/route.ts    # Secure prediction API endpoint
│       └── model-info/route.ts # Serves genuine training metadata and metrics
│
├── backend/
│   ├── main.py                 # FastAPI application with CORS & security headers
│   ├── schemas.py              # Pydantic validation schemas with range constraints
│   └── routes/                 # FastAPI router endpoints
│
├── components/
│   ├── navbar/                 # Responsive navigation bar with mobile drawer
│   ├── footer/                 # Clinical disclaimer footer
│   ├── assessment/             # Steps 1 to 5 assessment components
│   ├── results/                # Visual gauge, factor chart, recommendations
│   └── ui/                     # Accessible tooltips, cards, buttons
│
├── lib/
│   ├── api.ts                  # Client-side API caller
│   ├── types.ts                # Strict TypeScript interfaces
│   ├── storage.ts              # Browser localStorage history manager
│   ├── report-generator.ts     # Client-side PDF screening report generator
│   └── utils.ts                # Class merging utility
│
├── ml/
│   ├── data/heart.csv          # UCI Cleveland Heart Disease dataset
│   ├── preprocessing.py        # ColumnTransformer pipeline
│   ├── train.py                # Multi-model training and evaluation script
│   ├── evaluate.py             # Model diagnostic evaluation reporter
│   ├── predict.py              # Production inference & feature attribution
│   ├── artifacts/              # Serialized .joblib pipelines, metrics.json, metadata.json
│   └── requirements.txt        # ML dependencies
│
├── docs/
│   ├── ARCHITECTURE.md         # Full system architecture specification
│   ├── MODEL.md                # Mathematical formulations & ML metrics report
│   ├── DATASET.md              # UCI Cleveland attribute specifications
│   └── PRIVACY.md              # Data minimization & governance policy
│
├── test_system.py              # Automated 7-point integration test suite
├── package.json                # Next.js and frontend dependencies
├── requirements.txt            # Python dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Clinical design system theme
└── .env.example                # Environment variables template
```

---

## 6. Installation & Quick Start

### Prerequisites
- Node.js 18+ or 20+
- Python 3.10+ with `pip`

### Step 1: Clone Repository
```bash
git clone https://github.com/your-repo/heartguard-ai.git
cd heartguard-ai
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

### Step 3: Install Python Dependencies & Retrain Models (Optional)
```bash
pip install -r requirements.txt
python ml/train.py
```

### Step 4: Run Automated Verification Tests
```bash
python test_system.py
```

### Step 5: Start the Application

#### Option A: Single Next.js Command (Self-Contained)
Next.js will handle all UI rendering and gracefully run Python inference directly:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Option B: Decoupled Full-Stack Mode (FastAPI + Next.js)
**Terminal 1 (Backend)**:
```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive OpenAPI Swagger docs available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

**Terminal 2 (Frontend)**:
```bash
npm run dev
```

---

## 7. Production Build

To verify production compilation:
```bash
npm run build
npm run start
```

---

## 8. Public Production Deployment (Vercel + Render)

HeartGuard AI is architected for decoupled zero-cost production deployment:
- **Frontend**: Deployed to **Vercel** with global edge CDN caching and automatic builds.
- **Backend API**: Deployed to **Render** running Python 3.11 FastAPI with pre-loaded Scikit-Learn models.

### Quick Deployment Checklist:
1. **Push to GitHub**:
   ```bash
   git init && git add . && git commit -m "feat: production deployment"
   git remote add origin https://github.com/shivangsaxena1011/Heart-Disease-Risk-Prediction.git
   git push -u origin main
   ```
2. **Deploy Backend to Render**:
   - Create Web Service from the repository.
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - Verify health: `https://<YOUR-RENDER-APP>.onrender.com/health`
3. **Deploy Frontend to Vercel**:
   - Import repository on Vercel (Root `./`).
   - Set Environment Variable: `NEXT_PUBLIC_API_URL` = `https://<YOUR-RENDER-APP>.onrender.com`.
   - Deploy.

*For complete configuration options, Render sleep-state handling, and CORS locking, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).*

---

## 9. Privacy & Ethical Standards

1. **Zero Cloud Retention**: User-entered clinical parameters are never stored in a central database or shared with third parties.
2. **Local Browser Storage**: Screening records are retained exclusively within `localStorage` and can be purged at any time.
3. **Transparent Explainability**: Explanations indicate mathematical feature influence within the model without claiming biological causality.

---

## 9. Medical Disclaimer

> **IMPORTANT**: HeartGuard AI is an educational and academic screening project. Its predictions are generated by statistical machine learning models trained on historical data and do **NOT** constitute a medical diagnosis, clinical decision, or substitute for professional healthcare consultation. If you are experiencing acute chest discomfort, difficulty breathing, or fainting, immediately contact regional emergency services (dial 911 / 112 / 999).

---

## 10. License

This project is developed for educational and academic showcase purposes under the MIT License.
