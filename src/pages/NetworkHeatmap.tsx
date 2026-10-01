import React, { useState } from "react";
import { DEMO_ROUTES } from "../data/transitDemoData";
import { ROUTE_STOP_BOTTLENECKS, RouteStopBottleneck } from "../data/transitDatasets";
import {
  Grid,
  Clock,
  Flame,
  AlertTriangle,
  Bus,
  Users,
  MapPin,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Filter
} from "lucide-react";

const HOURS_TIMELINE = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

// Generate deterministic hour-by-hour passenger heatmap values for each route
const getHeatmapDemand = (routeId: string, hour: string): { pax: number; level: "HIGH" | "MED" | "LOW" } => {
  const hourNum = parseInt(hour.split(":")[0], 10);
  const isMorningPeak = hourNum >= 7 && hourNum <= 9;
  const isEveningPeak = hourNum >= 17 && hourNum <= 19;
  const isMidday = hourNum >= 11 && hourNum <= 14;

  let base = 120;
  if (routeId === "route-1" || routeId === "route-4") base = 280;
  if (routeId === "route-7" || routeId === "route-8") base = 210;

  let multiplier = 0.5;
  if (isMorningPeak) multiplier = 2.4;
  else if (isEveningPeak) multiplier = 2.2;
  else if (isMidday) multiplier = 1.1;

  const pax = Math.round(base * multiplier);
  const level = pax > 350 ? "HIGH" : pax < 140 ? "LOW" : "MED";
  return { pax, level };
};

export const NetworkHeatmap: React.FC = () => {
  const [selectedCell, setSelectedCell] = useState<{ routeId: string; hour: string } | null>({
    routeId: "route-1",
    hour: "08:00"
  });

  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>("ALL");

  const filteredBottlenecks = selectedRouteFilter === "ALL"
    ? ROUTE_STOP_BOTTLENECKS
    : ROUTE_STOP_BOTTLENECKS.filter((b) => b.routeId === selectedRouteFilter);

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wide">
              Time-Series Spatial Matrix
            </span>
            <span className="text-xs text-slate-500">· 24-Hour Network Telemetry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Hourly Passenger Demand Heatmap &amp; Stop Congestion
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Inspect hour-by-hour passenger density across all 8 transit lines. Click any cell to view local platform dwell and stop bottlenecks.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-500"></span>
            <span className="font-semibold text-slate-700">High (&gt;350 pax/hr)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-400"></span>
            <span className="font-semibold text-slate-700">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-400"></span>
            <span className="font-semibold text-slate-700">Low (&lt;140)</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Card */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5 overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-slate-900">
              Corridor Density Matrix (Hour vs Route)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Click any cell to inspect corridor stop bottlenecks
          </span>
        </div>

        <div className="overflow-x-auto pb-2">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-slate-500 font-mono text-[11px] font-semibold w-40">
                  Route
                </th>
                {HOURS_TIMELINE.map((hour) => (
                  <th
                    key={hour}
                    className={`p-1.5 font-mono text-[10px] font-bold ${
                      hour === "08:00" || hour === "18:00"
                        ? "text-rose-600 bg-rose-50 rounded-t"
                        : "text-slate-500"
                    }`}
                  >
                    {hour}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEMO_ROUTES.map((route) => (
                <tr key={route.id} className="hover:bg-slate-50/50">
                  <td className="p-2 text-left font-bold text-slate-800 truncate pr-3">
                    <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono inline-flex items-center justify-center mr-1.5 text-[10px] border border-blue-200">
                      {route.name.split("–")[0].trim()}
                    </span>
                    <span className="text-xs">{route.name.split("–")[1]?.trim() || route.name}</span>
                  </td>
                  {HOURS_TIMELINE.map((hour) => {
                    const data = getHeatmapDemand(route.id, hour);
                    const isSelected = selectedCell?.routeId === route.id && selectedCell?.hour === hour;

                    let bgClass = "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
                    if (data.level === "HIGH") {
                      bgClass = "bg-rose-500 text-white font-bold hover:bg-rose-600 shadow-xs";
                    } else if (data.level === "MED") {
                      bgClass = "bg-amber-300 text-amber-900 font-semibold hover:bg-amber-400";
                    }

                    return (
                      <td key={hour} className="p-1">
                        <button
                          onClick={() => setSelectedCell({ routeId: route.id, hour })}
                          className={`w-full py-1.5 px-0.5 rounded text-[10px] font-mono transition-all ${bgClass} ${
                            isSelected ? "ring-2 ring-blue-700 scale-105 z-10 relative" : ""
                          }`}
                          title={`${route.name} at ${hour}: ${data.pax} passengers`}
                        >
                          {data.pax}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Cell Detail Box */}
        {selectedCell && (
          <div className="mt-4 p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                {DEMO_ROUTES.find((r) => r.id === selectedCell.routeId)?.name.split("–")[0].trim()}
              </div>
              <div>
                <span className="font-bold text-slate-900">
                  {DEMO_ROUTES.find((r) => r.id === selectedCell.routeId)?.name} at {selectedCell.hour}
                </span>
                <p className="text-[11px] text-slate-600">
                  Predicted Demand:{" "}
                  <strong className="text-blue-800 font-mono">
                    {getHeatmapDemand(selectedCell.routeId, selectedCell.hour).pax} passengers
                  </strong>{" "}
                  · Frequency Recommendation:{" "}
                  <strong className="text-emerald-700">
                    {getHeatmapDemand(selectedCell.routeId, selectedCell.hour).level === "HIGH" ? "Every 5 min" : "Every 12 min"}
                  </strong>
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold font-mono bg-white border border-blue-300 text-blue-700 shadow-2xs">
              Status: {getHeatmapDemand(selectedCell.routeId, selectedCell.hour).level} DEMAND
            </span>
          </div>
        )}
      </div>

      {/* Stop Bottlenecks & Platform Queues Section */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Stop-by-Stop Platform Congestion Radar
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies specific bus stops where passenger queues exceed boarding capacity.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Filter Route:</span>
            <select
              value={selectedRouteFilter}
              onChange={(e) => setSelectedRouteFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 font-sans text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">All Monitored Stops (6)</option>
              {DEMO_ROUTES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bottleneck Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredBottlenecks.map((item) => (
            <div
              key={item.stopId}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                item.congestionStatus === "CRITICAL"
                  ? "bg-rose-50/60 border-rose-200 shadow-2xs"
                  : item.congestionStatus === "MODERATE"
                  ? "bg-amber-50/50 border-amber-200"
                  : "bg-slate-50/70 border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white border text-slate-700">
                    {item.scheduledTime}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.congestionStatus === "CRITICAL"
                        ? "bg-rose-600 text-white"
                        : item.congestionStatus === "MODERATE"
                        ? "bg-amber-500 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {item.congestionStatus} QUEUE
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{item.stopName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{item.routeName}</p>

                {/* Queue telemetry */}
                <div className="grid grid-cols-3 gap-2 my-3 p-2.5 bg-white rounded-lg border border-slate-200 text-center font-mono">
                  <div>
                    <div className="text-[10px] text-slate-500">Waiting</div>
                    <div className="text-sm font-bold text-slate-900">{item.waitingPax} pax</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Boarding</div>
                    <div className="text-sm font-bold text-blue-600">{item.boardingRate}/m</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Bus Load</div>
                    <div className={`text-sm font-bold ${item.busOccupancyPct > 95 ? "text-rose-600" : "text-emerald-600"}`}>
                      {item.busOccupancyPct}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Required */}
              <div className="text-[11px] text-slate-700 bg-white/80 p-2 rounded-lg border border-slate-200 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{item.actionRequired}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
