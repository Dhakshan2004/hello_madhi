import React from "react";
import { Cpu, ShieldCheck, Sparkles, Sliders, CheckCircle2, BarChart2 } from "lucide-react";

export const ExplainableAiCard: React.FC = () => {
  const featureWeights = [
    { name: "Historical Commuter Patterns & Day-of-Week Trends", weight: 42, color: "bg-blue-600" },
    { name: "Weather Conditions (Rain, Temperature & Visibility)", weight: 21, color: "bg-sky-500" },
    { name: "Live Smart-Card Tap Velocity & Doorway Counts", weight: 19, color: "bg-indigo-500" },
    { name: "Special Event Schedules & School/Shift Calendars", weight: 18, color: "bg-teal-500" },
  ];

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">
                Explainable AI (XAI) – Feature Weights
              </h3>
              <p className="text-xs text-slate-500">
                Transparent decision weights used by the predictive model
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Model Accuracy: 98.4%
          </span>
        </div>

        {/* Feature Importance Bars */}
        <div className="space-y-3 pt-1">
          {featureWeights.map((f, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-xs font-sans mb-1 text-slate-700">
                <span className="truncate pr-2">{f.name}</span>
                <span className="font-mono font-bold text-slate-900 shrink-0">
                  {f.weight}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${f.color}`}
                  style={{ width: `${f.weight}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Spec Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Deterministic Verification Passed
        </span>
        <span>Inference Latency: 120ms</span>
      </div>
    </div>
  );
};
