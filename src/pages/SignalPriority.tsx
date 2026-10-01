import React, { useState, useEffect } from "react";
import {
  TrafficCone,
  Zap,
  Bus,
  Siren,
  Clock,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { SignalPriorityState } from "../types";
import {
  fetchSignalPriorityState,
  toggleTransitSignalPriority,
  toggleEmergencyPreemption
} from "../services/api";

interface SignalPriorityProps {
  tspActive: boolean;
  onToggleTsp: (active: boolean) => void;
}

export const SignalPriority: React.FC<SignalPriorityProps> = ({
  tspActive,
  onToggleTsp,
}) => {
  const [signalState, setSignalState] = useState<SignalPriorityState | null>(null);
  const [emergencyPreemption, setEmergencyPreemption] = useState(false);
  const [countdownSec, setCountdownSec] = useState(28);

  useEffect(() => {
    loadState();
  }, [tspActive]);

  const loadState = async () => {
    const data = await fetchSignalPriorityState();
    setSignalState(data);
  };

  const handleToggleTsp = async () => {
    const next = !tspActive;
    onToggleTsp(next);
    const updated = await toggleTransitSignalPriority(next);
    setSignalState(updated);
  };

  const handleToggleEmergency = async () => {
    const next = !emergencyPreemption;
    setEmergencyPreemption(next);
    const updated = await toggleEmergencyPreemption(next);
    setSignalState(updated);
  };

  // Ticking clearance countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownSec((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const approaches = signalState?.approaches || {
    north: { name: "Northbound Bus Rapid Transit (BRT)", vehicleCount: 28, queueLengthM: 110, currentSignal: "RED", greenDurationSec: 25, hasPriorityVehicle: true, priorityVehicleType: "PUBLIC_BUS" },
    south: { name: "Southbound Metro Feeder", vehicleCount: 16, queueLengthM: 45, currentSignal: "RED", greenDurationSec: 20, hasPriorityVehicle: false },
    east: { name: "Eastbound Commercial Arterial", vehicleCount: 22, queueLengthM: 75, currentSignal: "GREEN", greenDurationSec: 30, hasPriorityVehicle: false },
    west: { name: "Westbound Harbor Tunnel Link", vehicleCount: 14, queueLengthM: 35, currentSignal: "RED", greenDurationSec: 20, hasPriorityVehicle: false },
  };

  const activeBus = signalState?.activeBus || {
    id: "BUS-42",
    route: "Line 4: Airport to Metro Express",
    delayMin: tspActive ? 1.0 : 5.2,
    passengerCount: 68,
    distanceToJunctionM: 340,
    etaSec: 28,
    targetJunction: "Corridor 4 Junction",
  };

  return (
    <div className="space-y-4 select-none pb-12">
      {/* Header Bar */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            tspActive ? "bg-emerald-500 text-slate-950 font-bold" : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
          }`}>
            <TrafficCone className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Transit Signal Priority &amp; Emergency Clearance
            </h2>
            <p className="text-xs text-slate-400">
              Schedule-based green wave extension · Life-safety ambulance preemption · NEMA TS2 interface
            </p>
          </div>
        </div>

        {/* Priority Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleTsp}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm ${
              tspActive
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{tspActive ? "TSP Wave Active (-4.2m)" : "Activate Transit Priority"}</span>
          </button>

          <button
            onClick={handleToggleEmergency}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              emergencyPreemption
                ? "bg-rose-950/60 border-rose-500 text-rose-300"
                : "border-slate-800 text-rose-400 hover:bg-slate-800"
            }`}
          >
            <Siren className="w-3.5 h-3.5" />
            <span>{emergencyPreemption ? "Preemption Engaged" : "Ambulance Preemption"}</span>
          </button>
        </div>
      </div>

      {/* Dual Priority Mode Status Callout */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
        emergencyPreemption
          ? "bg-rose-950/30 border-rose-500/60"
          : tspActive
          ? "bg-emerald-950/30 border-emerald-500/60"
          : "bg-[#0f172a] border-slate-800/80"
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg border mt-0.5 ${
            emergencyPreemption
              ? "bg-rose-900/60 border-rose-700 text-white"
              : tspActive
              ? "bg-emerald-900/60 border-emerald-700 text-white"
              : "bg-slate-800/80 border-slate-700 text-cyan-400"
          }`}>
            {emergencyPreemption ? <Siren className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                {emergencyPreemption
                  ? "Emergency Ambulance Preemption Active"
                  : tspActive
                  ? "Transit Signal Priority: Bus #42 Green Extension"
                  : "TSP Standby: Bus #42 Trailing Schedule by > 4 mins"}
              </span>
              <span className={`text-[11px] font-mono font-medium ${
                emergencyPreemption
                  ? "text-rose-400"
                  : tspActive
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}>
                · {emergencyPreemption ? "Life Safety Mode" : tspActive ? "Priority Granted (+17s)" : "Delay Exceeded (+5.2m)"}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-1">
              Vehicle: {emergencyPreemption ? "Trauma Rescue Unit Echo-4" : "Bus #42 (68 Commuters on board)"} · Target: Corridor 4 Intersection
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 mt-2">
              <span>Distance: {activeBus.distanceToJunctionM}m</span>
              <span>ETA: {countdownSec}s</span>
              <span className={tspActive ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                Delay: {tspActive ? "+1.0 min (Recovered)" : "+5.2 min (Action needed)"}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule Recovery Metrics Box */}
        <div className="p-3.5 rounded-lg bg-[#0b1220] border border-slate-800 font-mono text-center min-w-[200px]">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Schedule Recovery Delta</span>
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-emerald-400 tabular-nums">
            <TrendingDown className="w-5 h-5 text-emerald-400" />
            <span>{tspActive ? "4.2 min Saved" : "0 min (Stalled)"}</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {tspActive ? "+17s Green Extension Active" : "Bus Waiting at Red Phase"}
          </span>
        </div>
      </div>

      {/* 4-Way Intersection Simulator Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Top-Down Visual 4-Way Crossing */}
        <div className="lg:col-span-7 rounded-xl bg-[#0f172a] border border-slate-800/80 p-5 flex flex-col items-center justify-center relative min-h-[440px]">
          {/* North Approach: Northbound BRT */}
          <div className="flex flex-col items-center mb-2">
            <div className={`p-2.5 rounded-lg border text-center font-mono text-xs mb-1.5 w-60 transition-colors ${
              tspActive || emergencyPreemption
                ? "bg-emerald-950/30 border-emerald-500/60"
                : "bg-[#0b1220] border-slate-800"
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold text-cyan-400">
                <span className="flex items-center gap-1.5">
                  <Bus className="w-3.5 h-3.5" />
                  NORTH (Bus #42 BRT)
                </span>
                <span className={tspActive || emergencyPreemption ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                  {tspActive || emergencyPreemption ? "GREEN (+17s)" : "RED"}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>{approaches.north.vehicleCount} Vehicles (BRT)</span>
                <span>Queue: {approaches.north.queueLengthM}m</span>
              </div>
            </div>
            <ArrowDown className={`w-5 h-5 ${tspActive ? "text-emerald-400" : "text-cyan-400"}`} />
          </div>

          {/* Middle Row: West, Central Traffic Light Core, East */}
          <div className="w-full flex items-center justify-between gap-3 my-2">
            {/* West Road */}
            <div className="flex items-center gap-1.5">
              <div className="p-2.5 rounded-lg bg-[#0b1220] border border-slate-800 font-mono text-xs w-48">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span>WEST (Harbor Link)</span>
                  <span className="text-rose-400 font-bold">RED</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>{approaches.west.vehicleCount} Vehicles</span>
                  <span>Queue: {approaches.west.queueLengthM}m</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Central Controller Box */}
            <div className="w-32 h-32 rounded-xl bg-[#0b1220] border border-slate-700 flex flex-col items-center justify-center p-2 text-center font-mono">
              <div className="flex items-center gap-1 mb-1.5">
                <div className={`w-3.5 h-3.5 rounded-full ${tspActive || emergencyPreemption ? "bg-slate-700" : "bg-rose-500 shadow-sm"}`}></div>
                <div className="w-3.5 h-3.5 rounded-full bg-slate-700"></div>
                <div className={`w-3.5 h-3.5 rounded-full ${tspActive || emergencyPreemption ? "bg-emerald-400 shadow-sm" : "bg-slate-700"}`}></div>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Phase Timer</span>
              <span className="text-xl font-bold text-white tabular-nums">{countdownSec}s</span>
              <span className="text-[10px] text-cyan-400 mt-1">
                {emergencyPreemption ? "PREEMPTION" : tspActive ? "TSP WAVE" : "CYCLIC"}
              </span>
            </div>

            {/* East Road */}
            <div className="flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <div className="p-2.5 rounded-lg bg-[#0b1220] border border-slate-800 font-mono text-xs w-48">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span>EAST (Arterial)</span>
                  <span className={tspActive || emergencyPreemption ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                    {tspActive || emergencyPreemption ? "RED" : "GREEN"}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>{approaches.east.vehicleCount} Vehicles</span>
                  <span>Queue: {approaches.east.queueLengthM}m</span>
                </div>
              </div>
            </div>
          </div>

          {/* South Approach: Southbound Metro Feeder */}
          <div className="flex flex-col items-center mt-2">
            <ArrowUp className="w-5 h-5 text-slate-400" />
            <div className="p-2.5 rounded-lg bg-[#0b1220] border border-slate-800 text-center font-mono text-xs mt-1.5 w-60">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>SOUTH (Metro Feeder)</span>
                <span className="text-rose-400 font-bold">RED</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>{approaches.south.vehicleCount} Vehicles</span>
                <span>Queue: {approaches.south.queueLengthM}m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actuation Protocols & Telemetry Table */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-xl bg-[#0f172a] border border-slate-800/80 p-4">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-xs">
              <span className="font-semibold text-white">Approach Signal Status</span>
              <span className="font-mono text-slate-500">NEMA TS2 Type 1</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {Object.entries(approaches).map(([key, app]) => {
                const isNorthPriority = key === "north";
                const isGreen = (tspActive || emergencyPreemption) ? isNorthPriority : app.currentSignal === "GREEN";

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#0b1220] border border-slate-800/80"
                  >
                    <div>
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <span className="uppercase text-cyan-400 font-semibold">{key}:</span>
                        <span>{app.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Queue: {app.queueLengthM}m · {app.vehicleCount} Vehicles
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      isGreen ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60" : "bg-rose-950/60 text-rose-400 border border-rose-800/60"
                    }`}>
                      {isGreen ? "GREEN" : "RED"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TSP Clearance Protocol */}
          <div className="rounded-xl bg-[#0f172a] border border-slate-800/80 p-4 flex-1">
            <div className="text-xs font-semibold text-white mb-2">
              Automated Signal Actuation Sequence
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-[#0b1220] border border-slate-800/60">
                <span className="font-mono text-cyan-400 font-bold shrink-0">01</span>
                <div>
                  <span className="font-medium text-white">Detection &amp; Trailing Calculation: </span>
                  Bus #42 schedule delay of 5.2m detected 340m from intersection via C-V2X OBU radio.
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg bg-[#0b1220] border border-slate-800/60">
                <span className="font-mono text-cyan-400 font-bold shrink-0">02</span>
                <div>
                  <span className="font-medium text-white">Cross-Street Truncation: </span>
                  Eastbound arterial green phase truncated by 8 seconds to release cycle capacity.
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg bg-[#0b1220] border border-slate-800/60">
                <span className="font-mono text-cyan-400 font-bold shrink-0">03</span>
                <div>
                  <span className="font-medium text-white">Green Wave Extension: </span>
                  Northbound BRT green extended by +17s, allowing non-stop passage for 68 passengers.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
