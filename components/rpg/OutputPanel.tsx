"use client";

import { ValidationResult } from "../../lib/skillValidation";

interface OutputPanelProps {
  output: string;
  validation: ValidationResult;
  onCopy: () => void;
  onDownload: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
  errorMessage?: string;
}

export function OutputPanel({
  output,
  validation,
  onCopy,
  onDownload,
  onRegenerate,
  isLoading,
  errorMessage
}: OutputPanelProps) {
  return (
    <div className="panel space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="panel-title">SKILL.md output</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg border border-slate-700 px-3 py-1 text-sm text-slate-200"
            onClick={onCopy}
            type="button"
          >
            Copy
          </button>
          <button
            className="rounded-lg border border-slate-700 px-3 py-1 text-sm text-slate-200"
            onClick={onDownload}
            type="button"
          >
            Download SKILL.md
          </button>
          <button
            className="rounded-lg border border-forge-400 bg-forge-500/20 px-3 py-1 text-sm text-forge-100"
            disabled={isLoading}
            onClick={onRegenerate}
            type="button"
          >
            {isLoading ? "Forging..." : "Regenerate"}
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
        <pre className="max-h-[360px] whitespace-pre-wrap text-sm text-slate-200">
          {output || "Generated SKILL.md will appear here."}
        </pre>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span
          className={`font-medium ${
            validation.valid ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {validation.valid ? "✅ " : "❌ "}
          {validation.message}
        </span>
        {errorMessage && (
          <span className="text-rose-300">{errorMessage}</span>
        )}
      </div>
    </div>
  );
}
