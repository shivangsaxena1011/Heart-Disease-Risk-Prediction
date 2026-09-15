# HeartGuard AI System Architecture

HeartGuard AI employs a decoupled, modular healthcare application architecture designed for clear separation of concerns, high diagnostic explainability, and zero permanent storage of personal health parameters.

## High-Level Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                          USER WEB BROWSER                             │
│                                                                        │
│  [5-Step Clinical Form] ──> [Client Validation] ──> [PDF Generator]   │
│            ▲                                              │            │
│            │                                              ▼            │
│  [Local History (localStorage)] <── [Results & Risk Gauge UI]          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   NEXT.JS 14 APPLICATION LAYER                         │
│                                                                        │
│  • App Router (Static & Dynamic SSR)                                   │
│  • Client-Side State & Multi-Step Wizard Flow                          │
│  • Recharts Visualizations (ROC Curves, Confusion Matrix)              │
│  • Next.js API Routes (/api/predict, /api/model-info)                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / Local Python Invocation
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     FASTAPI / PYTHON ML ENGINE                         │
│                                                                        │
│  • Pydantic V2 Schema Validation (Strict Biological Guards)            │
│  • ColumnTransformer Preprocessing (StandardScaler + OneHotEncoder)   │
│  • Trained Scikit-Learn Model Pipeline (.joblib)                       │
│  • Counterfactual Marginal Feature Attribution Engine                  │
│  • Non-Prescriptive Educational Recommendation Generator               │
└────────────────────────────────────────────────────────────────────────┘
```

## Security & Privacy Safeguards

1. **Defense-in-Depth Validation**:
   - Frontend inputs are bounded by HTML attributes and React state checks.
   - The Next.js API route validates presence and biological boundaries.
   - The FastAPI backend reinforces Pydantic schema validation before tensor construction.

2. **Zero Server Retention**:
   - No permanent relational database or patient profiling table is utilized.
   - Physiological values reside in memory only for the duration of inference (~15 ms).
   - Session history resides strictly in the user's browser `localStorage`.

3. **Medical Disclaimer Enforcement**:
   - Every inference response embeds a persistent disclaimer and emergency medical warning.
   - Classification categories are strictly non-diagnostic ("Model-Estimated Risk").
