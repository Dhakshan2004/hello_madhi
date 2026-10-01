import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Play,
  Pause,
  RotateCcw,
  Video,
  Bus,
  Users,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Cpu,
  Car,
  ShieldAlert,
  CheckCircle2
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { TransitVisionResult } from "../types";
import { analyzeTransitVideo } from "../services/api";

const TRANSIT_DEMO_FEEDS = [
  {
    id: "corridor_traffic",
    name: "Feed 1: Corridor 4 Rapid Transit Flow",
    description: "Multi-modal corridor with BRT buses, commercial vans, and light rail crossings",
    duration: "0:24",
  },
  {
    id: "bus_stop_crowd",
    name: "Feed 2: Central Platform Crowd & Bus Lane Blockage",
    description: "Peak morning surge at Transfer Gate 3 with unauthorized car intrusion in Bus Lane 3",
    duration: "0:18",
  },
  {
    id: "mixed_ambulance",
    name: "Feed 3: Mixed Transit & Emergency Vehicle Junction",
    description: "Ambulance interacting with articulated bus priority corridor",
    duration: "0:30",
  },
];

export const TransitVision: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState(TRANSIT_DEMO_FEEDS[1].id);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TransitVisionResult | null>(null);
  const [showBoxes, setShowBoxes] = useState(true);
  const [playbackProgress, setPlaybackProgress] = useState(42);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    runAnalysis(selectedDemo);
  }, []);

  const runAnalysis = async (scenario: string, file?: File) => {
    setIsProcessing(true);
    try {
      const result = await analyzeTransitVideo(file || uploadedFile, scenario);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameCount = 0;

    const render = () => {
      frameCount++;

      // Clear Canvas
      ctx.fillStyle = "#09101f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Perspective Road Lanes
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1.5;

      // Horizon line
      ctx.beginPath();
      ctx.moveTo(0, 140);
      ctx.lineTo(canvas.width, 140);
      ctx.stroke();

      // Lane dividers
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 12]);
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.35, 140);
      ctx.lineTo(canvas.width * 0.1, canvas.height);
      ctx.moveTo(canvas.width * 0.5, 140);
      ctx.lineTo(canvas.width * 0.5, canvas.height);
      ctx.moveTo(canvas.width * 0.65, 140);
      ctx.lineTo(canvas.width * 0.9, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dedicated Bus Lane Red Texture
      ctx.fillStyle = "rgba(239, 68, 68, 0.12)";
      ctx.fillRect(canvas.width * 0.68, 140, canvas.width * 0.32, canvas.height - 140);

      // Bus Lane text
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.fillText("BUS ONLY LANE", canvas.width * 0.72, 280);

      // Draw Animated Vehicles
      const offset = (frameCount * 1.5) % 180;

      // 1. Articulated Transit Bus
      const busY = 170 + (offset * 0.6);
      const busX = 140 - (offset * 0.2);
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.roundRect(busX, busY, 110, 52, 6);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.fillText("LINE 4 BRT", busX + 16, busY + 30);

      // 2. Intruder Car in Bus Lane
      const carX = 510;
      const carY = 220;
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.roundRect(carX, carY, 68, 38, 4);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.fillText("7XY-419", carX + 10, carY + 23);

      // 3. Platform Commuters Cluster
      ctx.fillStyle = "rgba(245, 158, 11, 0.8)";
      for (let i = 0; i < 18; i++) {
        const px = 40 + (i % 6) * 12;
        const py = 160 + Math.floor(i / 6) * 16;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw YOLO Bounding Boxes
      if (showBoxes) {
        // Bus Box
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.strokeRect(busX - 6, busY - 6, 122, 64);
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(busX - 6, busY - 24, 110, 18);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px 'JetBrains Mono', monospace";
        ctx.fillText("publicBus 0.96", busX - 2, busY - 11);

        // Intrusion Box (Red)
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(carX - 4, carY - 4, 76, 46);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(carX - 4, carY - 22, 140, 18);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("LANE INTRUSION 0.94", carX, carY - 9);

        // Platform Crowd Box (Amber)
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 148, 85, 60);
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(30, 130, 125, 18);
        ctx.fillStyle = "#000000";
        ctx.font = "bold 10px 'JetBrains Mono', monospace";
        ctx.fillText("CROWD +88% LOAD", 34, 143);
      }

      if (isPlaying) {
        setPlaybackProgress((prev) => (prev >= 100 ? 0 : prev + 0.4));
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, showBoxes]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setSelectedDemo(file.name);
      runAnalysis("custom", file);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPlaybackProgress(0);
  };

  const vehicleChartData = [
    { name: "Public Bus", count: analysisResult?.vehicles?.publicBus || 4, fill: "#2563eb" },
    { name: "Passenger Car", count: analysisResult?.vehicles?.car || 28, fill: "#64748b" },
    { name: "Pedestrians", count: analysisResult?.vehicles?.pedestrian || 44, fill: "#f59e0b" },
    { name: "Minibus/Van", count: analysisResult?.vehicles?.minibusVan || 3, fill: "#0284c7" },
    { name: "Light Tram", count: analysisResult?.vehicles?.tram || 2, fill: "#8b5cf6" },
    { name: "Ambulance", count: analysisResult?.vehicles?.ambulance || 1, fill: "#ef4444" },
  ];

  return (
    <div className="space-y-4 select-none pb-12">
      {/* Header Bar */}
      <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Transit Vision &amp; Platform Crowd Analyzer
            </h2>
            <p className="text-xs text-slate-500">
              Edge YOLOv8 object detection · Bus lane intrusion enforcement · Real-time platform queue density
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Edge Engine Online (18.8 FPS)
          </span>
        </div>
      </div>

      {/* Main Grid: Stream Player (7 cols) + Inferred Telemetry (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Player & Video Selector */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Player Card */}
          <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>Ingest: {uploadedFile ? uploadedFile.name : selectedDemo.replace("_", " ").toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBoxes(!showBoxes)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors ${
                    showBoxes ? "bg-blue-50 text-blue-700 border-blue-300 font-semibold" : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  Boxes: {showBoxes ? "Visible" : "Hidden"}
                </button>
                <span className="text-xs font-mono text-slate-500">1080p @ 30 FPS</span>
              </div>
            </div>

            {/* Interactive Canvas Viewport */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-[#09101f] shadow-inner">
              <canvas
                ref={canvasRef}
                width={700}
                height={400}
                className="w-full h-full object-cover"
              />

              {isProcessing && (
                <div className="absolute inset-0 bg-[#070b14]/85 backdrop-blur-sm flex flex-col items-center justify-center text-blue-400 font-mono gap-2.5">
                  <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-semibold tracking-wide text-white">
                    Running YOLOv8 Public Transit Model...
                  </span>
                  <span className="text-xs text-slate-400">
                    Scanning for bus lane intrusions &amp; platform crowds
                  </span>
                </div>
              )}

              {/* Progress Bar */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-800">
                <div
                  className="h-full bg-blue-500 transition-all duration-200"
                  style={{ width: `${playbackProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between pt-3 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? "Pause" : "Play Stream"}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
                  title="Reset video playback"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => runAnalysis(selectedDemo)}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze Transit Stream</span>
              </button>
            </div>
          </div>

          {/* Preset Selector & File Upload */}
          <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs p-4">
            <div className="text-xs font-bold text-slate-900 mb-2.5">
              Select Preset Video Feeds or Upload MP4
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
              {TRANSIT_DEMO_FEEDS.map((feed) => {
                const isSelected = selectedDemo === feed.id && !uploadedFile;
                return (
                  <div
                    key={feed.id}
                    onClick={() => {
                      setSelectedDemo(feed.id);
                      setUploadedFile(null);
                      runAnalysis(feed.id);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors text-xs ${
                      isSelected
                        ? "bg-blue-50/80 border-blue-400 ring-2 ring-blue-100"
                        : "bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-white"
                    }`}
                  >
                    <div className="font-bold text-slate-900 mb-1">{feed.name}</div>
                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                      {feed.description}
                    </p>
                    <div className="mt-2 text-[10px] text-slate-400 font-mono">
                      Duration: {feed.duration}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Upload Area */}
            <label className="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 cursor-pointer text-xs text-slate-600 transition-colors">
              <Upload className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Upload Video (.mp4, .webm, .mov)</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Right Column: Inferred Telemetry */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Transit Congestion</div>
              <div className="my-1.5 font-mono text-2xl font-bold text-slate-900 tabular-nums">
                {analysisResult?.transitLaneCongestionPct || 74}%
              </div>
              <div className="text-[11px] text-amber-600 font-mono font-medium">Heavy corridor demand</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Platform Crowd Load</div>
              <div className="my-1.5 font-mono text-2xl font-bold text-amber-600 tabular-nums">
                {analysisResult?.platformCrowdDensityPct || 88}%
              </div>
              <div className="text-[11px] text-slate-500 font-mono">142 Waiting at Gate 3</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Total Detections</div>
              <div className="my-1.5 font-mono text-2xl font-bold text-blue-600 tabular-nums">
                {analysisResult?.vehicleCount || 81}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">Units in frame</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Bus Lane Intrusion</div>
              <div className="my-1.5 font-mono text-xl font-bold text-rose-600 tabular-nums">
                1 Flagged
              </div>
              <div className="text-[11px] text-rose-600 font-mono font-medium">Dwell: 1m 45s</div>
            </div>
          </div>

          {/* Vehicle Distribution Chart */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 text-xs">
              <span className="font-bold text-slate-900">Detected Unit Classification</span>
              <span className="font-mono text-slate-500">YOLOv8 Class ID</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vehicleChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "8px", fontSize: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {vehicleChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bus Lane Intrusion Violation Notice */}
          <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-xs">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Bus Lane Intrusion Enforcement</span>
            </div>
            <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-600">Target Vehicle:</span>
                <span className="text-slate-900 font-bold">Sedan (Lic: 7XY-419)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Location:</span>
                <span className="text-slate-800">Corridor 4, Lane 3 Red Zone</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Violation Dwell Time:</span>
                <span className="text-rose-600 font-bold">1 min 45 sec</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-rose-200">
                <span className="text-slate-600">Action:</span>
                <span className="text-emerald-700 font-bold">Citation #BL-8812 Logged</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
