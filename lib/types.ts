export type DomainKey =
  | "frontend"
  | "backend"
  | "testing"
  | "devops"
  | "databases"
  | "accessibility"
  | "performance"
  | "documentation"
  | "planning"
  | "designer";

export type DomainLevelMap = Record<DomainKey, number>;

export type ProviderName = "ollama" | "openrouter";

export type TemperatureMode = "auto" | "manual";

export interface CharacterSheet {
  className: string;
  pointsTotal: number;
  levels: DomainLevelMap;
  topDomains: DomainKey[];
  temperature: number;
  includeOutOfScope: boolean;
  style: {
    tone: string;
    format: "markdown";
  };
}
