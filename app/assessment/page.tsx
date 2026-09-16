"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PatientData } from "@/lib/types";
import { submitAssessment } from "@/lib/api";
import { saveAssessment } from "@/lib/storage";
import { Step1Basic } from "@/components/assessment/Step1Basic";
import { Step2Clinical } from "@/components/assessment/Step2Clinical";
import { Step3Exercise } from "@/components/assessment/Step3Exercise";
import { Step4Additional } from "@/components/assessment/Step4Additional";
import { Step5Review } from "@/components/assessment/Step5Review";
import {
  ChevronLeft,
  ChevronRight,
  Activity,
  AlertCircle,
  Loader2,
  ShieldCheck,
  RotateCcw
} from "lucide-react";

const INITIAL_DATA: PatientData = {
  age: 52,
  sex: 1,
  cp: 3,
  trestbps: 128,
  chol: 220,
  fbs: 0,
  restecg: 0,
  thalach: 152,
  exang: 0,
  oldpeak: 0.6,
  slope: 1,
  ca: 0,
  thal: 3,
};

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PatientData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSubmitting) {
      setElapsedSeconds(0);
      interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleFieldChange = (field: keyof PatientData, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleResetForm = () => {
    setFormData(INITIAL_DATA);
    setErrors({});
    setApiError(null);
    setCurrentStep(1);
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.age || isNaN(formData.age) || formData.age < 18 || formData.age > 120) {
        errs.age = "Please enter an adult age between 18 and 120.";
      }
      if (![0, 1].includes(formData.sex)) {
        errs.sex = "Please select biological sex.";
      }
    } else if (step === 2) {
      if (!formData.trestbps || isNaN(formData.trestbps) || formData.trestbps < 70 || formData.trestbps > 260) {
        errs.trestbps = "Blood pressure must be between 70 and 260 mm Hg.";
      }
      if (!formData.chol || isNaN(formData.chol) || formData.chol < 80 || formData.chol > 650) {
        errs.chol = "Serum cholesterol must be between 80 and 650 mg/dL.";
      }
      if (!formData.thalach || isNaN(formData.thalach) || formData.thalach < 60 || formData.thalach > 240) {
        errs.thalach = "Maximum heart rate must be between 60 and 240 bpm.";
      }
    } else if (step === 3) {
      if (formData.oldpeak === undefined || formData.oldpeak === null || isNaN(formData.oldpeak) || formData.oldpeak < 0 || formData.oldpeak > 8) {
        errs.oldpeak = "ST depression must be between 0.0 and 8.0 mm.";
      }
    } else if (step === 4) {
      if (![0, 1, 2, 3].includes(formData.ca)) {
        errs.ca = "Major vessels must be between 0 and 3.";
      }
      if (![3, 6, 7].includes(formData.thal)) {
        errs.thal = "Please select a valid Thalassemia perfusion result.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      setApiError("Please check all highlighted clinical parameters before analysis.");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const result = await submitAssessment(formData);
      saveAssessment(result);
      router.push("/results");
    } catch (err: any) {
      setApiError(err.message || "Unable to complete the risk analysis. Please try again.");
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    "Basic Info",
    "Measurements",
    "Exercise & ECG",
    "Imaging",
    "Review"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <Activity className="w-3.5 h-3.5" />
          <span>Cardiovascular Risk Screening Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Clinical Parameter Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Complete the 5 sections below. All values map directly to the trained UCI Cleveland feature pipeline.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="mb-8">
        <div className="grid grid-cols-5 gap-2 text-center text-xs font-medium text-slate-600 mb-2">
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <div key={title} className="flex flex-col items-center">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-sm ring-4 ring-blue-100"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isCompleted ? "✓" : stepNum}
                </span>
                <span className={`mt-1.5 hidden sm:block ${isCurrent ? "font-bold text-slate-900" : ""}`}>
                  {title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Assessment Card Surface */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {apiError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Analysis Notice</p>
              <p className="text-xs mt-0.5 text-rose-700">{apiError}</p>
            </div>
          </div>
        )}

        {/* Step Forms */}
        {currentStep === 1 && (
          <Step1Basic data={formData} onChange={handleFieldChange} errors={errors} />
        )}
        {currentStep === 2 && (
          <Step2Clinical data={formData} onChange={handleFieldChange} errors={errors} />
        )}
        {currentStep === 3 && (
          <Step3Exercise data={formData} onChange={handleFieldChange} errors={errors} />
        )}
        {currentStep === 4 && (
          <Step4Additional data={formData} onChange={handleFieldChange} errors={errors} />
        )}
        {currentStep === 5 && (
          <Step5Review data={formData} />
        )}

        {/* Live Submission Status Callout */}
        {isSubmitting && (
          <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3 text-blue-900 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600 flex-shrink-0" />
            <div className="text-xs sm:text-sm">
              <p className="font-bold">
                {elapsedSeconds < 4
                  ? "Connecting to HeartGuard AI & analyzing assessment..."
                  : "Starting the prediction service. This can take a moment after a period of inactivity..."}
              </p>
              <p className="text-blue-700 text-xs mt-0.5">
                {elapsedSeconds < 4
                  ? "Applying standard scaling, one-hot categorical transformations, and evaluating the trained machine learning pipeline."
                  : "Render free-tier instances may take 20–40 seconds to spin up from sleep. Please hold on..."}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Form</span>
            </button>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all ml-auto"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all ml-auto disabled:opacity-60 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing your assessment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Analyze Risk</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
