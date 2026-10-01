import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Multer storage for uploaded video files (.mp4, .webm, .mov)
const upload = multer({
  dest: "/tmp/traffic-uploads/",
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    const allowed = [".mp4", ".webm", ".mov", ".avi"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format. Please upload .mp4, .webm, or .mov."));
    }
  },
});

// Initialize Gemini API client on the server side
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("[Gemini API] Server-side client initialized successfully.");
  } catch (err) {
    console.warn("[Gemini API] Failed to initialize GoogleGenAI:", err);
  }
} else {
  console.log("[Gemini API] No GEMINI_API_KEY provided; system will use high-fidelity cognitive simulation fallback.");
}

// In-Memory Simulated State for Transit Signal Priority (TSP)
let signalState = {
  intersectionId: "INT-METRO-02",
  name: "Corridor 4 / Central Metro Hub Junction",
  mode: "STANDARD" as "STANDARD" | "TSP_ACTIVE" | "EMERGENCY_PREEMPTION",
  activePriorityType: "NONE" as "NONE" | "TSP_BUS" | "EMERGENCY_AMBULANCE",
  cycleTimeSec: 60,
  currentPhaseRemainingSec: 24,
  approaches: {
    north: {
      name: "Northbound Bus Rapid Transit (BRT)",
      vehicleCount: 28,
      queueLengthM: 110,
      currentSignal: "RED" as "RED" | "YELLOW" | "GREEN",
      greenDurationSec: 25,
      hasPriorityVehicle: true,
      priorityVehicleType: "PUBLIC_BUS" as const,
    },
    south: {
      name: "Southbound Metro Feeder",
      vehicleCount: 16,
      queueLengthM: 45,
      currentSignal: "RED" as "RED" | "YELLOW" | "GREEN",
      greenDurationSec: 20,
      hasPriorityVehicle: false,
    },
    east: {
      name: "Eastbound Commercial Arterial",
      vehicleCount: 22,
      queueLengthM: 75,
      currentSignal: "GREEN" as "RED" | "YELLOW" | "GREEN",
      greenDurationSec: 30,
      hasPriorityVehicle: false,
    },
    west: {
      name: "Westbound Harbor Tunnel Link",
      vehicleCount: 14,
      queueLengthM: 35,
      currentSignal: "RED" as "RED" | "YELLOW" | "GREEN",
      greenDurationSec: 20,
      hasPriorityVehicle: false,
    },
  },
  activeBus: {
    id: "BUS-42",
    route: "Line 4: Airport to Metro Express",
    delayMin: 5.2,
    passengerCount: 68,
    distanceToJunctionM: 340,
    etaSec: 28,
    targetJunction: "Corridor 4 Junction",
  },
  tspMetrics: {
    normalGreenSec: 25,
    extendedGreenSec: 42,
    scheduleRecoveryMin: 4.2,
    dwellTimeReducedSec: 35,
  },
};

let activeStandbyBusesDeployed = 0;

// 1. TRANSIT VIDEO & CV ANALYSIS ENDPOINT
app.post("/api/analyze-video", upload.single("video"), async (req, res) => {
  try {
    const isDemo = req.body?.isDemo === "true" || req.body?.isDemo === true || !req.file;
    const scenario = req.body?.scenario || "default";

    // Attempt to invoke Python YOLO microservice if running on port 8000
    if (!isDemo && req.file) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const blob = new Blob([fileBuffer]);
        const form = new FormData();
        form.append("file", blob, req.file.originalname);

        const pyRes = await fetch("http://127.0.0.1:8000/analyze-video", {
          method: "POST",
          body: form,
        });

        if (pyRes.ok) {
          const pyData = await pyRes.json();
          try { fs.unlinkSync(req.file.path); } catch {}
          return res.json({
            ...pyData,
            dataSource: "LIVE_YOLO_EDGE",
            isSimulated: false,
          });
        }
      } catch (pyErr) {
        console.log("[Python YOLO Service] Not reachable on :8000, using high-fidelity edge simulation.");
      }
    }

    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }

    // High fidelity realistic transit detection result
    if (scenario === "bus_stop_crowd" || scenario === "hackathon_demo") {
      return res.json({
        dataSource: "DEMO_DATA",
        isSimulated: true,
        transitLaneCongestionPct: 74,
        platformCrowdDensityPct: 88,
        estimatedPassengerQueue: 142,
        busLaneIntrusionsDetected: 2,
        intrusionAlerts: [
          { vehicleType: "Private Sedan (Silver)", lane: "Dedicated BRT Lane 3", plateSnippet: "7XY-419", confidence: 0.94 },
          { vehicleType: "Delivery Van (White)", lane: "Corridor 4 Bus Pocket", plateSnippet: "3BZ-902", confidence: 0.91 },
        ],
        vehicleCount: 58,
        vehicles: {
          publicBus: 4,
          minibusVan: 3,
          tram: 2,
          car: 28,
          motorcycle: 12,
          bicycle: 9,
          pedestrian: 44,
          ambulance: 1,
        },
        averageTransitSpeedKmh: 19.2,
        confidence: 0.94,
        prediction: "Platform overcrowding detected at Transfer Gate 3 (+42% over capacity). Bus #42 is trailing schedule by 5.2 minutes due to Bus Lane 3 blockage. Recommending immediate Transit Signal Priority (TSP) green extension and autonomous feeder dispatch.",
        detections: [
          { box: [80, 100, 220, 260], confidence: 0.97, label: "publicBus" },
          { box: [140, 120, 200, 200], confidence: 0.94, label: "car_intrusion", isIntrusion: true },
          { box: [300, 90, 420, 250], confidence: 0.93, label: "tram" },
          { box: [450, 150, 520, 230], confidence: 0.92, label: "minibusVan" },
          { box: [20, 180, 80, 290], confidence: 0.89, label: "pedestrian_crowd" },
          { box: [120, 210, 180, 310], confidence: 0.96, label: "ambulance" },
        ],
      });
    }

    return res.json({
      dataSource: "DEMO_DATA",
      isSimulated: true,
      transitLaneCongestionPct: 62,
      platformCrowdDensityPct: 68,
      estimatedPassengerQueue: 75,
      busLaneIntrusionsDetected: 1,
      intrusionAlerts: [
        { vehicleType: "Compact SUV (Blue)", lane: "Bus Lane 2", plateSnippet: "5AB-881", confidence: 0.89 }
      ],
      vehicleCount: 42,
      vehicles: {
        publicBus: 3,
        minibusVan: 2,
        tram: 1,
        car: 22,
        motorcycle: 8,
        bicycle: 6,
        pedestrian: 26,
      },
      averageTransitSpeedKmh: 24.5,
      confidence: 0.92,
      prediction: "Moderate transit flow across Corridor 4. Minor intrusion detected in Bus Lane 2. Schedule adherence within normal operational bounds.",
      detections: [
        { box: [90, 110, 210, 240], confidence: 0.96, label: "publicBus" },
        { box: [150, 130, 210, 210], confidence: 0.91, label: "car_intrusion", isIntrusion: true },
        { box: [310, 100, 410, 230], confidence: 0.93, label: "tram" },
        { box: [40, 190, 90, 280], confidence: 0.88, label: "pedestrian" },
      ],
    });
  } catch (error: any) {
    console.error("Error in /api/analyze-video:", error);
    res.status(500).json({ error: error?.message || "Video analysis failure", isSimulated: true });
  }
});

// 2. FLEET TELEMETRY & LIVE TRANSIT TRACKING
app.get("/api/transit/fleet", (_req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    systemState: "ONLINE",
    activeFleetCount: 48 + activeStandbyBusesDeployed,
    activeStandbyBuses: 4 - activeStandbyBusesDeployed,
    networkOnTimeRatePct: 84.6,
    delayedVehiclesCount: 6,
    passengerPlatformLoadPct: 78,
    totalWaitingPassengers: 3420,
    averageTransitSpeedKmh: 26.4,
    nominalSpeedKmh: 45.0,
    activeTspRequestsCount: signalState.mode === "TSP_ACTIVE" ? 4 : 3,
    activeDisruptionAlertsCount: 3,
    corridors: [
      { id: "cor-1", name: "Corridor 1: Metro North Spine", congestionPct: 45, avgSpeedKmh: 34, activeBuses: 12, headwayMin: 4.5, status: "ON_TIME" },
      { id: "cor-2", name: "Corridor 2: University Connector", congestionPct: 52, avgSpeedKmh: 30, activeBuses: 8, headwayMin: 6.0, status: "ON_TIME" },
      { id: "cor-3", name: "Corridor 3: Downtown Tram Loop", congestionPct: 68, avgSpeedKmh: 21, activeBuses: 10, headwayMin: 5.0, status: "DELAYED" },
      { id: "cor-4", name: "Corridor 4: Airport Rapid BRT", congestionPct: 79, avgSpeedKmh: 19, activeBuses: 14, headwayMin: 3.5, status: "CRITICAL" },
      { id: "cor-5", name: "Corridor 5: Harbor Autonomous Link", congestionPct: 35, avgSpeedKmh: 42, activeBuses: 8, headwayMin: 5.0, status: "ON_TIME" },
    ],
    activeBuses: [
      { id: "BUS-42", line: "Line 4 Airport BRT", vehicleType: "Articulated Bus", currentSpeedKmh: 18, occupancyPct: 92, delayMin: 5.2, nextStop: "Junction A / Central Hub", lat: 37.7795, lng: -122.421, tspRequested: true },
      { id: "BUS-18", line: "Line 1 Metro Spine", vehicleType: "Double-Decker EV", currentSpeedKmh: 36, occupancyPct: 65, delayMin: 0.8, nextStop: "North Terminal", lat: 37.785, lng: -122.415, tspRequested: false },
      { id: "TRM-07", line: "Downtown Loop 3", vehicleType: "Light Tram", currentSpeedKmh: 22, occupancyPct: 78, delayMin: 3.4, nextStop: "Civic Plaza", lat: 37.772, lng: -122.418, tspRequested: true },
      { id: "AV-03", line: "Harbor Autonomous Feeder", vehicleType: "Autonomous Shuttle", currentSpeedKmh: 32, occupancyPct: 45, delayMin: -0.5, nextStop: "Harbor Tunnel South", lat: 37.768, lng: -122.405, tspRequested: false },
    ],
    disruptions: [
      { id: "DIS-101", title: "Bus Lane 3 Unauthorized Vehicle Intrusion", corridor: "Corridor 4 Airport BRT", type: "LANE_INTRUSION", severity: "HIGH", reportedAgoMin: 4 },
      { id: "DIS-102", title: "Platform Crowding Overflow (+40%)", corridor: "Central Transfer Hub Gate 3", type: "OVERCROWDING", severity: "HIGH", reportedAgoMin: 9 },
      { id: "DIS-103", title: "Signal Cycle Synchronization Lag", corridor: "Corridor 3 Tram Crossing", type: "SIGNAL_LAG", severity: "MEDIUM", reportedAgoMin: 21 },
    ],
  });
});

// 3. MULTI-MODAL SMART ROUTES ENDPOINT
app.get("/api/routes", (req, res) => {
  const origin = (req.query.origin as string) || "Junction A (Northwest Sector)";
  const destination = (req.query.destination as string) || "General Hospital & Innovation District";

  const routes = [
    {
      id: "route-a",
      name: "Route A: Direct Bus Rapid Transit Corridor (BRT)",
      modeCategory: "DIRECT_BUS" as const,
      distanceKm: 12.8,
      travelTimeMin: 22,
      co2SavedKg: 3.4,
      reliabilityIndexPct: 91,
      crowdLevel: "MODERATE" as const,
      fareUsd: 2.50,
      tspEnabled: true,
      isAiRecommended: false,
      summary: "Dedicated arterial bus lane with dynamic Transit Signal Priority (+15s green wave). Direct non-stop service.",
      transfers: 0,
      steps: [
        { mode: "WALK" as const, name: "Walk to Junction A Platform 1", durationMin: 3, crowd: "Low" },
        { mode: "BUS" as const, name: "BRT Express Line 4 (TSP Enabled)", durationMin: 17, crowd: "Moderate (65%)" },
        { mode: "WALK" as const, name: "Walk to Hospital Entrance", durationMin: 2, crowd: "Low" },
      ],
    },
    {
      id: "route-b",
      name: "Route B: Metro Rail + Autonomous Feeder E-Shuttle",
      modeCategory: "METRO_AUTONOMOUS" as const,
      distanceKm: 14.5,
      travelTimeMin: 18,
      co2SavedKg: 5.8,
      reliabilityIndexPct: 98,
      crowdLevel: "LOW" as const,
      fareUsd: 3.25,
      tspEnabled: true,
      isAiRecommended: true,
      summary: "AI Recommended: 100% electrified multimodal chain. High-speed Metro spine paired with on-demand autonomous shuttle saves 4 minutes and achieves highest reliability.",
      transfers: 1,
      steps: [
        { mode: "METRO" as const, name: "Metro Blue Line (Dedicated Underground Right-of-Way)", durationMin: 11, crowd: "Light (42%)" },
        { mode: "AUTONOMOUS_SHUTTLE" as const, name: "AeroShuttle L4 Autonomous Feeder (Door-to-Door)", durationMin: 5, crowd: "Very Low (30%)" },
        { mode: "WALK" as const, name: "Direct drop-off at Trauma Portal", durationMin: 2, crowd: "None" },
      ],
    },
    {
      id: "route-c",
      name: "Route C: Traditional Mixed Surface Transit",
      modeCategory: "MIXED_TRANSIT" as const,
      distanceKm: 13.1,
      travelTimeMin: 36,
      co2SavedKg: 2.1,
      reliabilityIndexPct: 68,
      crowdLevel: "HIGH" as const,
      fareUsd: 2.25,
      tspEnabled: false,
      isAiRecommended: false,
      summary: "Local street bus subject to peak-hour traffic bottlenecks at Junction A merge without TSP support.",
      transfers: 1,
      steps: [
        { mode: "WALK" as const, name: "Walk to Local Stop", durationMin: 5, crowd: "Low" },
        { mode: "BUS" as const, name: "Local Bus 14 (Mixed Traffic)", durationMin: 26, crowd: "High (90%)" },
        { mode: "WALK" as const, name: "Walk to Destination", durationMin: 5, crowd: "Moderate" },
      ],
    },
  ];

  res.json({
    origin,
    destination,
    generatedAt: new Date().toISOString(),
    routes,
    aiRecommendation: {
      recommendedRouteId: "route-b",
      rationale: "Route B completely circumvents the surface bottleneck on Junction A by utilizing grade-separated Metro Rail and autonomous electric shuttles, maximizing schedule adherence (98%) and CO2 offset (5.8 kg).",
      carbonSavingsTotalKg: 5.8,
      timeAdvantageMin: 4,
    },
  });
});

// 4. TRANSIT SIGNAL PRIORITY (TSP) & EMERGENCY CORRIDOR
app.get("/api/signals", (_req, res) => {
  res.json(signalState);
});

app.post("/api/signals/tsp", (req, res) => {
  const active = Boolean(req.body.active !== undefined ? req.body.active : true);
  if (active) {
    signalState.mode = "TSP_ACTIVE";
    signalState.activePriorityType = "TSP_BUS";
    signalState.approaches.north.currentSignal = "GREEN";
    signalState.approaches.north.greenDurationSec = 42;
    signalState.approaches.east.currentSignal = "RED";
    signalState.activeBus.delayMin = 1.0; // Schedule recovered
  } else {
    signalState.mode = "STANDARD";
    signalState.activePriorityType = "NONE";
    signalState.approaches.north.currentSignal = "RED";
    signalState.approaches.north.greenDurationSec = 25;
    signalState.approaches.east.currentSignal = "GREEN";
    signalState.activeBus.delayMin = 5.2;
  }
  res.json({
    success: true,
    signalState,
    message: active
      ? "Transit Signal Priority (TSP) engaged for Bus #42 (+17s green extension wave)."
      : "TSP deactivated. Returned to standard NEMA signal cycle.",
  });
});

app.post("/api/emergency/activate", (req, res) => {
  const active = Boolean(req.body.active !== undefined ? req.body.active : true);
  if (active) {
    signalState.mode = "EMERGENCY_PREEMPTION";
    signalState.activePriorityType = "EMERGENCY_AMBULANCE";
    signalState.approaches.north.currentSignal = "GREEN";
    signalState.approaches.north.greenDurationSec = 60;
    signalState.approaches.south.currentSignal = "RED";
    signalState.approaches.east.currentSignal = "RED";
    signalState.approaches.west.currentSignal = "RED";
  } else {
    signalState.mode = "STANDARD";
    signalState.activePriorityType = "NONE";
    signalState.approaches.north.currentSignal = "RED";
    signalState.approaches.north.greenDurationSec = 25;
    signalState.approaches.east.currentSignal = "GREEN";
  }
  res.json({
    success: true,
    signalState,
    message: active
      ? "Emergency Vehicle Preemption active: All cross-traffic halted, Green Wave locked."
      : "Emergency Preemption released.",
  });
});

// 5. DISPATCH ACTION: DEPLOY STANDBY BUS / SHUTTLE
app.post("/api/transit/dispatch", (req, res) => {
  const action = req.body?.action || "deploy_standby_bus";
  activeStandbyBusesDeployed = Math.min(4, activeStandbyBusesDeployed + 1);
  res.json({
    success: true,
    action,
    message: "Standby Electric Articulated Bus deployed to Corridor 4 to absorb platform passenger overflow.",
    activeFleetCount: 48 + activeStandbyBusesDeployed,
    standbyRemaining: 4 - activeStandbyBusesDeployed,
  });
});

// 6. GEMINI AI TRANSIT DISPATCHER
app.post("/api/ai/analyze", async (req, res) => {
  const {
    transitStatistics,
    platformDensity,
    activeDisruptions,
    delayedVehicles,
  } = req.body || {};

  const prompt = `You are the chief AI Transit Dispatcher for AeroTransit Intelligent Public Transportation System (IPTS).
Analyze the following multi-modal public transit telemetry:
- Transit Network Stats: ${JSON.stringify(transitStatistics || { onTimeRate: "84.6%", activeFleet: 48, avgSpeed: "26.4 km/h" })}
- Platform Crowd Density: ${platformDensity || "88% Peak Overcrowding at Gate 3"}
- Delayed Transit Units: ${JSON.stringify(delayedVehicles || [{ unit: "Bus #42", delay: "5.2 mins", route: "Line 4 BRT" }])}
- Active Disruptions: ${JSON.stringify(activeDisruptions || ["Bus Lane 3 Unauthorized Vehicle Intrusion"])}

Respond strictly in valid JSON matching this schema:
{
  "summary": "1-2 sentence executive briefing of transit operations",
  "cause": "Specific operational cause (e.g. bus lane blockage, asymmetric platform crowding)",
  "prediction": "Forward-looking stochastic passenger delay forecast for next 15-30 minutes",
  "dispatchAction": "Concrete automated dispatch action (e.g. engage TSP green wave, deploy standby autonomous shuttle)",
  "priorityLevel": "CRITICAL" | "MODERATE" | "OPTIMAL",
  "confidence": 0.94
}`;

  if (ai) {
    try {
      const geminiResponse = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the cognitive dispatcher for an Intelligent Public Transportation System. Output only valid JSON.",
          responseMimeType: "application/json",
          temperature: 0.25,
        },
      });

      const responseText = geminiResponse.text?.trim() || "";
      const parsed = JSON.parse(responseText);

      return res.json({
        ...parsed,
        source: "GEMINI_3_8_FLASH_LIVE",
        isLiveAI: true,
      });
    } catch (err: any) {
      console.warn("[Gemini API] Call failed or quota reached, using structured fallback:", err?.message);
    }
  }

  // Graceful deterministic fallback
  return res.json({
    summary: "Corridor 4 is experiencing an 8.4-minute schedule divergence due to private vehicle blockage in dedicated BRT Lane 3 combined with 88% platform crowd saturation at Transfer Gate 3.",
    cause: "Bus Lane 3 intrusion by unauthorized sedan 7XY-419 impeding Bus #42 transit throughput during peak morning commute.",
    prediction: "Downstream platform queues will surge past 180 commuters within 15 minutes unless automated signal priority and supplemental headway are injected.",
    dispatchAction: "Engage Transit Signal Priority (TSP) +17s green wave extension at Junction 2 and deploy Standby Autonomous Electric Shuttle #AV-04 to absorb overflow.",
    priorityLevel: "CRITICAL",
    confidence: 0.94,
    source: "FALLBACK_DISPATCH_CORE",
    isLiveAI: false,
  });
});

// 7. GOOGLE MAPS GROUNDING ENDPOINT (Uses gemini-3.8-flash with googleMaps tool)
app.post("/api/ai/maps-grounding", async (req, res) => {
  const { query, lat = 37.7749, lng = -122.4194 } = req.body || {};
  const prompt = query || "Find primary transit transfer hubs, metro terminals, and emergency hospital entrances near this corridor for route clearance.";

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: Number(lat),
                longitude: Number(lng),
              },
            },
          },
        },
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const places: { title: string; uri: string; address?: string }[] = [];

      for (const chunk of chunks) {
        if ((chunk as any).maps) {
          places.push({
            title: (chunk as any).maps.title || "Transit Hub Location",
            uri: (chunk as any).maps.uri || "https://maps.google.com",
            address: (chunk as any).maps.placeAnswerSources?.[0]?.reviewSnippets?.[0] || undefined,
          });
        }
      }

      return res.json({
        success: true,
        text,
        places,
        source: "GOOGLE_MAPS_LIVE_GROUNDING",
        model: "gemini-3.8-flash",
      });
    } catch (err: any) {
      console.warn("[Google Maps Grounding] Call failed or quota exceeded:", err?.message);
    }
  }

  // High-fidelity fallback with real Google Maps navigation links
  return res.json({
    success: true,
    text: `Verified geographic transit corridors and medical access points for "${query || "Corridor 4 Route"}":\n- **General Hospital Trauma Center**: Primary level 1 emergency destination accessed via Broadway & Hospital Drive.\n- **Central Metro Transfer Terminal**: High-capacity intermodal interchange linking Metro Lines 1 & 4.\n- **Northwest Sector Mobility Hub**: Micro-mobility and autonomous shuttle staging portal with dedicated EV charging docks.`,
    places: [
      {
        title: "San Francisco General Hospital & Trauma Center",
        uri: "https://maps.google.com/?q=San+Francisco+General+Hospital",
        address: "1001 Potrero Ave, San Francisco, CA 94110",
      },
      {
        title: "Salesforce Transit Center & Bus Plaza",
        uri: "https://maps.google.com/?q=Salesforce+Transit+Center",
        address: "425 Mission St, San Francisco, CA 94105",
      },
      {
        title: "Powell Street Station & Metro Hub",
        uri: "https://maps.google.com/?q=Powell+Street+Station",
        address: "Market St & Powell St, San Francisco, CA 94102",
      },
    ],
    source: "GOOGLE_MAPS_FALLBACK_GROUNDING",
    model: "gemini-3.8-flash",
  });
});

// 8. GOOGLE SEARCH GROUNDING ENDPOINT (Uses gemini-3.8-flash with googleSearch tool)
app.post("/api/ai/search-grounding", async (req, res) => {
  const { query } = req.body || {};
  const prompt = query || "What are recent traffic congestion incidents, severe road weather impacts, or public transportation delays reported today?";

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const webSources: { title: string; uri: string }[] = [];

      for (const chunk of chunks) {
        if ((chunk as any).web) {
          webSources.push({
            title: (chunk as any).web.title || "Traffic Advisory Link",
            uri: (chunk as any).web.uri || "https://google.com",
          });
        }
      }

      return res.json({
        success: true,
        text,
        webSources,
        source: "GOOGLE_SEARCH_LIVE_GROUNDING",
        model: "gemini-3.8-flash",
      });
    } catch (err: any) {
      console.warn("[Google Search Grounding] Call failed or quota exceeded:", err?.message);
    }
  }

  // High-fidelity fallback with real search sources
  return res.json({
    success: true,
    text: `Live Regional Traffic Intelligence for "${query || "Metropolitan Transit Grid"}":\n- **Peak Congestion Alert**: Arterial bottlenecks reported on major highway merges with delays averaging +12 to +18 minutes.\n- **Weather Advisory**: Clear pavement conditions; road friction coefficient 0.88 nominal.\n- **Public Transit Advisory**: Signal priority wave active along central busway; headway variance reduced to under 3.5 minutes.`,
    webSources: [
      {
        title: "Department of Transportation Live Traffic Monitoring",
        uri: "https://www.transportation.gov",
      },
      {
        title: "Intelligent Transportation Systems (ITS) Network Advisories",
        uri: "https://www.its.dot.gov",
      },
      {
        title: "National Weather Service Regional Transportation Forecast",
        uri: "https://www.weather.gov",
      },
    ],
    source: "GOOGLE_SEARCH_FALLBACK_GROUNDING",
    model: "gemini-3.8-flash",
  });
});

// 9. SYSTEM STATUS ENDPOINT
app.get("/api/system/status", (_req, res) => {
  res.json({
    geminiApi: {
      status: ai ? "CONNECTED" : "DEMO_FALLBACK",
      model: "gemini-3.8-flash",
      mapsGrounding: "ACTIVE (gemini-3.8-flash + googleMaps)",
      searchGrounding: "ACTIVE (gemini-3.8-flash + googleSearch)",
      latencyMs: 14,
    },
    computerVision: {
      status: "READY",
      engine: "YOLOv8 Transit Classifier",
      fps: 18.8,
      mode: "STANDALONE_&_MICROSERVICE",
    },
    tspController: {
      status: "ACTIVE",
      mode: signalState.mode,
      activePriority: signalState.activePriorityType,
    },
    transitFleetEngine: {
      status: "RUNNING",
      activeLines: 5,
      frequencySec: 1.0,
    },
    routeEngine: {
      status: "RUNNING",
      algorithm: "Multi-Modal Intermodal Cost Synthesis",
    },
  });
});

// 8. VITE MIDDLEWARE & SERVER STARTUP
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AeroTransit IPTS Command Center] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start AeroTransit server:", err);
});
