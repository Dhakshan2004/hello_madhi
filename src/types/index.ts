export type NavTab =
  | "demand-forecast"
  | "allocation-sandbox"
  | "network-heatmap"
  | "dynamic-headways"
  | "dispatch-terminal";

export type SystemDataMode = "SIMULATED" | "REAL_API";

export interface DetectionBox {
  box: number[]; // [ymin, xmin, ymax, xmax] or [x1, y1, x2, y2]
  confidence: number;
  label: string;
  isIntrusion?: boolean; // private vehicle in dedicated bus lane
}

export interface TransitVisionResult {
  dataSource: "LIVE_YOLO_EDGE" | "DEMO_DATA";
  isSimulated: boolean;
  transitLaneCongestionPct: number;
  platformCrowdDensityPct: number;
  estimatedPassengerQueue: number;
  busLaneIntrusionsDetected: number;
  intrusionAlerts: {
    vehicleType: string;
    lane: string;
    plateSnippet: string;
    confidence: number;
  }[];
  vehicleCount: number;
  vehicles: {
    publicBus: number;
    minibusVan: number;
    tram: number;
    car: number;
    motorcycle: number;
    bicycle: number;
    pedestrian: number;
    ambulance?: number;
  };
  averageTransitSpeedKmh: number;
  confidence: number;
  prediction: string;
  detections: DetectionBox[];
  note?: string;
}

export interface MultiModalRoute {
  id: string;
  name: string;
  modeCategory: "DIRECT_BUS" | "METRO_AUTONOMOUS" | "MIXED_TRANSIT";
  distanceKm: number;
  travelTimeMin: number;
  co2SavedKg: number;
  reliabilityIndexPct: number;
  crowdLevel: "LOW" | "MODERATE" | "HIGH";
  fareUsd: number;
  tspEnabled: boolean;
  isAiRecommended: boolean;
  summary: string;
  transfers: number;
  steps: {
    mode: "BUS" | "METRO" | "AUTONOMOUS_SHUTTLE" | "WALK";
    name: string;
    durationMin: number;
    crowd: string;
  }[];
}

export interface MultiModalRoutesResponse {
  origin: string;
  destination: string;
  generatedAt: string;
  routes: MultiModalRoute[];
  aiRecommendation: {
    recommendedRouteId: string;
    rationale: string;
    carbonSavingsTotalKg: number;
    timeAdvantageMin: number;
  };
}

export interface IntersectionApproach {
  name: string;
  vehicleCount: number;
  queueLengthM: number;
  currentSignal: "RED" | "YELLOW" | "GREEN";
  greenDurationSec: number;
  hasPriorityVehicle: boolean;
  priorityVehicleType?: "PUBLIC_BUS" | "EMERGENCY_AMBULANCE" | "NONE";
}

export interface SignalPriorityState {
  intersectionId: string;
  name: string;
  mode: "STANDARD" | "TSP_ACTIVE" | "EMERGENCY_PREEMPTION";
  activePriorityType: "NONE" | "TSP_BUS" | "EMERGENCY_AMBULANCE";
  cycleTimeSec: number;
  currentPhaseRemainingSec: number;
  approaches: {
    north: IntersectionApproach;
    south: IntersectionApproach;
    east: IntersectionApproach;
    west: IntersectionApproach;
  };
  activeBus: {
    id: string;
    route: string;
    delayMin: number;
    passengerCount: number;
    distanceToJunctionM: number;
    etaSec: number;
    targetJunction: string;
  };
  tspMetrics: {
    normalGreenSec: number;
    extendedGreenSec: number;
    scheduleRecoveryMin: number;
    dwellTimeReducedSec: number;
  };
}

export interface GeminiTransitDispatchInsight {
  summary: string;
  cause: string;
  prediction: string;
  dispatchAction: string;
  priorityLevel: "CRITICAL" | "MODERATE" | "OPTIMAL";
  confidence: number;
  source?: string;
  isLiveAI?: boolean;
}

export interface TransitFleetTelemetry {
  timestamp: string;
  systemState: string;
  activeFleetCount: number;
  activeStandbyBuses: number;
  networkOnTimeRatePct: number;
  delayedVehiclesCount: number;
  passengerPlatformLoadPct: number;
  totalWaitingPassengers: number;
  averageTransitSpeedKmh: number;
  nominalSpeedKmh: number;
  activeTspRequestsCount: number;
  activeDisruptionAlertsCount: number;
  corridors: {
    id: string;
    name: string;
    congestionPct: number;
    avgSpeedKmh: number;
    activeBuses: number;
    headwayMin: number;
    status: "ON_TIME" | "DELAYED" | "CRITICAL";
  }[];
  activeBuses: {
    id: string;
    line: string;
    vehicleType: "Double-Decker EV" | "Articulated Bus" | "Light Tram" | "Autonomous Shuttle";
    currentSpeedKmh: number;
    occupancyPct: number;
    delayMin: number;
    nextStop: string;
    lat: number;
    lng: number;
    tspRequested: boolean;
  }[];
  disruptions: {
    id: string;
    title: string;
    corridor: string;
    type: "LANE_INTRUSION" | "OVERCROWDING" | "SIGNAL_LAG" | "VEHICLE_STALL";
    severity: "HIGH" | "MEDIUM" | "LOW";
    reportedAgoMin: number;
  }[];
}
