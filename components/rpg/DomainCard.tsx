"use client";

import { DomainKey } from "../../lib/types";
import { domainFragments } from "../../lib/domainFragments";

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
    <div className="panel flex h-full flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-500">{fragment.label}</p>
          <h3 className="text-xl font-semibold text-ink-900">
            {fragment.icon} {fragment.label}
          </h3>
        </div>
        <span className="badge">Lv {level}</span>
      </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-pine-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          className="btn-secondary px-3 py-1 text-xs"
          onClick={() => onChange(Math.max(0, level - 1))}
          disabled={level === 0}
          type="button"
        >
          −
        </button>
        <input
          aria-label={`${fragment.label} level`}
          className="my-1 h-3 w-full cursor-pointer accent-brass-500"
          max={maxLevel}
          min={0}
          onChange={(event) => onChange(Number(event.target.value))}
          type="range"
          value={level}
        />
        <button
          className="btn-secondary px-3 py-1 text-xs disabled:opacity-50"
          onClick={() => onChange(Math.min(maxLevel, level + 1))}
          disabled={level >= maxLevel || disableIncrease}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
}
