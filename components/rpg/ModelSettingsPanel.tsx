"use client";

import { useState } from "react";
import { ProviderName, TemperatureMode } from "../../lib/types";
import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Slider } from "../ui/slider";

interface ModelSettingsPanelProps {
  provider: ProviderName;
  model: string;
  apiKey: string;
  rememberApiKey: boolean;
  openRouterModels: Array<{ id: string; name?: string }>;
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
          (modelItem.name ?? "").toLowerCase().includes(normalizedModel)
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
    <Card className="space-y-4">
      <CardTitle>Model settings</CardTitle>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-ink-600">
          Provider
          <Select
            className="mt-1"
            onChange={(event) =>
              onProviderChange(event.target.value as ProviderName)
            }
            value={provider}
          >
            <option value="ollama">Ollama</option>
            <option value="openrouter">OpenRouter</option>
          </Select>
        </label>
        <label className="text-sm text-ink-600">
          Model
          <div className="relative">
            <Input
              className="mt-1"
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
                isOpenRouter ? "openrouter/model-id" : "gemma2:9b"
              }
              type="text"
              value={model}
            />
            {showModelsList && isModelFocused && filteredModels.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-2 max-h-40 overflow-auto rounded-lg border border-ink-200 bg-white shadow-lg">
                {filteredModels.map((modelItem) => (
                  <Button
                    className="h-auto w-full justify-start rounded-md px-3 py-2 text-left text-xs font-normal text-ink-800 hover:bg-parchment-100"
                    key={modelItem.id}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleModelSelect(modelItem.id);
                    }}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    <span className="text-ink-800">{modelItem.id}</span>
                    {modelItem.name && (
                      <span className="text-ink-500">
                        {" "}
                        — {modelItem.name}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
          {showModelsList && filteredModels.length === 0 && normalizedModel && (
            <p className="mt-2 text-xs text-ink-500">No matches.</p>
          )}
          {isOpenRouter && modelStatus && (
            <p className="mt-2 text-xs text-ink-500">{modelStatus}</p>
          )}
        </label>
        {isOpenRouter && (
          <div className="space-y-2">
            <label className="text-sm text-ink-600">
              OpenRouter API key
              <Input
                className="mt-1"
                onChange={(event) => onApiKeyChange(event.target.value)}
                placeholder="sk-or-..."
                type="password"
                value={apiKey}
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-ink-500">
              <Checkbox
                checked={rememberApiKey}
                onChange={(event) => onRememberChange(event.target.checked)}
              />
              Remember key on this device
            </label>
          </div>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm text-ink-600">Temperature mode</p>
          <div className="flex gap-2">
            <Button
              className={
                temperatureMode === "auto"
                  ? "border-brass-600 bg-brass-100 text-brass-800"
                  : "border-ink-200 text-ink-600 hover:border-ink-400"
              }
              onClick={() => onTemperatureModeChange("auto")}
              size="sm"
              type="button"
              variant="chip"
            >
              Auto
            </Button>
            <Button
              className={
                temperatureMode === "manual"
                  ? "border-brass-600 bg-brass-100 text-brass-800"
                  : "border-ink-200 text-ink-600 hover:border-ink-400"
              }
              onClick={() => onTemperatureModeChange("manual")}
              size="sm"
              type="button"
              variant="chip"
            >
              Manual
            </Button>
          </div>
          <p className="text-xs text-ink-500">
            Auto mode updates based on your build: {autoTemperature}.
          </p>
        </div>
        <label className="text-sm text-ink-600">
          Manual temperature
          <Slider
            className="mt-3"
            disabled={temperatureMode !== "manual"}
            max={1}
            min={0}
            onChange={(event) =>
              onManualTemperatureChange(Number(event.target.value))
            }
            step={0.01}
            value={manualTemperature}
          />
          <p className="mt-2 text-xs text-ink-500">
            Current: {manualTemperature.toFixed(2)}
          </p>
        </label>
      </div>
    </Card>
  );
}
