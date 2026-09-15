"use client";

import React from "react";
import { PatientData } from "@/lib/types";
import { MedicalTooltip } from "@/components/ui/Tooltip";

interface Step4Props {
  data: PatientData;
  onChange: (field: keyof PatientData, value: number) => void;
  errors: Record<string, string>;
}

export function Step4Additional({ data, onChange, errors }: Step4Props) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Step 4: Additional Clinical Information</h2>
        <p className="text-sm text-slate-500 mt-1">
          Specialized diagnostic imaging parameters from cardiac catheterization and nuclear scintigraphy.
        </p>
      </div>

      <div className="space-y-6">
        {/* Major Vessels Colored by Fluoroscopy */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-slate-700">
            <span>Number of Major Vessels Colored by Fluoroscopy (ca)</span>
            <MedicalTooltip
              title="Major Vessels by Fluoroscopy (ca)"
              content="The number of primary coronary arteries (0 to 3) showing contrast medium flow under real-time X-ray fluoroscopy. More colored vessels with lesions indicate multi-vessel disease."
            />
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="group" aria-label="Major Coronary Vessels Colored">
            {[0, 1, 2, 3].map((num) => (
              <button
                key={num}
                type="button"
                aria-pressed={data.ca === num}
                onClick={() => onChange("ca", num)}
                className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${
                  data.ca === num
                    ? "bg-blue-50 border-blue-500 text-blue-800 ring-1 ring-blue-500"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {num === 0 ? "0 (None)" : `${num} Vessel${num > 1 ? "s" : ""}`}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">0 indicates no major vessels showing significant narrowing on fluoroscopy.</p>
        </div>

        {/* Thalassemia Blood Flow Scan */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-slate-700">
            <span>Thalassemia Nuclear Perfusion Scan (thal)</span>
            <MedicalTooltip
              title="Thalassemia Scan (thal)"
              content="Radioisotope myocardial perfusion imaging: Normal (3) indicates uniform uptake; Fixed Defect (6) indicates old myocardial infarction; Reversible Defect (7) indicates exercise-induced reversible ischemia."
            />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="group" aria-label="Thalassemia Perfusion Results">
            {[
              { id: 3, label: "Normal (3)", desc: "Uniform radioisotope blood flow across myocardium" },
              { id: 6, label: "Fixed Defect (6)", desc: "No perfusion at rest or exercise (non-viable scar tissue)" },
              { id: 7, label: "Reversible Defect (7)", desc: "Reduced perfusion during stress that normalizes at rest" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={data.thal === item.id}
                onClick={() => onChange("thal", item.id)}
                className={`p-3.5 text-left rounded-lg border text-sm transition-all ${
                  data.thal === item.id
                    ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="font-semibold text-slate-900">{item.label}</div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
