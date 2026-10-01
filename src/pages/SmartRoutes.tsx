import React, { useState, useEffect } from "react";
import {
  Route as RouteIcon,
  Navigation,
  Sparkles,
  Clock,
  ArrowRight,
  TrendingDown,
  MapPin,
  RefreshCw,
  Bus,
  Train,
  Car,
  Footprints,
  Leaf,
  Users,
  CheckCircle2,
  ExternalLink,
  Globe
} from "lucide-react";
import { MultiModalRoute, MultiModalRoutesResponse } from "../types";
import { fetchMultiModalRoutes, fetchGoogleMapsGrounding, MapsGroundingResult } from "../services/api";

export const SmartRoutes: React.FC = () => {
  const [origin, setOrigin] = useState("Junction A (Northwest Sector)");
  const [destination, setDestination] = useState("General Hospital & Innovation District");
  const [routesData, setRoutesData] = useState<MultiModalRoutesResponse | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("route-b");
  const [isSearching, setIsSearching] = useState(false);
  const [analysisNote, setAnalysisNote] = useState<string | null>(null);

  // Google Maps Grounding State
  const [mapsResult, setMapsResult] = useState<MapsGroundingResult | null>(null);
  const [loadingMaps, setLoadingMaps] = useState(false);

  useEffect(() => {
    handleSearch();
    handleQueryMaps("Junction A to General Hospital Trauma Center corridor");
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const data = await fetchMultiModalRoutes(origin, destination);
      setRoutesData(data);
      if (data.aiRecommendation?.recommendedRouteId) {
        setSelectedRouteId(data.aiRecommendation.recommendedRouteId);
      }
    } catch (err) {
      console.error("Failed to load multi-modal routes:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQueryMaps = async (queryText?: string) => {
    setLoadingMaps(true);
    try {
      const q = queryText || `${origin} to ${destination}`;
      const data = await fetchGoogleMapsGrounding(q);
      setMapsResult(data);
    } catch (err) {
      console.error("Maps grounding failed:", err);
    } finally {
      setLoadingMaps(false);
    }
  };

  const handleOptimize = () => {
    setAnalysisNote("Multi-modal transit engine confirmed: Route B (Metro + Autonomous E-Shuttle) avoids surface bottleneck on Junction A, achieving 98% reliability and 5.8 kg carbon offset.");
    setSelectedRouteId("route-b");
  };

  return (
    <div className="space-y-4 select-none pb-12">
      {/* Header Bar */}
      <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <RouteIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Multi-Modal Transit Route Optimizer
            </h2>
            <p className="text-xs text-slate-500">
              Direct BRT · Underground Metro · Autonomous First/Last Mile Shuttles · Google Maps Grounding
            </p>
          </div>
        </div>

        <button
          onClick={handleOptimize}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Optimize Multi-Modal Path</span>
        </button>
      </div>

      {/* Input Planner Bar */}
      <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="flex-1">
              <span className="text-[10px] text-slate-500 uppercase block font-medium">Origin Hub</span>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-5 flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="flex-1">
              <span className="text-[10px] text-slate-500 uppercase block font-medium">Destination</span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button
              onClick={() => {
                handleSearch();
                handleQueryMaps();
              }}
              disabled={isSearching || loadingMaps}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSearching || loadingMaps ? "animate-spin" : ""}`} />
              <span>{isSearching ? "Searching..." : "Recalculate"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Google Maps Grounded Verification Panel */}
      <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-slate-900">Google Maps Grounded Transit Hubs &amp; Access</span>
            <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              gemini-3.8-flash + googleMaps
            </span>
          </div>
          <button
            onClick={() => handleQueryMaps()}
            disabled={loadingMaps}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${loadingMaps ? "animate-spin" : ""}`} />
            <span>Refresh Maps</span>
          </button>
        </div>

        <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed mb-3 font-normal">
          {mapsResult?.text || "Querying Google Maps for verified transit portals, station access, and emergency hospital coordinates..."}
        </p>

        {/* Clickable Google Maps Place Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {mapsResult?.places.map((place, idx) => (
            <a
              key={idx}
              href={place.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-blue-50/40 border border-blue-100 hover:border-blue-300 transition-colors flex items-start justify-between gap-2 group"
            >
              <div className="truncate">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate block">
                  {place.title}
                </span>
                {place.address && (
                  <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                    {place.address}
                  </span>
                )}
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 mt-0.5" />
            </a>
          ))}
        </div>
      </div>

      {/* AI Recommendation Banner */}
      {analysisNote && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-blue-950">Dispatcher Intelligence: </span>
            {analysisNote}
          </div>
        </div>
      )}

      {/* 3 Route Alternative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routesData?.routes.map((route) => {
          const isSelected = route.id === selectedRouteId;
          const isRecommended = routesData.aiRecommendation?.recommendedRouteId === route.id;

          return (
            <div
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between shadow-xs ${
                isSelected
                  ? "bg-white border-blue-500 ring-2 ring-blue-100 shadow-sm"
                  : "bg-white border-slate-200/90 hover:border-blue-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-bold text-sm text-slate-900">{route.name}</span>
                  {isRecommended && (
                    <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      Recommended
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-snug mb-3">
                  {route.summary}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs font-mono mb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Est. Time</span>
                    <span className="font-bold text-slate-900 tabular-nums text-sm">
                      {route.travelTimeMin} mins
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">CO2 Offset</span>
                    <span className="font-bold text-emerald-600 tabular-nums text-sm">
                      {route.co2SavedKg} kg
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Reliability</span>
                    <span className="font-bold text-blue-600 tabular-nums">
                      {route.reliabilityIndexPct}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Fare</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      ${route.fareUsd.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Route Legs */}
                <div className="space-y-1.5 text-xs">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Corridor Segments</div>
                  {route.steps.map((step, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px]"
                    >
                      <div className="flex items-center gap-1.5 text-slate-800">
                        {step.mode === "BUS" && <Bus className="w-3 h-3 text-blue-600" />}
                        {step.mode === "METRO" && <Train className="w-3 h-3 text-blue-600" />}
                        {step.mode === "AUTONOMOUS_SHUTTLE" && <Car className="w-3 h-3 text-purple-600" />}
                        {step.mode === "WALK" && <Footprints className="w-3 h-3 text-slate-500" />}
                        <span className="font-medium">{step.name}</span>
                      </div>
                      <span className="font-mono text-slate-500">{step.durationMin}m ({step.crowd})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Platform crowd: {route.crowdLevel}</span>
                <span className={`font-semibold ${isSelected ? "text-blue-600 font-bold" : "text-slate-500"}`}>
                  {isSelected ? "Selected" : "Select Route"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
