import React, { useState } from "react";
import {
  DEMO_ROUTES,
  HOURLY_OVERVIEW_DATA,
  RouteDemandItem,
  DemandLevel,
  HourlyDemandPoint
} from "../data/transitDemoData";
import { SCENARIOS, ScenarioType } from "../data/scenarioData";
import { TRANSIT_DATASETS, TransitDataset } from "../data/transitDatasets";
import { DemandChart } from "../components/DemandChart";
import { RouteWiseDemandTable } from "../components/RouteWiseDemandTable";
import { BusAllocationSection } from "../components/BusAllocationSection";
import { AiPredictionFlow } from "../components/AiPredictionFlow";
import { PassengerDataFactors } from "../components/PassengerDataFactors";
import { DemandLevelsCard } from "../components/DemandLevelsCard";
import { RouteDetailModal } from "../components/RouteDetailModal";
import { ScenarioSimulator } from "../components/ScenarioSimulator";
import { ImpactMetricsComparison } from "../components/ImpactMetricsComparison";
import { StopBottleneckInspector } from "../components/StopBottleneckInspector";
import { ExplainableAiCard } from "../components/ExplainableAiCard";
import { FleetDispatchModal } from "../components/FleetDispatchModal";
import { LiveTransitMap } from "../components/LiveTransitMap";
import {
  Bus,
  Users,
  Route as RouteIcon,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Clock,
  Compass,
  CheckCircle2,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Send,
  Zap,
  Check
} from "lucide-react";

export const SmartTransitDashboard: React.FC = () => {
  // State for interactive controls
  const [routes, setRoutes] = useState<RouteDemandItem[]>(DEMO_ROUTES);
  const [hourlyData, setHourlyData] = useState<HourlyDemandPoint[]>(HOURLY_OVERVIEW_DATA);
  const [demandFilter, setDemandFilter] = useState<"ALL" | DemandLevel>("ALL");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("ALL_DAY");
  const [selectedRoute, setSelectedRoute] = useState<RouteDemandItem | null>(DEMO_ROUTES[0]);
  const [appliedAllocations, setAppliedAllocations] = useState<Record<string, boolean>>({});
  
  // Dataset Ingestion State
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("regular_weekday");

  // Scenario Simulator State
  const [activeScenario, setActiveScenario] = useState<ScenarioType>("NORMAL");
  const [isRecalculating, setIsRecalculating] = useState(false);

  const handleSelectDataset = (datasetId: string) => {
    setSelectedDatasetId(datasetId);
    setIsRecalculating(true);
    const ds = TRANSIT_DATASETS.find((d) => d.id === datasetId) || TRANSIT_DATASETS[0];

    setTimeout(() => {
      const updated = DEMO_ROUTES.map((base) => {
        const isTargeted = ds.highlightedRoutes.includes(base.id);
        const mult = isTargeted ? ds.multiplier * 1.15 : ds.multiplier;
        const newPredicted = Math.round(base.predictedDemand * mult);
        const diff = newPredicted - base.currentPassengers;
        const newDelta = diff > 100 ? 2 : diff > 30 ? 1 : diff < -30 ? -1 : 0;
        const newRecBuses = Math.max(2, base.currentBuses + newDelta);
        const newLevel: DemandLevel = newPredicted > 420 ? "HIGH" : newPredicted < 160 ? "LOW" : "MEDIUM";
        return {
          ...base,
          predictedDemand: newPredicted,
          delta: newDelta,
          recommendedBuses: newRecBuses,
          demandLevel: newLevel,
        };
      });

      const updatedHourly = HOURLY_OVERVIEW_DATA.map((h) => ({
        ...h,
        predicted: Math.round(h.predicted * ds.multiplier),
      }));

      setRoutes(updated);
      setHourlyData(updatedHourly);
      setIsRecalculating(false);
      showToast(`Ingested sample dataset: ${ds.name} (${ds.commuterVolume.toLocaleString()} taps)`);
    }, 400);
  };

  // "Run Prediction" Simulation State
  const [isRunningPrediction, setIsRunningPrediction] = useState(false);
  const [lastPredictionTime, setLastPredictionTime] = useState<string>("Just now");
  const [showMapModal, setShowMapModal] = useState(false);

  // Fleet Dispatch Modal State
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Summary Metrics
  const totalRoutes = routes.length;
  const totalBuses = routes.reduce((acc, r) => acc + r.currentBuses, 0);
  const totalPredictedPax = routes.reduce((acc, r) => acc + r.predictedDemand, 0);
  const totalCurrentPax = routes.reduce((acc, r) => acc + r.currentPassengers, 0);
  const highDemandRoutesCount = routes.filter((r) => r.demandLevel === "HIGH").length;

  // Handle Scenario Change
  const handleSelectScenario = (scType: ScenarioType) => {
    setActiveScenario(scType);
    setIsRecalculating(true);

    const scDef = SCENARIOS.find((s) => s.id === scType) || SCENARIOS[0];

    setTimeout(() => {
      // Recompute route forecasts based on scenario multiplier
      const updatedRoutes = DEMO_ROUTES.map((base) => {
        const isTargeted = scDef.highlightedRouteIds.includes(base.id);
        const effectiveMultiplier = isTargeted
          ? scDef.multiplier * 1.15
          : scDef.multiplier;

        const newPredicted = Math.round(base.predictedDemand * effectiveMultiplier);
        const diff = newPredicted - base.currentPassengers;
        const newDelta = diff > 100 ? 2 : diff > 30 ? 1 : diff < -30 ? -1 : 0;
        const newRecBuses = Math.max(2, base.currentBuses + newDelta);
        const newLevel: DemandLevel =
          newPredicted > 420 ? "HIGH" : newPredicted < 160 ? "LOW" : "MEDIUM";

        return {
          ...base,
          predictedDemand: newPredicted,
          delta: newDelta,
          recommendedBuses: newRecBuses,
          demandLevel: newLevel,
        };
      });

      // Update hourly chart data by scenario multiplier
      const updatedHourly = HOURLY_OVERVIEW_DATA.map((h) => ({
        ...h,
        predicted: Math.round(h.predicted * scDef.multiplier),
      }));

      setRoutes(updatedRoutes);
      setHourlyData(updatedHourly);
      setIsRecalculating(false);
      setLastPredictionTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));

      // Update selected route reference if open
      if (selectedRoute) {
        const match = updatedRoutes.find((r) => r.id === selectedRoute.id);
        if (match) setSelectedRoute(match);
      }
    }, 450);
  };

  // Handle "Run Prediction" click
  const handleRunPrediction = () => {
    setIsRunningPrediction(true);

    setTimeout(() => {
      const updatedRoutes = routes.map((r) => {
        const jitter = Math.floor((Math.random() - 0.5) * 30);
        const newPredicted = Math.max(80, r.predictedDemand + jitter);
        const diff = newPredicted - r.currentPassengers;
        const newDelta = diff > 80 ? 2 : diff > 25 ? 1 : diff < -25 ? -1 : 0;
        const newRecBuses = Math.max(2, r.currentBuses + newDelta);

        return {
          ...r,
          predictedDemand: newPredicted,
          delta: newDelta,
          recommendedBuses: newRecBuses,
          demandLevel: newPredicted > 400 ? ("HIGH" as DemandLevel) : newPredicted < 150 ? ("LOW" as DemandLevel) : ("MEDIUM" as DemandLevel),
        };
      });

      setRoutes(updatedRoutes);
      setLastPredictionTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setIsRunningPrediction(false);
    }, 600);
  };

  // Handle Time Period Selection filter
  const handleSelectTime = (time: string) => {
    setSelectedTimePeriod(time);
  };

  // Handle Apply Individual Allocation
  const handleApplyAllocation = (routeId: string) => {
    setAppliedAllocations((prev) => ({ ...prev, [routeId]: true }));
    showToast(`Fleet allocation applied for ${routes.find((r) => r.id === routeId)?.name || "Route"}`);
  };

  // Handle Batch Fleet Dispatch
  const handleConfirmBatchDispatch = () => {
    setIsDispatched(true);
    setIsDispatchModalOpen(false);

    // Apply all recommended allocations to routes
    const allApplied: Record<string, boolean> = {};
    routes.forEach((r) => {
      allApplied[r.id] = true;
    });
    setAppliedAllocations(allApplied);

    showToast("Fleet Reallocation Order #DSP-8820 authorized and transmitted to depot operations!");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="space-y-5 select-none pb-12 font-sans relative">
      {/* Floating Status Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs font-sans flex items-center gap-2.5 animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER & PROTOTYPE BANNER */}
      <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
              Erode District, Tamil Nadu · TNSTC
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-[11px] text-slate-500 font-mono">
              Last Prediction: {lastPredictionTime}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Erode District AI Passenger Demand &amp; Fleet Allocation
          </h1>
          <p className="text-xs text-slate-600 mt-0.5 max-w-2xl font-normal">
            Forecasting commuter, college, and textile market surges across Erode Central, Perundurai SIPCOT, Bhavani Kooduthurai, Thindal, and Sathyamangalam corridors.
          </p>
        </div>

        {/* Action Buttons: Dataset Ingestion, Run Prediction, Batch Dispatch & View Map */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Dataset Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-[11px] font-mono font-semibold text-slate-500 pl-2">Data Feed:</span>
            <select
              value={selectedDatasetId}
              onChange={(e) => handleSelectDataset(e.target.value)}
              className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {TRANSIT_DATASETS.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.name} [{ds.badge}]
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowMapModal(!showMapModal)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>{showMapModal ? "Hide Map" : "Transit Map View"}</span>
          </button>

          <button
            onClick={() => setIsDispatchModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isDispatched ? "Reallocation Active" : "Dispatch Reallocation"}</span>
          </button>

          <button
            onClick={handleRunPrediction}
            disabled={isRunningPrediction}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunningPrediction ? "animate-spin" : ""}`} />
            <span>{isRunningPrediction ? "Computing Forecast..." : "Run Prediction"}</span>
          </button>
        </div>
      </div>

      {/* 2. TOP SUMMARY CARDS (4 Essential KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Routes */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Routes</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <RouteIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {totalRoutes}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-normal">Routes</span>
          </div>
          <div className="text-[11px] text-blue-600 font-medium">
            4 Primary Trunk Corridors
          </div>
        </div>

        {/* Card 2: Available Buses */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Available Buses</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {totalBuses}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-normal">Active Fleet</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            4 Standby Reserves Ready
          </div>
        </div>

        {/* Card 3: Predicted Passengers */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Predicted Passengers</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-blue-700 tabular-nums">
              {totalPredictedPax.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-normal">Pax / Day</span>
          </div>
          <div className="text-[11px] text-rose-600 font-medium font-mono">
            +{totalCurrentPax > 0 ? (((totalPredictedPax - totalCurrentPax) / totalCurrentPax) * 100).toFixed(1) : "0.0"}% vs Current Volume
          </div>
        </div>

        {/* Card 4: High-Demand Routes */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>High-Demand Routes</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-rose-600 tabular-nums">
              {highDemandRoutesCount}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-normal">Corridors Alerted</span>
          </div>
          <div className="text-[11px] text-rose-700 font-medium font-sans">
            Requires capacity injection
          </div>
        </div>
      </div>

      {/* 3. SCENARIO SIMULATOR (Rain, Stadium Event, Normal, Exam Week, Holiday) */}
      <ScenarioSimulator
        activeScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
        isRecalculating={isRecalculating}
      />

      {/* 4. HIGHLIGHTED PREDICTION INSIGHT CARD */}
      <div className="p-4 sm:p-5 rounded-xl bg-blue-50/80 border border-blue-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-blue-800 uppercase font-mono tracking-wide">
              Prediction Insight
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
              “Peak demand is expected between 7:00–9:00 AM and 5:00–7:00 PM.”
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs font-sans text-slate-700">
              <span className="font-bold text-blue-900">Recommended Action:</span>
              <span>Increase bus availability on high-demand routes during predicted peak periods.</span>
            </div>
          </div>
        </div>

        {/* Quick action button */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={() => {
              setDemandFilter("HIGH");
            }}
            className="px-3.5 py-2 rounded-lg bg-white border border-blue-300 hover:bg-blue-50 text-blue-700 text-xs font-semibold transition-colors shadow-2xs font-mono"
          >
            Filter High-Demand Corridors
          </button>
        </div>
      </div>

      {/* Optional Interactive Google Transit Map Collapsible View */}
      {showMapModal && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-slate-900 font-sans">
                Interactive Google Map – Fleet Positioning &amp; Route Hubs
              </span>
            </div>
            <button
              onClick={() => setShowMapModal(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Close Map
            </button>
          </div>
          <LiveTransitMap tspActive={true} onSelectVehicle={(v) => console.log(v)} />
        </div>
      )}

      {/* 5. DEMAND OVERVIEW CHART (Across 6 AM, 8 AM, 10 AM, 12 PM, 2 PM, 4 PM, 6 PM, 8 PM) */}
      <DemandChart
        data={hourlyData}
        selectedRouteName={selectedRoute ? `${selectedRoute.name} (${selectedRoute.corridor})` : "All City Routes (System-Wide)"}
        selectedTimeFilter={selectedTimePeriod}
        onSelectTime={handleSelectTime}
      />

      {/* 6. ROUTE-WISE DEMAND TABLE */}
      <RouteWiseDemandTable
        routes={routes}
        selectedRouteId={selectedRoute?.id || null}
        onSelectRoute={(r) => setSelectedRoute(r)}
        demandFilter={demandFilter}
        onDemandFilterChange={(f) => setDemandFilter(f)}
      />

      {/* 7. RECOMMENDED BUS ALLOCATION SECTION */}
      <BusAllocationSection
        routes={routes}
        onSelectRoute={(r) => setSelectedRoute(r)}
      />

      {/* 8. MEASURABLE SYSTEM IMPACT: STATIC VS AI REALLOCATION */}
      <ImpactMetricsComparison />

      {/* 9. STOP-LEVEL BOTTLENECK INSPECTOR & EXPLAINABLE AI CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StopBottleneckInspector
          selectedRouteId={selectedRoute?.id || "route-a"}
          routeName={selectedRoute?.name || "Route A (Airport Express)"}
        />
        <ExplainableAiCard />
      </div>

      {/* 10. AI DEMAND PREDICTION SECTION & FLOW DIAGRAM */}
      <AiPredictionFlow />

      {/* 11. PASSENGER DEMAND DATA FACTORS & DEMAND LEVELS REFERENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PassengerDataFactors />
        <DemandLevelsCard />
      </div>

      {/* 12. FINAL DASHBOARD MESSAGE */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-center shadow-sm">
        <div className="max-w-2xl mx-auto space-y-1.5">
          <div className="w-8 h-8 rounded-full bg-white/10 mx-auto flex items-center justify-center text-blue-200 mb-2">
            <Bus className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold font-sans">
            “Predict the demand before it happens.
            <br className="hidden sm:inline" /> Allocate public transport where it is needed most.”
          </h2>
          <p className="text-xs text-blue-200/80 font-normal">
            SmartTransit AI Demonstration Prototype · Hackathon Presentation Edition
          </p>
        </div>
      </div>

      {/* 13. ROUTE DETAIL MODAL (Opens on row click) */}
      <RouteDetailModal
        route={selectedRoute}
        onClose={() => setSelectedRoute(null)}
        onApplyAllocation={handleApplyAllocation}
        isApplied={selectedRoute ? !!appliedAllocations[selectedRoute.id] : false}
      />

      {/* 14. BATCH FLEET DISPATCH MODAL */}
      <FleetDispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        routes={routes}
        onConfirmDispatch={handleConfirmBatchDispatch}
        isDispatched={isDispatched}
      />
    </div>
  );
};
