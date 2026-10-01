import React, { useState } from "react";
import { RouteDemandItem, DemandLevel } from "../data/transitDemoData";
import {
  Route as RouteIcon,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Bus,
  Users,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface RouteWiseDemandTableProps {
  routes: RouteDemandItem[];
  selectedRouteId: string | null;
  onSelectRoute: (route: RouteDemandItem) => void;
  demandFilter: "ALL" | DemandLevel;
  onDemandFilterChange: (filter: "ALL" | DemandLevel) => void;
}

export const RouteWiseDemandTable: React.FC<RouteWiseDemandTableProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  demandFilter,
  onDemandFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoutes = routes.filter((r) => {
    const matchesFilter = demandFilter === "ALL" || r.demandLevel === demandFilter;
    const matchesQuery =
      searchQuery === "" ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.corridor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Header and Filter Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <RouteIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-sans">
              Route-Wise Passenger Demand &amp; Fleet Allocation
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any route row to view detailed hourly forecasts and dispatch options
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Demand:</span>
          </span>
          <button
            onClick={() => onDemandFilterChange("ALL")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              demandFilter === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            All ({routes.length})
          </button>
          <button
            onClick={() => onDemandFilterChange("HIGH")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              demandFilter === "HIGH"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
            }`}
          >
            High ({routes.filter((r) => r.demandLevel === "HIGH").length})
          </button>
          <button
            onClick={() => onDemandFilterChange("MEDIUM")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              demandFilter === "MEDIUM"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
            }`}
          >
            Medium ({routes.filter((r) => r.demandLevel === "MEDIUM").length})
          </button>
          <button
            onClick={() => onDemandFilterChange("LOW")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              demandFilter === "LOW"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            Low ({routes.filter((r) => r.demandLevel === "LOW").length})
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">
              <th className="py-3 px-4">Route</th>
              <th className="py-3 px-4">Current Passengers</th>
              <th className="py-3 px-4">Predicted Demand</th>
              <th className="py-3 px-4">Demand Level</th>
              <th className="py-3 px-4">Current → Recommended Buses</th>
              <th className="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredRoutes.map((route) => {
              const isSelected = selectedRouteId === route.id;
              const isHigh = route.demandLevel === "HIGH";
              const isLow = route.demandLevel === "LOW";
              const isMedium = route.demandLevel === "MEDIUM";

              return (
                <tr
                  key={route.id}
                  onClick={() => onSelectRoute(route)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-50/80 font-medium"
                      : "hover:bg-slate-50/80"
                  }`}
                >
                  {/* Route Column */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          isHigh
                            ? "bg-rose-100 text-rose-700"
                            : isMedium
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {route.name.split("–")[0].replace("Route ", "").trim()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 font-sans">
                          {route.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          {route.corridor}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Current Passengers */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{route.currentPassengers.toLocaleString()}</span>
                    </div>
                  </td>

                  {/* Predicted Demand */}
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <div className="flex items-center gap-1.5">
                      {route.predictedDemand > route.currentPassengers ? (
                        <ArrowUpRight className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : route.predictedDemand < route.currentPassengers ? (
                        <ArrowDownRight className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Minus className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span
                        className={
                          isHigh
                            ? "text-rose-700"
                            : isMedium
                            ? "text-blue-700"
                            : "text-emerald-700"
                        }
                      >
                        {route.predictedDemand.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({route.predictedDemand > route.currentPassengers ? "+" : ""}
                        {route.predictedDemand - route.currentPassengers})
                      </span>
                    </div>
                  </td>

                  {/* Demand Level */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono border ${
                        isHigh
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : isMedium
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isHigh
                            ? "bg-rose-600"
                            : isMedium
                            ? "bg-blue-600"
                            : "bg-emerald-600"
                        }`}
                      ></span>
                      {route.demandLevel} DEMAND
                    </span>
                  </td>

                  {/* Recommended Buses */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">
                        {route.currentBuses} buses
                      </span>
                      <span className="text-slate-400 font-normal">→</span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          route.delta > 0
                            ? "bg-rose-100 text-rose-800"
                            : route.delta < 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {route.recommendedBuses} buses
                      </span>
                      {route.delta !== 0 && (
                        <span
                          className={`text-[11px] font-bold ${
                            route.delta > 0 ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          ({route.delta > 0 ? `+${route.delta}` : route.delta})
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Action / View */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRoute(route);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Showing {filteredRoutes.length} of {routes.length} transit routes</span>
        <span className="font-mono text-[11px]">System Status: Optimization Active</span>
      </div>
    </div>
  );
};
