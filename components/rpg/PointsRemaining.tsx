"use client";

interface PointsRemainingProps {
  pointsRemaining: number;
  pointsTotal: number;
  onChangeTotal: (value: number) => void;
}

export function PointsRemaining({
  pointsRemaining,
  pointsTotal,
  onChangeTotal
}: PointsRemainingProps) {
  return (
    <div className="panel flex items-center justify-between gap-6">
      <div>
        <p className="text-sm text-ink-500">Points remaining</p>
        <p className="text-2xl font-semibold text-ink-900">
          {pointsRemaining}
        </p>
      </div>
      <label className="text-sm text-ink-600">
        Total points
        <input
          className="ml-3 w-20 rounded-lg border-2 border-ink-200 bg-white/90 px-2 py-1 text-ink-900"
          min={0}
          max={30}
          onChange={(event) => onChangeTotal(Number(event.target.value))}
          type="number"
          value={pointsTotal}
        />
      </label>
    </div>
  );
}
