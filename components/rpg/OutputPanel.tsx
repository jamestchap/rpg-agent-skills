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
            className="btn-secondary px-3 py-1"
            onClick={onCopy}
            type="button"
          >
            Copy
          </button>
          <button
            className="btn-secondary px-3 py-1"
            onClick={onDownload}
            type="button"
          >
            Download SKILL.md
          </button>
          <button
            className="btn-primary px-3 py-1"
            disabled={isLoading}
            onClick={onRegenerate}
            type="button"
          >
            {isLoading ? "Forging..." : "Regenerate"}
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-ink-200 bg-parchment-50 p-4 overflow-hidden">
        <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap break-words text-sm text-ink-800">
          {output || "Generated SKILL.md will appear here."}
        </pre>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span
          className={`font-medium ${
            validation.valid ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {validation.valid ? "✅ " : "❌ "}
          {validation.message}
        </span>
        {errorMessage && (
          <span className="text-rose-700">{errorMessage}</span>
        )}
      </div>
    </div>
  );
}
