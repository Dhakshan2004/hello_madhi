import React, { useState } from "react";
import { DEMO_ROUTES } from "../data/transitDemoData";
import {
  Clock,
  TrendingDown,
  DollarSign,
  Fuel,
  Leaf,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Bus,
  RefreshCw
} from "lucide-react";

interface ScheduleBlock {
  period: string;
  timeRange: string;
  demandFactor: string;
  staticHeadway: number; // minutes
  dynamicHeadway: number; // minutes
  activeBuses: number;
  savings: string;
}

const SCHEDULE_BLOCKS: ScheduleBlock[] = [
  {
    period: "Early Morning (Off-Peak)",
    timeRange: "05:00 – 07:00",
    demandFactor: "LOW (45% Base)",
    staticHeadway: 15,
    dynamicHeadway: 25,
    activeBuses: 2,
    savings: "$480 fuel saved (no empty buses)",
  },
  {
    period: "Morning Commuter Rush (Peak)",
    timeRange: "07:00 – 09:30",
    demandFactor: "HIGH (240% Surge)",
    staticHeadway: 15,
    dynamicHeadway: 5,
    activeBuses: 8,
    savings: "Zero platform crowding; -62% wait times",
  },
  {
    period: "Midday Transit Baseline",
    timeRange: "09:30 – 16:30",
    demandFactor: "MEDIUM (100% Base)",
    staticHeadway: 15,
    dynamicHeadway: 12,
    activeBuses: 4,
    savings: "Balanced frequency maintains 94% on-time",
  },
  {
    period: "Evening Commuter Rush (Peak)",
    timeRange: "16:30 – 19:30",
    demandFactor: "HIGH (210% Surge)",
    staticHeadway: 15,
    dynamicHeadway: 6,
    activeBuses: 7,
    savings: "Seamless transfer clearance at Metro terminal",
  },
  {
    period: "Late Night Feeder Service",
    timeRange: "19:30 – 23:30",
    demandFactor: "LOW (35% Base)",
    staticHeadway: 15,
    dynamicHeadway: 30,
    activeBuses: 2,
    savings: "$620 fuel saved; depot charging scheduled",
  },
];

export const DynamicHeadways: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>("route-1");
  const selectedRoute = DEMO_ROUTES.find((r) => r.id === selectedRouteId) || DEMO_ROUTES[0];

  // Calculated ROI summary
  const weeklyFuelSavedUSD = "$3,850";
  const monthlyCo2AvoidedKg = "14,200 kg";
  const passengerHoursRecovered = "1,840 hrs/mo";

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
              Autonomous Timetable Optimization
            </span>
            <span className="text-xs text-slate-500">· Peak vs Off-Peak Headway Synthesis</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dynamic Headway Schedule &amp; Cost ROI Model
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Static transit runs flat frequencies all day, causing empty buses in off-peak and overcrowding in rush hour. SmartTransit AI dynamically synchronizes bus departures with passenger flow.
          </p>
        </div>

        {/* Route Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Select Route:</span>
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold focus:ring-1 focus:ring-blue-500 text-xs"
          >
            {DEMO_ROUTES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ROI 3-Card Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Fuel &amp; Driver Cost Savings</div>
            <div className="font-mono text-xl font-bold text-slate-900">{weeklyFuelSavedUSD} / week</div>
            <div className="text-[11px] text-emerald-600 font-medium">Eliminates empty off-peak miles</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Commuter Time Saved</div>
            <div className="font-mono text-xl font-bold text-blue-700">{passengerHoursRecovered}</div>
            <div className="text-[11px] text-blue-600 font-medium">-49% average wait reduction</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Emissions Offset</div>
            <div className="font-mono text-xl font-bold text-teal-700">{monthlyCo2AvoidedKg}</div>
            <div className="text-[11px] text-teal-600 font-medium">Reduced diesel deadheading</div>
          </div>
        </div>
      </div>

      {/* Headway Timetable Comparison Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-bold flex items-center justify-center text-xs border border-blue-200">
                {selectedRoute.name.split("–")[0].trim()}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {selectedRoute.name} – Dynamic Headway Schedule
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Corridor: {selectedRoute.corridor} · Current Active Units: {selectedRoute.currentBuses}
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Status: Synchronized with Demand
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Time Period</th>
                <th className="py-3 px-4 font-semibold">Demand Profile</th>
                <th className="py-3 px-4 font-semibold text-center">Static Timetable</th>
                <th className="py-3 px-4 font-semibold text-center bg-blue-50/50 text-blue-800">
                  SmartTransit AI Dynamic
                </th>
                <th className="py-3 px-4 font-semibold text-center">Active Buses</th>
                <th className="py-3 px-4 font-semibold">Operational Benefit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SCHEDULE_BLOCKS.map((block, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{block.period}</div>
                    <div className="font-mono text-[11px] text-slate-500">{block.timeRange}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        block.demandFactor.includes("HIGH")
                          ? "bg-rose-100 text-rose-700"
                          : block.demandFactor.includes("LOW")
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {block.demandFactor}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                    Every {block.staticHeadway} min (Rigid)
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold bg-blue-50/30 text-blue-700">
                    Every {block.dynamicHeadway} min
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                    {block.activeBuses} Units
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{block.savings}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
