"use client";

import React from "react";
import { PatientData } from "@/lib/types";
import { MedicalTooltip } from "@/components/ui/Tooltip";

interface Step2Props {
  data: PatientData;
  onChange: (field: keyof PatientData, value: number) => void;
  errors: Record<string, string>;
}

export function Step2Clinical({ data, onChange, errors }: Step2Props) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Step 2: Clinical Measurements</h2>
        <p className="text-sm text-slate-500 mt-1">
          Objective physiological observations recorded during clinical admission or routine examination.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resting Blood Pressure */}
        <div className="space-y-2">
          <label htmlFor="trestbps-input" className="flex items-center text-sm font-semibold text-slate-700">
            <span>Resting Blood Pressure</span>
            <MedicalTooltip
              title="Resting Blood Pressure"
              content="Systolic arterial blood pressure in mm Hg measured upon hospital admission or seated rest. Normal baseline is under 120 mm Hg."
            />
          </label>
          <div className="relative">
            <input
              id="trestbps-input"
              type="number"
              min={70}
              max={260}
              value={data.trestbps || ""}
              onChange={(e) => onChange("trestbps", parseFloat(e.target.value) || 0)}
              placeholder="e.g. 130"
              className={`w-full px-4 py-2.5 rounded-lg border bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                errors.trestbps ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
              }`}
            />
            <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
              mm Hg
            </span>
          </div>
          {errors.trestbps ? (
            <p className="text-xs text-rose-600 font-medium">{errors.trestbps}</p>
          ) : (
            <p className="text-xs text-slate-400">Typical adult range: 90 – 200 mm Hg</p>
          )}
        </div>

        {/* Serum Cholesterol */}
        <div className="space-y-2">
          <label htmlFor="chol-input" className="flex items-center text-sm font-semibold text-slate-700">
            <span>Serum Cholesterol</span>
            <MedicalTooltip
              title="Serum Cholesterol"
              content="Total circulating serum cholesterol in mg/dL. Elevated circulating lipids can contribute to atheromatous plaque in coronary arteries."
            />
          </label>
          <div className="relative">
            <input
              id="chol-input"
              type="number"
              min={80}
              max={650}
              value={data.chol || ""}
              onChange={(e) => onChange("chol", parseFloat(e.target.value) || 0)}
              placeholder="e.g. 240"
              className={`w-full px-4 py-2.5 rounded-lg border bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                errors.chol ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
              }`}
            />
            <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
              mg/dL
            </span>
          </div>
          {errors.chol ? (
            <p className="text-xs text-rose-600 font-medium">{errors.chol}</p>
          ) : (
            <p className="text-xs text-slate-400">Desirable: &lt; 200 mg/dL | Borderline: 200–239 mg/dL</p>
          )}
        </div>

        {/* Maximum Heart Rate */}
        <div className="space-y-2">
          <label htmlFor="thalach-input" className="flex items-center text-sm font-semibold text-slate-700">
            <span>Maximum Heart Rate Achieved</span>
            <MedicalTooltip
              title="Max Heart Rate Achieved (thalach)"
              content="The highest heart rate in beats per minute reached during graded cardiovascular stress testing."
            />
          </label>
          <div className="relative">
            <input
              id="thalach-input"
              type="number"
              min={60}
              max={240}
              value={data.thalach || ""}
              onChange={(e) => onChange("thalach", parseFloat(e.target.value) || 0)}
              placeholder="e.g. 150"
              className={`w-full px-4 py-2.5 rounded-lg border bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                errors.thalach ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
              }`}
            />
            <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
              bpm
            </span>
          </div>
          {errors.thalach ? (
            <p className="text-xs text-rose-600 font-medium">{errors.thalach}</p>
          ) : (
            <p className="text-xs text-slate-400">Typical stress range: 70 – 210 bpm</p>
          )}
        </div>

        {/* Fasting Blood Sugar */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-slate-700">
            <span>Fasting Blood Sugar &gt; 120 mg/dL</span>
            <MedicalTooltip
              title="Fasting Blood Sugar (fbs)"
              content="Indicates if fasting blood glucose was greater than 120 mg/dL (1 = True, 0 = False), serving as an indicator of diabetes or impaired fasting glucose."
            />
          </label>
          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Fasting Blood Sugar Level">
            <button
              type="button"
              aria-pressed={data.fbs === 0}
              onClick={() => onChange("fbs", 0)}
              className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                data.fbs === 0
                  ? "bg-blue-50 border-blue-500 text-blue-800 font-semibold ring-1 ring-blue-500"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Normal (≤ 120)
            </button>
            <button
              type="button"
              aria-pressed={data.fbs === 1}
              onClick={() => onChange("fbs", 1)}
              className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                data.fbs === 1
                  ? "bg-blue-50 border-blue-500 text-blue-800 font-semibold ring-1 ring-blue-500"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Elevated (&gt; 120)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
