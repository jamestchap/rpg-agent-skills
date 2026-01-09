import { DomainLevelMap, ProviderName, TemperatureMode } from "./types";

export interface StoredSettings {
  levels: DomainLevelMap;
  pointsTotal: number;
  provider: ProviderName;
  model: string;
  temperatureMode: TemperatureMode;
  manualTemperature: number;
  rememberApiKey: boolean;
  apiKey?: string;
}

const STORAGE_KEY = "rpg-skill-forge:v1";

export function loadSettings(): StoredSettings | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredSettings;
  } catch {
    return null;
  }
}

export function saveSettings(settings: StoredSettings): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
