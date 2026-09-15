import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

  // Try FastAPI backend first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const response = await fetch(`${backendUrl}/api/model-info`, {
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch {
    // Fallback to local artifacts read
  }

  try {
    const artifactsDir = path.join(process.cwd(), "ml", "artifacts");
    const metricsPath = path.join(artifactsDir, "metrics.json");
    const metadataPath = path.join(artifactsDir, "metadata.json");
    const importancePath = path.join(artifactsDir, "feature_importance.json");

    if (!fs.existsSync(metricsPath) || !fs.existsSync(metadataPath)) {
      return NextResponse.json(
        { error: "Model artifacts not generated. Please run train.py." },
        { status: 404 }
      );
    }

    const metrics = JSON.parse(fs.readFileSync(metricsPath, "utf-8"));
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
    const featureImportance = fs.existsSync(importancePath)
      ? JSON.parse(fs.readFileSync(importancePath, "utf-8"))
      : [];

    return NextResponse.json({
      metadata,
      metrics,
      feature_importance: featureImportance,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to load model diagnostics: " + (err?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
