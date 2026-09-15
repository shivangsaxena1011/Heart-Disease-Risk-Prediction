/**
 * Centralized API client for HeartGuard AI.
 * Handles production Render HTTPS requests, local development routes,
 * request timeouts, and Render free-tier cold starts.
 */

import { ModelInfoResponse, PatientData, PredictionResult } from "./types";

/**
 * Returns the configured base API URL.
 * In production (Vercel): points to NEXT_PUBLIC_API_URL (Render backend).
 * In local development fallback: uses relative paths to the Next.js API gateway.
 */
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  if (envUrl && typeof envUrl === "string") {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return "";
}

/**
 * Submits clinical assessment features for machine learning risk estimation.
 */
export async function submitAssessment(patientData: PatientData): Promise<PredictionResult> {
  const baseUrl = getApiBaseUrl();
  // If calling Render directly, use /predict; if using Next.js local gateway, use /api/predict
  const endpoint = baseUrl ? `${baseUrl}/predict` : "/api/predict";

  // 60-second timeout to comfortably accommodate Render free-tier cold boot
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 400 || response.status === 422) {
        throw new Error(errorData.error || errorData.detail || "Please check the information you entered.");
      }
      if (response.status === 503) {
        throw new Error("Risk analysis is temporarily unavailable.");
      }
      throw new Error(errorData.error || errorData.detail || "Unable to complete the risk analysis. Please try again.");
    }

    return response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("The prediction service is taking too long to respond. Please try again.");
    }
    if (err.message) {
      throw err;
    }
    throw new Error("Unable to complete the risk analysis. Please try again.");
  }
}

/**
 * Retrieves empirical model metrics, training statistics, and ROC coordinates.
 */
export async function fetchModelInfo(): Promise<ModelInfoResponse> {
  const baseUrl = getApiBaseUrl();
  const endpoint = baseUrl ? `${baseUrl}/model-info` : "/api/model-info";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Model insights unavailable.");
    }

    return response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw new Error(err.message || "Model insights unavailable.");
  }
}

/**
 * Verifies backend health and model loading status.
 */
export async function checkBackendHealth(): Promise<{ status: string; model_loaded: boolean; model_version?: string }> {
  const baseUrl = getApiBaseUrl();
  const endpoint = baseUrl ? `${baseUrl}/health` : "/api/health";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return { status: "degraded", model_loaded: false };
    }
    return response.json();
  } catch {
    clearTimeout(timeoutId);
    return { status: "offline", model_loaded: false };
  }
}
