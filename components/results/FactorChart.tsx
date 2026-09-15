"use client";

import React from "react";
import { FactorAttribution } from "@/lib/types";
import { ArrowUpRight, ArrowDownRight, Minus, Info } from "lucide-react";

interface FactorChartProps {
  factors: FactorAttribution[];
}

export function FactorChart({ factors }: FactorChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Why Did the Model Produce This Result?</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Localized marginal feature attribution indicating how entered parameters shifted the risk estimate.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200 self-start sm:self-auto">
          Local Attribution
        </span>
      </div>

      <div className="space-y-4">
        {factors.map((item, idx) => {
          const isElevating = item.direction === "elevating";
          const isLowering = item.direction === "lowering";

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{item.label}</span>
                  <span className="text-xs text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                    Value: {item.patient_value}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {isElevating && (
                    <span className="inline-flex items-center text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                      Elevating Factor (+{(item.impact_score * 100).toFixed(1)}%)
                    </span>
                  )}
                  {isLowering && (
                    <span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                      Protective Shift ({(item.impact_score * 100).toFixed(1)}%)
                    </span>
                  )}
                  {!isElevating && !isLowering && (
                    <span className="inline-flex items-center text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Minus className="w-3.5 h-3.5 mr-0.5" />
                      Neutral Influence
                    </span>
                  )}
                </div>
              </div>

              {/* Relative Impact Bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isElevating ? "bg-rose-500" : isLowering ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(12, Math.abs(item.impact_score) * 200))}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Methodological Note:</strong> Feature importance describes how the model uses features. It does not prove that a feature caused the medical outcome.
        </p>
      </div>
    </div>
  );
}
