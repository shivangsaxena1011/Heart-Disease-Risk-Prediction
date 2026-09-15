"use client";

import React from "react";
import { Recommendation, RiskClassification } from "@/lib/types";
import { Stethoscope, CheckSquare, HeartHandshake, AlertCircle } from "lucide-react";

interface RecommendationsCardProps {
  recommendations: Recommendation[];
  classification: RiskClassification;
}

export function RecommendationsCard({ recommendations, classification }: RecommendationsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Educational Guidance & Next Steps</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Non-prescriptive recommendations to facilitate informed discussions with your healthcare provider.
          </p>
        </div>
        <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
          <Stethoscope className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {rec.category}
              </span>
            </div>
            <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{rec.detail}</p>
          </div>
        ))}
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Educational Safeguard</p>
          <p className="mt-0.5 leading-relaxed">
            Never initiate, discontinue, or alter any medication or cardiovascular therapy based on this automated screening. All clinical choices require direct evaluation by a certified healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}
