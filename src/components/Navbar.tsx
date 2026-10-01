import React, { useState, useEffect } from "react";
import { NavTab, SystemDataMode } from "../types";
import {
  TrendingUp,
  Sliders,
  Flame,
  Clock,
  Terminal,
  Presentation,
  Play,
  Bus,
  Volume2,
  VolumeX
} from "lucide-react";
import { speakTransitBriefing, stopTransitBriefing } from "../utils/speechDispatcher";

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  systemMode: SystemDataMode;
  onToggleSystemMode: (mode: SystemDataMode) => void;
  presentationMode: boolean;
  onTogglePresentationMode: () => void;
  onTriggerDemo: () => void;
  emergencyActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  systemMode,
  onToggleSystemMode,
  presentationMode,
  onTogglePresentationMode,
  onTriggerDemo,
  emergencyActive,
}) => {
  const [utcTime, setUtcTime] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toTimeString().split(" ")[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopTransitBriefing();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const text =
        "Welcome to SmartTransit AI – Erode District transit operations. Monitoring 8 primary corridors including Perundurai SIPCOT, Bhavani Kooduthurai, Thindal Velalar, and Sathyamangalam. Projected peak demand is 14,850 passengers. Fleet rebalancing recommended for Route 1A and Route 4D.";
      speakTransitBriefing(text, () => setIsSpeaking(false));
    }
  };

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; dot?: boolean }[] = [
    { id: "demand-forecast", label: "Demand Forecast", icon: TrendingUp },
    { id: "allocation-sandbox", label: "Allocation Sandbox", icon: Sliders },
    { id: "network-heatmap", label: "Demand Heatmap", icon: Flame },
    { id: "dynamic-headways", label: "Dynamic Headways", icon: Clock },
    { id: "dispatch-terminal", label: "Dispatch Terminal", icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* 3-Zone Clean Top Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Distinctive Clean Brand */}
        <div
          onClick={() => onSelectTab("demand-forecast")}
          className="flex items-center gap-2.5 shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Bus className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-slate-900 font-sans">
              SmartTransit <span className="text-blue-600 font-bold">AI</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 whitespace-nowrap">
              Erode District, TN
            </span>
          </div>
        </div>

        {/* Zone 2: Clean Segmented Tabs in Blue & White (Desktop View) */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs font-semibold"
                    : "text-slate-600 hover:text-blue-600 hover:bg-white"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span>{item.label}</span>
                {item.dot && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white" : "bg-rose-500"} animate-pulse`}></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & System Status */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Subtle Live Clock */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 font-mono px-2 py-1 bg-slate-100 rounded-lg border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="tabular-nums font-semibold">{utcTime}</span>
          </div>

          {/* Clean Mode Switch */}
          <button
            onClick={() => onToggleSystemMode(systemMode === "SIMULATED" ? "REAL_API" : "SIMULATED")}
            className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium border border-blue-200 bg-blue-50/70 text-blue-700 hover:bg-blue-100/70 transition-colors"
            title="Toggle between Live Simulated telemetry and Node/YOLO Backend"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${systemMode === "SIMULATED" ? "bg-emerald-500" : "bg-blue-600"}`}></span>
            <span className="font-mono text-[11px] font-semibold">{systemMode === "SIMULATED" ? "Simulated" : "Real API"}</span>
          </button>

          {/* Voice Briefing Audio Button */}
          <button
            onClick={handleToggleVoice}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isSpeaking
                ? "bg-amber-100 border-amber-300 text-amber-900 animate-pulse font-semibold"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
            title="Read out AI Dispatch Voice Announcement"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
            <span className="hidden md:inline">{isSpeaking ? "Mute" : "Voice AI"}</span>
          </button>

          {/* Presentation Mode Toggle */}
          <button
            onClick={onTogglePresentationMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              presentationMode
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
            title="Toggle Judge Presentation View"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Judge View</span>
          </button>

          {/* Run Demo Button */}
          <button
            onClick={onTriggerDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold tracking-tight transition-colors shadow-xs"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Live Demo</span>
          </button>
        </div>
      </div>

      {/* Horizontal Navigation Tabs (Visible on screens below XL) */}
      <div className="xl:hidden px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-200 bg-white shadow-2xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-blue-600 text-white font-medium shadow-xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.dot && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
            </button>
          );
        })}
      </div>

      {/* Dynamic Rebalancing Notification if active */}
      {emergencyActive && (
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-1 text-xs text-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="font-semibold font-mono">AI FLEET REBALANCING ACTIVE:</span>
            <span className="text-slate-700 truncate">Capacity injection active on Route A (+2 buses) and Route G (+2 buses) · -49% wait reduction</span>
          </div>
          <span className="text-[11px] text-blue-700 shrink-0 font-mono font-semibold">Dynamic Headway Control</span>
        </div>
      )}
    </header>
  );
};
