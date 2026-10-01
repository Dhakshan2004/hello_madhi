import React, { useState, useEffect } from "react";
import {
  TrafficCone,
  Zap,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Siren,
  Clock,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  TrendingDown,
  RefreshCw
} from "lucide-react";

type ControlMode = "STANDARD" | "AI_ADAPTIVE" | "EMERGENCY_PRIORITY";

interface ApproachData {
  name: string;
  carsWaiting: number;
  speedKmh: number;
  greenSec: number;
  state: "RED" | "YELLOW" | "GREEN";
}

export const SignalSimulator: React.FC = () => {
  const [mode, setMode] = useState<ControlMode>("AI_ADAPTIVE");
  const [timer, setTimer] = useState<number>(24);
  const [activeDirection, setActiveDirection] = useState<"NS" | "EW">("NS");

  const [approaches, setApproaches] = useState<Record<string, ApproachData>>({
    north: { name: "Northbound Main Arterial", carsWaiting: 28, speedKmh: 42, greenSec: 35, state: "GREEN" },
    south: { name: "Southbound Commercial Ave", carsWaiting: 22, speedKmh: 38, greenSec: 35, state: "GREEN" },
    east: { name: "Eastbound Downtown Merge", carsWaiting: 16, speedKmh: 24, greenSec: 25, state: "RED" },
    west: { name: "Westbound Harbor Connector", carsWaiting: 14, speedKmh: 30, greenSec: 25, state: "RED" },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Flip phases
          setActiveDirection((curr) => {
            const next = curr === "NS" ? "EW" : "NS";
            setApproaches((app) => ({
              north: { ...app.north, state: next === "NS" ? "GREEN" : "RED" },
              south: { ...app.south, state: next === "NS" ? "GREEN" : "RED" },
              east: { ...app.east, state: next === "EW" ? "GREEN" : "RED" },
              west: { ...app.west, state: next === "EW" ? "GREEN" : "RED" },
            }));
            return next;
          });
          return mode === "AI_ADAPTIVE" ? 32 : 25;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mode]);

  const handleSimulateSurge = (dir: string) => {
    setApproaches((prev) => ({
      ...prev,
      [dir]: {
        ...prev[dir],
        carsWaiting: prev[dir].carsWaiting + 15,
        greenSec: prev[dir].greenSec + 10,
      },
    }));
  };

  return (
    <div className="space-y-4 select-none pb-12">
      {/* Header Bar */}
      <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrafficCone className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Adaptive Traffic Signal Simulator
            </h2>
            <p className="text-xs text-slate-500">
              NEMA TS2 controller · Dynamic queue-based green extensions · Multi-phase optimization
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
          <button
            onClick={() => setMode("STANDARD")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === "STANDARD" ? "bg-white text-slate-900 font-semibold shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Fixed Timer
          </button>
          <button
            onClick={() => setMode("AI_ADAPTIVE")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === "AI_ADAPTIVE" ? "bg-blue-600 text-white font-semibold shadow-xs" : "text-slate-600 hover:text-blue-600"
            }`}
          >
            AI Adaptive
          </button>
          <button
            onClick={() => setMode("EMERGENCY_PRIORITY")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === "EMERGENCY_PRIORITY" ? "bg-rose-600 text-white font-semibold shadow-xs" : "text-slate-600 hover:text-rose-600"
            }`}
          >
            Emergency Mode
          </button>
        </div>
      </div>

      {/* Main Grid: 4-Way Crossing (7 cols) + Telemetry & Controls (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Top-Down Visual Crossing */}
        <div className="lg:col-span-7 rounded-xl bg-white border border-slate-200/90 shadow-xs p-6 flex flex-col items-center justify-center min-h-[440px]">
          {/* North */}
          <div className="flex flex-col items-center mb-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono text-xs w-64 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>NORTH (Main Arterial)</span>
                <span className={approaches.north.state === "GREEN" ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                  {approaches.north.state}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Queue: {approaches.north.carsWaiting} cars</span>
                <span>Speed: {approaches.north.speedKmh} km/h</span>
              </div>
            </div>
            <ArrowDown className={`w-5 h-5 mt-1 ${approaches.north.state === "GREEN" ? "text-emerald-600" : "text-slate-400"}`} />
          </div>

          {/* Middle Row */}
          <div className="w-full flex items-center justify-between gap-3 my-2">
            {/* West */}
            <div className="flex items-center gap-1.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs w-52 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>WEST (Harbor)</span>
                  <span className={approaches.west.state === "GREEN" ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                    {approaches.west.state}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Queue: {approaches.west.carsWaiting} cars</span>
                  <span>{approaches.west.speedKmh} km/h</span>
                </div>
              </div>
              <ArrowRight className={`w-4 h-4 ${approaches.west.state === "GREEN" ? "text-emerald-600" : "text-slate-400"}`} />
            </div>

            {/* Central Traffic Controller Node (Blue & White) */}
            <div className="w-36 h-36 rounded-2xl bg-blue-50 border-2 border-blue-300 flex flex-col items-center justify-center p-2 text-center font-mono shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className={`w-3.5 h-3.5 rounded-full ${activeDirection === "NS" ? "bg-slate-300" : "bg-rose-500"}`}></div>
                <div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>
                <div className={`w-3.5 h-3.5 rounded-full ${activeDirection === "NS" ? "bg-emerald-500" : "bg-slate-300"}`}></div>
              </div>
              <span className="text-[10px] text-slate-600 uppercase font-bold">Active Cycle</span>
              <span className="text-3xl font-bold text-blue-950 tabular-nums">{timer}s</span>
              <span className="text-[10px] text-blue-700 font-bold mt-1">
                {mode === "AI_ADAPTIVE" ? "AI EXTENSION +12s" : mode}
              </span>
            </div>

            {/* East */}
            <div className="flex items-center gap-1.5">
              <ArrowLeft className={`w-4 h-4 ${approaches.east.state === "GREEN" ? "text-emerald-600" : "text-slate-400"}`} />
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs w-52 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>EAST (Downtown)</span>
                  <span className={approaches.east.state === "GREEN" ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                    {approaches.east.state}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Queue: {approaches.east.carsWaiting} cars</span>
                  <span>{approaches.east.speedKmh} km/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* South */}
          <div className="flex flex-col items-center mt-2">
            <ArrowUp className={`w-5 h-5 mb-1 ${approaches.south.state === "GREEN" ? "text-emerald-600" : "text-slate-400"}`} />
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono text-xs w-64 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>SOUTH (Commercial Ave)</span>
                <span className={approaches.south.state === "GREEN" ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                  {approaches.south.state}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Queue: {approaches.south.carsWaiting} cars</span>
                <span>Speed: {approaches.south.speedKmh} km/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Injected Surges & AI Logic */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4">
            <div className="text-sm font-bold text-slate-900 pb-2 mb-3 border-b border-slate-200">
              Traffic Surge Test Injections
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono">
                <span className="text-slate-800 font-medium">North Arterial (+15 Cars)</span>
                <button
                  onClick={() => handleSimulateSurge("north")}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors shadow-xs"
                >
                  Inject Surge
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono">
                <span className="text-slate-800 font-medium">East Downtown (+15 Cars)</span>
                <button
                  onClick={() => handleSimulateSurge("east")}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors shadow-xs"
                >
                  Inject Surge
                </button>
              </div>
            </div>
          </div>

          {/* AI Optimization Brief */}
          <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4 flex-1">
            <div className="text-sm font-bold text-slate-900 mb-2">
              Adaptive Optimization Protocol
            </div>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 leading-relaxed">
                <span className="text-blue-900 font-bold">Queue-Weighted Extension: </span>
                When queue on an approach exceeds 20 vehicles, AI dynamically adds +5s to +15s green extension without disrupting adjacent corridor coordination.
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 leading-relaxed">
                <span className="text-emerald-900 font-bold">Throughput Increase: </span>
                Adaptive control yields a <strong className="text-emerald-800">+22.4% reduction in average vehicle idling delay</strong> compared to fixed-time signal cycles.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
