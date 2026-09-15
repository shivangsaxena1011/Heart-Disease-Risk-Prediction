import React from "react";
import Link from "next/link";
import { Activity, ShieldAlert, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">HeartGuard AI</span>
            </div>
            <p className="text-slate-400 max-w-md text-xs leading-relaxed">
              An educational AI/ML healthcare project demonstrating clinical risk screening using supervised machine learning algorithms trained on the UCI Cleveland Heart Disease dataset.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 rounded-lg p-2.5 max-w-md">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span><strong>Educational Screening Only:</strong> Not a medical diagnosis, clinical decision, or therapeutic directive.</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/assessment" className="hover:text-white transition-colors">Risk Assessment</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/model" className="hover:text-white transition-colors">Model Insights & Metrics</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Academic Overview</Link></li>
            </ul>
          </div>

          {/* Col 3: Compliance & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Governance</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Medical Disclaimer</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy & Data Ethics</Link></li>
              <li><a href="https://archive.ics.uci.edu/dataset/45/heart+disease" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">UCI Dataset Reference ↗</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HeartGuard AI. Developed for educational, research, and technical evaluation purposes.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by Scikit-Learn & Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
