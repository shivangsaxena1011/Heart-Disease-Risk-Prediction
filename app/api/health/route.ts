import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const modelPath = path.join(process.cwd(), "ml", "artifacts", "heart_disease_model.joblib");
    const metadataPath = path.join(process.cwd(), "ml", "artifacts", "metadata.json");

    const modelExists = fs.existsSync(modelPath);
    let version = "HeartGuard Model v1.0";

    if (fs.existsSync(metadataPath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
        version = metadata.model_version || version;
      } catch {
        // use fallback
      }
    }

    return NextResponse.json({
      status: modelExists ? "ok" : "degraded",
      model_loaded: modelExists,
      model_version: version,
      service: "HeartGuard AI Application Gateway"
    });
  } catch {
    return NextResponse.json(
      { status: "unavailable", model_loaded: false, detail: "Risk analysis is temporarily unavailable." },
      { status: 503 }
    );
  }
}
