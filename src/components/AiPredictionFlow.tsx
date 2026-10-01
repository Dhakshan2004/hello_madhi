import React from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowDown,
  Database,
  Cpu,
  TrendingUp,
  Bus,
  RefreshCcw,
  CheckCircle2,
  Layers,
  Network
} from "lucide-react";

export const AiPredictionFlow: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Data Collection",
      sub: "Smart card taps, optical passenger counters, and historical headway logs.",
      icon: Database,
      tag: "Inputs",
    },
    {
      num: "02",
      title: "Pattern Analysis",
      sub: "Time-of-day clustering, seasonal baselines, and origin-destination matrices.",
      icon: Cpu,
      tag: "ML Pipeline",
    },
    {
      num: "03",
      title: "Demand Prediction",
      sub: "Forward-looking stochastic passenger volume forecast per 15-minute slot.",
      icon: TrendingUp,
      tag: "Forecast",
    },
    {
      num: "04",
      title: "Route & Time Analysis",
      sub: "Bottleneck identification and cross-corridor capacity deficit mapping.",
      icon: Layers,
      tag: "Corridor Eval",
    },
    {
      num: "05",
      title: "Bus Allocation",
      sub: "Optimization solver recommending exact fleet transfers between routes.",
      icon: Bus,
      tag: "Reallocation",
    },
    {
      num: "06",
      title: "Continuous Feedback",
      sub: "Real-time verification against onboard sensor telemetry to retrain model.",
      icon: RefreshCcw,
      tag: "Closed-Loop",
    },
  ];

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col">
      {/* Header */}
      <div className="pb-3 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-sans">
            AI Demand Prediction – Operational Flow
          </h3>
        </div>
        <p className="text-xs text-slate-600 mt-1 font-sans">
          The AI analyzes historical and current passenger patterns to forecast future demand across routes and time periods.
        </p>
      </div>

      {/* Primary 4-Stage Architecture Flow (Passenger Data -> AI -> Demand Forecast -> Bus Allocation) */}
      <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 mb-5">
        <div className="text-[11px] font-bold text-blue-900 uppercase font-mono tracking-wider mb-2.5">
          Core AI Prediction Pipeline
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 relative">
          {/* Stage 1 */}
          <div className="p-3 rounded-lg bg-white border border-blue-200/90 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Stage 1</span>
              <Database className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="font-bold text-slate-900 text-xs font-sans">Passenger Data</div>
            <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Turnstile taps, door counts &amp; transit GPS feeds.
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-3 rounded-lg bg-white border border-blue-200/90 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Stage 2</span>
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="font-bold text-slate-900 text-xs font-sans">AI / Machine Learning</div>
            <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Time-series regression &amp; commuter density patterns.
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-3 rounded-lg bg-white border border-blue-200/90 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Stage 3</span>
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="font-bold text-slate-900 text-xs font-sans">Demand Forecast</div>
            <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              High, medium, and low passenger predictions.
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-3 rounded-lg bg-white border border-blue-200/90 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Stage 4</span>
              <Bus className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="font-bold text-slate-900 text-xs font-sans">Bus Allocation</div>
            <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Automated vehicle distribution recommendations.
            </div>
          </div>
        </div>
      </div>

      {/* Detailed 6-Step Visual Process Diagram */}
      <div className="space-y-1.5">
        <div className="text-xs font-bold text-slate-800 font-sans flex items-center gap-1.5">
          <Network className="w-3.5 h-3.5 text-slate-500" />
          <span>Prediction Flow Architecture</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 pt-1">
          {steps.map((st, idx) => {
            const IconComponent = st.icon;

            return (
              <div
                key={st.num}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200/90 hover:border-blue-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-blue-600">
                      {st.num}
                    </span>
                    <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      {st.tag}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs font-sans mb-1">
                    {st.title}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    {st.sub}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-slate-400">
                  <IconComponent className="w-3.5 h-3.5 text-blue-600" />
                  {idx < steps.length - 1 ? (
                    <ArrowRight className="w-3 h-3 text-slate-400 hidden lg:block" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
