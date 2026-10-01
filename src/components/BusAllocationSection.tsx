import React from "react";
import { RouteDemandItem } from "../data/transitDemoData";
import {
  Bus,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp
} from "lucide-react";

interface BusAllocationSectionProps {
  routes: RouteDemandItem[];
  onSelectRoute: (route: RouteDemandItem) => void;
}

export const BusAllocationSection: React.FC<BusAllocationSectionProps> = ({
  routes,
  onSelectRoute,
}) => {
  // Aggregate statistics
  const totalCurrentBuses = routes.reduce((acc, r) => acc + r.currentBuses, 0);
  const totalRecommendedBuses = routes.reduce((acc, r) => acc + r.recommendedBuses, 0);
  const netShift = totalRecommendedBuses - totalCurrentBuses;

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-sans">
              Recommended Bus Allocation
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated fleet balancing: Reallocating underutilized buses to high-demand corridors
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <span>Fleet in Service: </span>
            <span className="font-bold text-slate-900">{totalCurrentBuses} buses</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold">
            <span>AI Optimized: </span>
            <span>{totalRecommendedBuses} buses</span>
          </div>
        </div>
      </div>

      {/* Grid of Route Allocation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {routes.map((route) => {
          const isIncrease = route.delta > 0;
          const isReduce = route.delta < 0;
          const isMaintain = route.delta === 0;

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute(route)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isIncrease
                  ? "bg-rose-50/40 border-rose-200 hover:border-rose-400"
                  : isReduce
                  ? "bg-emerald-50/40 border-emerald-200 hover:border-emerald-400"
                  : "bg-slate-50/50 border-slate-200 hover:border-blue-300"
              }`}
            >
              {/* Card Header: Route Name & Action Badge */}
              <div className="mb-2.5">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-slate-900 text-sm font-sans flex items-center gap-1.5 truncate">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isIncrease
                          ? "bg-rose-600"
                          : isReduce
                          ? "bg-emerald-600"
                          : "bg-blue-600"
                      }`}
                    ></span>
                    <span className="truncate">{route.name.split("–")[0].trim()}</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border shrink-0 ${
                      isIncrease
                        ? "bg-rose-100 text-rose-800 border-rose-200"
                        : isReduce
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isIncrease
                      ? `+${route.delta} Buses`
                      : isReduce
                      ? `${route.delta} Bus`
                      : "Balanced"}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-800 truncate">
                  {route.name.split("–")[1]?.trim() || route.name}
                </div>
                <div className="text-[11px] text-slate-500 font-sans truncate">
                  {route.corridor}
                </div>
              </div>

              {/* Visual Comparison: Current vs Recommended Allocation */}
              <div className="space-y-2 pt-2 border-t border-slate-200/80">
                {/* Current */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-600 mb-1">
                    <span>Current:</span>
                    <span className="font-bold text-slate-800">
                      {route.currentBuses} buses
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      className="bg-slate-400 h-full rounded-full transition-all"
                      style={{ width: `${(route.currentBuses / 8) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Recommended */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-slate-700 font-semibold">Recommended:</span>
                    <div className="flex items-center gap-1">
                      <span
                        className={`font-bold ${
                          isIncrease
                            ? "text-rose-600"
                            : isReduce
                            ? "text-emerald-600"
                            : "text-blue-600"
                        }`}
                      >
                        {route.recommendedBuses} buses
                      </span>
                      {route.delta !== 0 && (
                        <span
                          className={`text-[10px] font-bold ${
                            isIncrease ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          ({isIncrease ? `+${route.delta}` : route.delta})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isIncrease
                          ? "bg-rose-500"
                          : isReduce
                          ? "bg-emerald-500"
                          : "bg-blue-600"
                      }`}
                      style={{ width: `${(route.recommendedBuses / 8) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Fleet Visual Icons */}
                <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: route.recommendedBuses }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i >= route.currentBuses
                            ? "text-rose-600 font-bold"
                            : "text-slate-700"
                        }`}
                      >
                        🚌
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Cap: {route.recommendedBuses * 75} Pax
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
