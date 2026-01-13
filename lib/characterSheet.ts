import { DomainLevelMap, CharacterSheet } from "./types";
import { getClassName, getTopDomains } from "./className";

export function getTotalPointsUsed(levels: DomainLevelMap): number {
  return Object.values(levels).reduce((sum, value) => sum + value, 0);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getAutoTemperature(levels: DomainLevelMap): number {
  const totalPointsUsed = getTotalPointsUsed(levels);
  const maxLevel = Math.max(0, ...Object.values(levels));
  const focusRatio = maxLevel / Math.max(1, totalPointsUsed);
  const temperature =
    0.2 + totalPointsUsed * 0.03 + (1 - focusRatio) * 0.25;
  return clamp(Number(temperature.toFixed(2)), 0.2, 0.95);
}

export function buildCharacterSheet(
  levels: DomainLevelMap,
  pointsTotal: number,
  temperature: number,
  includeOutOfScope: boolean
): CharacterSheet {
  const className = getClassName(levels);
  return {
    className,
    pointsTotal,
    levels,
    topDomains: getTopDomains(levels),
    temperature,
    includeOutOfScope,
    style: {
      tone: "helpful, direct, non-technical friendly",
      format: "markdown"
    }
  };
}
