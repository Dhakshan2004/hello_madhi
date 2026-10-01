import React, { useState } from "react";
import {
  Car,
  Eye,
  Cpu,
  Brain,
  Navigation,
  Radio,
  Crosshair,
  Shield,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Users,
  Bus
} from "lucide-react";

export const AutonomousTransit: React.FC = () => {
  const [selectedSensor, setSelectedSensor] = useState<string>("lidar");
  const [selectedLevel, setSelectedLevel] = useState<number>(4);

  const transitShuttleSpecs = [
    { label: "Vehicle Model", val: "AeroShuttle L4 Autonomous Pod" },
    { label: "Passenger Capacity", val: "14 Commuters (8 Seated + 6 Standing)" },
    { label: "Operational Speed", val: "35 km/h (Geofenced Transit Corridor)" },
    { label: "Powertrain", val: "100% Electric LFP Battery (180 km range)" },
    { label: "Accessibility", val: "Automated ADA Low-Floor Ramp" },
    { label: "V2X Telemetry", val: "DSRC / Cellular-V2X 5.9 GHz" },
  ];

  const sensors = [
    { id: "lidar", name: "Surround 3D Solid-State LiDAR", range: "250m", hz: "20 Hz", role: "Centimeter-accurate 3D point cloud for platform curb docking and passenger clearance", color: "#2563eb" },
    { id: "camera", name: "Multi-Spectral Optical HD Camera Array", range: "160m", hz: "60 FPS", role: "Traffic signal aspect detection, pedestrian intention analysis, and lane boundary classification", color: "#0284c7" },
    { id: "radar", name: "4D Imaging Radar (Doppler Array)", range: "300m", hz: "30 Hz", role: "Penetrates adverse fog/rain to measure radial velocity of surrounding vehicles", color: "#38bdf8" },
    { id: "v2x", name: "C-V2X Roadside Communication Beacon", range: "500m", hz: "10 Hz", role: "Direct digital handshake with traffic controllers for guaranteed green phase extensions", color: "#10b981" },
    { id: "ultrasonic", name: "Ultrasonic Proximity Sensors", range: "6m", hz: "40 Hz", role: "Blind-spot passenger door pinch prevention and tight terminal maneuvering", color: "#f59e0b" },
    { id: "imu", name: "High-Precision RTK-GNSS + Dual IMU", range: "Global", hz: "100 Hz", role: "Dead-reckoning localization accurate to 2 centimeters without satellite lock", color: "#8b5cf6" },
  ];

  const saeLevels = [
    { level: 0, title: "No Automation", desc: "Human operator steers, brakes, and collects passenger fares manually." },
    { level: 1, title: "Driver Assistance", desc: "Lane Keep Assist or Adaptive Cruise on highway transit stretches." },
    { level: 2, title: "Partial Driving Automation", desc: "Co-pilot automated steering and headway control; human monitors 100%." },
    { level: 3, title: "Conditional Automation", desc: "Autonomous transit on dedicated busways; driver intervenes on alert." },
    { level: 4, title: "High Automation (AeroShuttle)", desc: "Full autonomous driverless transit inside designated geofenced corridor ODD." },
    { level: 5, title: "Full Automation", desc: "Zero driver requirement under all weather and unmapped street conditions." },
  ];

  return (
    <div className="space-y-4 select-none pb-12">
      {/* Header Bar */}
      <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Autonomous Transit &amp; Sensor Fusion (SAE L4)
            </h2>
            <p className="text-xs text-slate-500">
              AeroShuttle first/last mile deployment · 360° perception stack · C-V2X roadside coordination
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-blue-700 font-semibold px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
          Geofenced Transit ODD: Active
        </span>
      </div>

      {/* Main Grid: Sensor Visualizer (7 cols) + Pod Hardware Specs (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: 360 Perception Visualizer */}
        <div className="lg:col-span-7 rounded-xl bg-white border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-900">
              360° Environmental Perception Visualizer
            </span>
            <span className="text-xs font-mono text-slate-500">LiDAR · Radar · Optics</span>
          </div>

          {/* Clean Light Radar Diagram */}
          <div className="relative w-full h-[280px] sm:h-[320px] rounded-xl overflow-hidden border border-slate-200 bg-[#f8fafc] flex items-center justify-center">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {/* Concentric distance rings */}
              <circle cx="150" cy="150" r="130" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="150" cy="150" r="95" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              <circle cx="150" cy="150" r="60" fill="none" stroke="#cbd5e1" strokeWidth="1.2" />
              <circle cx="150" cy="150" r="25" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />

              {/* Sensor Perception Beams */}
              {selectedSensor === "lidar" && (
                <path d="M 150 150 L 50 40 A 130 130 0 0 1 250 40 Z" fill="#2563eb" fillOpacity="0.15" stroke="#2563eb" strokeWidth="1.5" />
              )}
              {selectedSensor === "camera" && (
                <path d="M 150 150 L 80 50 A 100 100 0 0 1 220 50 Z" fill="#0284c7" fillOpacity="0.2" stroke="#0284c7" strokeWidth="1.5" />
              )}
              {selectedSensor === "radar" && (
                <path d="M 150 150 L 30 150 A 130 130 0 0 1 270 150 Z" fill="#38bdf8" fillOpacity="0.18" stroke="#38bdf8" strokeWidth="1.5" />
              )}

              {/* Shuttle Vehicle Representation */}
              <rect x="140" y="135" width="20" height="30" rx="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
              <text x="150" y="153" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
                POD
              </text>
            </svg>

            <div className="absolute bottom-3 inset-x-3 flex justify-between text-xs font-mono bg-white/90 backdrop-blur-xs p-2 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-slate-600">Selected: <strong className="text-blue-700">{sensors.find(s => s.id === selectedSensor)?.name}</strong></span>
              <span className="text-slate-900 font-semibold">{sensors.find(s => s.id === selectedSensor)?.range}</span>
            </div>
          </div>

          {/* Sensor Select Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {sensors.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSensor(s.id)}
                className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                  selectedSensor === s.id
                    ? "bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-100 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="font-bold truncate">{s.name}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{s.range} · {s.hz}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Shuttle Hardware Specifications */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-5">
            <div className="text-sm font-bold text-slate-900 pb-2 mb-3 border-b border-slate-100">
              AeroShuttle L4 Technical Specifications
            </div>

            <div className="space-y-2 font-mono text-xs">
              {transitShuttleSpecs.map((spec, idx) => (
                <div key={idx} className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500">{spec.label}</span>
                  <span className="text-slate-900 font-bold">{spec.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SAE Levels Selector */}
          <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-5 flex-1">
            <div className="text-sm font-bold text-slate-900 pb-2 mb-3 border-b border-slate-100">
              SAE Automation Levels (0–5)
            </div>

            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {saeLevels.map((lvl) => (
                <button
                  key={lvl.level}
                  onClick={() => setSelectedLevel(lvl.level)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedLevel === lvl.level
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  L{lvl.level}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-slate-800">
              <div className="font-bold text-blue-900 mb-1">
                Level {selectedLevel}: {saeLevels[selectedLevel].title}
              </div>
              <p className="text-slate-700 leading-relaxed font-normal">
                {saeLevels[selectedLevel].desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
