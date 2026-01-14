"use client";

import { ValidationResult } from "../../lib/skillValidation";
import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";

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
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle>SKILL.md output</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onCopy} size="sm" variant="secondary">
            Copy
          </Button>
          <Button onClick={onDownload} size="sm" variant="secondary">
            Download SKILL.md
          </Button>
          <Button
            disabled={isLoading}
            onClick={onRegenerate}
            size="sm"
            variant="primary"
          >
            {isLoading ? "Forging..." : "Regenerate"}
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-ink-200 bg-parchment-50 p-4">
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
    </Card>
  );
}
