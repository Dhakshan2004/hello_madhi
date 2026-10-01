import React from "react";
import { SCENARIOS, ScenarioType, ScenarioDefinition } from "../data/scenarioData";
import { SlidersHorizontal, Sparkles, AlertCircle, CloudRain, Sun, Trophy, GraduationCap, Umbrella } from "lucide-react";

interface ScenarioSimulatorProps {
  activeScenario: ScenarioType;
  onSelectScenario: (scenario: ScenarioType) => void;
  isRecalculating?: boolean;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  activeScenario,
  onSelectScenario,
  isRecalculating = false,
}) => {
  const currentDef = SCENARIOS.find((s) => s.id === activeScenario) || SCENARIOS[0];

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-sans">
              Dynamic Condition Simulator (What-If Forecasting)
            </h3>
            <p className="text-xs text-slate-500">
              Select real-world conditions to test how the AI dynamically adapts fleet allocations
            </p>
          </div>
        </div>

        {/* Recalculating Indicator */}
        {isRecalculating && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-50 text-blue-700 animate-pulse border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            Recalculating Stochastic Headways...
          </span>
        )}
      </div>

      {/* Scenario Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-3">
        {SCENARIOS.map((sc) => {
          const isSelected = sc.id === activeScenario;

          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-blue-50/80 border-blue-500 ring-2 ring-blue-100 shadow-xs"
                  : "bg-slate-50/60 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-base">{sc.emoji}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  {sc.surgeFactor}
                </span>
              </div>
              <div className="font-bold text-xs text-slate-900 truncate font-sans">
                {sc.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Impact Summary Banner */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 font-sans">Active Condition:</span>
          <span className="font-mono text-blue-700 font-semibold">{currentDef.label} ({currentDef.surgeFactor})</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-slate-600 font-sans">{currentDef.impactSummary}</span>
        </div>
        <div className="text-[11px] font-mono text-slate-500 shrink-0">
          Load Multiplier: <span className="font-bold text-slate-800">{currentDef.multiplier.toFixed(2)}x</span>
        </div>
      </div>
    </div>
  );
};
