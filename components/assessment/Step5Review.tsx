"use client";

import React from "react";
import { PatientData } from "@/lib/types";
import { CheckCircle2, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";

interface Step5Props {
  data: PatientData;
}

export function Step5Review({ data }: Step5Props) {
  const getSexLabel = (val: number) => (val === 1 ? "Male" : "Female");
  const getCpLabel = (val: number) => {
    switch (val) {
      case 1: return "Typical Angina (1)";
      case 2: return "Atypical Angina (2)";
      case 3: return "Non-Anginal Pain (3)";
      case 4: return "Asymptomatic (4)";
      default: return String(val);
    }
  };
  const getRestecgLabel = (val: number) => {
    switch (val) {
      case 0: return "Normal (0)";
      case 1: return "ST-T Wave Abnormality (1)";
      case 2: return "LV Hypertrophy (2)";
      default: return String(val);
    }
  };
  const getSlopeLabel = (val: number) => {
    switch (val) {
      case 1: return "Upsloping (1)";
      case 2: return "Flat (2)";
      case 3: return "Downsloping (3)";
      default: return String(val);
    }
  };
  const getThalLabel = (val: number) => {
    switch (val) {
      case 3: return "Normal (3)";
      case 6: return "Fixed Defect (6)";
      case 7: return "Reversible Defect (7)";
      default: return String(val);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Step 5: Review Clinical Profile</h2>
        <p className="text-sm text-slate-500 mt-1">
          Carefully verify the entered physiological measurements before triggering the model.
        </p>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category 1: Basic & Vitals */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Demographics & Vitals</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Age</span>
              <span className="font-semibold text-slate-900">{data.age} years</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Biological Sex</span>
              <span className="font-semibold text-slate-900">{getSexLabel(data.sex)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Resting Blood Pressure</span>
              <span className="font-semibold text-slate-900">{data.trestbps} mm Hg</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Serum Cholesterol</span>
              <span className="font-semibold text-slate-900">{data.chol} mg/dL</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Fasting Blood Sugar</span>
              <span className="font-semibold text-slate-900">{data.fbs === 1 ? "> 120 mg/dL (Elevated)" : "≤ 120 mg/dL (Normal)"}</span>
            </div>
          </div>
        </div>

        {/* Category 2: Stress & Heart Indicators */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cardiac Stress Response</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Max Heart Rate</span>
              <span className="font-semibold text-slate-900">{data.thalach} bpm</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Chest Pain Type</span>
              <span className="font-semibold text-slate-900 text-right">{getCpLabel(data.cp)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Resting ECG</span>
              <span className="font-semibold text-slate-900 text-right">{getRestecgLabel(data.restecg)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Exercise Angina</span>
              <span className="font-semibold text-slate-900">{data.exang === 1 ? "Yes (Induced)" : "No"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">ST Depression (Oldpeak)</span>
              <span className="font-semibold text-slate-900">{data.oldpeak} mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category 3: Imaging */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Imaging & Morphology</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500">ST Slope</div>
            <div className="font-semibold text-slate-900 mt-0.5">{getSlopeLabel(data.slope)}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500">Major Vessels (ca)</div>
            <div className="font-semibold text-slate-900 mt-0.5">{data.ca} Colored Vessel(s)</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500">Thalassemia Perfusion</div>
            <div className="font-semibold text-slate-900 mt-0.5">{getThalLabel(data.thal)}</div>
          </div>
        </div>
      </div>

      {/* Confirmation Callout */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <p className="font-semibold">Ready for Inference</p>
          <p className="mt-0.5 text-blue-800">
            Clicking <strong>Analyze Risk</strong> transmits these 13 clinical features to the scikit-learn preprocessing and inference pipeline. All calculations are logged locally to your browser session.
          </p>
        </div>
      </div>
    </div>
  );
}
