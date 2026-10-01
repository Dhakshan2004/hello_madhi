export interface TransitDataset {
  id: string;
  name: string;
  badge: string;
  description: string;
  commuterVolume: number;
  multiplier: number;
  highlightedRoutes: string[];
  weather: string;
  avgTemp: string;
  event: string;
  region: string;
}

export const TRANSIT_DATASETS: TransitDataset[] = [
  {
    id: "regular_weekday",
    name: "Erode Weekday Commute (TNSTC)",
    badge: "Baseline",
    description: "Standard industrial shift, college students (Velalar/IRT), and commercial commuters across Erode District.",
    commuterVolume: 14850,
    multiplier: 1.0,
    highlightedRoutes: ["route-1", "route-4", "route-8"],
    weather: "Clear / 31°C",
    avgTemp: "31°C",
    event: "TNSTC Erode City Division Regular Schedule",
    region: "Erode District, Tamil Nadu",
  },
  {
    id: "texvalley_fair",
    name: "Texvalley Weekly Textile Market Surge",
    badge: "Market Day (+45%)",
    description: "Thousands of wholesale textile traders converge from Tiruppur, Salem, and Coimbatore at Texvalley Chithode.",
    commuterVolume: 21500,
    multiplier: 1.45,
    highlightedRoutes: ["route-2", "route-5", "route-8"],
    weather: "Humid / 33°C",
    avgTemp: "33°C",
    event: "Weekly Textile Market Day & Texvalley Fair",
    region: "Erode District, Tamil Nadu",
  },
  {
    id: "monsoon_surge",
    name: "Cauvery River Belt Monsoon Rain Surge",
    badge: "Rain Surge (+30%)",
    description: "Heavy rain across Bhavani and Erode city pushes two-wheeler commuters to TNSTC municipal buses.",
    commuterVolume: 19200,
    multiplier: 1.30,
    highlightedRoutes: ["route-1", "route-2", "route-4"],
    weather: "Heavy Monsoon Rain / 24°C",
    avgTemp: "24°C",
    event: "Monsoon Public Transit Priority Mode",
    region: "Erode District, Tamil Nadu",
  },
  {
    id: "kooduthurai_pilgrim",
    name: "Bhavani Kooduthurai & Kodumudi Special",
    badge: "Pilgrim Surge (+60%)",
    description: "Amavasai / Festival auspicious day with heavy devotee flow to Bhavani Sangameshwarar and Kodumudi temples.",
    commuterVolume: 23800,
    multiplier: 1.60,
    highlightedRoutes: ["route-2", "route-7", "route-8"],
    weather: "Sunny / 34°C",
    avgTemp: "34°C",
    event: "Kooduthurai Sangamam & Kodumudi Temple Festival",
    region: "Erode District, Tamil Nadu",
  },
];

// Stop Bottleneck Data along authentic Erode District corridors
export interface RouteStopBottleneck {
  stopId: string;
  stopName: string;
  routeId: string;
  routeName: string;
  scheduledTime: string;
  waitingPax: number;
  boardingRate: number; // pax/min
  busOccupancyPct: number;
  congestionStatus: "CRITICAL" | "MODERATE" | "NORMAL";
  actionRequired: string;
}

export const ROUTE_STOP_BOTTLENECKS: RouteStopBottleneck[] = [
  {
    stopId: "ED-STP-101",
    stopName: "Perundurai SIPCOT Phase-1 Main Gate (NH-544)",
    routeId: "route-1",
    routeName: "Route 1A – Erode BS ↔ Perundurai SIPCOT",
    scheduledTime: "08:15 AM",
    waitingPax: 154,
    boardingRate: 42,
    busOccupancyPct: 102,
    congestionStatus: "CRITICAL",
    actionRequired: "Deploy Bus #ED-402 from Solar Bus Stand Depot to clear shift workers",
  },
  {
    stopId: "ED-STP-104",
    stopName: "Thindal Murugan Temple & Velalar College Bay",
    routeId: "route-3",
    routeName: "Route 3C – Erode Jn ↔ Thindal & Velalar Campuses",
    scheduledTime: "08:35 AM",
    waitingPax: 128,
    boardingRate: 36,
    busOccupancyPct: 96,
    congestionStatus: "CRITICAL",
    actionRequired: "Split headway from 12 min to 6 min frequency during morning college rush",
  },
  {
    stopId: "ED-STP-202",
    stopName: "Bhavani Sangameshwarar Kooduthurai Bus Stand",
    routeId: "route-2",
    routeName: "Route 2B – Erode BS ↔ Bhavani Kooduthurai",
    scheduledTime: "08:45 AM",
    waitingPax: 112,
    boardingRate: 28,
    busOccupancyPct: 91,
    congestionStatus: "CRITICAL",
    actionRequired: "Inject Bus #ED-204 from Erode Central Bay 2",
  },
  {
    stopId: "ED-STP-305",
    stopName: "Texvalley Mega Textile Mall (Chithode NH-544)",
    routeId: "route-5",
    routeName: "Route 5E – Solar New Terminus ↔ Texvalley Chithode",
    scheduledTime: "10:15 AM",
    waitingPax: 88,
    boardingRate: 24,
    busOccupancyPct: 84,
    congestionStatus: "MODERATE",
    actionRequired: "Maintain synchronized 12-min frequency with trade arrivals",
  },
  {
    stopId: "ED-STP-401",
    stopName: "Erode Railway Junction (East Entrance Bus Bay)",
    routeId: "route-8",
    routeName: "Route 8H – Solar Bus Stand ↔ Erode Central ↔ Railway Jn",
    scheduledTime: "07:30 AM",
    waitingPax: 135,
    boardingRate: 38,
    busOccupancyPct: 98,
    congestionStatus: "CRITICAL",
    actionRequired: "Coordinate with arrival of Cheran & Yercaud Express trains",
  },
  {
    stopId: "ED-STP-502",
    stopName: "Kavindapadi Sugarcane Market (Sathy Road)",
    routeId: "route-4",
    routeName: "Route 4D – Erode Central ↔ Sathyamangalam (Sathy Road)",
    scheduledTime: "09:05 AM",
    waitingPax: 46,
    boardingRate: 15,
    busOccupancyPct: 62,
    congestionStatus: "NORMAL",
    actionRequired: "Optimal load balanced; maintain scheduled 15-min headway",
  },
];
