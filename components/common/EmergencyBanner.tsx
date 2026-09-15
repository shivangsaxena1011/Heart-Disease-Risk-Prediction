"use client";

import React, { useState } from "react";
import { AlertCircle, X } from "lucide-react";

export function EmergencyBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 px-4 py-2 text-xs md:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Emergency Notice:</strong> If you are experiencing severe chest pain, difficulty breathing, fainting, or sudden weakness, seek emergency medical care immediately rather than relying on this screening tool.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-700 hover:text-amber-900 p-1 flex-shrink-0"
          aria-label="Dismiss emergency banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
