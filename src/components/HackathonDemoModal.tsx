import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Bus,
  X,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Database,
  Cpu,
  Send,
  Leaf
} from "lucide-react";

interface HackathonDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDemoState: (stepIndex: number) => void;
}

interface StepItem {
  number: number;
  title: string;
  category: string;
  telemetry: string;
  actionText: string;
}

const SMART_TRANSIT_STEPS: StepItem[] = [
  {
    number: 1,
    title: "Collect Smart-Card & Turnstile Passenger Data",
    category: "Data Ingestion",
    telemetry: "12,420 Current Commuters Tally · 8 Monitored City Routes",
    actionText: "Automatic passenger counters (APC) & faregate tap velocity streams ingested",
  },
  {
    number: 2,
    title: "Pattern Analysis & Peak Surge Detection",
    category: "ML Analytics",
    telemetry: "Morning Peak (7:00–9:00 AM) · +38% Surge Magnitude Detected",
    actionText: "Time-series clustering flags commuter concentration on Route A and Route D",
  },
  {
    number: 3,
    title: "Run Stochastic Demand Forecasting Engine",
    category: "Demand Forecast",
    telemetry: "Predicted Passenger Volume: 14,850 Pax/Day (+19.6% System Load)",
    actionText: "Categorizes lines: Route A, D, G as HIGH DEMAND; Route C, F as LOW DEMAND",
  },
  {
    number: 4,
    title: "Generate Optimal Bus Reallocation Plan",
    category: "Fleet Balancing",
    telemetry: "Net Fleet Neutral (48 Active Units) · Dynamic Capacity Transfer",
    actionText: "Transfers underutilized buses from Route C & F (-1 each) to Route A & G (+2 each)",
  },
  {
    number: 5,
    title: "Authorize & Dispatch Fleet Manifest (#DSP-8820)",
    category: "Depot Dispatch",
    telemetry: "Order Broadcast to Central Operations & Onboard CAD/AVL Tablets",
    actionText: "Buses rerouted to high-demand corridors prior to platform queue buildup",
  },
  {
    number: 6,
    title: "Verify Measurable Commuter Impact & ROI",
    category: "Outcome Audit",
    telemetry: "-49% Wait Time (11.4m → 5.8m) · -84% Overcrowding · +2,450 kg CO2 Offset",
    actionText: "Closed-loop feedback completes: Passenger throughput maximized with zero extra fleet cost",
  },
];

export const HackathonDemoModal: React.FC<HackathonDemoModalProps> = ({
  isOpen,
  onClose,
  onApplyDemoState,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setCurrentStep(0);
    setIsPlaying(true);
    onApplyDemoState(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < SMART_TRANSIT_STEPS.length - 1) {
        const next = currentStep + 1;
        setCurrentStep(next);
        onApplyDemoState(next);
      } else {
        setIsPlaying(false);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [isOpen, isPlaying, currentStep]);

  if (!isOpen) return null;

  const activeStep = SMART_TRANSIT_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < SMART_TRANSIT_STEPS.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      onApplyDemoState(next);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(true);
    onApplyDemoState(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-150 font-sans">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                SmartTransit AI – Automated Presentation Walkthrough
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Step-by-step end-to-end demonstration for hackathon judges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Step Hero View */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                STEP {activeStep.number} OF {SMART_TRANSIT_STEPS.length}
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                [{activeStep.category}]
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>{isPlaying ? "Auto-Advancing" : "Paused"}</span>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {activeStep.title}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {activeStep.actionText}
            </p>
          </div>

          {/* Telemetry Display Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-blue-900 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{activeStep.telemetry}</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-600 h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${((currentStep + 1) / SMART_TRANSIT_STEPS.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Step Pill Navigation */}
          <div className="grid grid-cols-6 gap-1.5 pt-1">
            {SMART_TRANSIT_STEPS.map((step, idx) => (
              <button
                key={step.number}
                onClick={() => {
                  setCurrentStep(idx);
                  onApplyDemoState(idx);
                }}
                className={`py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                  idx === currentStep
                    ? "bg-blue-600 text-white shadow-xs"
                    : idx < currentStep
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                0{step.number}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNext}
              disabled={currentStep >= SMART_TRANSIT_STEPS.length - 1}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors shadow-xs"
            >
              <span>Next Step</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
