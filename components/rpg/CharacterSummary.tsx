"use client";

import { DomainKey } from "../../lib/types";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

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
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-500">Character summary</p>
          <h2 className="text-2xl font-semibold text-ink-900 font-display">
            {className}
          </h2>
        </div>
        {topDomains.length > 0 && (
          <Badge>{topDomains.length} top domains</Badge>
        )}
      </div>
      <p className="text-sm text-ink-600">{flavourText}</p>
    </Card>
  );
}
