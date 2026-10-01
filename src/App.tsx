import React, { useState } from "react";
import { NavTab, SystemDataMode } from "./types";
import { Navbar } from "./components/Navbar";
import { HackathonDemoModal } from "./components/HackathonDemoModal";
import { PresentationOverlay } from "./components/PresentationOverlay";

import { ErrorBoundary } from "./components/ErrorBoundary";

// Pages
import { SmartTransitDashboard } from "./pages/SmartTransitDashboard";
import { AllocationSandbox } from "./pages/AllocationSandbox";
import { NetworkHeatmap } from "./pages/NetworkHeatmap";
import { DynamicHeadways } from "./pages/DynamicHeadways";
import { DispatchTerminal } from "./pages/DispatchTerminal";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("demand-forecast");
  const [systemMode, setSystemMode] = useState<SystemDataMode>("SIMULATED");
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);

  const handleApplyDemoState = (stepIndex: number) => {
    // Synchronize global dashboard states according to 10-step ITS scenario
    if (stepIndex >= 4) {
      setEmergencyActive(true);
    } else {
      setEmergencyActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Fixed Command Console Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        systemMode={systemMode}
        onToggleSystemMode={setSystemMode}
        presentationMode={presentationMode}
        onTogglePresentationMode={() => setPresentationMode(!presentationMode)}
        onTriggerDemo={() => setDemoModalOpen(true)}
        emergencyActive={emergencyActive}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 py-5 sm:px-6 sm:py-6">
        <ErrorBoundary fallbackTitle="Unable to display Demand Forecast">
          {currentTab === "demand-forecast" && <SmartTransitDashboard />}
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="Unable to display Allocation Sandbox">
          {currentTab === "allocation-sandbox" && <AllocationSandbox />}
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="Unable to display Demand Heatmap">
          {currentTab === "network-heatmap" && <NetworkHeatmap />}
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="Unable to display Dynamic Headways">
          {currentTab === "dynamic-headways" && <DynamicHeadways />}
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="Unable to display Dispatch Terminal">
          {currentTab === "dispatch-terminal" && <DispatchTerminal />}
        </ErrorBoundary>
      </main>

      {/* 10-Step Automated Hackathon Walkthrough Modal */}
      <HackathonDemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onApplyDemoState={handleApplyDemoState}
      />

      {/* Full-Screen Projector / Judge Presentation Mode */}
      {presentationMode && (
        <PresentationOverlay
          onClose={() => setPresentationMode(false)}
          onTriggerDemo={() => {
            setPresentationMode(false);
            setDemoModalOpen(true);
          }}
          tspActive={emergencyActive}
        />
      )}
    </div>
  );
}
