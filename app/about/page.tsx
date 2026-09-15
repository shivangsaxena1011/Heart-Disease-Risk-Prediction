import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Code2,
  Cpu,
  Database,
  Layers,
  ShieldAlert,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>College AI/ML Healthcare Engineering Project</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About HeartGuard AI
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          An academic initiative designed to demonstrate production-quality full-stack machine learning engineering, ethical healthcare AI boundaries, and explainable cardiovascular risk screening.
        </p>
      </div>

      {/* Tech Stack Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
          Architecture & Technology Stack
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
              <Cpu className="w-4 h-4" />
              <span>Machine Learning Core</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li>• Python 3.14 + Scikit-Learn</li>
              <li>• Pandas & NumPy vector operations</li>
              <li>• Joblib model & pipeline serialization</li>
              <li>• Marginal feature attribution engine</li>
              <li>• Stratified 5-Fold Cross-Validation</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
              <Layers className="w-4 h-4" />
              <span>Backend & Validation</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li>• FastAPI asynchronous Python server</li>
              <li>• Strict Pydantic V2 schema validation</li>
              <li>• Biological range constraints</li>
              <li>• Next.js API route orchestration</li>
              <li>• Rate limiting & security headers</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
              <Code2 className="w-4 h-4" />
              <span>Frontend & Visualization</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li>• Next.js 14 App Router + React 18</li>
              <li>• TypeScript strict type checking</li>
              <li>• Tailwind CSS clinical design system</li>
              <li>• Recharts interactive ROC & metrics</li>
              <li>• jsPDF client-side report generator</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Educational Mission & Integrity */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
          Academic Motivation & Scientific Rigor
        </h2>
        <div className="prose prose-slate text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            Heart disease remains a leading cause of morbidity and mortality worldwide. Traditional scoring systems (like Framingham Risk Score or Reynolds Risk Score) rely on regression-based risk calculators. This project demonstrates how modern supervised classification models evaluate multidimensional physiological signals including stress-induced ST depression and nuclear scintigraphy.
          </p>
          <p>
            Crucially, this project was developed with complete algorithmic honesty: no accuracy metrics, confusion matrices, or model weights were fabricated. The web interface directly reflects the empirical cross-validation outputs generated on the UCI Cleveland dataset.
          </p>
        </div>
      </div>

      {/* Callout */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-blue-600 text-white shadow-md">
        <div>
          <h3 className="text-base font-bold">Ready to test the model?</h3>
          <p className="text-xs text-blue-100 mt-0.5">Explore the interactive 5-step screening assessment form.</p>
        </div>
        <Link
          href="/assessment"
          className="px-5 py-2.5 rounded-xl bg-white text-blue-700 text-xs font-bold hover:bg-blue-50 transition-colors whitespace-nowrap"
        >
          Start Assessment
        </Link>
      </div>
    </div>
  );
}
