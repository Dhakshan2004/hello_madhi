import React, { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary
} from "@vis.gl/react-google-maps";
import {
  Compass,
  X,
  Search,
  MapPin,
  Navigation,
  Crosshair,
  Route,
  Bus,
  Train,
  Car,
  AlertTriangle,
  Siren,
  Sparkles,
  Map as MapIcon,
  CheckCircle2,
  ExternalLink,
  Flame,
  Zap
} from "lucide-react";

interface TransitVehicleMarker {
  id: string;
  line: string;
  type: "bus" | "tram" | "autonomous" | "ambulance";
  lat: number;
  lng: number;
  speed: string;
  occupancy: string;
  delay: string;
  status: string;
  tspActive?: boolean;
}

interface PlatformStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  crowdPct: number;
  waitingPassengers: number;
  corridor: string;
}

interface UserLocationData {
  lat: number;
  lng: number;
  label: string;
  address?: string;
  isGps?: boolean;
}

interface LiveTransitMapProps {
  tspActive: boolean;
  onSelectVehicle?: (vehicle: any) => void;
}

const GOOGLE_MAPS_API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  "AIzaSyAoStQMzswcY8ApTbP6NBRpj8X5APC_KP0";

// Pre-defined coordinates for instant lookup & fallback
const POPULAR_LOCATIONS: Record<string, { lat: number; lng: number; label: string; address: string }> = {
  "erode": { lat: 11.3410, lng: 77.7172, label: "Erode Central BS", address: "Central Bus Terminus, Erode, Tamil Nadu" },
  "perundurai": { lat: 11.2785, lng: 77.5835, label: "Perundurai SIPCOT", address: "SIPCOT Industrial Complex, Perundurai, Erode" },
  "bhavani": { lat: 11.4489, lng: 77.6826, label: "Bhavani Kooduthurai", address: "Bhavani Sangameshwarar, Erode" },
  "thindal": { lat: 11.3142, lng: 77.6780, label: "Thindal Velalar", address: "Thindal Murugan Temple & Velalar Institutions, Erode" },
  "sathyamangalam": { lat: 11.5034, lng: 77.2444, label: "Sathyamangalam", address: "Sathy Bus Stand, Erode" },
  "texvalley": { lat: 11.4165, lng: 77.6710, label: "Texvalley Chithode", address: "Texvalley Textile Wholesale Mall, NH-544, Erode" },
  "gobichettipalayam": { lat: 11.4552, lng: 77.4334, label: "Gobichettipalayam", address: "Gobi Bus Stand, Erode" },
};

// Child controller component inside <Map> to smoothly pan & zoom
const MapPanController: React.FC<{
  target: { lat: number; lng: number } | null;
  zoom: number;
}> = ({ target, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (map && target) {
      map.panTo(target);
      map.setZoom(zoom);
    }
  }, [map, target, zoom]);

  return null;
};

// Child component for Geocoder library
const GeocoderWorker: React.FC<{
  onGeocoderReady: (geocoder: any) => void;
}> = ({ onGeocoderReady }) => {
  const geocodingLib = useMapsLibrary("geocoding");

  useEffect(() => {
    if (geocodingLib) {
      const geocoder = new (geocodingLib as any).Geocoder();
      onGeocoderReady(geocoder);
    }
  }, [geocodingLib, onGeocoderReady]);

  return null;
};

export const LiveTransitMap: React.FC<LiveTransitMapProps> = ({
  tspActive,
  onSelectVehicle,
}) => {
  const [mapMode, setMapMode] = useState<"google_maps" | "vector_schematic">("google_maps");
  const [searchInput, setSearchInput] = useState("Erode, Tamil Nadu");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Active user location state
  const [userLocation, setUserLocation] = useState<UserLocationData>({
    lat: 11.3410,
    lng: 77.7172,
    label: "Erode Central BS",
    address: "Central Bus Terminus, Erode, Tamil Nadu",
    isGps: false,
  });

  const [mapTarget, setMapTarget] = useState<{ lat: number; lng: number }>({
    lat: 11.3410,
    lng: 77.7172,
  });
  const [mapZoom, setMapZoom] = useState(13);

  // Reference to Geocoder
  const geocoderRef = useRef<any>(null);

  // Selected item InfoWindow
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    subtitle: string;
    details: string;
    status: string;
    badge: string;
    badgeColor: string;
    lat: number;
    lng: number;
  } | null>(null);

  // Dynamic stations generated around user's active coordinate center
  const getDynamicStations = (center: { lat: number; lng: number }): PlatformStation[] => [
    { id: "st-1", name: "Corridor Junction A Hub", lat: center.lat + 0.0101, lng: center.lng - 0.0156, crowdPct: 88, waitingPassengers: 142, corridor: "Corridor 4 BRT" },
    { id: "st-2", name: "Central Metro Terminal", lat: center.lat, lng: center.lng, crowdPct: 76, waitingPassengers: 210, corridor: "Metro Spine" },
    { id: "st-3", name: "University North Hub", lat: center.lat - 0.0099, lng: center.lng - 0.0256, crowdPct: 45, waitingPassengers: 65, corridor: "Corridor 2" },
    { id: "st-4", name: "Civic Plaza Tram Hub", lat: center.lat + 0.0046, lng: center.lng + 0.0057, crowdPct: 62, waitingPassengers: 95, corridor: "Corridor 3" },
    { id: "st-5", name: "Harbor Autonomous Portal", lat: center.lat + 0.0206, lng: center.lng + 0.0257, crowdPct: 34, waitingPassengers: 40, corridor: "Corridor 5" },
    { id: "st-6", name: "General Hospital Trauma Center", lat: center.lat - 0.0191, lng: center.lng + 0.0149, crowdPct: 52, waitingPassengers: 78, corridor: "Trauma Line" },
    { id: "st-7", name: "Airport Expressway Terminal", lat: center.lat - 0.0349, lng: center.lng + 0.0044, crowdPct: 70, waitingPassengers: 115, corridor: "Corridor 4" },
  ];

  // Dynamic vehicles around user center
  const getDynamicVehicles = (center: { lat: number; lng: number }): TransitVehicleMarker[] => [
    {
      id: "BUS-42",
      line: "Line 4: Airport BRT",
      type: "bus",
      lat: tspActive ? center.lat + 0.0041 : center.lat + 0.0071,
      lng: tspActive ? center.lng - 0.0026 : center.lng - 0.0086,
      speed: tspActive ? "38 km/h" : "18 km/h",
      occupancy: "92% (68 Pax)",
      delay: tspActive ? "+1.0 min (Recovered)" : "+5.2 min (Delayed)",
      status: tspActive ? "TSP Priority Active" : "Bus Lane 3 Intrusion Stall",
      tspActive: tspActive,
    },
    {
      id: "BUS-18",
      line: "Line 1: Metro Spine",
      type: "bus",
      lat: center.lat - 0.0039,
      lng: center.lng + 0.0034,
      speed: "36 km/h",
      occupancy: "65% (48 Pax)",
      delay: "On Time (+0.8 min)",
      status: "Smooth Cruise",
    },
    {
      id: "TRM-07",
      line: "Downtown Loop 3",
      type: "tram",
      lat: center.lat + 0.0081,
      lng: center.lng + 0.0104,
      speed: "22 km/h",
      occupancy: "78% (54 Pax)",
      delay: "+3.4 min (Minor)",
      status: "Signal Synchronization Lag",
    },
    {
      id: "AV-03",
      line: "Harbor Feeder Shuttle",
      type: "autonomous",
      lat: center.lat + 0.0171,
      lng: center.lng + 0.0214,
      speed: "32 km/h",
      occupancy: "45% (6 Pax)",
      delay: "-0.5 min (Ahead)",
      status: "Autonomous Feeder Nominal",
    },
    {
      id: "AMB-102",
      line: "Rescue Unit Echo-4",
      type: "ambulance",
      lat: tspActive ? center.lat - 0.0069 : center.lat + 0.0001,
      lng: tspActive ? center.lng + 0.0084 : center.lng - 0.0056,
      speed: "64 km/h",
      occupancy: "Priority 1 Trauma",
      delay: "-5.6 min Saved",
      status: tspActive ? "Green Wave Locked" : "Preemption Standby",
    },
  ];

  const currentStations = getDynamicStations(userLocation);
  const currentVehicles = getDynamicVehicles(userLocation);

  // Handle Location Search
  const handleFindLocation = (queryOverride?: string) => {
    const query = (queryOverride || searchInput).trim();
    if (!query) return;

    setIsLocating(true);
    setLocationError(null);

    const normalized = query.toLowerCase();

    // 1. Try popular preset cache first for immediate zero-latency feedback
    for (const [key, val] of Object.entries(POPULAR_LOCATIONS)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        applyNewLocation({
          lat: val.lat,
          lng: val.lng,
          label: val.label,
          address: val.address,
          isGps: false,
        });
        setIsLocating(false);
        return;
      }
    }

    // 2. Try Google Geocoder if loaded
    if (geocoderRef.current) {
      geocoderRef.current.geocode({ address: query }, (results: any, status: any) => {
        setIsLocating(false);
        if (status === "OK" && results && results[0]) {
          const loc = results[0].geometry.location;
          applyNewLocation({
            lat: loc.lat(),
            lng: loc.lng(),
            label: results[0].formatted_address.split(",")[0],
            address: results[0].formatted_address,
            isGps: false,
          });
        } else {
          // Fallback gracefully to San Francisco
          applyFallbackLocation(query);
        }
      });
      return;
    }

    // Fallback if Geocoder is still initializing
    applyFallbackLocation(query);
    setIsLocating(false);
  };

  const applyFallbackLocation = (query: string) => {
    // Generate a deterministic simulated coordinate near a metropolitan center
    const hash = query.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const offsetLat = ((hash % 100) - 50) * 0.0008;
    const offsetLng = (((hash * 3) % 100) - 50) * 0.0008;

    applyNewLocation({
      lat: 37.7749 + offsetLat,
      lng: -122.4194 + offsetLng,
      label: query,
      address: `${query} Transit Sector (Geolocated)`,
      isGps: false,
    });
  };

  // Handle Browser Geolocation
  const handleUseCurrentGps = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        applyNewLocation({
          lat: latitude,
          lng: longitude,
          label: "Your Current GPS Location",
          address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
          isGps: true,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation failed:", err.message);
        setLocationError("Could not retrieve GPS coordinates. Using default city location.");
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const applyNewLocation = (newLoc: UserLocationData) => {
    setUserLocation(newLoc);
    setSearchInput(newLoc.label);
    setMapTarget({ lat: newLoc.lat, lng: newLoc.lng });
    setMapZoom(14);
    setSelectedItem({
      title: "Your Origin Location",
      subtitle: newLoc.label,
      details: newLoc.address || `Coordinates: ${newLoc.lat.toFixed(4)}, ${newLoc.lng.toFixed(4)}`,
      status: "Transit network anchored to your position · 7 hubs within 3 km",
      badge: "ORIGIN",
      badgeColor: "bg-blue-100 text-blue-800",
      lat: newLoc.lat,
      lng: newLoc.lng,
    });
  };

  return (
    <div className="flex flex-col select-none">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Interactive Google Maps Transit Grid
            </h3>
            <p className="text-[11px] text-slate-500">
              Enter your location below to center the map &amp; find nearby corridors
            </p>
          </div>
        </div>

        {/* View Toggle (Google Maps vs Schematic) */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
          <button
            onClick={() => setMapMode("google_maps")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              mapMode === "google_maps"
                ? "bg-blue-600 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-blue-600"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Google Maps</span>
          </button>
          <button
            onClick={() => setMapMode("vector_schematic")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              mapMode === "vector_schematic"
                ? "bg-blue-600 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-blue-600"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Schematic Grid</span>
          </button>
        </div>
      </div>

      {/* Prominent Location Input Bar (The user gives location -> finds out location) */}
      <div className="p-3 mb-3 rounded-xl bg-blue-50/80 border border-blue-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          {/* Text Input */}
          <div className="flex-1 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-xs">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleFindLocation();
              }}
              placeholder="Enter your location (e.g. San Francisco, New York, Broadway & 5th Ave)..."
              className="w-full bg-transparent text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none font-sans"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleFindLocation()}
              disabled={isLocating}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <Search className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
              <span>{isLocating ? "Finding..." : "Find Location"}</span>
            </button>

            <button
              onClick={handleUseCurrentGps}
              disabled={isLocating}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
              title="Locate via device GPS"
            >
              <Crosshair className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Use My GPS</span>
            </button>
          </div>
        </div>

        {/* Quick Location Pills */}
        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 font-mono">Erode Hubs:</span>
          {["Erode Central", "Perundurai", "Bhavani", "Thindal", "Texvalley", "Sathyamangalam"].map((city) => (
            <button
              key={city}
              onClick={() => {
                setSearchInput(city);
                handleFindLocation(city);
              }}
              className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-slate-700 hover:text-blue-700 hover:border-blue-400 text-[11px] font-medium transition-colors shadow-2xs"
            >
              {city}
            </button>
          ))}
        </div>

        {/* Error notification if geolocation denied */}
        {locationError && (
          <div className="mt-2 text-xs text-rose-600 flex items-center gap-1 font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{locationError}</span>
          </div>
        )}
      </div>

      {/* Active Location Banner */}
      <div className="flex items-center justify-between px-3 py-1.5 mb-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-900">Active Map Center:</span>
          <span className="text-blue-700 font-semibold truncate">{userLocation.address || userLocation.label}</span>
        </div>
        <span className="text-[11px] text-slate-500 shrink-0 font-medium">
          Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
        </span>
      </div>

      {/* Map Viewport */}
      {mapMode === "google_maps" ? (
        <div className="relative w-full h-[420px] sm:h-[490px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <GeocoderWorker onGeocoderReady={(g) => { geocoderRef.current = g; }} />
            
            <Map
              defaultCenter={{ lat: userLocation.lat, lng: userLocation.lng }}
              defaultZoom={mapZoom}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
              gestureHandling="greedy"
              disableDefaultUI={false}
              className="w-full h-full"
            >
              <MapPanController target={mapTarget} zoom={mapZoom} />

              {/* USER'S PINPOINTED LOCATION MARKER */}
              <AdvancedMarker
                position={{ lat: userLocation.lat, lng: userLocation.lng }}
                title="Your Selected Location"
                onClick={() => {
                  setSelectedItem({
                    title: "📍 Your Active Location",
                    subtitle: userLocation.label,
                    details: userLocation.address || `Coordinates: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`,
                    status: "Centered Location · Real-time corridor hubs deployed around this point",
                    badge: "YOUR ORIGIN",
                    badgeColor: "bg-blue-100 text-blue-900",
                    lat: userLocation.lat,
                    lng: userLocation.lng,
                  });
                }}
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
                  <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
                    📍
                  </div>
                </div>
              </AdvancedMarker>

              {/* Station Markers around user's location */}
              {currentStations.map((st) => (
                <AdvancedMarker
                  key={st.id}
                  position={{ lat: st.lat, lng: st.lng }}
                  title={st.name}
                  onClick={() => {
                    setSelectedItem({
                      title: st.name,
                      subtitle: st.corridor,
                      details: `Platform Crowd: ${st.crowdPct}% · ${st.waitingPassengers} Waiting Passengers`,
                      status: st.crowdPct > 80 ? "Critical Platform Saturation" : "Nominal Queue Flow",
                      badge: `${st.crowdPct}% Load`,
                      badgeColor: st.crowdPct > 80 ? "bg-rose-100 text-rose-800" : "bg-blue-100 text-blue-800",
                      lat: st.lat,
                      lng: st.lng,
                    });
                  }}
                >
                  <Pin
                    background={st.crowdPct > 80 ? "#ef4444" : "#2563eb"}
                    borderColor="#ffffff"
                    glyphColor="#ffffff"
                    scale={0.9}
                  />
                </AdvancedMarker>
              ))}

              {/* Transit Vehicles around user's location */}
              {currentVehicles.map((v) => {
                const isAmb = v.type === "ambulance";
                const isBus42 = v.id === "BUS-42";

                return (
                  <AdvancedMarker
                    key={v.id}
                    position={{ lat: v.lat, lng: v.lng }}
                    title={`${v.id} - ${v.line}`}
                    onClick={() => {
                      setSelectedItem({
                        title: `${v.id} · ${v.line}`,
                        subtitle: `Speed: ${v.speed} · Occupancy: ${v.occupancy}`,
                        details: `Schedule Delay: ${v.delay}`,
                        status: v.status,
                        badge: v.type.toUpperCase(),
                        badgeColor: isAmb ? "bg-rose-100 text-rose-800" : "bg-blue-100 text-blue-800",
                        lat: v.lat,
                        lng: v.lng,
                      });
                      if (onSelectVehicle) onSelectVehicle(v);
                    }}
                  >
                    <div className="relative cursor-pointer hover:scale-110 transition-transform">
                      {(isAmb || (isBus42 && tspActive)) && (
                        <div className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${isAmb ? "bg-rose-500" : "bg-emerald-500"}`}></div>
                      )}
                      <div
                        className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono text-white shadow-md flex items-center gap-1 border-2 border-white ${
                          isAmb
                            ? "bg-rose-600"
                            : v.type === "bus"
                            ? "bg-blue-600"
                            : v.type === "tram"
                            ? "bg-sky-600"
                            : "bg-purple-600"
                        }`}
                      >
                        <span>{isAmb ? "🚑" : v.type === "bus" ? "🚌" : v.type === "tram" ? "🚊" : "🤖"}</span>
                        <span>{v.id}</span>
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* Lane Intrusion Incident Marker */}
              <AdvancedMarker
                position={{ lat: userLocation.lat + 0.002, lng: userLocation.lng - 0.004 }}
                title="Bus Lane Blockage Violation"
                onClick={() => {
                  setSelectedItem({
                    title: "Bus Lane 3 Intrusion Incident",
                    subtitle: "Target: Private Sedan (Lic: 7XY-419)",
                    details: "Illegal dwell time: 1 min 45 sec blocking approach for Bus #42",
                    status: "Flagged by YOLOv8 Optical Enforcement · Citation #BL-8812 Issued",
                    badge: "INCIDENT",
                    badgeColor: "bg-rose-100 text-rose-800",
                    lat: userLocation.lat + 0.002,
                    lng: userLocation.lng - 0.004,
                  });
                }}
              >
                <div className="cursor-pointer hover:scale-110 transition-transform">
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-white animate-bounce">
                    !
                  </div>
                </div>
              </AdvancedMarker>

              {/* Active Marker InfoWindow */}
              {selectedItem && (
                <InfoWindow
                  position={{ lat: selectedItem.lat, lng: selectedItem.lng }}
                  onCloseClick={() => setSelectedItem(null)}
                >
                  <div className="p-1 max-w-[240px] text-slate-800 font-sans">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {selectedItem.title}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${selectedItem.badgeColor}`}>
                        {selectedItem.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mb-1">
                      {selectedItem.subtitle}
                    </div>
                    <div className="text-[11px] font-mono font-medium text-slate-700 bg-slate-50 p-1.5 rounded border border-slate-100 mb-1.5">
                      {selectedItem.details}
                    </div>
                    <div className="text-[10px] font-semibold text-blue-700">
                      {selectedItem.status}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>

          {/* Floating Map Legend */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 shadow-md text-xs font-mono space-y-1.5 hidden sm:block">
            <div className="font-bold text-slate-900 font-sans text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Google Maps Live Fleet Grid
            </div>
            <div className="text-[11px] text-slate-600 flex items-center gap-2">
              <span className="text-blue-600 font-bold">📍 Origin</span>
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> BRT Bus
              <span className="w-2 h-2 rounded-full bg-rose-600"></span> Ambulance
              <span className="w-2 h-2 rounded-full bg-purple-600"></span> AV Pod
            </div>
          </div>
        </div>
      ) : (
        /* Schematic Vector Grid Fallback */
        <div className="relative w-full h-[420px] sm:h-[490px] rounded-xl overflow-hidden border border-slate-200 bg-[#f8fafc]">
          <svg viewBox="0 0 440 300" className="w-full h-full" style={{ background: "#f8fafc" }}>
            <defs>
              <pattern id="schematicGrid2" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="440" height="300" fill="url(#schematicGrid2)" />
            <path d="M 70 80 L 220 140" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" fill="none" strokeOpacity="0.9" />
            <path d="M 120 220 L 220 140" stroke="#10b981" strokeWidth="4" strokeLinecap="round" fill="none" strokeOpacity="0.9" />
            <path d="M 220 140 L 330 90 L 350 190" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" fill="none" strokeOpacity="0.9" />
            <circle cx="220" cy="140" r="8" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            <text x="220" y="165" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">
              {userLocation.label}
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};
