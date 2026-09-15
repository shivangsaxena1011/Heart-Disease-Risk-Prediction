"""
FastAPI Server for HeartGuard AI.
Configures CORS, routers, security headers, and health checks.
"""

import os
import json
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.routes.model_info import router as model_info_router
from backend.routes.predict import router as predict_router
from ml.predict import MODEL_PATH, METADATA_PATH, load_artifacts, _model

app = FastAPI(
    title="HeartGuard AI API",
    description="Cardiovascular Risk Screening Inference Service based on the UCI Cleveland Dataset.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Cross-Origin Resource Sharing (CORS) setup
# Supports local dev ports, FRONTEND_URL, and ALLOWED_ORIGINS env variables
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

frontend_url = os.getenv("FRONTEND_URL", "")
allowed_env = os.getenv("ALLOWED_ORIGINS", "")

for item in f"{frontend_url},{allowed_env}".split(","):
    cleaned = item.strip().rstrip("/")
    if cleaned and cleaned not in allowed_origins:
        allowed_origins.append(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

@app.get("/health", tags=["Health"])
async def health_check():
    try:
        load_artifacts()
        from ml.predict import _model, _metadata
        model_loaded = _model is not None and os.path.exists(MODEL_PATH)
        version = _metadata.get("model_version", "HeartGuard Model v1.0") if _metadata else "HeartGuard Model v1.0"
        
        return {
            "status": "ok" if model_loaded else "degraded",
            "model_loaded": model_loaded,
            "model_version": version,
            "service": "HeartGuard AI Backend"
        }
    except Exception as err:
        return JSONResponse(
            status_code=503,
            content={
                "status": "unavailable",
                "model_loaded": False,
                "detail": "Risk analysis is temporarily unavailable."
            }
        )

# Register API routes both with and without /api prefix for maximum deployment flexibility
app.include_router(predict_router, prefix="", tags=["Inference"])
app.include_router(predict_router, prefix="/api", tags=["Inference"])
app.include_router(model_info_router, prefix="", tags=["Model Diagnostics"])
app.include_router(model_info_router, prefix="/api", tags=["Model Diagnostics"])

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred while processing the request."}
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)

