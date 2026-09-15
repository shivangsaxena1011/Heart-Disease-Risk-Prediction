"use client";

import React, { useState } from "react";
import { clearAssessments } from "@/lib/storage";
import { ShieldCheck, Lock, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

export default function PrivacyPage() {
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    clearAssessments();
    setCleared(true);
    setTimeout(() => setCleared(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="max-w-2xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy-by-Design Architecture</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy & Data Ethics
        </h1>
        <p className="text-sm text-slate-500">
          HeartGuard AI is built around data minimization and zero persistent cloud storage of health information.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-blue-900">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">Zero Server-Side Retention</h3>
              <p className="text-xs text-blue-800 mt-1">
                Your physiological parameters (blood pressure, cholesterol, ECG, age) are processed strictly in transient memory during inference. We do not store, catalog, monetize, or transmit your clinical data to any external database.
              </p>
            </div>
          </div>

          <h2 className="text-base font-bold text-slate-900 pt-2">How Data Is Handled</h2>
          <ul className="space-y-2 text-xs sm:text-sm list-disc pl-5 text-slate-600">
            <li>
              <strong>Client-Side Storage:</strong> Assessment history and recent predictions are saved exclusively inside your local web browser using HTML5 <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">localStorage</code>.
            </li>
            <li>
              <strong>No Account Requirement:</strong> You do not need to register, provide your name, email, or government identifier to use the screening tool.
            </li>
            <li>
              <strong>Immediate Deletion:</strong> You can purge all local screening records at any time using the one-click action below.
            </li>
          </ul>

          <h2 className="text-base font-bold text-slate-900 pt-4">Data Purge Control</h2>
          <p className="text-xs text-slate-500">
            Click the button below to purge all cached screening records and active prediction results from this browser.
          </p>

          <div className="pt-2">
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Purge All Local Browser Data</span>
            </button>
            {cleared && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold ml-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Local data successfully erased.</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
