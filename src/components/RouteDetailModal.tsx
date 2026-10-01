import React from "react";
import { RouteDemandItem } from "../data/transitDemoData";
import {
  X,
  Bus,
  Users,
  Clock,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface RouteDetailModalProps {
  route: RouteDemandItem | null;
  onClose: () => void;
  onApplyAllocation: (routeId: string) => void;
  isApplied?: boolean;
}

export const RouteDetailModal: React.FC<RouteDetailModalProps> = ({
  route,
  onClose,
  onApplyAllocation,
  isApplied = false,
}) => {
  if (!route) return null;

  const isHigh = route.demandLevel === "HIGH";
  const isMedium = route.demandLevel === "MEDIUM";
  const isLow = route.demandLevel === "LOW";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm text-white shrink-0 ${
                isHigh
                  ? "bg-rose-600"
                  : isMedium
                  ? "bg-blue-600"
                  : "bg-emerald-600"
              }`}
            >
              {route.name.split("–")[0].replace("Route ", "").trim()}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 font-sans truncate">
                  {route.name}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                    isHigh
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : isMedium
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  {route.demandLevel} DEMAND
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                {route.description}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Key Stat Cards (Current vs Predicted Passengers, Current vs Recommended Buses) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Current Passengers */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">
                Current Pax
              </span>
              <span className="text-lg font-bold font-mono text-slate-800">
                {route.currentPassengers.toLocaleString()}
              </span>
            </div>

            {/* Predicted Demand */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
              <span className="text-[11px] text-blue-700 font-medium block">
                Predicted Demand
              </span>
              <span className="text-lg font-bold font-mono text-blue-700">
                {route.predictedDemand.toLocaleString()}
              </span>
            </div>

            {/* Current Buses */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">
                Current Fleet
              </span>
              <span className="text-lg font-bold font-mono text-slate-800">
                {route.currentBuses} buses
              </span>
            </div>

            {/* Recommended Buses */}
            <div
              className={`p-3 rounded-xl border ${
                isHigh
                  ? "bg-rose-50/70 border-rose-200 text-rose-800"
                  : isLow
                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                  : "bg-blue-50/70 border-blue-200 text-blue-800"
              }`}
            >
              <span className="text-[11px] font-medium block">
                Recommended Fleet
              </span>
              <span className="text-lg font-bold font-mono">
                {route.recommendedBuses} buses
              </span>
            </div>
          </div>

          {/* Peak Demand Time & Recommendation Summary */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-sans">
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-900">Peak Demand Time:</span>
              <span className="font-mono font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {route.peakDemandTime}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 pt-1">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-900">Recommendation:</span>
              <span className="text-slate-700">{route.recommendationText}</span>
            </div>
          </div>

          {/* Simple Demand Chart by Hour for this route */}
          <div className="rounded-xl border border-slate-200 p-3 bg-white">
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>Hourly Passenger Profile (Current vs Predicted)</span>
              <span className="text-[11px] text-slate-500 font-normal">Every 2 Hours</span>
            </div>
            <div className="w-full h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={route.hourlyBreakdown} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-md text-xs font-mono">
                            <div className="font-bold text-slate-800 mb-1">{label}</div>
                            <div className="text-emerald-600">Current: {payload[0]?.value} Pax</div>
                            <div className="text-blue-600 font-bold">Predicted: {payload[1]?.value} Pax</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    height={24}
                    formatter={(val) => (
                      <span className="text-[11px] text-slate-600">
                        {val === "predicted" ? "Predicted Demand" : "Current Count"}
                      </span>
                    )}
                  />
                  <Bar dataKey="current" fill="#94a3b8" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="predicted" fill="#2563eb" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => onApplyAllocation(route.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
              isApplied
                ? "bg-emerald-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isApplied ? "Fleet Allocation Applied" : `Apply Allocation (${route.recommendedBuses} Buses)`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
