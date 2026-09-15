"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PredictionResult } from "@/lib/types";
import { getCurrentResult, setCurrentResult } from "@/lib/storage";
import { RiskGauge } from "@/components/results/RiskGauge";
import { FactorChart } from "@/components/results/FactorChart";
import { RecommendationsCard } from "@/components/results/RecommendationsCard";
import { HistorySection } from "@/components/results/HistorySection";
import { generatePdfReport } from "@/lib/report-generator";
import {
  Download,
  RotateCcw,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  FileText,
  AlertOctagon,
  Clock,
  ArrowRight
} from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const activeResult = getCurrentResult();
    if (activeResult) {
      setResult(activeResult);
    }
  }, []);

  const handleSelectHistory = (selected: PredictionResult) => {
    setResult(selected);
    setCurrentResult(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadReport = () => {
    if (!result) return;
    setIsGeneratingPdf(true);
    try {
      generatePdfReport(result);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to export PDF. Please check browser permissions.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Empty State if accessed without an assessment
  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
          <FileText className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">No Assessment Found</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You haven't completed a cardiovascular risk screening in this session yet, or local cache was cleared.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-all"
          >
            <span>Start Risk Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const p = result.input_summary;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Assessment ID: <span className="font-mono text-slate-900">{result.assessment_id}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(result.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Heart Disease Risk Screening Result
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Model inference generated via <strong>{result.model_name}</strong> trained on the UCI Cleveland dataset.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadReport}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors disabled:opacity-60"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>{isGeneratingPdf ? "Generating..." : "Download Report"}</span>
          </button>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Assessment</span>
          </Link>
        </div>
      </div>

      {/* Primary Result Gauge Card */}
      <RiskGauge
        percentage={result.risk_percentage}
        probability={result.risk_probability}
        classification={result.risk_classification}
      />

      {/* Emergency Notice */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-4 text-xs sm:text-sm text-rose-900">
        <AlertOctagon className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Emergency Warning Notice</p>
          <p className="text-rose-800 leading-relaxed text-xs">
            {result.emergency_notice}
          </p>
        </div>
      </div>

      {/* Input Summary Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-base font-bold text-slate-900">Patient Input Summary</h3>
          <span className="text-xs text-slate-400">13 Clinical Parameters Evaluated</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-slate-400">Age / Sex</span>
            <div className="font-semibold text-slate-900 mt-0.5">
              {p.age} yrs • {p.sex === 1 ? "Male" : "Female"}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-slate-400">Resting Blood Pressure</span>
            <div className="font-semibold text-slate-900 mt-0.5">{p.trestbps} mm Hg</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-slate-400">Serum Cholesterol</span>
            <div className="font-semibold text-slate-900 mt-0.5">{p.chol} mg/dL</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-slate-400">Max Heart Rate</span>
            <div className="font-semibold text-slate-900 mt-0.5">{p.thalach} bpm</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-slate-400">Chest Pain Type</span>
            <div className="font-semibold text-slate-900 mt-0.5">
              {p.cp === 1 ? "Typical Angina (1)" : p.cp === 2 ? "Atypical Angina (2)" : p.cp === 3 ? "Non-Anginal (3)" : "Asymptomatic (4)"}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-slate-400">Exercise Angina</span>
            <div className="font-semibold text-slate-900 mt-0.5">
              {p.exang === 1 ? "Yes (Induced)" : "No"}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-slate-400">ST Depression</span>
            <div className="font-semibold text-slate-900 mt-0.5">{p.oldpeak} mm</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-slate-400">Major Vessels / Thal</span>
            <div className="font-semibold text-slate-900 mt-0.5">
              {p.ca} vessel(s) • Thal: {p.thal}
            </div>
          </div>
        </div>
      </div>

      {/* Model Explainability: Factor Contributions */}
      <FactorChart factors={result.top_contributing_factors} />

      {/* Educational Guidance */}
      <RecommendationsCard
        recommendations={result.recommendations}
        classification={result.risk_classification}
      />

      {/* Session History */}
      <HistorySection
        onSelectHistory={handleSelectHistory}
        currentId={result.assessment_id}
      />

      {/* Clinical Disclaimer Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 text-center space-y-2">
        <p className="text-xs font-semibold text-slate-700">Legal & Clinical Disclaimer</p>
        <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">
          {result.disclaimer}
        </p>
      </div>
    </div>
  );
}
