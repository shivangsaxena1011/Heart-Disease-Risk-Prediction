"use client";

import React, { useState, useEffect } from "react";
import { StoredAssessment, PredictionResult } from "@/lib/types";
import { getAssessments, clearAssessments } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import { History, Trash2, Eye, Shield, AlertCircle } from "lucide-react";

interface HistorySectionProps {
  onSelectHistory: (result: PredictionResult) => void;
  currentId?: string;
}

export function HistorySection({ onSelectHistory, currentId }: HistorySectionProps) {
  const [history, setHistory] = useState<StoredAssessment[]>([]);

  useEffect(() => {
    setHistory(getAssessments());
  }, [currentId]);

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your local assessment history?")) {
      clearAssessments();
      setHistory([]);
    }
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center space-y-2">
        <History className="w-8 h-8 text-slate-300 mx-auto" />
        <h4 className="text-sm font-semibold text-slate-700">No Assessment History</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Recent risk assessments during your browser session will appear here. No sensitive information is sent to permanent database storage.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-slate-700" />
          <h3 className="text-base font-bold text-slate-900">Recent Session Assessments</h3>
        </div>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold p-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {history.map((item) => {
          const isCurrent = item.id === currentId;
          const badgeClass =
            item.riskLevel === "Higher"
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : item.riskLevel === "Intermediate"
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200";

          return (
            <div
              key={item.id}
              className={`py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isCurrent ? "bg-blue-50/50 -mx-3 px-3 rounded-lg" : ""
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">{item.id}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${badgeClass}`}>
                    {item.riskLevel} ({item.riskPercentage}%)
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{formatDate(item.date)}</p>
              </div>

              <button
                onClick={() => onSelectHistory(item.result)}
                disabled={isCurrent}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:pointer-events-none self-start sm:self-auto"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Result</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
        <Shield className="w-3.5 h-3.5 text-slate-400" />
        <span>Stored exclusively in your local browser storage. Never tracked or monetized.</span>
      </div>
    </div>
  );
}
