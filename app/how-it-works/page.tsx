import React from "react";
import Link from "next/link";
import {
  FileCheck2,
  SlidersHorizontal,
  Cpu,
  Gauge,
  Sparkles,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Binary,
  Layers,
  HelpCircle,
  Database
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Data Ingestion & Clinical Input",
      icon: FileCheck2,
      desc: "The user enters 13 key cardiovascular parameters across demographics, laboratory measurements, ECG patterns, and imaging scans.",
      details: "Includes age, resting blood pressure, cholesterol, resting ECG, maximum heart rate, exercise angina, ST depression, fluoroscopy vessels, and thalassemia.",
    },
    {
      step: "02",
      title: "Multi-Layered Validation & Range Guards",
      icon: SlidersHorizontal,
      desc: "Both the client interface and backend API run strict biological boundary checks using Pydantic schemas.",
      details: "Prevents impossible physiological inputs (such as negative cholesterol or systolic pressures beyond 260 mm Hg) before passing to the ML engine.",
    },
    {
      step: "03",
      title: "Scikit-Learn Preprocessing Pipeline",
      icon: Binary,
      desc: "Continuous numerical features are standardized; categorical features undergo one-hot transformation with median and modal imputation.",
      details: "Employs ColumnTransformer to apply StandardScaler to age, BP, cholesterol, max heart rate, and ST depression, preventing feature scale dominance.",
    },
    {
      step: "04",
      title: "Machine Learning Model Inference",
      icon: Cpu,
      desc: "The preprocessed feature vector is evaluated by the saved model pipeline trained on the UCI Cleveland Heart Disease dataset.",
      details: "Generates calibrated probabilities (P between 0.00 and 1.00) using the optimal model chosen during cross-validation.",
    },
    {
      step: "05",
      title: "Screening Risk Classification",
      icon: Gauge,
      desc: "Estimated probability is mapped into non-diagnostic educational screening categories: Lower, Intermediate, or Higher Risk.",
      details: "Uses predefined academic screening thresholds (<0.35, 0.35-0.65, >0.65) designed strictly for educational risk stratification.",
    },
    {
      step: "06",
      title: "Localized Feature Attribution (Explainability)",
      icon: Sparkles,
      desc: "Deconstructs why the model made its prediction using marginal counterfactual analysis relative to cohort baseline medians.",
      details: "Highlights the top 5 clinical features that exerted upward or protective pressure on the estimated risk score.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <Layers className="w-3.5 h-3.5" />
          <span>End-to-End Technical Workflow</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How HeartGuard AI Works
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Explore the algorithmic journey from patient physiological input to calibrated risk probability and localized feature attribution.
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="space-y-4">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="relative">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="font-mono text-xl font-black text-slate-300 sm:w-8">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600">{item.desc}</p>
                  <p className="text-xs text-slate-400 font-mono pt-1">{item.details}</p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="flex justify-center my-1 text-slate-300">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Educational Considerations Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 space-y-4">
        <h3 className="text-xl font-bold tracking-tight">Clinical AI Ethics & Educational Scope</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Machine learning screening models assist in identifying statistical anomalies and non-linear interactions across physiological parameters. However, clinical decision-making incorporates bedside evaluation, patient narrative, family history, and ongoing diagnostic telemetry. HeartGuard AI strictly reinforces this boundary.
        </p>
        <div className="pt-2">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <span>Proceed to Screening Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
