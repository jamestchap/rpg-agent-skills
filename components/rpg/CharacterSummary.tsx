"use client";

import { DomainKey } from "../../lib/types";

interface CharacterSummaryProps {
  className: string;
  flavourText: string;
  topDomains: DomainKey[];
}

export function CharacterSummary({
  className,
  flavourText,
  topDomains
}: CharacterSummaryProps) {
  return (
    <div className="panel space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-500">Character summary</p>
          <h2 className="text-2xl font-semibold text-ink-900 font-display">
            {className}
          </h2>
        </div>
        {topDomains.length > 0 && (
          <span className="badge">{topDomains.length} top domains</span>
        )}
      </div>
      <p className="text-sm text-ink-600">{flavourText}</p>
    </div>
  );
}
