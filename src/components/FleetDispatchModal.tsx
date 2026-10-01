import React from "react";
import { RouteDemandItem } from "../data/transitDemoData";
import { X, CheckCircle2, Bus, FileText, Printer, ArrowRight, ShieldCheck, Download } from "lucide-react";

interface FleetDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  routes: RouteDemandItem[];
  onConfirmDispatch: () => void;
  isDispatched: boolean;
}

export const FleetDispatchModal: React.FC<FleetDispatchModalProps> = ({
  isOpen,
  onClose,
  routes,
  onConfirmDispatch,
  isDispatched,
}) => {
  if (!isOpen) return null;

  const totalShifts = routes.filter((r) => r.delta !== 0);
  const totalBusesAdded = routes.reduce((acc, r) => acc + (r.delta > 0 ? r.delta : 0), 0);
  const totalBusesTrimmed = routes.reduce((acc, r) => acc + (r.delta < 0 ? Math.abs(r.delta) : 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Fleet Dispatch &amp; Reallocation Manifest
              </h3>
              <p className="text-xs text-slate-500">
                Automated multi-route fleet transfer order for transit operations center
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

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs font-sans">
          {/* Summary Banner */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <div>
                <span className="font-bold text-slate-900 block">Fleet Rebalancing Order #DSP-8820</span>
                <span className="text-[11px] text-slate-600">
                  {totalShifts.length} routes adjusted · +{totalBusesAdded} buses injected · -{totalBusesTrimmed} buses optimized
                </span>
              </div>
            </div>
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-blue-300 text-blue-700">
              Net Fleet Neutral (Balanced)
            </span>
          </div>

          {/* Allocation Manifest Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase font-mono border-b border-slate-200">
                  <th className="py-2.5 px-3">Route</th>
                  <th className="py-2.5 px-3">Demand Forecast</th>
                  <th className="py-2.5 px-3">Current Fleet</th>
                  <th className="py-2.5 px-3">Recommended</th>
                  <th className="py-2.5 px-3">Fleet Delta</th>
                  <th className="py-2.5 px-3">Order Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {routes.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900 font-sans">
                      {r.name} ({r.corridor})
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-700">
                      {r.predictedDemand} Pax
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {r.currentBuses} buses
                    </td>
                    <td className="py-2.5 px-3 font-bold text-blue-700">
                      {r.recommendedBuses} buses
                    </td>
                    <td className="py-2.5 px-3 font-bold">
                      <span
                        className={
                          r.delta > 0
                            ? "text-rose-600"
                            : r.delta < 0
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }
                      >
                        {r.delta > 0 ? `+${r.delta}` : r.delta}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isDispatched
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {isDispatched ? "DISPATCHED" : "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirmDispatch();
            }}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
              isDispatched
                ? "bg-emerald-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isDispatched ? "Manifest Dispatched to Drivers" : "Authorize & Transmit Fleet Order"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
