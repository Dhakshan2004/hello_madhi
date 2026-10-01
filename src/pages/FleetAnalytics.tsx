import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  Clock,
  Bus,
  Users,
  Leaf
} from "lucide-react";

type TimeframeFilter = "morning_peak" | "midday" | "evening_peak" | "7d_trend";

export const FleetAnalytics: React.FC = () => {
  const [filter, setFilter] = useState<TimeframeFilter>("morning_peak");

  // Chart 1: Hourly Ridership Demand vs Fleet Capacity Supply
  const ridershipData = [
    { hour: "06:00", passengerDemand: 820, busSupplyCapacity: 1200 },
    { hour: "07:00", passengerDemand: 2450, busSupplyCapacity: 2600 },
    { hour: "08:00", passengerDemand: 4120, busSupplyCapacity: 3800 },
    { hour: "09:00", passengerDemand: 4680, busSupplyCapacity: 4100 },
    { hour: "10:00", passengerDemand: 2850, busSupplyCapacity: 3400 },
    { hour: "11:00", passengerDemand: 1920, busSupplyCapacity: 2600 },
    { hour: "12:00", passengerDemand: 2350, busSupplyCapacity: 2800 },
    { hour: "13:00", passengerDemand: 2180, busSupplyCapacity: 2600 },
    { hour: "14:00", passengerDemand: 2420, busSupplyCapacity: 2800 },
    { hour: "15:00", passengerDemand: 3380, busSupplyCapacity: 3600 },
    { hour: "16:00", passengerDemand: 4240, busSupplyCapacity: 4100 },
    { hour: "17:00", passengerDemand: 4820, busSupplyCapacity: 4300 },
    { hour: "18:00", passengerDemand: 3910, busSupplyCapacity: 4000 },
  ];

  // Chart 2: Punctuality and Delay Trends Across 5 Transit Corridors
  const punctualityData = [
    { corridor: "Corridor 1 (Metro Spine)", onTimePct: 94.2, avgDelayMin: 0.8 },
    { corridor: "Corridor 2 (University)", onTimePct: 89.6, avgDelayMin: 1.8 },
    { corridor: "Corridor 3 (Tram Loop)", onTimePct: 81.4, avgDelayMin: 3.4 },
    { corridor: "Corridor 4 (Airport BRT)", onTimePct: 76.2, avgDelayMin: 5.2 },
    { corridor: "Corridor 5 (Harbor Autonomous)", onTimePct: 98.1, avgDelayMin: -0.4 },
  ];

  // Chart 3: Carbon Offset Analytics (Cumulative kg CO2 avoided)
  const carbonData = [
    { day: "Mon", co2AvoidedKg: 1420 },
    { day: "Tue", co2AvoidedKg: 1680 },
    { day: "Wed", co2AvoidedKg: 1850 },
    { day: "Thu", co2AvoidedKg: 1790 },
    { day: "Fri", co2AvoidedKg: 2140 },
    { day: "Sat", co2AvoidedKg: 1250 },
    { day: "Sun", co2AvoidedKg: 980 },
  ];

  // Chart 4: Public Transit vs Private Road Share
  const roadShareData = [
    { name: "Public EV Buses", value: 42, color: "#2563eb" },
    { name: "Light Rail / Trams", value: 24, color: "#0284c7" },
    { name: "Autonomous Shuttles", value: 14, color: "#8b5cf6" },
    { name: "Private Vehicles", value: 20, color: "#ef4444" },
  ];

  return (
    <div className="space-y-4 select-none pb-12">
      {/* Top Header */}
      <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Transit Fleet Intelligence &amp; Performance Analytics
            </h2>
            <p className="text-xs text-slate-500">
              Corridor punctuality · Capacity utilization · Decarbonization metrics
            </p>
          </div>
        </div>

        {/* Filter Pills in Blue & White */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
          <button
            onClick={() => setFilter("morning_peak")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === "morning_peak" ? "bg-blue-600 text-white font-semibold shadow-xs" : "text-slate-600 hover:text-blue-600"
            }`}
          >
            Morning Peak
          </button>
          <button
            onClick={() => setFilter("midday")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === "midday" ? "bg-blue-600 text-white font-semibold shadow-xs" : "text-slate-600 hover:text-blue-600"
            }`}
          >
            Midday
          </button>
          <button
            onClick={() => setFilter("evening_peak")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === "evening_peak" ? "bg-blue-600 text-white font-semibold shadow-xs" : "text-slate-600 hover:text-blue-600"
            }`}
          >
            Evening Peak
          </button>
          <button
            onClick={() => setFilter("7d_trend")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === "7d_trend" ? "bg-blue-600 text-white font-semibold shadow-xs" : "text-slate-600 hover:text-blue-600"
            }`}
          >
            7-Day Trend
          </button>
        </div>
      </div>

      {/* 2x2 Clean Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Ridership Demand vs Capacity */}
        <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Hourly Passenger Demand vs Fleet Supply Capacity
              </h3>
              <p className="text-xs text-slate-500">
                Identifies asymmetric platform crowding spikes during peak commute hours
              </p>
            </div>
            <Users className="w-4 h-4 text-blue-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ridershipData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="blueDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="supplyCap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "8px", fontSize: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
                />
                <Area type="monotone" dataKey="passengerDemand" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#blueDemand)" name="Pax Demand" />
                <Area type="monotone" dataKey="busSupplyCapacity" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#supplyCap)" name="Fleet Capacity" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Punctuality Across 5 Corridors */}
        <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Corridor Punctuality &amp; On-Time Adherence
              </h3>
              <p className="text-xs text-slate-500">
                Percentage of trips operating within ±2 minutes of schedule
              </p>
            </div>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={punctualityData} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" domain={[60, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis type="category" dataKey="corridor" stroke="#64748b" fontSize={11} tickLine={false} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "8px", fontSize: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
                />
                <Bar dataKey="onTimePct" fill="#2563eb" radius={[0, 4, 4, 0]} name="On-Time %">
                  {punctualityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.onTimePct > 90 ? "#10b981" : entry.onTimePct > 80 ? "#2563eb" : "#f59e0b"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Weekly Carbon Offset */}
        <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Decarbonization: Cumulative CO2 Avoided
              </h3>
              <p className="text-xs text-slate-500">
                Carbon reduction achieved via modal shift from private automobiles to electric transit
              </p>
            </div>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={carbonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "8px", fontSize: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
                />
                <Bar dataKey="co2AvoidedKg" fill="#10b981" radius={[4, 4, 0, 0]} name="kg CO2 Avoided" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Road Share Breakdown */}
        <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Corridor Passenger Modal Share
              </h3>
              <p className="text-xs text-slate-500">
                Current passenger throughput split by mode category
              </p>
            </div>
            <Bus className="w-4 h-4 text-blue-600" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roadShareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {roadShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "8px", fontSize: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-100">
            {roadShareData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span>{item.name}: <strong>{item.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
