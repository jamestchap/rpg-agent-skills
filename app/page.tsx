"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DomainCard } from "../components/rpg/DomainCard";
import { CharacterSummary } from "../components/rpg/CharacterSummary";
import { PointsRemaining } from "../components/rpg/PointsRemaining";
import { ModelSettingsPanel } from "../components/rpg/ModelSettingsPanel";
import { OutputPanel } from "../components/rpg/OutputPanel";
import { domainFragments } from "../lib/domainFragments";
import {
  buildCharacterSheet,
  getAutoTemperature,
  getTotalPointsUsed
} from "../lib/characterSheet";
import { getClassFlavour, getClassName, getTopDomains } from "../lib/className";
import { loadSettings, saveSettings } from "../lib/storage";
import {
  DomainKey,
  DomainLevelMap,
  ProviderName,
  TemperatureMode
} from "../lib/types";
import { validateSkillMarkdown } from "../lib/skillValidation";
import { normalizeSkillMarkdown } from "../lib/skillNormalization";

const DOMAIN_KEYS = Object.keys(domainFragments) as DomainKey[];
const DEFAULT_LEVELS: DomainLevelMap = DOMAIN_KEYS.reduce((acc, key) => {
  acc[key] = 0;
  return acc;
}, {} as DomainLevelMap);

const MAX_LEVEL = 5;
const DEFAULT_OLLAMA_MODEL = "gemma2:9b";
const DEFAULT_OPENROUTER_MODEL = "anthropic/claude-3.5-sonnet";

type ErrorPayload = {
  error?: string;
};

type OpenRouterModel = {
  id: string;
  name?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isErrorPayload = (value: unknown): value is ErrorPayload =>
  isRecord(value) &&
  (value.error === undefined || typeof value.error === "string");

const isOpenRouterModel = (value: unknown): value is OpenRouterModel =>
  isRecord(value) &&
  typeof value.id === "string" &&
  (value.name === undefined || typeof value.name === "string");

const getErrorMessage = (value: unknown): string | undefined =>
  isErrorPayload(value) ? value.error : undefined;

const getOpenRouterModels = (value: unknown): OpenRouterModel[] => {
  if (!isRecord(value) || !Array.isArray(value.models)) {
    return [];
  }
  return value.models.filter(isOpenRouterModel);
};

const getSkillMarkdown = (value: unknown): string | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }
  return typeof value.skillMarkdown === "string"
    ? value.skillMarkdown
    : undefined;
};

export default function HomePage() {
  const [levels, setLevels] = useState<DomainLevelMap>(DEFAULT_LEVELS);
  const [pointsTotal, setPointsTotal] = useState(10);
  const [provider, setProvider] = useState<ProviderName>("ollama");
  const [model, setModel] = useState(DEFAULT_OLLAMA_MODEL);
  const [apiKey, setApiKey] = useState("");
  const [rememberApiKey, setRememberApiKey] = useState(false);
  const [temperatureMode, setTemperatureMode] =
    useState<TemperatureMode>("auto");
  const [manualTemperature, setManualTemperature] = useState(0.4);
  const [includeOutOfScope, setIncludeOutOfScope] = useState(true);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [openRouterModels, setOpenRouterModels] = useState<
    Array<{ id: string; name?: string }>
  >([]);
  const [modelsError, setModelsError] = useState<string | undefined>();
  const [isModelsLoading, setIsModelsLoading] = useState(false);
  const previousProviderRef = useRef<ProviderName>(provider);

  const totalPointsUsed = useMemo(
    () => getTotalPointsUsed(levels),
    [levels]
  );
  const pointsRemaining = pointsTotal - totalPointsUsed;
  const autoTemperature = useMemo(
    () => getAutoTemperature(levels),
    [levels]
  );
  const activeTemperature =
    temperatureMode === "auto" ? autoTemperature : manualTemperature;

  const className = useMemo(() => getClassName(levels), [levels]);
  const topDomains = useMemo(() => getTopDomains(levels), [levels]);
  const flavourText = useMemo(
    () => getClassFlavour(className, topDomains),
    [className, topDomains]
  );

  const adjustLevelsToFit = useCallback(
    (currentLevels: DomainLevelMap, nextPointsTotal: number) => {
      let newLevels = { ...currentLevels };
      let used = getTotalPointsUsed(newLevels);
      if (used <= nextPointsTotal) {
        return newLevels;
      }
      const sorted = Object.entries(newLevels).sort((a, b) => b[1] - a[1]);
      let index = 0;
      while (used > nextPointsTotal && index < sorted.length) {
        const [key, value] = sorted[index];
        if (value > 0) {
          newLevels = {
            ...newLevels,
            [key]: value - 1
          };
          used -= 1;
          sorted[index][1] = value - 1;
        } else {
          index += 1;
        }
      }
      return newLevels;
    },
    []
  );

  useEffect(() => {
    const stored = loadSettings();
    if (!stored) {
      return;
    }
    const adjustedLevels = adjustLevelsToFit(
      stored.levels,
      stored.pointsTotal
    );
    setLevels(adjustedLevels);
    setPointsTotal(stored.pointsTotal);
    setProvider(stored.provider);
    setModel(stored.model);
    setTemperatureMode(stored.temperatureMode);
    setManualTemperature(stored.manualTemperature);
    setIncludeOutOfScope(stored.includeOutOfScope ?? true);
    setRememberApiKey(Boolean(stored.rememberApiKey));
    if (stored.rememberApiKey && stored.apiKey) {
      setApiKey(stored.apiKey);
    }
  }, [adjustLevelsToFit]);

  useEffect(() => {
    saveSettings({
      levels,
      pointsTotal,
      provider,
      model,
      temperatureMode,
      manualTemperature,
      includeOutOfScope,
      rememberApiKey,
      apiKey: rememberApiKey ? apiKey : undefined
    });
  }, [
    levels,
    pointsTotal,
    provider,
    model,
    temperatureMode,
    manualTemperature,
    includeOutOfScope,
    rememberApiKey,
    apiKey
  ]);

  useEffect(() => {
    if (provider !== "ollama") {
      return;
    }
    if (!apiKey && !rememberApiKey) {
      return;
    }
    setApiKey("");
    setRememberApiKey(false);
  }, [provider, apiKey, rememberApiKey]);

  useEffect(() => {
    const previousProvider = previousProviderRef.current;
    if (provider === previousProvider) {
      return;
    }
    if (provider === "openrouter") {
      if (!model.trim() || model === DEFAULT_OLLAMA_MODEL) {
        setModel(DEFAULT_OPENROUTER_MODEL);
      }
    } else if (!model.trim() || model === DEFAULT_OPENROUTER_MODEL) {
      setModel(DEFAULT_OLLAMA_MODEL);
    }
    previousProviderRef.current = provider;
  }, [provider, model]);

  useEffect(() => {
    if (provider !== "openrouter") {
      return;
    }
    if (!apiKey.trim()) {
      setOpenRouterModels([]);
      setModelsError(undefined);
      setIsModelsLoading(false);
      return;
    }
    let isCancelled = false;
    setIsModelsLoading(true);
    setModelsError(undefined);
    fetch("/api/openrouter-models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey })
    })
      .then(async (response) => {
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as unknown;
          const message = getErrorMessage(payload);
          throw new Error(message ?? "Failed to load models.");
        }
        return (await response.json()) as unknown;
      })
      .then((payload: unknown) => {
        if (isCancelled) {
          return;
        }
        const models = getOpenRouterModels(payload);
        models.sort((a, b) => a.id.localeCompare(b.id));
        setOpenRouterModels(models);
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }
        setModelsError(
          error instanceof Error ? error.message : "Failed to load models."
        );
        setOpenRouterModels([]);
      })
      .finally(() => {
        if (isCancelled) {
          return;
        }
        setIsModelsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [provider, apiKey]);

  const handleLevelChange = useCallback(
    (domain: DomainKey, value: number) => {
      setLevels((prev) => {
        const current = prev[domain];
        const nextValue = Math.max(0, Math.min(MAX_LEVEL, value));
        if (nextValue > current) {
          const used = getTotalPointsUsed(prev);
          if (used >= pointsTotal) {
            return prev;
          }
        }
        return {
          ...prev,
          [domain]: nextValue
        };
      });
    },
    [pointsTotal]
  );

  const handlePointsTotalChange = useCallback(
    (value: number) => {
      const nextValue = Math.max(0, Math.min(30, value));
      setPointsTotal(nextValue);
      setLevels((prev) => adjustLevelsToFit(prev, nextValue));
    },
    [adjustLevelsToFit]
  );

  const validation = useMemo(
    () => validateSkillMarkdown(output || ""),
    [output]
  );

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);
    try {
      const sheet = buildCharacterSheet(
        levels,
        pointsTotal,
        activeTemperature,
        includeOutOfScope
      );
      const response = await fetch("/api/generate-skill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          characterSheet: sheet,
          providerConfig: {
            provider,
            model,
            apiKey: provider === "openrouter" ? apiKey : undefined,
            temperature: activeTemperature
          }
        })
      });

      if (!response.ok) {
        let message = "Something went wrong.";
        try {
          const payload = (await response.json()) as unknown;
          message = getErrorMessage(payload) ?? message;
        } catch {
          // Ignore parse failures and fall back to the default message.
        }
        setErrorMessage(message);
        return;
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (response.body && contentType.includes("text/plain")) {
        setOutput("");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let combined = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            setOutput((prev) => prev + chunk);
            combined += chunk;
          }
        }
        setOutput(normalizeSkillMarkdown(combined));
        return;
      }

      const payload = (await response.json()) as unknown;
      const skillMarkdown = getSkillMarkdown(payload);
      setOutput(normalizeSkillMarkdown(skillMarkdown ?? ""));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Network error."
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    levels,
    pointsTotal,
    activeTemperature,
    includeOutOfScope,
    provider,
    model,
    apiKey
  ]);

  const handleCopy = useCallback(async () => {
    if (!output) {
      return;
    }
    await navigator.clipboard.writeText(output);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) {
      return;
    }
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SKILL.md";
    link.click();
    URL.revokeObjectURL(url);
  }, [output]);

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10">
      <div
        className="page-sheen pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8">
        <header
          className="space-y-3 animate-fade-up"
          style={{ animationDelay: "0.05s" }}
        >
          <p className="badge">RPG Skill Forge</p>
          <h1 className="text-3xl font-semibold text-ink-900 md:text-4xl font-display">
            Build your agent character sheet
          </h1>
          <p className="text-base text-ink-600 md:text-lg">
            Allocate points across domains, tune your model, and forge a
            SKILL.md profile with an RPG twist.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div
            className="space-y-6 animate-fade-up"
            style={{ animationDelay: "0.12s" }}
          >
            <PointsRemaining
              pointsRemaining={pointsRemaining}
              pointsTotal={pointsTotal}
              onChangeTotal={handlePointsTotalChange}
            />
            <div className="grid gap-4 md:grid-cols-2">
              {DOMAIN_KEYS.map((domain) => (
                <DomainCard
                  key={domain}
                  domain={domain}
                  level={levels[domain]}
                  maxLevel={MAX_LEVEL}
                  onChange={(value) => handleLevelChange(domain, value)}
                  disableIncrease={pointsRemaining <= 0}
                />
              ))}
            </div>
          </div>
          <div
            className="space-y-6 animate-fade-up"
            style={{ animationDelay: "0.18s" }}
          >
            <CharacterSummary
              className={className}
              flavourText={flavourText}
              topDomains={topDomains}
            />
            <div className="panel space-y-3">
              <h2 className="panel-title">Generate SKILL.md</h2>
              <p className="text-sm text-ink-600">
                Ready to forge? This uses your character sheet and temperature
                settings.
              </p>
              <button
                className="btn-primary w-full py-3"
                disabled={isLoading}
                onClick={handleGenerate}
                type="button"
              >
                {isLoading ? "Forging your skill..." : "Generate SKILL.md"}
              </button>
              <label className="flex items-start gap-3 text-xs text-ink-600">
                <input
                  checked={includeOutOfScope}
                  className="mt-0.5 accent-brass-500"
                  onChange={(event) =>
                    setIncludeOutOfScope(event.target.checked)
                  }
                  type="checkbox"
                />
                Include the “Out of scope / Don&apos;ts” section.
              </label>
            </div>
          </div>
        </section>

        <ModelSettingsPanel
          provider={provider}
          model={model}
          apiKey={apiKey}
          rememberApiKey={rememberApiKey}
          openRouterModels={openRouterModels}
          isModelsLoading={isModelsLoading}
          modelsError={modelsError}
          temperatureMode={temperatureMode}
          manualTemperature={manualTemperature}
          autoTemperature={autoTemperature}
          onProviderChange={setProvider}
          onModelChange={setModel}
          onApiKeyChange={setApiKey}
          onRememberChange={setRememberApiKey}
          onTemperatureModeChange={setTemperatureMode}
          onManualTemperatureChange={setManualTemperature}
        />

        <OutputPanel
          output={output}
          validation={validation}
          onCopy={handleCopy}
          onDownload={handleDownload}
          onRegenerate={handleGenerate}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </div>
    </main>
  );
}
