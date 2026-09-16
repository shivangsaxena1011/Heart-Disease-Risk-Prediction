"use client";

import React from "react";
import { PatientData } from "@/lib/types";
import { MedicalTooltip } from "@/components/ui/Tooltip";

interface Step3Props {
  data: PatientData;
  onChange: (field: keyof PatientData, value: number) => void;
  errors: Record<string, string>;
}

export function Step3Exercise({ data, onChange, errors }: Step3Props) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Step 3: Heart & Exercise Indicators</h2>
        <p className="text-sm text-slate-500 mt-1">
          Electrocardiographic and symptomatic markers recorded at rest and during exercise stress testing.
        </p>
      </div>

      <div className="space-y-6">
        {/* Chest Pain Type */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-slate-700">
            <span>Chest Pain Type (Presentation)</span>
            <MedicalTooltip
              title="Chest Pain Classification (cp)"
              content="Clinical description of discomfort: Typical angina occurs with exertion and is relieved by rest; atypical has some but not all features; non-anginal is non-cardiac; asymptomatic denotes silent ischemia."
            />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="group" aria-label="Chest Pain Presentation">
            {[
              { id: 1, label: "Typical Angina (1)", desc: "Exertional retrosternal discomfort relieved by rest" },
              { id: 2, label: "Atypical Angina (2)", desc: "Atypical discomfort location or inconsistent onset" },
              { id: 3, label: "Non-Anginal Pain (3)", desc: "Sharp or musculoskeletal chest wall sensations" },
              { id: 4, label: "Asymptomatic (4)", desc: "No overt angina; frequently associated with silent ischemia" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={data.cp === item.id}
                onClick={() => onChange("cp", item.id)}
                className={`p-3 text-left rounded-lg border text-sm transition-all ${
                  data.cp === item.id
                    ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="font-semibold text-slate-900">{item.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Resting ECG */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-slate-700">
            <span>Resting Electrocardiographic Results (ECG)</span>
            <MedicalTooltip
              title="Resting ECG (restecg)"
              content="Baseline electrical activity. 0 = Normal, 1 = ST-T wave abnormalities (inversions or elevation), 2 = Left ventricular hypertrophy."
            />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5" role="group" aria-label="Resting ECG Results">
            {[
              { id: 0, label: "Normal (0)", desc: "No baseline rhythm or waveform irregularities" },
              { id: 1, label: "ST-T Wave Abnormality (1)", desc: "T wave inversions or ST depression > 0.05 mV" },
              { id: 2, label: "LV Hypertrophy (2)", desc: "Probable or definite left ventricular enlargement" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={data.restecg === item.id}
                onClick={() => onChange("restecg", item.id)}
                className={`p-3 text-left rounded-lg border text-sm transition-all ${
                  data.restecg === item.id
                    ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="font-semibold text-slate-900">{item.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Exercise-Induced Angina */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-slate-700">
              <span>Exercise-Induced Angina</span>
              <MedicalTooltip
                title="Exercise-Induced Angina (exang)"
                content="Indicates whether exertion directly provoked ischemic chest pain during treadmill or bicycle ergometry testing."
              />
            </label>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Exercise-Induced Angina">
              <button
                type="button"
                aria-pressed={data.exang === 0}
                onClick={() => onChange("exang", 0)}
                className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                  data.exang === 0
                    ? "bg-blue-50 border-blue-500 text-blue-800 font-semibold ring-1 ring-blue-500"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                No (0)
              </button>
              <button
                type="button"
                aria-pressed={data.exang === 1}
                onClick={() => onChange("exang", 1)}
                className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                  data.exang === 1
                    ? "bg-blue-50 border-blue-500 text-blue-800 font-semibold ring-1 ring-blue-500"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Yes (1)
              </button>
            </div>
          </div>

          {/* ST Depression (oldpeak) */}
          <div className="space-y-2">
            <label htmlFor="oldpeak-input" className="flex items-center text-sm font-semibold text-slate-700">
              <span>ST Depression (Oldpeak)</span>
              <MedicalTooltip
                title="ST Depression (oldpeak)"
                content="The magnitude of J-point depression (in millimeters) on the ECG trace during peak exertion compared to rest. High oldpeak is a hallmark indicator of myocardial ischemia."
              />
            </label>
            <div className="relative">
              <input
                id="oldpeak-input"
                type="number"
                step="0.1"
                min={0}
                max={8}
                value={data.oldpeak !== undefined && !isNaN(data.oldpeak) ? data.oldpeak : ""}
                onChange={(e) => onChange("oldpeak", e.target.value === "" ? (NaN as unknown as number) : parseFloat(e.target.value))}
                placeholder="e.g. 1.2"
                className={`w-full px-4 py-2.5 rounded-lg border bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                  errors.oldpeak ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                }`}
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                mm
              </span>
            </div>
            {errors.oldpeak ? (
              <p className="text-xs text-rose-600 font-medium">{errors.oldpeak}</p>
            ) : (
              <p className="text-xs text-slate-400">Normal is typically 0.0 – 1.0 mm</p>
            )}
          </div>

          {/* ST Slope */}
          <div className="space-y-2">
            <label htmlFor="slope-select" className="flex items-center text-sm font-semibold text-slate-700">
              <span>Peak Exercise ST Slope</span>
              <MedicalTooltip
                title="ST Slope (slope)"
                content="The trajectory of the ST segment at peak exercise: Upsloping (1) is often benign; Flat (2) or Downsloping (3) correlates strongly with coronary stenosis."
              />
            </label>
            <select
              id="slope-select"
              value={data.slope}
              onChange={(e) => onChange("slope", parseInt(e.target.value))}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={1}>1: Upsloping (Often Normal)</option>
              <option value={2}>2: Flat (Ischemia Risk)</option>
              <option value={3}>3: Downsloping (Severe Ischemia Risk)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
