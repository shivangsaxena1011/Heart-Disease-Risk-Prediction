import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { randomUUID } from "crypto";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Rigorous API level validation
    const {
      age,
      sex,
      cp,
      trestbps,
      chol,
      fbs,
      restecg,
      thalach,
      exang,
      oldpeak,
      slope,
      ca,
      thal,
    } = body;

    // Check presence
    const required = [
      "age", "sex", "cp", "trestbps", "chol", "fbs",
      "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
    ];
    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Missing required clinical field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Range checks
    if (age < 18 || age > 120) {
      return NextResponse.json({ error: "Age must be between 18 and 120 years." }, { status: 422 });
    }
    if (![0, 1].includes(sex)) {
      return NextResponse.json({ error: "Sex must be 0 (Female) or 1 (Male)." }, { status: 422 });
    }
    if (![1, 2, 3, 4].includes(cp)) {
      return NextResponse.json({ error: "Chest pain must be between 1 and 4." }, { status: 422 });
    }
    if (trestbps < 70 || trestbps > 260) {
      return NextResponse.json({ error: "Resting blood pressure must be between 70 and 260 mmHg." }, { status: 422 });
    }
    if (chol < 80 || chol > 650) {
      return NextResponse.json({ error: "Cholesterol must be between 80 and 650 mg/dL." }, { status: 422 });
    }
    if (![0, 1].includes(fbs)) {
      return NextResponse.json({ error: "Fasting blood sugar must be 0 or 1." }, { status: 422 });
    }
    if (![0, 1, 2].includes(restecg)) {
      return NextResponse.json({ error: "Resting ECG must be 0, 1, or 2." }, { status: 422 });
    }
    if (thalach < 60 || thalach > 240) {
      return NextResponse.json({ error: "Maximum heart rate must be between 60 and 240 bpm." }, { status: 422 });
    }
    if (![0, 1].includes(exang)) {
      return NextResponse.json({ error: "Exercise angina must be 0 or 1." }, { status: 422 });
    }
    if (oldpeak < 0 || oldpeak > 8.0) {
      return NextResponse.json({ error: "ST depression must be between 0.0 and 8.0 mm." }, { status: 422 });
    }
    if (![1, 2, 3].includes(slope)) {
      return NextResponse.json({ error: "Slope must be 1, 2, or 3." }, { status: 422 });
    }
    if (![0, 1, 2, 3].includes(ca)) {
      return NextResponse.json({ error: "Major vessels must be between 0 and 3." }, { status: 422 });
    }
    if (![3, 6, 7].includes(thal)) {
      return NextResponse.json({ error: "Thalassemia must be 3 (Normal), 6 (Fixed), or 7 (Reversible)." }, { status: 422 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

    // 1. Try FastAPI backend first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${backendUrl}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        return NextResponse.json(result);
      }
    } catch {
      // FastAPI not running; fallback to direct Python inference
    }

    // 2. Direct Python Execution Fallback via stdin streaming (no shell escaping)
    const runPythonInference = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        const { spawn } = require("child_process");
        const pyProc = spawn("python", ["-m", "ml.predict"], { cwd: process.cwd() });
        let stdoutData = "";
        let stderrData = "";

        pyProc.stdout.on("data", (chunk: Buffer) => {
          stdoutData += chunk.toString();
        });

        pyProc.stderr.on("data", (chunk: Buffer) => {
          stderrData += chunk.toString();
        });

        pyProc.on("close", (code: number) => {
          if (code !== 0 || !stdoutData.trim()) {
            return reject(new Error(stderrData || `Python process exited with code ${code}`));
          }
          try {
            resolve(JSON.parse(stdoutData.trim()));
          } catch (parseErr) {
            reject(parseErr);
          }
        });

        pyProc.on("error", (err: Error) => {
          reject(err);
        });

        // Write input payload to stdin and close
        pyProc.stdin.write(JSON.stringify(body));
        pyProc.stdin.end();
      });
    };

    const parsedResult = await runPythonInference();
    const assessmentId = `HG-${randomUUID().slice(0, 8).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    return NextResponse.json({
      assessment_id: assessmentId,
      timestamp,
      ...parsedResult,
    });
  } catch (err: any) {
    console.error("Predict route error:", err);
    return NextResponse.json(
      { error: "Something went wrong while processing the assessment." },
      { status: 500 }
    );
  }
}
