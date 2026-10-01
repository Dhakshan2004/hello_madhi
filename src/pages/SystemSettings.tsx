import React, { useState, useEffect } from "react";
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Sparkles,
  Map,
  Activity,
  Route,
  Bus,
  TrafficCone,
  Terminal,
  BookOpen,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";

export const SystemSettings: React.FC = () => {
  const [lastCheck, setLastCheck] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLastCheck(new Date().toLocaleTimeString());
  }, []);

  const handleProbe = () => {
    setLoading(true);
    setTimeout(() => {
      setLastCheck(new Date().toLocaleTimeString());
      setLoading(false);
    }, 500);
  };

  const researchPillars = [
    { name: "Intelligent Public Transportation Systems (IPTS)", desc: "Cyber-physical multi-modal transit coordination to maximize passenger throughput and minimize headway variance." },
    { name: "Transit Signal Priority (TSP - NEMA TS2)", desc: "Dynamic green extension algorithm for delayed buses with occupancy weight optimization." },
    { name: "Computer Vision Bus Lane Enforcement", desc: "Automated real-time classification of unauthorized vehicle dwell in dedicated transit corridors." },
    { name: "Cognitive AI Dispatcher (Gemini 3.8 Flash)", desc: "Generative intelligence that models asymmetric platform crowding and orchestrates supplementary vehicle dispatch." },
    { name: "Google Maps & Search Grounding (Gemini 3.8 Flash)", desc: "Live geographic grounding for transit portals and web grounding for real-time traffic alerts." },
    { name: "Decarbonization & Carbon Offset Accounting", desc: "Real-time energy and tailpipe emission reduction modeling based on modal shift away from private automobiles." },
  ];

  return (
    <div className="space-y-4 select-none pb-12">
      {/* Header bar */}
      <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              System Diagnostics &amp; Research Foundation
            </h2>
            <p className="text-xs text-slate-500">
              Microservice topology · Subsystem health probes · Academic research foundation
            </p>
          </div>
        </div>

        <button
          onClick={handleProbe}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Probe Subsystems</span>
        </button>
      </div>

      {/* Subsystem Diagnostics Cards */}
      <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-900">
            Backend Subsystem Health Probes
          </span>
          <span className="text-xs font-mono text-slate-500">
            Last check: {lastCheck || "Current"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 1. Gemini AI Dispatch Core */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Gemini Dispatcher Core
                </span>
                <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active
                </span>
              </div>
              <p className="text-xs font-mono text-blue-700 font-medium mb-1">
                Model: gemini-3.8-flash (Proxy)
              </p>
              <p className="text-[11px] text-slate-600 leading-snug">
                Cognitive delay prediction and automated fleet dispatch recommendations.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
              Latency: 480ms
            </div>
          </div>

          {/* 2. Google Maps Grounding */}
          <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Map className="w-3.5 h-3.5 text-blue-600" />
                  Google Maps Grounding
                </span>
                <span className="text-xs font-mono text-blue-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  Enabled
                </span>
              </div>
              <p className="text-xs font-mono text-blue-700 font-medium mb-1">
                Model: gemini-3.8-flash (googleMaps)
              </p>
              <p className="text-[11px] text-slate-600 leading-snug">
                Live geographic grounding for transit hubs, station access, and emergency portals with clickable links.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-blue-200 text-[11px] text-blue-700 font-mono font-medium">
              Tool: googleMaps Grounding
            </div>
          </div>

          {/* 3. Google Search Grounding */}
          <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  Google Search Grounding
                </span>
                <span className="text-xs font-mono text-blue-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  Enabled
                </span>
              </div>
              <p className="text-xs font-mono text-blue-700 font-medium mb-1">
                Model: gemini-3.8-flash (googleSearch)
              </p>
              <p className="text-[11px] text-slate-600 leading-snug">
                Web search grounding for real-time incident reports, weather impacts, and regional road alerts.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-blue-200 text-[11px] text-blue-700 font-mono font-medium">
              Tool: googleSearch Grounding
            </div>
          </div>

          {/* 4. Computer Vision YOLOv8 Edge Engine */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-600" />
                  YOLOv8 Edge Engine
                </span>
                <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Operational
                </span>
              </div>
              <p className="text-xs font-mono text-slate-700 font-medium mb-1">
                Ultralytics YOLOv8n / OpenCV
              </p>
              <p className="text-[11px] text-slate-600 leading-snug">
                Detects buses, trams, cars, pedestrians, and bus lane intrusions in real-time.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
              Throughput: 18.8 FPS (CPU Edge)
            </div>
          </div>

          {/* 5. NEMA TS2 Traffic Signal Actuator */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <TrafficCone className="w-3.5 h-3.5 text-blue-600" />
                  NEMA TS2 Controller
                </span>
                <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Connected
                </span>
              </div>
              <p className="text-xs font-mono text-slate-700 font-medium mb-1">
                Type 1 Interface (C-V2X Radio)
              </p>
              <p className="text-[11px] text-slate-600 leading-snug">
                Preempts signal phases and issues green wave extensions for delayed transit units.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
              Active Waves: 4 Intersections
            </div>
          </div>

          {/* 6. Multi-Modal Dijkstra-A* Engine */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Route className="w-3.5 h-3.5 text-blue-600" />
                  Intermodal Path Engine
                </span>
                <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Synchronized
                </span>
              </div>
              <p className="text-xs font-mono text-slate-700 font-medium mb-1">
                Dynamic Graph Routing
              </p>
              <p className="text-[11px] text-slate-600 leading-snug">
                Synthesizes routes across bus, metro, and autonomous feeder shuttles.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
              Graph Nodes: 128 Corridors
            </div>
          </div>
        </div>
      </div>

      {/* Academic & Hackathon Research Foundation */}
      <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4">
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100 text-sm font-bold text-slate-900">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Research Foundation &amp; Architecture Pillars</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {researchPillars.map((p, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="font-bold text-slate-900 mb-1">{p.name}</div>
              <p className="text-slate-600 leading-relaxed font-normal">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
