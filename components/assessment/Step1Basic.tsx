"use client";

import React from "react";
import { PatientData } from "@/lib/types";
import { MedicalTooltip } from "@/components/ui/Tooltip";
import { User, Users } from "lucide-react";

interface Step1Props {
  data: PatientData;
  onChange: (field: keyof PatientData, value: number) => void;
  errors: Record<string, string>;
}

export function Step1Basic({ data, onChange, errors }: Step1Props) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Step 1: Basic Information</h2>
        <p className="text-sm text-slate-500 mt-1">
          Fundamental demographic parameters utilized by the statistical model.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age */}
        <div className="space-y-2">
          <label htmlFor="age-input" className="flex items-center text-sm font-semibold text-slate-700">
            <span>Patient Age</span>
            <MedicalTooltip
              title="Age"
              content="Cardiovascular disease risk statistically increases with age as arteries naturally stiffen and accumulate plaque."
            />
          </label>
          <div className="relative">
            <input
              id="age-input"
              type="number"
              min={18}
              max={120}
              value={data.age && !isNaN(data.age) ? data.age : ""}
              onChange={(e) => onChange("age", e.target.value === "" ? (NaN as unknown as number) : parseInt(e.target.value, 10))}
              placeholder="e.g. 54"
              className={`w-full px-4 py-2.5 rounded-lg border bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                errors.age ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
              }`}
            />
            <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
              years
            </span>
          </div>
          {errors.age ? (
            <p className="text-xs text-rose-600 font-medium">{errors.age}</p>
          ) : (
            <p className="text-xs text-slate-400">Valid adult range: 18 – 120 years</p>
          )}
        </div>

        {/* Biological Sex */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-slate-700">
            <span>Biological Sex</span>
            <MedicalTooltip
              title="Biological Sex"
              content="Clinical studies indicate differing cardiovascular epidemiology between biological sexes due to hormonal and vascular factors."
            />
          </label>
          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Biological Sex Selection">
            <button
              type="button"
              aria-pressed={data.sex === 1}
              onClick={() => onChange("sex", 1)}
              className={`py-2.5 px-4 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                data.sex === 1
                  ? "bg-blue-50 border-blue-500 text-blue-800 font-semibold ring-1 ring-blue-500"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Male (1)</span>
            </button>
            <button
              type="button"
              aria-pressed={data.sex === 0}
              onClick={() => onChange("sex", 0)}
              className={`py-2.5 px-4 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                data.sex === 0
                  ? "bg-blue-50 border-blue-500 text-blue-800 font-semibold ring-1 ring-blue-500"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Female (0)</span>
            </button>
          </div>
          {errors.sex && <p className="text-xs text-rose-600 font-medium">{errors.sex}</p>}
        </div>
      </div>
    </div>
  );
}
