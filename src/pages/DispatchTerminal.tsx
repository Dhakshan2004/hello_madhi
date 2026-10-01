import React, { useState, useEffect } from "react";
import { DEMO_ROUTES } from "../data/transitDemoData";
import {
  Terminal,
  Send,
  Download,
  CheckCircle2,
  AlertCircle,
  Radio,
  Bus,
  Clock,
  RotateCcw,
  Sparkles,
  FileText,
  Volume2,
  VolumeX
} from "lucide-react";
import { speakTransitBriefing, stopTransitBriefing } from "../utils/speechDispatcher";

interface DispatchLogEntry {
  id: string;
  time: string;
  busId: string;
  originRoute: string;
  targetRoute: string;
  headwayAdjustment: string;
  status: "TRANSMITTED" | "ACKNOWLEDGED" | "EN_ROUTE" | "ON_STATION";
}

const INITIAL_LOGS: DispatchLogEntry[] = [
  {
    id: "DSP-8821",
    time: "08:14:22",
    busId: "Bus #402",
    originRoute: "Route C (Downtown Inner Loop)",
    targetRoute: "Route A (Airport Express)",
    headwayAdjustment: "15 min → 6 min (-9 min headway)",
    status: "ON_STATION",
  },
  {
    id: "DSP-8822",
    time: "08:16:05",
    busId: "Bus #405",
    originRoute: "Central Depot Standby",
    targetRoute: "Route A (Airport Express)",
    headwayAdjustment: "Capacity injection +75 seats",
    status: "EN_ROUTE",
  },
  {
    id: "DSP-8823",
    time: "08:18:40",
    busId: "Bus #603",
    originRoute: "Route F (Harbor Tram)",
    targetRoute: "Route D (Tech Park Feeder)",
    headwayAdjustment: "18 min → 7 min (-11 min headway)",
    status: "ACKNOWLEDGED",
  },
  {
    id: "DSP-8824",
    time: "08:21:12",
    busId: "Bus #702",
    originRoute: "East Yard Standby",
    targetRoute: "Route G (Waterfront / Stadium)",
    headwayAdjustment: "20 min → 8 min (-12 min headway)",
    status: "TRANSMITTED",
  },
];

export const DispatchTerminal: React.FC = () => {
  const [logs, setLogs] = useState<DispatchLogEntry[]>(INITIAL_LOGS);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleBroadcastAll = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setLogs((prev) =>
        prev.map((log) => ({
          ...log,
          status: "ON_STATION",
        }))
      );
      setIsBroadcasting(false);
    }, 1500);
  };

  const handleDownloadManifest = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Order ID,Time,Bus ID,From Route,To Route,Headway Impact,Status\n" +
      logs
        .map(
          (l) =>
            `${l.id},${l.time},${l.busId},"${l.originRoute}","${l.targetRoute}","${l.headwayAdjustment}",${l.status}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SmartTransit_Dispatch_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const handleVoiceBriefing = () => {
    if (isSpeaking) {
      stopTransitBriefing();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const text =
        "SmartTransit Dispatch Operations: Dispatch Manifest DSP-8820 active. Four dynamic reallocations transmitted to Central Depot. Bus 402 and Bus 405 en route to Airport Express. Passenger headway reduced to 6 minutes.";
      speakTransitBriefing(text, () => setIsSpeaking(false));
    }
  };

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wide">
              CAD / AVL Fleet Dispatch Console
            </span>
            <span className="text-xs text-slate-400">· Computer-Aided Dispatch Telemetry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Live Fleet Rebalancing &amp; Dispatch Terminal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Transmit AI-recommended bus reallocation orders directly to depot dispatchers and onboard driver terminal consoles.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleVoiceBriefing}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isSpeaking
                ? "bg-amber-400 text-slate-900 border-amber-300 animate-pulse"
                : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? "Stop Voice" : "Voice Dispatch"}</span>
          </button>

          <button
            onClick={handleBroadcastAll}
            disabled={isBroadcasting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-xs transition-colors"
          >
            <Radio className={`w-3.5 h-3.5 ${isBroadcasting ? "animate-spin" : ""}`} />
            <span>{isBroadcasting ? "Transmitting..." : "Broadcast Orders"}</span>
          </button>

          <button
            onClick={handleDownloadManifest}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-sans text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Dispatch manifest exported successfully as CSV!</span>
        </div>
      )}

      {/* Terminal View */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Active Rebalancing Telemetry Feed (CAD/AVL Stream)
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Radio Protocol: V2X NEMA TS2 Standard</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Time</th>
                <th className="py-3 px-4 font-semibold">Vehicle</th>
                <th className="py-3 px-4 font-semibold">Origin Location</th>
                <th className="py-3 px-4 font-semibold">Target Route Assignment</th>
                <th className="py-3 px-4 font-semibold">Headway Impact</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                    {log.id}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {log.time}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <Bus className="w-3.5 h-3.5 text-blue-600" />
                    <span>{log.busId}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {log.originRoute}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {log.targetRoute}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600">
                    {log.headwayAdjustment}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        log.status === "ON_STATION"
                          ? "bg-emerald-100 text-emerald-800"
                          : log.status === "EN_ROUTE"
                          ? "bg-blue-100 text-blue-800 animate-pulse"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {log.status === "ON_STATION" && <CheckCircle2 className="w-3 h-3" />}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
