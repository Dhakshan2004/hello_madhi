import React, { useState } from "react";
import { DEMO_ROUTES, RouteDemandItem } from "../data/transitDemoData";
import {
  Bus,
  Sliders,
  TrendingDown,
  TrendingUp,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
  Volume2,
  VolumeX,
  Send
} from "lucide-react";
import { speakTransitBriefing, stopTransitBriefing } from "../utils/speechDispatcher";

export const AllocationSandbox: React.FC = () => {
  // User's custom bus allocation map
  const [allocatedBuses, setAllocatedBuses] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    DEMO_ROUTES.forEach((r) => {
      init[r.id] = r.currentBuses;
    });
    return init;
  });

  const [committedPlan, setCommittedPlan] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<"sandbox" | "comparison">("sandbox");

  const totalFixedFleet = DEMO_ROUTES.reduce((sum, r) => sum + r.currentBuses, 0); // 48
  const currentAssignedTotal = Object.values(allocatedBuses).reduce((sum, val) => sum + val, 0);
  const fleetDiff = totalFixedFleet - currentAssignedTotal;

  // Calculate dynamic metrics based on user's allocation
  let totalWaitTimeSum = 0;
  let overcrowdingIndexSum = 0;
  let aiOptimalMatchCount = 0;

  DEMO_ROUTES.forEach((route) => {
    const assigned = allocatedBuses[route.id] || route.currentBuses;
    const recommended = route.recommendedBuses;

    // Headway estimation: Route cycle time (60 min) / buses
    const estimatedHeadwayMin = Math.round(60 / Math.max(1, assigned));
    // Wait time approx half the headway + congestion penalty if under-allocated
    const underAllocatedPenalty = assigned < recommended ? (recommended - assigned) * 3 : 0;
    const avgWaitMin = (estimatedHeadwayMin / 2) + underAllocatedPenalty;
    totalWaitTimeSum += avgWaitMin;

    // Overcrowding calculation
    const capacityPerBus = 75; // max passengers carried per hour per bus
    const capacityProvided = assigned * capacityPerBus;
    const loadPct = Math.round((route.predictedDemand / Math.max(50, capacityProvided)) * 100);
    overcrowdingIndexSum += Math.max(0, loadPct - 85);

    if (assigned === recommended) {
      aiOptimalMatchCount += 1;
    }
  });

  const avgWaitTime = (totalWaitTimeSum / DEMO_ROUTES.length).toFixed(1);
  const overcrowdingScore = Math.max(2, Math.round(overcrowdingIndexSum / DEMO_ROUTES.length));
  const aiAlignmentScore = Math.round((aiOptimalMatchCount / DEMO_ROUTES.length) * 100);

  // Baseline metrics without allocation
  const baselineWaitTime = "11.4";
  const waitSavings = Math.max(0, Number(baselineWaitTime) - Number(avgWaitTime)).toFixed(1);

  const handleAdjustBus = (routeId: string, delta: number) => {
    setCommittedPlan(false);
    setAllocatedBuses((prev) => {
      const current = prev[routeId] ?? 4;
      const next = Math.max(1, Math.min(14, current + delta));
      return { ...prev, [routeId]: next };
    });
  };

  const handleApplyAIBestPlan = () => {
    setCommittedPlan(false);
    const aiPlan: Record<string, number> = {};
    DEMO_ROUTES.forEach((r) => {
      aiPlan[r.id] = r.recommendedBuses;
    });
    setAllocatedBuses(aiPlan);
  };

  const handleResetToCurrent = () => {
    setCommittedPlan(false);
    const currPlan: Record<string, number> = {};
    DEMO_ROUTES.forEach((r) => {
      currPlan[r.id] = r.currentBuses;
    });
    setAllocatedBuses(currPlan);
  };

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopTransitBriefing();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const briefing = `SmartTransit AI Fleet Sandbox. Total available fleet is 48 buses. Currently, your allocation achieves an average passenger wait time of ${avgWaitTime} minutes, representing a savings of ${waitSavings} minutes compared to static scheduling. AI alignment score is ${aiAlignmentScore} percent.`;
      speakTransitBriefing(briefing, () => setIsSpeaking(false));
    }
  };

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 uppercase tracking-wide">
              Interactive Decision Workbench
            </span>
            <span className="text-xs text-blue-200">· Real-Time What-If Sandbox</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Bus Allocation Sandbox &amp; Impact Simulator
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-1">
            Adjust bus numbers manually between routes to see how passenger wait times, overcrowding risk, and efficiency respond in real time.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleToggleVoice}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isSpeaking
                ? "bg-amber-400 text-slate-900 border-amber-300 animate-pulse"
                : "bg-white/10 hover:bg-white/20 text-white border-white/20"
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? "Mute Briefing" : "Audio Briefing"}</span>
          </button>

          <button
            onClick={handleApplyAIBestPlan}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-500 hover:bg-blue-400 text-white transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply AI Best Plan</span>
          </button>

          <button
            onClick={handleResetToCurrent}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Real-Time Impact Metric Barometer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Average Wait Time */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Avg Wait Time</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {avgWaitTime}
            </span>
            <span className="text-xs text-slate-500 ml-1">min</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold font-mono">
            -{waitSavings} min vs Static Schedule
          </div>
        </div>

        {/* Metric 2: Overcrowding Risk */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Overcrowding Index</span>
            <AlertTriangle className={`w-4 h-4 ${overcrowdingScore > 15 ? "text-rose-500" : "text-emerald-500"}`} />
          </div>
          <div className="my-1.5">
            <span className={`font-mono text-2xl sm:text-3xl font-bold tabular-nums ${overcrowdingScore > 15 ? "text-rose-600" : "text-emerald-600"}`}>
              {overcrowdingScore}%
            </span>
            <span className="text-xs text-slate-500 ml-1">overload</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {overcrowdingScore < 8 ? "Safe Passenger Headroom" : "High Platform Queue Risk"}
          </div>
        </div>

        {/* Metric 3: Fleet Balance */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Fleet Assignment</span>
            <Bus className="w-4 h-4 text-blue-600" />
          </div>
          <div className="my-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {currentAssignedTotal}
            </span>
            <span className="text-xs text-slate-500 ml-1">/ {totalFixedFleet} Buses</span>
          </div>
          <div className={`text-[11px] font-mono font-semibold ${fleetDiff === 0 ? "text-emerald-600" : fleetDiff > 0 ? "text-amber-600" : "text-rose-600"}`}>
            {fleetDiff === 0 ? "Exact Fleet Neutral (48/48)" : fleetDiff > 0 ? `${fleetDiff} Reserves Available` : `${Math.abs(fleetDiff)} Over Fleet Capacity`}
          </div>
        </div>

        {/* Metric 4: AI Match Score */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>AI Plan Match</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="my-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-indigo-700 tabular-nums">
              {aiAlignmentScore}%
            </span>
            <span className="text-xs text-slate-500 ml-1">congruence</span>
          </div>
          <div className="text-[11px] text-indigo-600 font-medium">
            {aiAlignmentScore === 100 ? "Maximum Optimization" : `${aiOptimalMatchCount} of 8 routes match AI`}
          </div>
        </div>
      </div>

      {/* Main Interactive Allocator Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Corridor Bus Allocation Controls
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Use the <span className="font-semibold text-slate-700">+</span> and <span className="font-semibold text-slate-700">-</span> buttons to test shifting buses from low-demand to high-demand routes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCommittedPlan(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Commit Plan to Dispatch</span>
            </button>
          </div>
        </div>

        {committedPlan && (
          <div className="p-3.5 mx-4 sm:mx-5 my-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-sans">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Plan Committed!</span>
            <span>Allocations mapped into transit dispatch log. Estimated wait times synchronized.</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Route &amp; Corridor</th>
                <th className="py-3 px-4 font-semibold">Predicted Demand</th>
                <th className="py-3 px-4 font-semibold">AI Recommendation</th>
                <th className="py-3 px-4 font-semibold text-center">Your Allocation</th>
                <th className="py-3 px-4 font-semibold text-right">Estimated Headway</th>
                <th className="py-3 px-4 font-semibold text-right">Avg Wait Time</th>
                <th className="py-3 px-4 font-semibold text-center">Efficiency Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {DEMO_ROUTES.map((route) => {
                const assigned = allocatedBuses[route.id] || route.currentBuses;
                const rec = route.recommendedBuses;
                const isUnder = assigned < rec;
                const isOptimal = assigned === rec;
                const isOver = assigned > rec;

                const headwayMin = Math.round(60 / assigned);
                const waitMin = ((headwayMin / 2) + (isUnder ? (rec - assigned) * 3 : 0)).toFixed(1);

                return (
                  <tr key={route.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Route Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-bold flex items-center justify-center text-[11px] border border-blue-200">
                          {route.name.split("–")[0].trim()}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{route.name}</div>
                          <div className="text-[11px] text-slate-500">{route.corridor}</div>
                        </div>
                      </div>
                    </td>

                    {/* Predicted Demand */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900">
                        {route.predictedDemand.toLocaleString()} <span className="text-slate-500 font-normal">pax</span>
                      </div>
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        route.demandLevel === "HIGH"
                          ? "bg-rose-100 text-rose-700"
                          : route.demandLevel === "MEDIUM"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {route.demandLevel} DEMAND
                      </span>
                    </td>

                    {/* AI Recommendation */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{rec} buses</span>
                        <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                          route.delta > 0
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : route.delta < 0
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {route.delta > 0 ? `+${route.delta}` : route.delta}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">Static: {route.currentBuses} units</div>
                    </td>

                    {/* Interactive Stepper */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleAdjustBus(route.id, -1)}
                          disabled={assigned <= 1}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold flex items-center justify-center text-sm transition-colors border border-slate-200"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-mono font-bold text-sm text-slate-900">
                          {assigned}
                        </span>
                        <button
                          onClick={() => handleAdjustBus(route.id, 1)}
                          disabled={assigned >= 14}
                          className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 disabled:opacity-40 text-blue-700 font-bold flex items-center justify-center text-sm transition-colors border border-blue-200"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Headway */}
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900">
                      Every {headwayMin} min
                    </td>

                    {/* Wait Time */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <span className={`font-bold ${isUnder ? "text-rose-600" : isOptimal ? "text-emerald-600" : "text-blue-600"}`}>
                        {waitMin} min
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {isOptimal ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Optimal (AI Matched)
                        </span>
                      ) : isUnder ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          Under-Allocated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200">
                          <Zap className="w-3 h-3" />
                          Surplus Assigned
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
