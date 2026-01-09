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
        <p className="text-sm text-slate-400">Points remaining</p>
        <p className="text-2xl font-semibold text-slate-100">
          {pointsRemaining}
        </p>
      </div>
      <label className="text-sm text-slate-300">
        Total points
        <input
          className="ml-3 w-20 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-slate-100"
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
