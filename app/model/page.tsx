"use client";

import React, { useState, useEffect } from "react";
import { ModelInfoResponse } from "@/lib/types";
import { fetchModelInfo } from "@/lib/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from "recharts";
import {
  Database,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Activity,
  Award,
  Layers,
  Info,
  Loader2
} from "lucide-react";

export default function ModelInsightsPage() {
  const [data, setData] = useState<ModelInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModelKey, setActiveModelKey] = useState<string>("Logistic Regression");

  useEffect(() => {
    fetchModelInfo()
      .then((res) => {
        setData(res);
        if (res.metrics?.best_model) {
          setActiveModelKey(res.metrics.best_model);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load model diagnostics.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading model diagnostics and metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Model Information Unavailable</h2>
        <p className="text-sm text-slate-500">{error || "Model artifacts not generated."}</p>
      </div>
    );
  }

  const metadata = data.metadata || ({} as any);
  const metrics = data.metrics || ({} as any);
  const models = metrics.models || {};
  const activeModel = models[activeModelKey] || metrics.selected_metrics || {
    confusion_matrix: { tn: 0, fp: 0, fn: 0, tp: 0 },
    test_roc_auc: 0,
    roc_curve: []
  };
  const feature_importance = Array.isArray(data.feature_importance) ? data.feature_importance : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Activity className="w-3.5 h-3.5" />
            <span>Empirical Validation & Benchmarks</span>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {metadata.model_version || "HeartGuard Model v1.0"}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Model Insights & Performance Metrics
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Comprehensive evaluation of 6 machine learning architectures trained on the UCI Cleveland Heart Disease dataset. All metrics reflect genuine stratified cross-validation and test holdout evaluation.
        </p>
      </div>

      {/* Dataset Statistics Grid */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Dataset Overview</h2>
              <p className="text-xs text-slate-500">UCI Cleveland Heart Disease Repository</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Gold Standard Benchmark
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400">Total Patient Samples</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{metadata.total_samples}</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">242 Train / 61 Test (80/20)</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400">Clinical Input Features</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{metadata.total_features}</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">5 Continuous, 8 Discrete</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400">Target Variable</span>
            <div className="text-sm font-bold text-slate-900 mt-2">Coronary Narrowing &gt; 50%</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Angiographic Status</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400">Class Balance</span>
            <div className="text-sm font-bold text-emerald-600 mt-2">
              {metadata.class_distribution.negative_pct}% vs {metadata.class_distribution.positive_pct}%
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">164 Lower / 139 Higher</span>
          </div>
        </div>
      </section>

      {/* Multi-Model Comparison Table */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Multi-Model Comparative Performance</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical holdout test set (n=61) and 5-fold stratified cross-validation.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
            <Award className="w-4 h-4" />
            <span>Selected: <strong>{metrics.best_model}</strong></span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                <th className="py-3 px-3">Algorithm</th>
                <th className="py-3 px-3">Test Accuracy</th>
                <th className="py-3 px-3">Precision</th>
                <th className="py-3 px-3">Recall (Sensitivity)</th>
                <th className="py-3 px-3">F1 Score</th>
                <th className="py-3 px-3">ROC-AUC</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(models).map(([name, m]) => {
                const isSelected = name === metrics.best_model;
                const isActive = name === activeModelKey;

                return (
                  <tr
                    key={name}
                    className={`transition-colors ${
                      isActive ? "bg-blue-50/70 font-semibold" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="py-3 px-3 flex items-center gap-2">
                      <span>{name}</span>
                      {isSelected && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Optimal
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">{(m.test_accuracy * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3">{(m.test_precision * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 font-semibold text-blue-700">
                      {(m.test_recall * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3">{(m.test_f1 * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {(m.test_roc_auc * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setActiveModelKey(name)}
                        className={`text-[11px] px-2.5 py-1 rounded border transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        Inspect Charts
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Model Selection Explanation */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">Model Selection Criterion</p>
            <p className="mt-0.5 leading-relaxed text-slate-600">
              {metadata.selection_rationale}
            </p>
          </div>
        </div>
      </section>

      {/* Active Model Detailed Diagnostics: Confusion Matrix & ROC Curve */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confusion Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Confusion Matrix</h3>
              <p className="text-xs text-slate-500">Holdout evaluation on {activeModelKey}</p>
            </div>
            <span className="text-xs font-mono text-slate-500">N = 61</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              {/* True Negative */}
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-[11px] font-bold uppercase text-emerald-800 tracking-wider">
                  True Negative (TN)
                </span>
                <div className="text-3xl font-black text-emerald-700">
                  {activeModel.confusion_matrix.tn}
                </div>
                <p className="text-[10px] text-emerald-600">Correctly screened as lower risk</p>
              </div>

              {/* False Positive */}
              <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-[11px] font-bold uppercase text-amber-800 tracking-wider">
                  False Positive (FP)
                </span>
                <div className="text-3xl font-black text-amber-700">
                  {activeModel.confusion_matrix.fp}
                </div>
                <p className="text-[10px] text-amber-600">Screened high, actual lower</p>
              </div>

              {/* False Negative */}
              <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                <span className="text-[11px] font-bold uppercase text-rose-800 tracking-wider">
                  False Negative (FN)
                </span>
                <div className="text-3xl font-black text-rose-700">
                  {activeModel.confusion_matrix.fn}
                </div>
                <p className="text-[10px] text-rose-600">Screened low, actual higher (Critical)</p>
              </div>

              {/* True Positive */}
              <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="text-[11px] font-bold uppercase text-blue-800 tracking-wider">
                  True Positive (TP)
                </span>
                <div className="text-3xl font-black text-blue-700">
                  {activeModel.confusion_matrix.tp}
                </div>
                <p className="text-[10px] text-blue-600">Correctly screened as elevated risk</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center">
              High recall (sensitivity) was prioritized during cross-validation to minimize false negatives.
            </p>
          </div>
        </div>

        {/* ROC-AUC Curve */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">ROC Curve (Receiver Operating Characteristic)</h3>
              <p className="text-xs text-slate-500">True Positive vs False Positive Rate across thresholds</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
              AUC = {activeModel.test_roc_auc.toFixed(3)}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activeModel.roc_curve}
                margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="fpr"
                  domain={[0, 1]}
                  tick={{ fontSize: 10 }}
                  label={{ value: "False Positive Rate (1 - Specificity)", position: "insideBottom", offset: -5, fontSize: 10 }}
                />
                <YAxis
                  domain={[0, 1]}
                  tick={{ fontSize: 10 }}
                  label={{ value: "True Positive Rate (Sensitivity)", angle: -90, position: "insideLeft", fontSize: 10 }}
                />
                <RechartsTooltip
                  formatter={(val: any) => [val, "Rate"]}
                  labelFormatter={(val: any) => `FPR: ${val}`}
                />
                <Line
                  type="monotone"
                  dataKey="tpr"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#2563eb" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Global Feature Importance */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Global Feature Importance (Permutation Impact)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical reduction in test ROC-AUC score when shuffling each original clinical parameter (25 repeats).
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">13 Features Ranked</span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={feature_importance}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 10 }} unit="%" />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 11 }}
                width={120}
              />
              <RechartsTooltip
                formatter={(val: any) => [`${val}%`, "Relative Weight"]}
              />
              <Bar dataKey="relative_weight" radius={[0, 4, 4, 0]}>
                {feature_importance.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index < 4 ? "#2563eb" : index < 8 ? "#3b82f6" : "#94a3b8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
