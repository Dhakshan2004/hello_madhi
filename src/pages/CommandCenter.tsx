import React, { useState, useEffect } from "react";
import {
  TransitFleetTelemetry,
  GeminiTransitDispatchInsight,
  SystemDataMode,
} from "../types";
import {
  fetchTransitFleetTelemetry,
  runGeminiTransitDispatcher,
  toggleTransitSignalPriority,
  fetchGoogleSearchGrounding,
  SearchGroundingResult,
} from "../services/api";
import { LiveTransitMap } from "../components/LiveTransitMap";
import { FeedbackLoop } from "../components/FeedbackLoop";
import {
  Car,
  Activity,
  Gauge,
  Siren,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Terminal,
  RefreshCw,
  TrafficCone,
  Flame,
  CheckCircle2,
  Globe,
  ExternalLink
} from "lucide-react";

interface CommandCenterProps {
  systemMode: SystemDataMode;
  onSwitchMode: (mode: SystemDataMode) => void;
  onTriggerDemo: () => void;
  onNavigateToTab: (tab: any) => void;
  emergencyActive: boolean;
  onToggleEmergency: (active: boolean) => void;
}

interface TrafficLog {
  id: string;
  timestamp: string;
  message: string;
  status: string;
  type: "info" | "alert" | "success";
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  onNavigateToTab,
  emergencyActive,
  onToggleEmergency,
}) => {
  const [telemetry, setTelemetry] = useState<TransitFleetTelemetry | null>(null);
  const [aiInsight, setAiInsight] = useState<GeminiTransitDispatchInsight | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [signalOverrideApplied, setSignalOverrideApplied] = useState(false);

  // Google Search Grounding State
  const [searchResult, setSearchResult] = useState<SearchGroundingResult | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [logs, setLogs] = useState<TrafficLog[]>([
    { id: "1", timestamp: "14:28:18", message: "Junction 2: Main Street congestion surge (density 84%). Diversion recommended.", status: "Congestion", type: "alert" },
    { id: "2", timestamp: "14:28:16", message: "Rescue Unit Echo-4 (AMB-102) preemption request granted at Junction 1 (+24s).", status: "Priority 1", type: "success" },
    { id: "3", timestamp: "14:28:15", message: "YOLOv8 Edge: Stalled vehicle identified blocking Broadway Lane 2.", status: "Incident", type: "alert" },
    { id: "4", timestamp: "14:28:12", message: "Gemini Engine: Grand Avenue bypass route advisory published to matrix signage.", status: "Advisory", type: "info" },
  ]);

  useEffect(() => {
    loadData();
    handleRunSearchGrounding("Regional metropolitan highway congestion and severe weather road incidents");
    const interval = setInterval(() => {
      loadData();
      appendSimulatedLog();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleRunSearchGrounding = async (queryText?: string) => {
    setLoadingSearch(true);
    try {
      const q = queryText || "Metropolitan highway congestion and traffic incident alerts";
      const data = await fetchGoogleSearchGrounding(q);
      setSearchResult(data);
    } catch (err) {
      console.error("Search Grounding failed:", err);
    } finally {
      setLoadingSearch(false);
    }
  };

  const loadData = async () => {
    const data = await fetchTransitFleetTelemetry();
    setTelemetry(data);
  };

  const appendSimulatedLog = () => {
    const timeStr = new Date().toTimeString().split(" ")[0];
    const messages = [
      { msg: "Arterial Highway 101: Speed maintained at 68 km/h nominal", status: "Nominal", type: "info" as const },
      { msg: "Grand Avenue Bypass: Absorbed 42 diverted vehicles without delay", status: "Smooth", type: "success" as const },
      { msg: "Junction 4 Signal: AI extended green phase by +12s for heavy queue", status: "Adaptive", type: "success" as const },
      { msg: "Downtown Loop: Average vehicle spacing 18.4 meters", status: "Normal", type: "info" as const },
    ];
    const picked = messages[Math.floor(Math.random() * messages.length)];
    setLogs((prev) => [
      { id: Date.now().toString(), timestamp: timeStr, message: picked.msg, status: picked.status, type: picked.type },
      ...prev.slice(0, 4),
    ]);
  };

  const handleRunAiAnalysis = async () => {
    setLoadingAi(true);
    const res = await runGeminiTransitDispatcher({
      transitStatistics: {
        onTimeRate: "84.6%",
        activeFleet: 1284,
        avgSpeed: "21.4 km/h",
      },
      platformDensity: "78% Network Density (Peak Bottleneck at Main Street)",
      delayedVehicles: [{ unit: "Corridor Main St", delay: "14 mins", route: "Highway Merge" }],
      activeDisruptions: ["Lane 2 Collision Stall", "Main St Surge"],
    });
    setAiInsight(res);
    setLoadingAi(false);

    setLogs((prev) => [
      {
        id: Date.now().toString(),
        timestamp: new Date().toTimeString().split(" ")[0],
        message: "Gemini Engine: Cognitive flow synthesis completed (94.0% confidence)",
        status: "Synthesized",
        type: "success",
      },
      ...prev.slice(0, 4),
    ]);
  };

  const handleApplySignalOverride = () => {
    setSignalOverrideApplied(true);
    setLogs((prev) => [
      {
        id: Date.now().toString(),
        timestamp: new Date().toTimeString().split(" ")[0],
        message: "Actuation Override: Extended Junction 4 green phase by +15 seconds",
        status: "Actuated",
        type: "success",
      },
      ...prev.slice(0, 4),
    ]);
  };

  return (
    <div className="space-y-4 select-none pb-10">
      {/* 6 Clean KPI Metric Cards (Blue & White theme) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: Vehicles Detected */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Vehicles Detected</span>
            <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
              <Car className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2.5">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              1,284
            </span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            38 optical road feeds
          </div>
        </div>

        {/* KPI 2: Traffic Density */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Traffic Density</span>
            <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center text-amber-600">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2.5">
            <span className="font-mono text-2xl font-bold text-amber-600 tabular-nums">
              78%
            </span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Capacity threshold: 85%
          </div>
        </div>

        {/* KPI 3: Congestion Score */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Congestion Level</span>
            <div className="w-6 h-6 rounded-md bg-rose-50 flex items-center justify-center text-rose-600">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2.5">
            <span className="font-mono text-2xl font-bold text-rose-600">
              HIGH
            </span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Main Street bottleneck
          </div>
        </div>

        {/* KPI 4: Average Speed */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Average Speed</span>
            <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
              <Gauge className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2.5">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              21 <span className="text-xs font-normal text-slate-500">km/h</span>
            </span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Free-flow: 50 km/h
          </div>
        </div>

        {/* KPI 5: Emergency Vehicles */}
        <div
          onClick={() => onToggleEmergency(!emergencyActive)}
          className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between shadow-xs ${
            emergencyActive
              ? "bg-rose-50 border-rose-300 ring-2 ring-rose-200"
              : "bg-white border-slate-200/90 hover:border-blue-300"
          }`}
          title="Click to toggle emergency preemption clearance"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Emergency Units</span>
            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${emergencyActive ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-600"}`}>
              <Siren className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2.5">
            <span className={`font-mono text-2xl font-bold tabular-nums ${emergencyActive ? "text-rose-600" : "text-slate-900"}`}>
              {emergencyActive ? "2 Active" : "2 Standby"}
            </span>
          </div>
          <div className="text-xs text-blue-600 font-mono font-medium">
            {emergencyActive ? "Preemption active" : "Click to clear path"}
          </div>
        </div>

        {/* KPI 6: Active Incidents */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Incidents</span>
            <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2.5">
            <span className="font-mono text-2xl font-bold text-amber-600 tabular-nums">
              4
            </span>
          </div>
          <div className="text-xs text-slate-500 font-mono truncate">
            1 stall · 3 slowdowns
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (7 cols) + Right Column (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Map & Pipeline */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs p-4">
            <LiveTransitMap
              tspActive={emergencyActive}
              onSelectVehicle={(v) => console.log("Selected vehicle:", v)}
            />
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs p-4">
            <FeedbackLoop />
          </div>
        </div>

        {/* Right Column: AI Traffic Decision & Dispatch */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* AI Decision Panel */}
          <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    AI Traffic Analysis &amp; Decision
                  </span>
                </div>
                <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  gemini-3.8-flash
                </span>
              </div>

              {/* Status Briefing */}
              <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200/80 mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>High Congestion on Main Street Corridor</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {aiInsight?.summary ||
                    "High congestion on Main Street (density 84%). Recommend redirecting non-emergency vehicles to Grand Avenue Bypass (Route B). Adjusting Junction 4 green phase cycle +15s."}
                </p>
                <div className="mt-2.5 pt-2.5 border-t border-blue-200 text-xs text-blue-900 font-mono">
                  <span className="text-slate-500 font-medium">Recommended Action:</span>{" "}
                  {aiInsight?.dispatchAction ||
                    "Enact Emergency Corridor clearance for AMB-102 and extend Junction 4 green phase by +15s."}
                </div>
              </div>

              {/* 4 Clean Stats */}
              <div className="grid grid-cols-4 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-center font-mono text-xs mb-3">
                <div>
                  <span className="text-[10px] text-slate-500 block">Density</span>
                  <span className="font-semibold text-amber-600 tabular-nums">78%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Bottleneck</span>
                  <span className="font-semibold text-rose-600">Main St</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Signal Adj</span>
                  <span className="font-semibold text-emerald-600 tabular-nums">+15s</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Confidence</span>
                  <span className="font-semibold text-blue-600 tabular-nums">
                    {Math.round((aiInsight?.confidence || 0.94) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons matching specifications */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onToggleEmergency(!emergencyActive)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors shadow-xs ${
                    emergencyActive
                      ? "bg-rose-600 text-white hover:bg-rose-500"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Siren className="w-3.5 h-3.5" />
                  <span>{emergencyActive ? "Clearance Active" : "Clear Emergency Path"}</span>
                </button>
                <button
                  onClick={handleApplySignalOverride}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    signalOverrideApplied
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <TrafficCone className="w-3.5 h-3.5 text-blue-600" />
                  <span>{signalOverrideApplied ? "Signal Override Applied" : "Apply Signal Changes"}</span>
                </button>
              </div>

              <button
                onClick={handleRunAiAnalysis}
                disabled={loadingAi}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loadingAi ? "animate-spin" : ""}`} />
                <span>{loadingAi ? "Analyzing..." : "Re-run AI Analysis"}</span>
              </button>
            </div>
          </div>

          {/* Google Search Grounded Regional Traffic Intelligence Card */}
          <div className="rounded-xl bg-white border border-blue-200/90 shadow-xs p-4">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">Live Search Grounded Advisories</span>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  gemini-3.8-flash + googleSearch
                </span>
              </div>
              <button
                onClick={() => handleRunSearchGrounding()}
                disabled={loadingSearch}
                className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1 font-mono font-medium"
              >
                <RefreshCw className={`w-3 h-3 ${loadingSearch ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>

            <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed mb-3">
              {searchResult?.text || "Searching Google for regional highway incidents, weather advisories, and corridor bottleneck updates..."}
            </p>

            {/* Clickable Citations */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-500 uppercase font-mono block font-medium">Verified Web Sources</span>
              {searchResult?.webSources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-blue-50/40 border border-blue-100 hover:border-blue-300 transition-colors text-xs text-slate-800 hover:text-blue-700 group"
                >
                  <span className="truncate pr-2 font-medium">{source.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Telemetry Stream */}
          <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  <span>Live Operations Feed</span>
                </div>
                <span className="text-xs font-mono text-slate-500">Real-Time Influx</span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/80"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[11px] text-slate-500 shrink-0 tabular-nums">[{log.timestamp}]</span>
                      <span className={`truncate text-xs ${
                        log.type === "alert"
                          ? "text-rose-600 font-medium"
                          : log.type === "success"
                          ? "text-emerald-600 font-medium"
                          : "text-slate-700"
                      }`}>
                        {log.message}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 shrink-0">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Sampling interval: 1.0s</span>
              <button
                onClick={() => onNavigateToTab("traffic-vision")}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
              >
                <span>Inspect Video Feeds</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
