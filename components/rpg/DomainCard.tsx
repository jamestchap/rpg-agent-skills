"use client";

import { DomainKey } from "../../lib/types";
import { domainFragments } from "../../lib/domainFragments";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Slider } from "../ui/slider";

interface DomainCardProps {
  domain: DomainKey;
  level: number;
  maxLevel: number;
  onChange: (level: number) => void;
  disableIncrease: boolean;
}

export function DomainCard({
  domain,
  level,
  maxLevel,
  onChange,
  disableIncrease
}: DomainCardProps) {
  const fragment = domainFragments[domain];
  const percent = Math.round((level / maxLevel) * 100);

  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-500">{fragment.label}</p>
          <h3 className="text-xl font-semibold text-ink-900">
            {fragment.icon} {fragment.label}
          </h3>
        </div>
        <Badge>Lv {level}</Badge>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-pine-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          size="xs"
          variant="secondary"
          onClick={() => onChange(Math.max(0, level - 1))}
          disabled={level === 0}
          type="button"
        >
          −
        </Button>
        <Slider
          aria-label={`${fragment.label} level`}
          className="my-1"
          max={maxLevel}
          min={0}
          onChange={(event) => onChange(Number(event.target.value))}
          value={level}
        />
        <Button
          size="xs"
          variant="secondary"
          onClick={() => onChange(Math.min(maxLevel, level + 1))}
          disabled={level >= maxLevel || disableIncrease}
          type="button"
        >
          +
        </Button>
      </div>
    </Card>
  );
}
