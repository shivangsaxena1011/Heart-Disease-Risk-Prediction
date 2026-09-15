import React from "react";
import Link from "next/link";
import {
  Activity,
  ShieldAlert,
  Sliders,
  FileText,
  BarChart3,
  ArrowRight,
  Database,
  Lock,
  Layers,
  HeartHandshake
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-8 bg-gradient-to-b from-white via-slate-50 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Academic Machine Learning Healthcare Project
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              HeartGuard <span className="text-blue-600">AI</span>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-slate-700">
              AI-Powered Heart Disease Risk Screening
            </p>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Estimate cardiovascular risk using a validated machine learning pipeline trained on clinical patient data. Powered by cross-validated algorithms with explainable feature attribution.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/assessment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                <span>Check My Risk</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <span>How It Works</span>
              </Link>
            </div>

            {/* Disclaimer Callout */}
            <div className="pt-4 max-w-xl mx-auto">
              <p className="text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <strong>Important Notice:</strong> This software is an educational demonstration. Model outputs represent statistical risk estimations, <em>never</em> a medical diagnosis or clinical directive.
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-bold text-slate-900">303</div>
              <div className="text-xs text-slate-500 mt-1">UCI Cleveland Samples</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-bold text-slate-900">13</div>
              <div className="text-xs text-slate-500 mt-1">Clinical Features</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">6 Models</div>
              <div className="text-xs text-slate-500 mt-1">Trained & Compared</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-2xl font-bold text-emerald-600">96.8%</div>
              <div className="text-xs text-slate-500 mt-1">Validation ROC-AUC</div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Architecture Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Platform Capabilities</h2>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Realistic Clinical Machine Learning Workflow
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Engineered using standard healthcare data science methodologies from exploratory data analysis to feature attribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">Guided 5-Step Assessment</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Intuitive, step-by-step entry of 13 cardiovascular parameters, including resting ECG, exercise-induced ST depression, fluoroscopy vessels, and thalassemia perfusion.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">Explainable AI Attributions</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Provides localized feature attribution showing how each clinical indicator elevated or lowered the model-estimated risk for the specific patient profile.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">Downloadable Screening Report</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Generate a formatted, print-ready AI Screening Report summarizing entered parameters, probability score, contributing risk factors, and doctor consultation prompts.
            </p>
          </div>
        </div>
      </section>

      {/* Dataset & Evaluation Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Transparent Methodology
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Trained on the UCI Cleveland Clinical Dataset
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                The Cleveland Heart Disease database contains 303 patient records analyzed during coronary angiography. We trained and evaluated 6 distinct models (Logistic Regression, Random Forest, Decision Tree, SVM, KNN, and Gradient Boosting) using stratified cross-validation.
              </p>
              <div className="pt-2">
                <Link
                  href="/model"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>Explore Model Comparison & ROC Curves</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-6 border border-slate-700 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-400">Target Variable</span>
                <span className="font-medium text-slate-200">Coronary Artery Disease (&gt;50% narrowing)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-400">Class Balance</span>
                <span className="font-medium text-emerald-400">54.1% Lower Risk / 45.9% Higher Risk</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-400">Data Preprocessing</span>
                <span className="font-medium text-slate-200">StandardScaler + OneHotEncoder Pipeline</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-400">Evaluation Strategy</span>
                <span className="font-medium text-slate-200">5-Fold Stratified Cross-Validation</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Privacy Model</span>
                <span className="font-medium text-sky-400">Zero Server Storage (Local Session Only)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust, Ethics & Medical Safety Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base">Educational & Screening Boundaries</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  HeartGuard AI does not replace clinical evaluation or physician judgment. All screening results reflect statistical correlations from the training sample and should be discussed with a qualified medical professional.
                </p>
              </div>
            </div>
            <Link
              href="/disclaimer"
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Read Medical Disclaimer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
