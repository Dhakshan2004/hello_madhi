import React, { useState } from "react";
import { RefreshCw, CheckCircle2, ChevronRight, X } from "lucide-react";

interface StepDetail {
  id: number;
  title: string;
  sub: string;
  metric: string;
  description: string;
}

export const FeedbackLoop: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps: StepDetail[] = [
    {
      id: 1,
      title: "1. Optical Perception",
      sub: "CCTV feeds, induction loops & C-V2X",
      metric: "38 Feeds Active",
      description: "Optical road cameras, platform passenger counters, and vehicle telemetry stream raw spatial data into edge aggregators.",
    },
    {
      id: 2,
      title: "2. Edge Detection",
      sub: "YOLOv8 bounding box inference",
      metric: "18.8 FPS Edge",
      description: "Classifies buses, trams, autonomous shuttles, cars, and platform crowds while detecting bus lane intrusions.",
    },
    {
      id: 3,
      title: "3. Delay Prediction",
      sub: "Gemini 3.8 Flash stochastic synthesis",
      metric: "94% Confidence",
      description: "Generative AI dispatcher models platform overcrowding surges and projects downstream delay curves.",
    },
    {
      id: 4,
      title: "4. Signal Actuation",
      sub: "TSP green wave extension & feeder dispatch",
      metric: "+17s Green Wave",
      description: "Actuates NEMA TS2 intersection controllers to extend green phase for trailing buses and dispatches standby shuttles.",
    },
    {
      id: 5,
      title: "5. Closed-Loop Audit",
      sub: "Schedule recovery reinjection",
      metric: "-4.2m Variance",
      description: "Post-actuation speed recovery and cleared platform queues are reinjected into the sensor matrix to refine predictive weights.",
    },
  ];

  return (
    <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4 select-none">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <RefreshCw className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Autonomous Closed-Loop Feedback Pipeline
          </h3>
        </div>
        <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Cycle: 1.2s Real-Time
        </span>
      </div>

      {/* 5-Step Horizontal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {steps.map((s) => {
          const isSelected = activeStep === s.id;
          return (
            <div
              key={s.id}
              onClick={() => setActiveStep(isSelected ? null : s.id)}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-blue-50/70 border-blue-400 ring-2 ring-blue-100"
                  : "bg-slate-50 border-slate-200/90 hover:border-blue-300 hover:bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-bold text-xs text-slate-900">{s.title}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                  {s.sub}
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-[11px] font-mono font-semibold text-blue-700">
                {s.metric}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Step Modal/Drawer if clicked */}
      {activeStep && (
        <div className="mt-3 p-3.5 rounded-lg bg-blue-50/80 border border-blue-200 text-xs text-slate-800 flex items-start justify-between gap-3 animate-fadeIn">
          <div>
            <div className="font-bold text-blue-900 mb-1">
              {steps.find((s) => s.id === activeStep)?.title}
            </div>
            <p className="text-slate-700 leading-relaxed">
              {steps.find((s) => s.id === activeStep)?.description}
            </p>
          </div>
          <button
            onClick={() => setActiveStep(null)}
            className="text-slate-400 hover:text-slate-600 shrink-0 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
