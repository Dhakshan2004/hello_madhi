import React from "react";
import { PASSENGER_DATA_FACTORS } from "../data/transitDemoData";
import {
  Users,
  DoorOpen,
  Route,
  Clock,
  TrendingUp,
  TrendingDown,
  Database
} from "lucide-react";

export const PassengerDataFactors: React.FC = () => {
  const iconMap: Record<string, React.ReactNode> = {
    Users: <Users className="w-4 h-4 text-blue-600" />,
    DoorOpen: <DoorOpen className="w-4 h-4 text-blue-600" />,
    Route: <Route className="w-4 h-4 text-blue-600" />,
    Clock: <Clock className="w-4 h-4 text-blue-600" />,
    TrendingUp: <TrendingUp className="w-4 h-4 text-rose-600" />,
    TrendingDown: <TrendingDown className="w-4 h-4 text-emerald-600" />,
  };

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col">
      {/* Header */}
      <div className="pb-3 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-sans">
            Passenger Demand Data Inputs
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Key transit metrics and behavioral sensor feeds ingested by the AI prediction engine
        </p>
      </div>

      {/* 6 Key Data Factors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PASSENGER_DATA_FACTORS.map((factor) => (
          <div
            key={factor.id}
            className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 hover:border-blue-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                  {iconMap[factor.icon] || <Users className="w-4 h-4 text-blue-600" />}
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-blue-700 border border-blue-200">
                  {factor.metric}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 font-sans mb-1">
                {factor.title}
              </h4>
              <p className="text-[11px] text-slate-600 leading-snug font-sans">
                {factor.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
