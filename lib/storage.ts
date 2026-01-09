import { z } from "zod";
import { domainFragments } from "./domainFragments";
import {
  DomainKey,
  DomainLevelMap,
  ProviderName,
  TemperatureMode
} from "./types";

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
const DOMAIN_KEYS = Object.keys(domainFragments) as DomainKey[];
const levelSchema = z.coerce.number().int().min(0).max(5);
const levelsSchema = z
  .object(
    DOMAIN_KEYS.reduce((shape, key) => {
      shape[key] = levelSchema;
      return shape;
    }, {} as Record<DomainKey, z.ZodType<number>>)
  )
  .strict();
const settingsSchema = z
  .object({
    levels: levelsSchema,
    pointsTotal: z.coerce.number().int().min(0).max(30),
    provider: z.enum(["ollama", "openrouter"]),
    model: z.string(),
    temperatureMode: z.enum(["auto", "manual"]),
    manualTemperature: z.coerce.number().min(0).max(1),
    rememberApiKey: z.coerce.boolean(),
    apiKey: z.string().optional()
  })
  .strict();

export function loadSettings(): StoredSettings | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = settingsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
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
