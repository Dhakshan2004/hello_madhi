import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { HourlyDemandPoint } from "../data/transitDemoData";
import { Clock, TrendingUp, Sparkles } from "lucide-react";

interface DemandChartProps {
  data: HourlyDemandPoint[];
  selectedRouteName?: string;
  selectedTimeFilter?: string;
  onSelectTime?: (time: string) => void;
}

export const DemandChart: React.FC<DemandChartProps> = ({
  data,
  selectedRouteName = "All City Routes (System-Wide)",
  selectedTimeFilter,
  onSelectTime,
}) => {
  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between">
      {/* Chart Title and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-sans">
              Demand Overview – Passenger Forecast by Time Period
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Scope: <span className="font-semibold text-blue-700">{selectedRouteName}</span> · Comparing Current Passengers vs AI Predicted Demand
          </p>
        </div>

        {/* Peak Callouts */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            Morning Peak: 8:00 AM (4,650 Pax)
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            Evening Peak: 6:00 PM (5,100 Pax)
          </span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-64 sm:h-72 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              fontFamily="Poppins, sans-serif"
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              fontFamily="JetBrains Mono, monospace"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const currentVal = (payload.find((p) => p.dataKey === "current")?.value as number) ?? 0;
                  const predictedVal = (payload.find((p) => p.dataKey === "predicted")?.value as number) ?? 0;
                  const diff = predictedVal - currentVal;
                  const diffPct = currentVal > 0 ? ((diff / currentVal) * 100).toFixed(1) : "0.0";

                  return (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-md text-xs font-sans">
                      <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1.5 flex items-center justify-between gap-3">
                        <span>Time: {label}</span>
                        {label === "8:00 AM" || label === "6:00 PM" ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-100 text-rose-700 font-bold">
                            PEAK PERIOD
                          </span>
                        ) : null}
                      </div>
                      <div className="space-y-1 font-mono">
                        <div className="flex items-center justify-between gap-4 text-emerald-600">
                          <span>Current Passengers:</span>
                          <span className="font-bold">{currentVal.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-blue-600">
                          <span>Predicted Demand:</span>
                          <span className="font-bold">{predictedVal.toLocaleString()}</span>
                        </div>
                        <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-4 text-slate-700">
                          <span>Projected Surge:</span>
                          <span className={`font-bold ${diff > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                            {diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()} ({diffPct}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              height={32}
              formatter={(value) => {
                return (
                  <span className="text-xs font-medium text-slate-700 font-sans">
                    {value === "predicted" ? "Predicted Passenger Demand" : "Current Passenger Volume"}
                  </span>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="predicted"
              name="predicted"
              stroke="#2563eb"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#predictedGradient)"
              activeDot={{ r: 6, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="current"
              name="current"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#currentGradient)"
              activeDot={{ r: 5, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Time Period Selector Pills below chart */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Click a time period to inspect:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {data.map((item) => {
            const isSelected = selectedTimeFilter === item.time;
            const isPeak = item.isPeak;

            return (
              <button
                key={item.time}
                onClick={() => onSelectTime && onSelectTime(item.time)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white font-bold shadow-xs"
                    : isPeak
                    ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-semibold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {item.time}
                {isPeak && <span className="ml-1 text-[9px] uppercase font-bold text-rose-600">Peak</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
