export type DomainKey =
  | "frontend"
  | "backend"
  | "testing"
  | "devops"
  | "databases"
  | "accessibility"
  | "performance"
  | "documentation";

export type DomainLevelMap = Record<DomainKey, number>;

export type ProviderName = "ollama" | "openrouter";

export type TemperatureMode = "auto" | "manual";

export interface CharacterSheet {
  className: string;
  pointsTotal: number;
  levels: DomainLevelMap;
  topDomains: DomainKey[];
  temperature: number;
  style: {
    tone: string;
    format: "markdown";
  };
}
