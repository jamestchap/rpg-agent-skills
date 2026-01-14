"use client";

import { Card } from "../ui/card";
import { Input } from "../ui/input";

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
    <Card className="flex items-center justify-between gap-6">
      <div>
        <p className="text-sm text-ink-500">Points remaining</p>
        <p className="text-2xl font-semibold text-ink-900">
          {pointsRemaining}
        </p>
      </div>
      <label className="text-sm text-ink-600">
        Total points
        <Input
          className="ml-3 w-20"
          min={0}
          max={30}
          onChange={(event) => onChangeTotal(Number(event.target.value))}
          type="number"
          value={pointsTotal}
        />
      </label>
    </Card>
  );
}
