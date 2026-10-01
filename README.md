# AI-DRIVEN SMART PUBLIC TRANSPORTATION & AUTONOMOUS TRANSIT MOBILITY (AeroTransit ITS)
### *“Sense. Predict. Schedule. Prioritize.”*

AeroTransit is an AI-powered Intelligent Public Transportation System (IPTS) command center prototype designed for hackathon demonstration. It analyzes multi-modal transit corridor streams, detects bus lane intrusions, monitors platform crowd density, predicts transit delays, recommends intermodal travel routes, and orchestrates automated **Transit Signal Priority (TSP)** and **Emergency Vehicle Preemption**.

---

## 1. Problem Statement
Urban public transit networks suffer from unpredictable schedule delays caused by unauthorized private vehicle intrusions into dedicated bus lanes, platform overcrowding spikes, and uncoordinated traffic signals. When buses fall behind schedule, headway bunching cascades across the entire network, reducing public transit adoption and increasing municipal carbon emissions.

## 2. Proposed Solution
AeroTransit establishes a closed-loop cyber-physical control architecture:
1. **Perception**: Real-time video ingestion via **YOLOv8** to classify transit vehicles (EV buses, articulated BRT, trams, autonomous shuttles) and automatically flag private vehicle intrusions into dedicated bus lanes with automatic citation logging.
2. **Platform Telemetry**: Estimates platform crowd saturation index (0–100%) and queuing commuters at transfer hubs.
3. **Cognitive Dispatch**: Utilizes **Gemini 3.8 Flash** to stochastically project headway lag and generate structured JSON operational directives.
4. **Transit Signal Priority (TSP)**: Actuates NEMA TS2 intersection controllers to extend green phase cycles (+17s green wave) for buses trailing schedule by > 4 minutes, alongside emergency vehicle preemption.
5. **Multi-Modal Optimization**: Computes routes combining Direct BRT, grade-separated Metro Rail, and first/last mile autonomous electric shuttles (AeroShuttle L4).

---

## 3. Core Modules & Pages

- **Module 1: Transit Command Center (`/src/pages/CommandCenter.tsx`)**
  - KPI monitors: Active Fleet (48 EV Buses + 4 Standby), Network On-Time Rate (84.6%), Platform Passenger Load (78%), Average Transit Speed (26.4 km/h), Active TSP Requests (3), Active Disruptions (3).
  - Tactical Metro Spatial Grid: Live transit corridors (Metro Spine, University Connector, Tram Loop, Airport BRT, Harbor Link) with moving bus markers, occupancy levels, and crowd heatmaps.
  - Right-side AI Dispatch Panel with Gemini cognitive analysis and live operational triggers (*Engage TSP Wave*, *Deploy Standby Bus*).
  - Autonomous closed-loop feedback pipeline: Sense → Predict → Schedule → Prioritize.

- **Module 2: Transit Vision & Intrusion Detection (`/src/pages/TransitVision.tsx`)**
  - Video upload (.mp4, .webm) and 3 preset CCTV streams (*Corridor Flow*, *Bus Stop Crowding & Intrusion*, *Mixed Ambulance Junction*).
  - YOLOv8 classification of 8 road entity types with red bounding boxes and citation alerts on unauthorized private vehicles dwelling in dedicated BRT lanes.
  - Metrics: Transit Lane Congestion (%), Platform Crowd Density (%), and Passenger Queue length.

- **Module 3: Multi-Modal Smart Routes (`/src/pages/SmartRoutes.tsx`)**
  - Compares Route A (Direct BRT, 22m), Route B (Metro + Autonomous E-Shuttle, 18m, AI Recommended), and Route C (Mixed Surface Transit, 36m).
  - Evaluates travel time, reliability index (98%), fare, and carbon offset (5.8 kg CO2 avoided).

- **Module 4: Transit Signal Priority (TSP) & Emergency Preemption (`/src/pages/SignalPriority.tsx`)**
  - 4-way intersection matrix (North BRT, South Feeder, East Arterial, West Link) with queue lengths and phase durations.
  - Dual Priority Modes: TSP green extension (+17s for trailing Bus #42 recovering 4.2 min) and Emergency Ambulance Preemption (halting cross-traffic).
  - Visual distance and clearance countdown timeline.

- **Module 5: Fleet Analytics & Ridership Telemetry (`/src/pages/FleetAnalytics.tsx`)**
  - Recharts visualizations: Hourly Ridership Demand vs Fleet Supply Capacity, Corridor Punctuality, 7-Day Carbon Offset (11,110 kg CO2), and Public vs Private Roadway Share (80% Public).
  - Filters: Peak Morning, Midday, Peak Evening, 7-Day Trend.

- **Module 6: Autonomous Transit & Sensor Fusion (`/src/pages/AutonomousTransit.tsx`)**
  - AeroShuttle L4 Autonomous Pod specifications (14 passengers, 35 km/h, 100% electric).
  - Bird's-eye view perception visualizer featuring 360° LiDAR point-clouds, 4D Radar Doppler cones, Optical HD cameras, and C-V2X beacon handshakes.
  - SAE J3016 public transit automation spectrum (Levels 0 through 5).

- **Module 7: Judge Presentation Mode & 10-Step Automated Scenario (`/src/components/HackathonDemoModal.tsx`)**
  - Projector-optimized HUD displaying the 6 transit pillars.
  - One-click 10-step automated walkthrough executing video ingestion → crowd detection → bus lane intrusion alert → TSP green wave request → signal clearance → autonomous shuttle dispatch → Gemini dispatch reasoning.

---

## 4. System Architecture

```
[ Transit CCTV Feeds ] 
           │
           ▼
[ Python FastAPI (YOLOv8 Edge) ] <───► [ Node.js Express Server (:3000) ]
  • Bus Lane Intrusion detection         • /api/analyze-video
  • Platform crowd density               • /api/transit/fleet
  • Transit vehicle classification       • /api/routes
                                         • /api/signals/tsp
                                         • /api/ai/analyze (Gemini 3.8 Flash)
                                                     │
                                                     ▼
                                        [ React 18 + Vite SPA ]
                                         • Real-time Transit Telemetry
                                         • Recharts Analytics Engine
                                         • TSP & Preemption Controller
```

---

## 5. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts.
- **Backend**: Node.js, Express, Multer, tsx.
- **Cognitive Core**: Google GenAI SDK (`@google/genai`) using `gemini-3.8-flash`.
- **Computer Vision**: Python 3.10+, FastAPI, OpenCV, Ultralytics YOLOv8.
- **Theme**: Dark navy transit control room (`#060a14` canvas, `#080d1a` panels, cyan/emerald/amber/rose beacons).

---

## 6. How to Run Locally

### A. Environment Configuration
Create a `.env` file in the project root:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
MAPBOX_ACCESS_TOKEN="" # Optional: Native SVG/Canvas tactical grid runs without token
```

### B. Launching Full-Stack Node.js + React Application
```bash
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

### C. Running Python YOLOv8 Transit Microservice (Optional)
```bash
cd python_service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```
Runs on `http://localhost:8000`. The Node.js backend automatically detects and connects to it.

---

## 7. Hackathon Judge Presentation Script

1. **Toggle Judge View**: Click **"Judge View: OFF"** in the top bar to display the high-contrast projector HUD.
2. **Launch 10-Step Walkthrough**: Click **"RUN HACKATHON LIVE DEMO"** and explain the automated sequence:
   - Video feed ingests Bus #42 trailing by 5.2 minutes.
   - YOLOv8 flags unauthorized private sedan (7XY-419) in dedicated Bus Lane 3.
   - Platform crowd reaches 88% capacity at Transfer Gate 3.
   - Transit Signal Priority (TSP) grants a +17s green extension wave at Junction 2.
   - Standby Autonomous Electric Shuttle #AV-04 is deployed to absorb overflow commuters.
   - Schedule recovers by 4.2 minutes, and Gemini AI outputs executive dispatch directives.
3. **Inspect Transit Vision**: Navigate to the **"Transit Vision"** tab and click **"ANALYZE TRANSIT STREAM"** to observe real-time lane intrusion tags and platform crowd indices.
4. **Test Signal Priority Simulator**: Navigate to **"TSP & Preemption"** to test 4-way intersection green extensions and emergency ambulance preemption.
