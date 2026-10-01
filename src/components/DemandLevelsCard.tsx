import React from "react";
import { AlertCircle, CheckCircle2, TrendingDown, ArrowUpRight, Minus, ArrowDownRight } from "lucide-react";

export const DemandLevelsCard: React.FC = () => {
  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col">
      <div className="pb-3 mb-3 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 font-sans">
          Demand Levels &amp; Fleet Allocation Matrix
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Predictive decision logic applied by the transit allocation solver
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* HIGH DEMAND */}
        <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-rose-600 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                HIGH DEMAND
              </span>
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xs font-bold text-rose-950 mb-1 font-sans">
              More Passengers Expected
            </div>
            <p className="text-[11px] text-slate-700 leading-snug">
              Commuter load exceeds 80% route threshold. Risk of platform overcrowding and schedule delays.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-rose-200/80 flex items-center justify-between text-xs font-bold text-rose-800 font-mono">
            <span>Action:</span>
            <span>→ Increase bus allocation</span>
          </div>
        </div>

        {/* MEDIUM DEMAND */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-blue-600 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                MEDIUM DEMAND
              </span>
              <Minus className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xs font-bold text-blue-950 mb-1 font-sans">
              Normal Passenger Flow
            </div>
            <p className="text-[11px] text-slate-700 leading-snug">
              Commuter numbers match scheduled capacity. Headways remain stable and predictable.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-blue-200/80 flex items-center justify-between text-xs font-bold text-blue-800 font-mono">
            <span>Action:</span>
            <span>→ Maintain regular allocation</span>
          </div>
        </div>

        {/* LOW DEMAND */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-emerald-600 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                LOW DEMAND
              </span>
              <ArrowDownRight className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xs font-bold text-emerald-950 mb-1 font-sans">
              Fewer Passengers Expected
            </div>
            <p className="text-[11px] text-slate-700 leading-snug">
              Off-peak or low-density line. Buses are running under capacity with excess empty seats.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs font-bold text-emerald-800 font-mono">
            <span>Action:</span>
            <span>→ Optimize bus allocation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
