# HeartGuard AI — Production Deployment Guide

This guide details the exact step-by-step procedure to deploy **HeartGuard AI** as a live, publicly accessible healthcare screening platform using:
- **Frontend UI:** [Vercel](https://vercel.com/) (Next.js 14)
- **ML & Backend API:** [Render](https://render.com/) (FastAPI + Scikit-Learn)
- **GitHub Repository:** [https://github.com/shivangsaxena1011/Heart-Disease-Risk-Prediction](https://github.com/shivangsaxena1011/Heart-Disease-Risk-Prediction)

---

## Deployment Architecture

```
                                +-------------------------------------------+
                                |                USER BROWSER               |
                                +-------------------------------------------+
                                                      |
                                                      v  HTTPS
                                +-------------------------------------------+
                                |               VERCEL EDGE                 |
                                |       (Next.js 14 React Application)      |
                                |    https://heartguard-ai.vercel.app       |
                                +-------------------------------------------+
                                                      |
                                                      v  HTTPS (CORS Protected)
                                +-------------------------------------------+
                                |              RENDER WEB SERVICE           |
                                |            (FastAPI Python 3.11)          |
                                |   https://heartguard-api.onrender.com     |
                                +-------------------------------------------+
                                                      |
                                                      v  Local Disk Load
                                +-------------------------------------------+
                                |          SCIKIT-LEARN ML ARTIFACTS        |
                                |  - ColumnTransformer (Scaling + One-Hot)  |
                                |  - Logistic Regression (C=0.8, L2)        |
                                |  - 96.75% ROC-AUC / 92.86% Sensitivity    |
                                +-------------------------------------------+
```

---

## Deployment Step 1: Push Code to GitHub

From your project root, verify Git is initialized and push the workspace to your GitHub repository:

```bash
git init
git add .
git commit -m "feat: complete HeartGuard AI production deployment setup for Vercel and Render"
git branch -M main
git remote add origin https://github.com/shivangsaxena1011/Heart-Disease-Risk-Prediction.git
git push -u origin main --force
```

---

## Deployment Step 2: Deploy Backend to Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository: `shivangsaxena1011/Heart-Disease-Risk-Prediction`.
4. Configure the service settings:
   - **Name:** `heartguard-api` (or your preferred name)
   - **Region:** Any region close to your users (e.g. `Oregon (US West)` or `Frankfurt`)
   - **Branch:** `main`
   - **Root Directory:** *(leave blank / root)*
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** `Free` (or higher)
5. Scroll down to **Advanced** and configure:
   - **Health Check Path:** `/health`
6. Add the following **Environment Variables**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `PYTHON_VERSION` | `3.11.9` | Ensures compatible runtime environment |
   | `FRONTEND_URL` | `https://your-vercel-app.vercel.app` | *(Optional initially; update once Vercel URL is known)* |
7. Click **Create Web Service**.
8. Wait for the build to complete and the service to show **Live**.
9. **Copy your Render URL** (e.g., `https://heartguard-api.onrender.com`).

---

## Deployment Step 3: Verify the Live Render Backend

Before configuring the frontend, verify that the Render backend and machine learning artifacts are operational:

### 1. Health Verification:
Open your browser or run:
```bash
curl -i https://YOUR-RENDER-SERVICE.onrender.com/health
```
**Expected Response (HTTP 200 OK):**
```json
{
  "status": "ok",
  "model_loaded": true,
  "model_version": "HeartGuard Model v1.0",
  "service": "HeartGuard AI Backend"
}
```

### 2. Interactive Swagger UI:
Open `https://YOUR-RENDER-SERVICE.onrender.com/docs` to inspect all live endpoints (`GET /health`, `POST /predict`, `GET /model-info`).

### 3. Prediction Verification:
```bash
curl -X POST https://YOUR-RENDER-SERVICE.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```
**Expected Response:** HTTP 200 with calibrated `risk_probability`, `risk_percentage`, and local `top_contributing_factors`.

---

## Deployment Step 4: Deploy Frontend to Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** → **Project**.
3. Import the repository: `shivangsaxena1011/Heart-Disease-Risk-Prediction`.
4. Vercel automatically detects **Next.js**:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. Expand the **Environment Variables** section and add:
   | Key | Value |
   | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://YOUR-RENDER-SERVICE.onrender.com` |
   *(Do NOT add a trailing slash; e.g. `https://heartguard-api.onrender.com`)*
6. Click **Deploy**.
7. Vercel will build the project and output your live production URL (e.g., `https://heartguard-ai.vercel.app`).

---

## Deployment Step 5: Finalize Backend CORS on Render

Now that you have your Vercel production domain:
1. Go back to your [Render Dashboard](https://dashboard.render.com/) → `heartguard-api` service.
2. Navigate to **Environment**.
3. Set or update:
   - `FRONTEND_URL` = `https://your-vercel-domain.vercel.app`
4. Render will automatically redeploy with strict CORS locked to your Vercel URL.
*(Note: HeartGuard AI also automatically allows any `https://*.vercel.app` preview branch deployments).*

---

## Deployment Step 6: End-to-End Live Validation

1. Open your live Vercel URL: `https://your-vercel-domain.vercel.app`.
2. Click **Start Risk Assessment**.
3. Enter clinical values across Steps 1 to 5.
4. Review your profile on Step 5 and click **Analyze Risk**.
5. **Observe Network Activity:**
   - The browser sends an HTTPS `POST https://YOUR-RENDER-SERVICE.onrender.com/predict`.
   - If Render is waking from an inactivity state, the UI indicates:
     *"Starting the prediction service. This can take a moment after a period of inactivity..."*
6. Upon response arrival, the results page displays:
   - Genuine probability percentage
   - Screening category (Lower / Intermediate / Higher)
   - Primary model-influencing factors
   - Emergency medical notice
7. Click **Download Report** to export a verified vector PDF containing your actual submitted values and prediction results.
