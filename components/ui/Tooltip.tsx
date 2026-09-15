"use client";

import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

interface MedicalTooltipProps {
  title: string;
  content: string;
}

export function MedicalTooltip({ title, content }: MedicalTooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-1.5">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(!visible)}
        aria-label={`Educational information about ${title}`}
        className="text-slate-400 hover:text-navy-600 focus:outline-none transition-colors"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-50 border border-slate-700 pointer-events-none">
          <p className="font-semibold text-sky-400 mb-1">{title}</p>
          <p className="text-slate-300 leading-relaxed">{content}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
