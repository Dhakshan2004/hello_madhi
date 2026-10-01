export type ScenarioType = "NORMAL" | "RAIN" | "STADIUM_EVENT" | "UNIVERSITY_EXAM" | "HOLIDAY";

export interface ScenarioDefinition {
  id: ScenarioType;
  label: string;
  emoji: string;
  description: string;
  multiplier: number;
  highlightedRouteIds: string[];
  impactSummary: string;
  surgeFactor: string;
}

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: "NORMAL",
    label: "Normal Weekday",
    emoji: "☀️",
    description: "Standard morning & evening commuter peak hours across SIPCOT, colleges, and commercial textile hubs.",
    multiplier: 1.0,
    highlightedRouteIds: ["route-1", "route-4"],
    impactSummary: "Regular rush hour peaks at 8:00 AM (shift start) and 6:00 PM (market return).",
    surgeFactor: "+19.6% baseline peak",
  },
  {
    id: "RAIN",
    label: "Cauvery Monsoon Storm",
    emoji: "🌧️",
    description: "Heavy rainfall over Bhavani and Erode; cyclists and two-wheelers shift to public buses.",
    multiplier: 1.28,
    highlightedRouteIds: ["route-1", "route-2", "route-4"],
    impactSummary: "District-wide bus demand surges by +28%. Route 1A (Perundurai) requires +2 auxiliary buses.",
    surgeFactor: "+28% weather surge",
  },
  {
    id: "STADIUM_EVENT",
    label: "Texvalley Mega Fair",
    emoji: "🏬",
    description: "Weekly wholesale textile market day at Texvalley Chithode with thousands of regional buyers.",
    multiplier: 1.55,
    highlightedRouteIds: ["route-2", "route-5", "route-8"],
    impactSummary: "Extreme trade concentration on Route 5E & Route 2B (+55% surge during wholesale hours).",
    surgeFactor: "+55% market surge",
  },
  {
    id: "UNIVERSITY_EXAM",
    label: "College Exam Rush",
    emoji: "🎓",
    description: "Final semester exams across Velalar, IRT Medical, and Nandha Engineering campuses.",
    multiplier: 1.22,
    highlightedRouteIds: ["route-3", "route-1"],
    impactSummary: "Student peak on Route 3C Thindal Spine (11:00 AM–1:30 PM surges by +45%).",
    surgeFactor: "+22% student surge",
  },
  {
    id: "HOLIDAY",
    label: "Bhavani Kooduthurai Special",
    emoji: "🛕",
    description: "Pilgrim influx for temple holy dips; commuter demand shifts to Bhavani and Kodumudi river corridors.",
    multiplier: 1.35,
    highlightedRouteIds: ["route-2", "route-7"],
    impactSummary: "River belt devotee demand jumps by +35%. Surplus buses diverted from industrial corridors.",
    surgeFactor: "+35% temple surge",
  },
];

export interface StopQueueItem {
  id: string;
  name: string;
  corridor: string;
  waitingPassengers: number;
  capacityPct: number;
  avgDwellSec: number;
  status: "CRITICAL" | "MODERATE" | "NOMINAL";
  nextBusEtaMin: number;
}

export const STOP_BOTTLENECK_DATA: Record<string, StopQueueItem[]> = {
  "route-1": [
    { id: "s1-1", name: "Perundurai SIPCOT Phase-1 Gate (NH-544)", corridor: "NH-544 Industrial Corridor", waitingPassengers: 154, capacityPct: 98, avgDwellSec: 54, status: "CRITICAL", nextBusEtaMin: 2 },
    { id: "s1-2", name: "Thindal Murugan Hill / Velalar Junction", corridor: "NH-544 Industrial Corridor", waitingPassengers: 108, capacityPct: 82, avgDwellSec: 42, status: "MODERATE", nextBusEtaMin: 4 },
    { id: "s1-3", name: "Erode Collectorate & GH Bus Bay", corridor: "NH-544 Industrial Corridor", waitingPassengers: 72, capacityPct: 58, avgDwellSec: 35, status: "NOMINAL", nextBusEtaMin: 6 },
  ],
  "route-2": [
    { id: "s2-1", name: "Bhavani Sangameshwarar Kooduthurai Bus Stand", corridor: "Bhavani Textile Spine", waitingPassengers: 124, capacityPct: 92, avgDwellSec: 48, status: "CRITICAL", nextBusEtaMin: 2 },
    { id: "s2-2", name: "Lakshmi Nagar Textile Workers Stop", corridor: "Bhavani Textile Spine", waitingPassengers: 96, capacityPct: 76, avgDwellSec: 38, status: "MODERATE", nextBusEtaMin: 5 },
    { id: "s2-3", name: "Komarapalayam Bridge Checkpoint", corridor: "Bhavani Textile Spine", waitingPassengers: 52, capacityPct: 44, avgDwellSec: 28, status: "NOMINAL", nextBusEtaMin: 7 },
  ],
  "route-3": [
    { id: "s3-1", name: "Velalar College of Engineering & Tech Gate", corridor: "Thindal Educational Spine", waitingPassengers: 138, capacityPct: 94, avgDwellSec: 56, status: "CRITICAL", nextBusEtaMin: 2 },
    { id: "s3-2", name: "Sampath Nagar Municipal Interchange", corridor: "Thindal Educational Spine", waitingPassengers: 82, capacityPct: 68, avgDwellSec: 36, status: "MODERATE", nextBusEtaMin: 5 },
    { id: "s3-3", name: "Erode Railway Junction (East Terminal)", corridor: "Thindal Educational Spine", waitingPassengers: 58, capacityPct: 48, avgDwellSec: 30, status: "NOMINAL", nextBusEtaMin: 8 },
  ],
  "route-4": [
    { id: "s4-1", name: "Kavindapadi Sugarcane Market Yard", corridor: "SH-15 Agricultural Gateway", waitingPassengers: 146, capacityPct: 95, avgDwellSec: 58, status: "CRITICAL", nextBusEtaMin: 2 },
    { id: "s4-2", name: "Chithode NH-544 Flyover Interchange", corridor: "SH-15 Agricultural Gateway", waitingPassengers: 104, capacityPct: 80, avgDwellSec: 44, status: "MODERATE", nextBusEtaMin: 4 },
    { id: "s4-3", name: "Sathyamangalam Central Bus Stand", corridor: "SH-15 Agricultural Gateway", waitingPassengers: 64, capacityPct: 52, avgDwellSec: 32, status: "NOMINAL", nextBusEtaMin: 7 },
  ],
  "route-5": [
    { id: "s5-1", name: "Texvalley Wholesale Textile Mall Gate 1", corridor: "Texvalley Textile Belt", waitingPassengers: 118, capacityPct: 88, avgDwellSec: 46, status: "CRITICAL", nextBusEtaMin: 3 },
    { id: "s5-2", name: "Karungalpalayam Wholesale Market", corridor: "Texvalley Textile Belt", waitingPassengers: 84, capacityPct: 70, avgDwellSec: 38, status: "MODERATE", nextBusEtaMin: 6 },
    { id: "s5-3", name: "Solar New Bus Terminus South Bay", corridor: "Texvalley Textile Belt", waitingPassengers: 55, capacityPct: 46, avgDwellSec: 28, status: "NOMINAL", nextBusEtaMin: 9 },
  ],
};
