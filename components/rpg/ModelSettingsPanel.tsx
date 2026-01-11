"use client";

import { useState } from "react";
import { ProviderName, TemperatureMode } from "../../lib/types";

interface ModelSettingsPanelProps {
  provider: ProviderName;
  model: string;
  apiKey: string;
  rememberApiKey: boolean;
  openRouterModels: Array<{ id: string; name: string }>;
  isModelsLoading: boolean;
  modelsError?: string;
  temperatureMode: TemperatureMode;
  manualTemperature: number;
  autoTemperature: number;
  onProviderChange: (provider: ProviderName) => void;
  onModelChange: (model: string) => void;
  onApiKeyChange: (key: string) => void;
  onRememberChange: (remember: boolean) => void;
  onTemperatureModeChange: (mode: TemperatureMode) => void;
  onManualTemperatureChange: (value: number) => void;
}

export function ModelSettingsPanel({
  provider,
  model,
  apiKey,
  rememberApiKey,
  openRouterModels,
  isModelsLoading,
  modelsError,
  temperatureMode,
  manualTemperature,
  autoTemperature,
  onProviderChange,
  onModelChange,
  onApiKeyChange,
  onRememberChange,
  onTemperatureModeChange,
  onManualTemperatureChange
}: ModelSettingsPanelProps) {
  const isOpenRouter = provider === "openrouter";
  const [isModelFocused, setIsModelFocused] = useState(false);
  const showModelsList = isOpenRouter && openRouterModels.length > 0;
  const normalizedModel = model.trim().toLowerCase();
  const filteredModels = showModelsList
    ? openRouterModels.filter((modelItem) => {
        if (!normalizedModel) {
          return true;
        }
        return (
          modelItem.id.toLowerCase().includes(normalizedModel) ||
          modelItem.name.toLowerCase().includes(normalizedModel)
        );
      })
    : [];
  const modelStatus = (() => {
    if (!isOpenRouter) {
      return "";
    }
    if (!apiKey.trim()) {
      return "Add an API key to load models.";
    }
    if (isModelsLoading) {
      return "Loading models...";
    }
    if (modelsError) {
      return modelsError;
    }
    return "";
  })();
  const handleModelSelect = (nextModel: string) => {
    onModelChange(nextModel);
    setIsModelFocused(false);
  };

  return (
    <div className="panel space-y-4">
      <h2 className="panel-title">Model settings</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-slate-300">
          Provider
          <select
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
            onChange={(event) =>
              onProviderChange(event.target.value as ProviderName)
            }
            value={provider}
          >
            <option value="ollama">Ollama</option>
            <option value="openrouter">OpenRouter</option>
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Model
          <div className="relative">
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
              onChange={(event) => {
                onModelChange(event.target.value);
                setIsModelFocused(true);
              }}
              onFocus={() => setIsModelFocused(true)}
              onBlur={() => setIsModelFocused(false)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsModelFocused(false);
                }
              }}
              placeholder={
                isOpenRouter ? "anthropic/claude-3.5-sonnet" : "gemma2:9b"
              }
              type="text"
              value={model}
            />
            {showModelsList && isModelFocused && filteredModels.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-2 max-h-40 overflow-auto rounded-lg border border-slate-800 bg-slate-950 shadow-lg">
                {filteredModels.map((modelItem) => (
                  <button
                    className="block w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-900"
                    key={modelItem.id}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleModelSelect(modelItem.id);
                    }}
                    type="button"
                  >
                    <span className="text-slate-200">{modelItem.id}</span>
                    {modelItem.name && (
                      <span className="text-slate-500">
                        {" "}
                        — {modelItem.name}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          {showModelsList && filteredModels.length === 0 && normalizedModel && (
            <p className="mt-2 text-xs text-slate-500">No matches.</p>
          )}
          {isOpenRouter && modelStatus && (
            <p className="mt-2 text-xs text-slate-400">{modelStatus}</p>
          )}
        </label>
        {isOpenRouter && (
          <div className="space-y-2">
            <label className="text-sm text-slate-300">
              OpenRouter API key
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
                onChange={(event) => onApiKeyChange(event.target.value)}
                placeholder="sk-or-..."
                type="password"
                value={apiKey}
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-400">
              <input
                checked={rememberApiKey}
                className="accent-forge-500"
                onChange={(event) => onRememberChange(event.target.checked)}
                type="checkbox"
              />
              Remember key on this device
            </label>
          </div>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm text-slate-300">Temperature mode</p>
          <div className="flex gap-2">
            <button
              className={`rounded-lg border px-3 py-1 text-sm ${
                temperatureMode === "auto"
                  ? "border-forge-400 bg-forge-500/20 text-forge-100"
                  : "border-slate-700 text-slate-300"
              }`}
              onClick={() => onTemperatureModeChange("auto")}
              type="button"
            >
              Auto
            </button>
            <button
              className={`rounded-lg border px-3 py-1 text-sm ${
                temperatureMode === "manual"
                  ? "border-forge-400 bg-forge-500/20 text-forge-100"
                  : "border-slate-700 text-slate-300"
              }`}
              onClick={() => onTemperatureModeChange("manual")}
              type="button"
            >
              Manual
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Auto mode updates based on your build: {autoTemperature}.
          </p>
        </div>
        <label className="text-sm text-slate-300">
          Manual temperature
          <input
            className="mt-3 h-2 w-full cursor-pointer accent-forge-500"
            disabled={temperatureMode !== "manual"}
            max={1}
            min={0}
            onChange={(event) =>
              onManualTemperatureChange(Number(event.target.value))
            }
            step={0.01}
            type="range"
            value={manualTemperature}
          />
          <p className="mt-2 text-xs text-slate-400">
            Current: {manualTemperature.toFixed(2)}
          </p>
        </label>
      </div>
    </div>
  );
}
