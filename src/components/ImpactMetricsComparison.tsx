import React from "react";
import {
  TrendingDown,
  Clock,
  AlertTriangle,
  Fuel,
  Leaf,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";

export const ImpactMetricsComparison: React.FC = () => {
  const impacts = [
    {
      title: "Avg Passenger Wait Time",
      desc: "Wait time at high-demand platform gates during peak commute hours.",
      before: "11.4 min",
      after: "5.8 min",
      delta: "-49%",
      positive: true,
      icon: Clock,
    },
    {
      title: "Platform Overcrowding Risk",
      desc: "Percentage of stations exceeding 85% safety crowd capacity.",
      before: "38%",
      after: "6%",
      delta: "-84%",
      positive: true,
      icon: AlertTriangle,
    },
    {
      title: "Empty Seat Kilometers (Waste)",
      desc: "Fuel & electric energy wasted on low-patronage off-peak runs.",
      before: "28%",
      after: "8%",
      delta: "-71%",
      positive: true,
      icon: Fuel,
    },
    {
      title: "Daily Carbon Offset Generated",
      desc: "Emissions avoided by maintaining reliable headways to discourage private car use.",
      before: "850 kg",
      after: "2,450 kg",
      delta: "+188%",
      positive: true,
      icon: Leaf,
    },
  ];

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col">
      {/* Header */}
      <div className="pb-3 mb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-sans">
              System Impact: Static Schedule vs AI Dynamic Allocation
            </h3>
            <p className="text-xs text-slate-500">
              Measurable operational benefits achieved when buses are dynamically deployed according to predicted demand
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
          Validated Simulation Model
        </span>
      </div>

      {/* 4 Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {impacts.map((item, idx) => {
          const Icon = item.icon;

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 hover:border-emerald-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 font-sans">
                    {item.title}
                  </span>
                  <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-2xs">
                    <Icon className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug mb-3 font-sans">
                  {item.desc}
                </p>
              </div>

              {/* Before vs After comparison bar */}
              <div className="pt-2 border-t border-slate-200/70 space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Static Schedule:</span>
                  <span className="font-semibold line-through text-slate-400">{item.before}</span>
                </div>
                <div className="flex items-center justify-between text-slate-900 font-bold">
                  <span className="text-emerald-700">AI Reallocated:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-emerald-600 font-extrabold">{item.after}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      {item.delta}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
