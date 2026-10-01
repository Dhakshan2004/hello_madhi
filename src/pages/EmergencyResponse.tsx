import React, { useState, useEffect } from "react";
import {
  Siren,
  ShieldCheck,
  Zap,
  Clock,
  Radio,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Navigation,
  Car,
  Bell,
  RefreshCw,
  Sliders
} from "lucide-react";

interface EmergencyResponseProps {
  emergencyActive: boolean;
  onToggleEmergency: (active: boolean) => void;
}

interface ClearanceCheckpoint {
  id: string;
  name: string;
  distanceM: number;
  etaSec: number;
  signalState: "CLEARED_GREEN" | "CLEARING_NOW" | "STAGED" | "NORMAL";
  divertedVehicles: number;
}

export const EmergencyResponse: React.FC<EmergencyResponseProps> = ({
  emergencyActive,
  onToggleEmergency,
}) => {
  const [countdown, setCountdown] = useState(252); // ~4m 12s
  const [activeAmbulance, setActiveAmbulance] = useState<"AMB-102" | "ENG-12">("AMB-102");

  const checkpoints: ClearanceCheckpoint[] = [
    {
      id: "cp-1",
      name: "Junction 1: Northwest Avenue Merge",
      distanceM: 400,
      etaSec: 24,
      signalState: "CLEARED_GREEN",
      divertedVehicles: 18,
    },
    {
      id: "cp-2",
      name: "Junction 2: Main Street / Central Hub",
      distanceM: 1200,
      etaSec: 72,
      signalState: emergencyActive ? "CLEARING_NOW" : "NORMAL",
      divertedVehicles: 34,
    },
    {
      id: "cp-3",
      name: "Junction 3: Broadway Commercial Arterial",
      distanceM: 2400,
      etaSec: 145,
      signalState: emergencyActive ? "STAGED" : "NORMAL",
      divertedVehicles: 26,
    },
    {
      id: "cp-4",
      name: "Junction 4: General Hospital Trauma Portal",
      distanceM: 3800,
      etaSec: 252,
      signalState: emergencyActive ? "STAGED" : "NORMAL",
      divertedVehicles: 14,
    },
  ];

  useEffect(() => {
    if (!emergencyActive) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 252));
    }, 1000);
    return () => clearInterval(interval);
  }, [emergencyActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  return (
    <div className="space-y-4 select-none pb-12">
      {/* Header Bar */}
      <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
            emergencyActive ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-600"
          }`}>
            <Siren className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Emergency Vehicle Priority &amp; Path Clearance
            </h2>
            <p className="text-xs text-slate-500">
              C-V2X preemption · Predictive green wave · Cross-traffic diversion
            </p>
          </div>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleEmergency(!emergencyActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-xs ${
              emergencyActive
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Siren className="w-3.5 h-3.5" />
            <span>{emergencyActive ? "Preemption Engaged (Active)" : "Simulate Emergency Response"}</span>
          </button>
        </div>
      </div>

      {/* Emergency Status Banner */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors shadow-xs ${
        emergencyActive
          ? "bg-rose-50/70 border-rose-300 ring-2 ring-rose-100"
          : "bg-white border-slate-200/90"
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg border mt-0.5 ${
            emergencyActive
              ? "bg-rose-600 border-rose-700 text-white"
              : "bg-slate-100 border-slate-200 text-slate-500"
          }`}>
            <Siren className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                {emergencyActive ? "AMBULANCE EN ROUTE · PRIORITY 1 CORRIDOR PREEMPTION" : "Emergency Standby · Monitored Transit Network"}
              </span>
              <span className={`text-xs font-mono font-semibold ${emergencyActive ? "text-rose-700" : "text-slate-500"}`}>
                · {emergencyActive ? "Active Preemption Phase" : "Standby Mode"}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-mono mt-1">
              Vehicle: Rescue Unit Echo-4 (AMB-102) · Route: Northwest Sector → General Hospital Trauma Center
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-600 mt-2">
              <span>Distance: 3.8 km</span>
              <span>Speed: 64 km/h</span>
              <span className="text-blue-700 font-semibold">ETA: {formatTime(countdown)}</span>
              <span className="text-emerald-700 font-semibold">Saved Time: ~5.6 mins</span>
            </div>
          </div>
        </div>

        {/* Rapid Stat */}
        <div className="p-3 rounded-lg bg-white border border-slate-200 font-mono text-center min-w-[190px] shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase block mb-1 font-semibold">Response Time Advantage</span>
          <div className="text-2xl font-bold text-emerald-600 tabular-nums">
            -5.6 min
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            4 Intersections Preempted
          </span>
        </div>
      </div>

      {/* Main Grid: Corridor Timeline (7 cols) + Actuation Telemetry (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Corridor Timeline */}
        <div className="lg:col-span-7 rounded-xl bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <span className="text-sm font-bold text-slate-900">
              Corridor Clearance Progression Timeline
            </span>
            <span className="text-xs font-mono text-slate-500">NEMA TS2 Preemption Protocol</span>
          </div>

          <div className="space-y-3">
            {checkpoints.map((cp, idx) => {
              const isCleared = cp.signalState === "CLEARED_GREEN";
              const isClearing = cp.signalState === "CLEARING_NOW";

              return (
                <div
                  key={cp.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    isClearing
                      ? "bg-rose-50 border-rose-300"
                      : isCleared
                      ? "bg-emerald-50 border-emerald-300"
                      : "bg-slate-50 border-slate-200/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        isCleared
                          ? "bg-emerald-600 text-white"
                          : isClearing
                          ? "bg-rose-600 text-white animate-pulse"
                          : "bg-slate-200 text-slate-700"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{cp.name}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      isCleared
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : isClearing
                        ? "bg-rose-100 text-rose-800 border border-rose-300 animate-pulse"
                        : "bg-slate-200 text-slate-700 border border-slate-300"
                    }`}>
                      {isCleared ? "CLEARED GREEN" : isClearing ? "CLEARING NOW (+28s)" : "STAGED"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono text-slate-600 pl-7">
                    <span>Distance: {cp.distanceM}m</span>
                    <span>ETA: {cp.etaSec}s</span>
                    <span className="text-slate-800 font-medium">Diverted: {cp.divertedVehicles} cars</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-blue-950 font-bold">Safety Invariant Guard:</strong> Minimum 5-second amber clearance and 2-second all-red interlock are strictly enforced prior to green wave handoff.
            </span>
          </div>
        </div>

        {/* Right Column: Actuation Protocols & Fleet Selector */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Active Emergency Units */}
          <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4">
            <div className="text-sm font-bold text-slate-900 pb-2 mb-3 border-b border-slate-200">
              Active Priority Vehicles in Grid
            </div>

            <div className="space-y-2">
              <div
                onClick={() => setActiveAmbulance("AMB-102")}
                className={`p-3 rounded-lg border cursor-pointer transition-all text-xs font-mono ${
                  activeAmbulance === "AMB-102"
                    ? "bg-rose-50 border-rose-300 ring-2 ring-rose-100"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-rose-700">AMB-102 (Trauma Ambulance)</span>
                  <span className="text-emerald-700">EN ROUTE</span>
                </div>
                <div className="text-slate-700">Hospital Run · Priority 1 · Speed: 64 km/h</div>
              </div>

              <div
                onClick={() => setActiveAmbulance("ENG-12")}
                className={`p-3 rounded-lg border cursor-pointer transition-all text-xs font-mono ${
                  activeAmbulance === "ENG-12"
                    ? "bg-amber-50 border-amber-300 ring-2 ring-amber-100"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-amber-700">ENG-12 (Heavy Rescue Fire)</span>
                  <span className="text-slate-500">STANDBY</span>
                </div>
                <div className="text-slate-700">Station 4 · Staged at Northwest Hub</div>
              </div>
            </div>
          </div>

          {/* V2X Communication Packet */}
          <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4 flex-1">
            <div className="text-sm font-bold text-slate-900 mb-2">
              C-V2X BSM &amp; Preemption Telemetry
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Radio Standard:</span>
                <span className="text-slate-900 font-semibold">IEEE 802.11p / C-V2X 5.9 GHz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Packet Type:</span>
                <span className="text-blue-700 font-bold">SSM / SRM (Preemption Request)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Controller:</span>
                <span className="text-slate-900 font-semibold">Junction 2 TS2 Hub</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Signal Authorization:</span>
                <span className="text-emerald-700 font-bold">Granted (Priority 1)</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Latency:</span>
                <span className="text-slate-900 font-semibold">12.4 ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
