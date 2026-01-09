"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

const DOMAIN_KEYS = Object.keys(domainFragments) as DomainKey[];
const DEFAULT_LEVELS: DomainLevelMap = DOMAIN_KEYS.reduce((acc, key) => {
  acc[key] = 0;
  return acc;
}, {} as DomainLevelMap);

const MAX_LEVEL = 5;

export default function HomePage() {
  const [levels, setLevels] = useState<DomainLevelMap>(DEFAULT_LEVELS);
  const [pointsTotal, setPointsTotal] = useState(10);
  const [provider, setProvider] = useState<ProviderName>("ollama");
  const [model, setModel] = useState("llama3.1:8b");
  const [apiKey, setApiKey] = useState("");
  const [rememberApiKey, setRememberApiKey] = useState(false);
  const [temperatureMode, setTemperatureMode] =
    useState<TemperatureMode>("auto");
  const [manualTemperature, setManualTemperature] = useState(0.4);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

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

  useEffect(() => {
    const stored = loadSettings();
    if (!stored) {
      return;
    }
    setLevels(stored.levels);
    setPointsTotal(stored.pointsTotal);
    setProvider(stored.provider);
    setModel(stored.model);
    setTemperatureMode(stored.temperatureMode);
    setManualTemperature(stored.manualTemperature);
    setRememberApiKey(Boolean(stored.rememberApiKey));
    if (stored.rememberApiKey && stored.apiKey) {
      setApiKey(stored.apiKey);
    }
  }, []);

  useEffect(() => {
    saveSettings({
      levels,
      pointsTotal,
      provider,
      model,
      temperatureMode,
      manualTemperature,
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
    rememberApiKey,
    apiKey
  ]);

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
      const sheet = buildCharacterSheet(levels, pointsTotal, activeTemperature);
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

      const payload = await response.json();
      if (!response.ok) {
        setErrorMessage(payload.error ?? "Something went wrong.");
        return;
      }
      setOutput(payload.skillMarkdown ?? "");
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
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-forge-300">
            RPG Skill Forge
          </p>
          <h1 className="text-3xl font-semibold text-slate-100">
            Build your agent character sheet
          </h1>
          <p className="text-slate-300">
            Allocate points across domains, tune your model, and forge a
            SKILL.md profile with an RPG twist.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
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
          <div className="space-y-6">
            <CharacterSummary
              className={className}
              flavourText={flavourText}
              topDomains={topDomains}
            />
            <div className="panel space-y-3">
              <h2 className="panel-title">Generate SKILL.md</h2>
              <p className="text-sm text-slate-300">
                Ready to forge? This uses your character sheet and temperature
                settings.
              </p>
              <button
                className="w-full rounded-xl border border-forge-400 bg-forge-500/30 px-4 py-3 text-sm font-semibold text-forge-100 transition hover:bg-forge-500/40"
                disabled={isLoading}
                onClick={handleGenerate}
                type="button"
              >
                {isLoading ? "Forging your skill..." : "Generate SKILL.md"}
              </button>
            </div>
          </div>
        </section>

        <ModelSettingsPanel
          provider={provider}
          model={model}
          apiKey={apiKey}
          rememberApiKey={rememberApiKey}
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
