import React, { useState } from "react";
import { STOP_BOTTLENECK_DATA, StopQueueItem } from "../data/scenarioData";
import { MapPin, Users, Clock, AlertTriangle, CheckCircle2, ChevronRight, Bus } from "lucide-react";

interface StopBottleneckInspectorProps {
  selectedRouteId: string;
  routeName: string;
}

export const StopBottleneckInspector: React.FC<StopBottleneckInspectorProps> = ({
  selectedRouteId,
  routeName,
}) => {
  // Use stops for the selected route or fallback to route-a
  const stops = STOP_BOTTLENECK_DATA[selectedRouteId] || STOP_BOTTLENECK_DATA["route-a"];

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-sans">
              Stop-Level Platform Queue &amp; Dwell Bottlenecks
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active stop monitoring for <span className="font-semibold text-blue-700">{routeName}</span>
          </p>
        </div>

        <span className="text-[11px] font-mono text-slate-500">
          Live Sensor Telemetry: Optical Turnstiles
        </span>
      </div>

      {/* List of Stops */}
      <div className="space-y-2.5">
        {stops.map((stop, idx) => {
          const isCritical = stop.status === "CRITICAL";
          const isModerate = stop.status === "MODERATE";

          return (
            <div
              key={stop.id}
              className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isCritical
                  ? "bg-rose-50/50 border-rose-200"
                  : isModerate
                  ? "bg-amber-50/50 border-amber-200"
                  : "bg-slate-50/50 border-slate-200"
              }`}
            >
              {/* Stop Info */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isCritical
                      ? "bg-rose-600 text-white"
                      : isModerate
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {idx + 1}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs font-sans flex items-center gap-2">
                    <span>{stop.name}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        isCritical
                          ? "bg-rose-100 text-rose-800 border-rose-200"
                          : isModerate
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-emerald-100 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {stop.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans mt-0.5">
                    {stop.corridor} · Avg Station Dwell: <span className="font-semibold text-slate-700">{stop.avgDwellSec}s</span>
                  </div>
                </div>
              </div>

              {/* Waiting Passengers and Capacity Meter */}
              <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Waiting Pax</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {stop.waitingPassengers} Pax
                  </span>
                </div>

                <div className="w-24">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                    <span>Load</span>
                    <span className="font-bold">{stop.capacityPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isCritical
                          ? "bg-rose-600"
                          : isModerate
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${stop.capacityPct}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Next Bus ETA</span>
                  <span className="font-bold text-blue-700">
                    {stop.nextBusEtaMin} min
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
