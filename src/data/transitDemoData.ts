export type DemandLevel = "HIGH" | "MEDIUM" | "LOW";

export interface HourlyDemandPoint {
  time: string;
  current: number;
  predicted: number;
  isPeak?: boolean;
}

export interface RouteDemandItem {
  id: string;
  name: string;
  corridor: string;
  description: string;
  currentPassengers: number;
  predictedDemand: number;
  demandLevel: DemandLevel;
  currentBuses: number;
  recommendedBuses: number;
  delta: number;
  peakDemandTime: string;
  recommendationText: string;
  actionType: "INCREASE" | "MAINTAIN" | "REDUCE";
  stopsCount: number;
  lengthKm: number;
  avgWaitMin: number;
  coords: { lat: number; lng: number };
  hourlyBreakdown: HourlyDemandPoint[];
}

export const HOURLY_OVERVIEW_DATA: HourlyDemandPoint[] = [
  { time: "6:00 AM", current: 1420, predicted: 1680, isPeak: false },
  { time: "8:00 AM", current: 3850, predicted: 5120, isPeak: true },
  { time: "10:00 AM", current: 2450, predicted: 2680, isPeak: false },
  { time: "12:00 PM", current: 2780, predicted: 3100, isPeak: false },
  { time: "2:00 PM", current: 2150, predicted: 2350, isPeak: false },
  { time: "4:00 PM", current: 3120, predicted: 3750, isPeak: false },
  { time: "6:00 PM", current: 4280, predicted: 5640, isPeak: true },
  { time: "8:00 PM", current: 1950, predicted: 2150, isPeak: false },
];

export const DEMO_ROUTES: RouteDemandItem[] = [
  {
    id: "route-1",
    name: "Route 1A – Erode BS ↔ Perundurai SIPCOT",
    corridor: "NH-544 Industrial & Tech Corridor",
    description: "Busiest industrial arterial linking Erode Central Bus Stand, Thindal, and Perundurai SIPCOT Industrial Growth Center & IRT Medical College.",
    currentPassengers: 460,
    predictedDemand: 590,
    demandLevel: "HIGH",
    currentBuses: 5,
    recommendedBuses: 7,
    delta: 2,
    peakDemandTime: "7:45 AM – 9:30 AM (Shift & College Rush)",
    recommendationText: "Increase bus availability (+2 buses to absorb SIPCOT factory shift & engineering students)",
    actionType: "INCREASE",
    stopsCount: 18,
    lengthKm: 21.4,
    avgWaitMin: 4.5,
    coords: { lat: 11.3410, lng: 77.7172 },
    hourlyBreakdown: [
      { time: "6:00 AM", current: 210, predicted: 260 },
      { time: "8:00 AM", current: 460, predicted: 590, isPeak: true },
      { time: "10:00 AM", current: 290, predicted: 320 },
      { time: "12:00 PM", current: 330, predicted: 370 },
      { time: "2:00 PM", current: 270, predicted: 295 },
      { time: "4:00 PM", current: 380, predicted: 440 },
      { time: "6:00 PM", current: 490, predicted: 620, isPeak: true },
      { time: "8:00 PM", current: 240, predicted: 260 },
    ],
  },
  {
    id: "route-2",
    name: "Route 2B – Erode BS ↔ Bhavani Kooduthurai",
    corridor: "Bhavani Cauvery River & Textile Spine",
    description: "High-density textile worker and pilgrim corridor connecting Central Bus Stand, Lakshmi Nagar, Komarapalayam Bridge, and Bhavani Sangameshwarar Temple.",
    currentPassengers: 390,
    predictedDemand: 480,
    demandLevel: "HIGH",
    currentBuses: 4,
    recommendedBuses: 5,
    delta: 1,
    peakDemandTime: "8:00 AM – 9:30 AM (Textile Market Rush)",
    recommendationText: "Increase bus availability (+1 bus to reduce Lakshmi Nagar textile worker queue)",
    actionType: "INCREASE",
    stopsCount: 15,
    lengthKm: 14.8,
    avgWaitMin: 5.5,
    coords: { lat: 11.4489, lng: 77.6826 },
    hourlyBreakdown: [
      { time: "6:00 AM", current: 160, predicted: 185 },
      { time: "8:00 AM", current: 390, predicted: 480, isPeak: true },
      { time: "10:00 AM", current: 250, predicted: 270 },
      { time: "12:00 PM", current: 280, predicted: 310 },
      { time: "2:00 PM", current: 230, predicted: 250 },
      { time: "4:00 PM", current: 320, predicted: 380 },
      { time: "6:00 PM", current: 420, predicted: 510, isPeak: true },
      { time: "8:00 PM", current: 210, predicted: 230 },
    ],
  },
  {
    id: "route-3",
    name: "Route 3C – Erode Jn ↔ Thindal & Velalar Campuses",
    corridor: "Thindal Educational & Residential Spine",
    description: "Core student and office commuter route from Southern Railway Junction via Collectorate to Thindal Murugan Hill & Velalar Engineering College.",
    currentPassengers: 280,
    predictedDemand: 310,
    demandLevel: "MEDIUM",
    currentBuses: 4,
    recommendedBuses: 4,
    delta: 0,
    peakDemandTime: "8:15 AM – 9:45 AM",
    recommendationText: "Maintain normal service (Headway is stable at 8-min intervals)",
    actionType: "MAINTAIN",
    stopsCount: 14,
    lengthKm: 11.2,
    avgWaitMin: 6.0,
    coords: { lat: 11.3142, lng: 77.6780 },
    hourlyBreakdown: [
      { time: "6:00 AM", current: 110, predicted: 125 },
      { time: "8:00 AM", current: 280, predicted: 310, isPeak: true },
      { time: "10:00 AM", current: 190, predicted: 205 },
      { time: "12:00 PM", current: 220, predicted: 235 },
      { time: "2:00 PM", current: 175, predicted: 185 },
      { time: "4:00 PM", current: 240, predicted: 260 },
      { time: "6:00 PM", current: 310, predicted: 335, isPeak: true },
      { time: "8:00 PM", current: 140, predicted: 150 },
    ],
  },
  {
    id: "route-4",
    name: "Route 4D – Erode Central ↔ Sathyamangalam (Sathy Road)",
    corridor: "SH-15 Agricultural & Western Ghats Gateway",
    description: "Arterial corridor serving Erode wholesale turmeric yards, Chithode, Kavindapadi sugarcane zone, and Sathyamangalam Bus Terminal.",
    currentPassengers: 430,
    predictedDemand: 550,
    demandLevel: "HIGH",
    currentBuses: 5,
    recommendedBuses: 7,
    delta: 2,
    peakDemandTime: "7:30 AM – 9:15 AM (Turmeric & Agri Market)",
    recommendationText: "Increase bus availability (+2 buses to ease overcrowding on Chithode / Kavindapadi stretch)",
    actionType: "INCREASE",
    stopsCount: 22,
    lengthKm: 34.6,
    avgWaitMin: 5.0,
    coords: { lat: 11.5034, lng: 77.2444 },
    hourlyBreakdown: [
      { time: "6:00 AM", current: 190, predicted: 230 },
      { time: "8:00 AM", current: 430, predicted: 550, isPeak: true },
      { time: "10:00 AM", current: 280, predicted: 310 },
      { time: "12:00 PM", current: 310, predicted: 340 },
      { time: "2:00 PM", current: 260, predicted: 280 },
      { time: "4:00 PM", current: 360, predicted: 430 },
      { time: "6:00 PM", current: 460, predicted: 570, isPeak: true },
      { time: "8:00 PM", current: 220, predicted: 240 },
    ],
  },
  {
    id: "route-5",
    name: "Route 5E – Solar New Terminus ↔ Texvalley Chithode",
    corridor: "NH-544 Texvalley Textile Belt Express",
    description: "Express commercial transit linking Solar Inter-City Terminal, Karungalpalayam textile market, and Texvalley Wholesale Textile Complex.",
    currentPassengers: 240,
    predictedDemand: 260,
    demandLevel: "MEDIUM",
    currentBuses: 3,
    recommendedBuses: 3,
    delta: 0,
    peakDemandTime: "10:00 AM – 12:00 PM (Wholesale Trading Hours)",
    recommendationText: "Maintain normal service (Optimal 12-min frequency for textile merchants)",
    actionType: "MAINTAIN",
    stopsCount: 16,
    lengthKm: 16.5,
    avgWaitMin: 7.0,
    coords: { lat: 11.4165, lng: 77.6710 },
    hourlyBreakdown: [
      { time: "6:00 AM", current: 80, predicted: 90 },
      { time: "8:00 AM", current: 210, predicted: 230 },
      { time: "10:00 AM", current: 240, predicted: 260, isPeak: true },
      { time: "12:00 PM", current: 260, predicted: 280, isPeak: true },
      { time: "2:00 PM", current: 190, predicted: 205 },
      { time: "4:00 PM", current: 230, predicted: 250 },
      { time: "6:00 PM", current: 270, predicted: 290 },
      { time: "8:00 PM", current: 120, predicted: 130 },
    ],
  },
  {
    id: "route-6",
    name: "Route 6F – Erode Central ↔ Gobichettipalayam",
    corridor: "Bhavani River Basin & Agro Green Line",
    description: "Inter-taluk agricultural link through Kalingarayan canal belt, Nambiyur crossing, and Gobichettipalayam Central Bus Stand.",
    currentPassengers: 150,
    predictedDemand: 120,
    demandLevel: "LOW",
    currentBuses: 4,
    recommendedBuses: 3,
    delta: -1,
    peakDemandTime: "11:00 AM – 1:00 PM",
    recommendationText: "Reduce/optimize allocation (Surplus capacity; reallocate 1 bus to Route 1A Perundurai SIPCOT)",
    actionType: "REDUCE",
    stopsCount: 20,
    lengthKm: 32.0,
    avgWaitMin: 11.5,
    coords: { lat: 11.4552, lng: 77.4334 },
    hourlyBreakdown: [
      { time: "6:00 AM", current: 70, predicted: 55 },
      { time: "8:00 AM", current: 150, predicted: 120 },
      { time: "10:00 AM", current: 110, predicted: 95 },
      { time: "12:00 PM", current: 130, predicted: 105 },
      { time: "2:00 PM", current: 90, predicted: 75 },
      { time: "4:00 PM", current: 120, predicted: 100 },
      { time: "6:00 PM", current: 140, predicted: 115 },
      { time: "8:00 PM", current: 60, predicted: 45 },
    ],
  },
  {
    id: "route-7",
    name: "Route 7G – Erode Jn ↔ Modakurichi & Kodumudi",
    corridor: "South Cauvery Turmeric & Pilgrimage Feeder",
    description: "Southern rural feeder connecting Modakurichi turmeric agricultural yards, Sivagiri, and Kodumudi Magudeswarar Temple along Cauvery River.",
    currentPassengers: 130,
    predictedDemand: 95,
    demandLevel: "LOW",
    currentBuses: 3,
    recommendedBuses: 2,
    delta: -1,
    peakDemandTime: "3:30 PM – 5:00 PM",
    recommendationText: "Reduce/optimize allocation (Low midday load allows 1 bus shift to Route 4D Sathy Road)",
    actionType: "REDUCE",
    stopsCount: 24,
    lengthKm: 38.2,
    avgWaitMin: 14.0,
    coords: { lat: 11.1250, lng: 77.8870 },
    hourlyBreakdown: [
      { time: "6:00 AM", current: 50, predicted: 40 },
      { time: "8:00 AM", current: 130, predicted: 95 },
      { time: "10:00 AM", current: 85, predicted: 70 },
      { time: "12:00 PM", current: 105, predicted: 80 },
      { time: "2:00 PM", current: 70, predicted: 55 },
      { time: "4:00 PM", current: 115, predicted: 90 },
      { time: "6:00 PM", current: 120, predicted: 95 },
      { time: "8:00 PM", current: 45, predicted: 35 },
    ],
  },
  {
    id: "route-8",
    name: "Route 8H – Solar Bus Stand ↔ Erode Central ↔ Railway Jn",
    corridor: "Erode City Intra-Hub High-Frequency Ring",
    description: "Continuous urban circular shuttle linking Erode's 3 major transit nodes: Solar South Bus Terminal, Central Bus Stand, and Southern Railway Junction.",
    currentPassengers: 360,
    predictedDemand: 470,
    demandLevel: "HIGH",
    currentBuses: 4,
    recommendedBuses: 5,
    delta: 1,
    peakDemandTime: "7:00 AM – 9:00 AM & 5:30 PM – 7:30 PM",
    recommendationText: "Increase bus availability (+1 bus to handle connecting inter-city train passengers)",
    actionType: "INCREASE",
    stopsCount: 12,
    lengthKm: 12.0,
    avgWaitMin: 5.0,
    coords: { lat: 11.3320, lng: 77.7250 },
    hourlyBreakdown: [
      { time: "6:00 AM", current: 140, predicted: 175 },
      { time: "8:00 AM", current: 360, predicted: 470, isPeak: true },
      { time: "10:00 AM", current: 240, predicted: 270 },
      { time: "12:00 PM", current: 270, predicted: 300 },
      { time: "2:00 PM", current: 220, predicted: 245 },
      { time: "4:00 PM", current: 310, predicted: 375 },
      { time: "6:00 PM", current: 390, predicted: 510, isPeak: true },
      { time: "8:00 PM", current: 180, predicted: 205 },
    ],
  },
];

export interface PassengerDataFactor {
  id: string;
  title: string;
  description: string;
  icon: string;
  metric: string;
  trend: string;
}

export const PASSENGER_DATA_FACTORS: PassengerDataFactor[] = [
  {
    id: "factor-1",
    title: "SIPCOT & Mill Shift Schedules",
    description: "Shift change times at Perundurai SIPCOT, Chithode powerlooms, and textile dying processing units.",
    icon: "Clock",
    metric: "8:00 AM & 5:30 PM",
    trend: "+65% Surge",
  },
  {
    id: "factor-2",
    title: "Student Pass & Concession Taps",
    description: "Daily smartcard boarding logs across Velalar, IRT Medical, Nandha, and Bannari Amman student hubs.",
    icon: "Users",
    metric: "4,620 passes/day",
    trend: "+28% Morning",
  },
  {
    id: "factor-3",
    title: "Southern Railway Junction Feeds",
    description: "Real-time arrival passenger volumes from Cheran, Yercaud, and Coimbatore Intercity express trains.",
    icon: "Route",
    metric: "12 trains synchronized",
    trend: "+35% Transfer",
  },
  {
    id: "factor-4",
    title: "Texvalley Trade Market Velocity",
    description: "Wholesale weekly textile market buyer convergence from Tiruppur, Karur, and Salem districts.",
    icon: "TrendingUp",
    metric: "18,000 visitors/wk",
    trend: "+45% Thursday peak",
  },
  {
    id: "factor-5",
    title: "Automated Door Passenger Counters",
    description: "Infrared door sensors on 48 TNSTC city buses calculating live boarding and alighting delta per stop.",
    icon: "DoorOpen",
    metric: "99.2% Accuracy",
    trend: "Live Telemetry",
  },
  {
    id: "factor-6",
    title: "Monsoon & Weather Impact",
    description: "Rainfall intensity sensors over Bhavani & Cauvery river basins prompting modal shifts from 2-wheelers.",
    icon: "TrendingDown",
    metric: "32% Modal Shift",
    trend: "+30% Rainy Days",
  },
];

