import React, { useEffect, useState, useRef } from 'react';
import { 
  Plane, 
  BatteryCharging, 
  RadioTower, 
  Navigation, 
  Target, 
  Activity, 
  Play, 
  RotateCcw, 
  ShieldAlert,
  Terminal,
  Wifi,
  Crosshair,
  Map as MapIcon,
  Search,
  ChevronRight,
  Minus,
  Plus
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';

// Fix for Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1.25 });
  }, [center, map]);
  useEffect(() => {
    if (map.getZoom() !== zoom) {
      map.setZoom(zoom);
    }
  }, [zoom, map]);
  return null;
}

function DroneMapEvents({ onPlaceDrone }) {
  useMapEvents({
    click(event) {
      onPlaceDrone([event.latlng.lat, event.latlng.lng]);
    },
  });
  return null;
}

const MIN_MAP_ZOOM = 3;
const MAX_MAP_ZOOM = 18;

const coordinatePattern = /@?(-?\d{1,2}(?:\.\d+)?)[,\s]+(-?\d{1,3}(?:\.\d+)?)/;

function parseCoordinates(query) {
  const match = query.match(coordinatePattern);
  if (!match) return null;

  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return [lat, lng];
}

function cleanSearchQuery(query) {
  return query
    .trim()
    .replace(/^https?:\/\/\S+/i, (url) => {
      try {
        return decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).join(' '));
      } catch {
        return url;
      }
    })
    .replace(/\s+/g, ' ');
}

function getSearchCandidates(query) {
  const cleanedQuery = cleanSearchQuery(query) || query.trim();
  const normalized = cleanedQuery.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const candidates = [cleanedQuery];

  if (/\b(meeca|meca|mekka|mecca|makkah|kaaba|haram)\b/.test(normalized)) {
    candidates.push(
      'Mecca Saudi Arabia',
      'Makkah Saudi Arabia',
      'Masjid al-Haram Makkah Saudi Arabia',
    );
  }

  if (!/\b(india|usa|united states|saudi arabia|uae|dubai|uk|canada|australia)\b/.test(normalized)) {
    candidates.push(`${cleanedQuery} city`, `${cleanedQuery} landmark`);
  }

  return [...new Set(candidates.filter(Boolean))];
}

function getKnownPlaceFallback(query) {
  const normalized = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (/\b(meeca|meca|mekka|mecca|makkah|kaaba|haram)\b/.test(normalized)) {
    return {
      coords: [21.422487, 39.826206],
      label: 'Masjid al-Haram, Mecca / Makkah, Saudi Arabia',
    };
  }
  return null;
}

function formatNominatimResult(result) {
  return result.display_name || [result.name, result.type, result.address?.city, result.address?.country].filter(Boolean).join(', ');
}

function formatPhotonResult(feature) {
  const props = feature.properties || {};
  return [props.name, props.street, props.city, props.state, props.country].filter(Boolean).join(', ');
}

const DroneSimulationPage = () => {
  const [status, setStatus] = useState('Standby'); 
  const [battery, setBattery] = useState(100);
  const [altitude, setAltitude] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [logs, setLogs] = useState(['[SYSTEM] Aegis Drone v4.2 Initialized.', '[SYSTEM] GPS Lock Acquired.']);
  const [activeWaypoint, setActiveWaypoint] = useState(0);
  
  // Geolocation State
  const [searchQuery, setSearchQuery] = useState('');
  const [targetAddress, setTargetAddress] = useState('Current browser location');
  const [currentPos, setCurrentPos] = useState([19.0760, 72.8777]); 
  const [dronePos, setDronePos] = useState([19.0760, 72.8777]);
  const [zoom, setZoom] = useState(16);
  const [isSearching, setIsSearching] = useState(false);
  
  const timerRef = useRef(null);

  const zoomIn = () => {
    setZoom((currentZoom) => Math.min(MAX_MAP_ZOOM, currentZoom + 1));
  };

  const zoomOut = () => {
    setZoom((currentZoom) => Math.max(MIN_MAP_ZOOM, currentZoom - 1));
  };

  const placeDroneAt = (coords, label = 'Selected map location') => {
    setCurrentPos(coords);
    setDronePos(coords);
    setTargetAddress(label);
    addLog(`Drone set to: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`);
  };

  const waypoints = [
    { name: 'Launchpad Delta', action: 'Takeoff', alt: 120 },
    { name: 'Target Perimeter', action: 'Scanning Terrain', alt: 150 },
    { name: 'Critical Corridor', action: 'Thermal Inspection', alt: 100 },
    { name: 'Secondary Sector', action: 'Search for Victims', alt: 80 },
    { name: 'Command Base', action: 'Land', alt: 0 },
  ];

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  // Get user's real location initially
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        placeDroneAt([latitude, longitude], 'Current browser location');
        addLog(`Initial GPS Lock: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      });
    }
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const rawQuery = searchQuery.trim();
    if (!rawQuery) return;
    
    setIsSearching(true);
    addLog(`Searching for target zone: "${rawQuery}"...`);
    
    try {
      const parsedCoords = parseCoordinates(rawQuery);
      if (parsedCoords) {
        placeDroneAt(parsedCoords, `Coordinates: ${parsedCoords[0].toFixed(6)}, ${parsedCoords[1].toFixed(6)}`);
        setZoom(17);
        addLog('Target Found: coordinates detected from search.');
        addLog(`Relocating drone to target coordinates.`);
        return;
      }

      const searchCandidates = getSearchCandidates(rawQuery);

      for (const candidate of searchCandidates) {
        const nominatimParams = new URLSearchParams({
          format: 'jsonv2',
          q: candidate,
          limit: '5',
          addressdetails: '1',
          dedupe: '1',
          namedetails: '1',
          'accept-language': 'en',
        });
        const nominatimResponse = await fetch(`https://nominatim.openstreetmap.org/search?${nominatimParams.toString()}`);
        const nominatimData = nominatimResponse.ok ? await nominatimResponse.json() : [];
        const nominatimMatch = nominatimData.find((item) => item.lat && item.lon);

        if (nominatimMatch) {
          const newCoords = [parseFloat(nominatimMatch.lat), parseFloat(nominatimMatch.lon)];
          const label = formatNominatimResult(nominatimMatch);
          placeDroneAt(newCoords, label);
          setSearchQuery(label);
          setZoom(17);
          addLog(`Target Found: ${label}`);
          addLog(`Relocating drone to target coordinates.`);
          return;
        }
      }

      for (const candidate of searchCandidates) {
        const photonParams = new URLSearchParams({ q: candidate, limit: '5', lang: 'en' });
        const photonResponse = await fetch(`https://photon.komoot.io/api/?${photonParams.toString()}`);
        const photonData = photonResponse.ok ? await photonResponse.json() : { features: [] };
        const photonMatch = photonData.features?.find((feature) => feature.geometry?.coordinates?.length >= 2);

        if (photonMatch) {
          const [lng, lat] = photonMatch.geometry.coordinates;
          const label = formatPhotonResult(photonMatch) || candidate;
          placeDroneAt([lat, lng], label);
          setSearchQuery(label);
          setZoom(17);
          addLog(`Target Found: ${label}`);
          addLog(`Relocating drone to target coordinates.`);
          return;
        }
      }

      const knownPlace = getKnownPlaceFallback(rawQuery);
      if (knownPlace) {
        placeDroneAt(knownPlace.coords, knownPlace.label);
        setSearchQuery(knownPlace.label);
        setZoom(17);
        addLog(`Target Found: ${knownPlace.label}`);
        addLog(`Relocating drone to target coordinates.`);
        return;
      }

      addLog('ERROR: Target location not found. Try adding city, state, or country.');
    } catch (error) {
      addLog('ERROR: Connection to satellite database failed.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLaunch = () => {
    if (status !== 'Standby') return;
    setStatus('Launching');
    setZoom(MAX_MAP_ZOOM); // Closest reliable satellite mission detail
    addLog('Initiating launch sequence...');
    
    timerRef.current = setInterval(() => {
      setAltitude(prev => {
        if (prev >= 120) {
          clearInterval(timerRef.current);
          setStatus('Surveying');
          addLog('Target altitude reached. Commencing high-res recon.');
          startSurvey();
          return 120;
        }
        return prev + 5;
      });
      setBattery(prev => Math.max(0, prev - 0.05));
    }, 100);
  };

  const startSurvey = () => {
    let step = 0;
    timerRef.current = setInterval(() => {
      if (step >= 20) {
        clearInterval(timerRef.current);
        setStatus('RTL');
        addLog('Mission complete. Returning to launch.');
        handleRTL();
        return;
      }
      
      setDronePos(prev => [prev[0] + 0.0002, prev[1] + 0.0002]);
      setSpeed(45 + Math.random() * 5);
      setDistance(prev => prev + 0.05);
      setBattery(prev => Math.max(0, prev - 0.2));
      
      if (step % 5 === 0) {
        const wpIdx = Math.floor(step / 5) + 1;
        setActiveWaypoint(wpIdx);
        addLog(`Executing: ${waypoints[wpIdx]?.action || 'Final Approach'}`);
      }
      
      step++;
    }, 2000);
  };

  const handleRTL = () => {
    setZoom(14);
    addLog('Landing sequence initiated...');
    setTimeout(() => {
      setStatus('Landed');
      setSpeed(0);
      setAltitude(0);
      addLog('Drone landed safely.');
    }, 5000);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setStatus('Standby');
    setBattery(100);
    setAltitude(0);
    setSpeed(0);
    setDistance(0);
    setActiveWaypoint(0);
    setDronePos(currentPos);
    setZoom(17);
    setLogs(['[SYSTEM] Ready for new mission at target location.']);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <PageHeader 
          title="Target Reconnaissance" 
          description="Search any location worldwide, set the drone there, and inspect the surrounding satellite map freely." 
        />
        <div className="flex gap-3">
          <button onClick={handleReset} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button 
            onClick={handleLaunch}
            disabled={status !== 'Standby'}
            className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl ${
              status === 'Standby' 
                ? 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 active:scale-95' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            Launch Mission
          </button>
        </div>
      </div>

      {/* Target Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <form onSubmit={handleSearch}>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter target location (e.g. Mumbai, New York, or specific address)..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-950 placeholder:text-slate-400 caret-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </form>
        </div>
        <button 
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
        >
          {isSearching ? 'Locating...' : 'Set Drone'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Plane} label="Drone Link" value={status} tone={status === 'Surveying' ? 'indigo' : 'slate'} />
        <StatCard icon={BatteryCharging} label="Battery" value={`${battery.toFixed(1)}%`} tone={battery < 20 ? 'danger' : 'indigo'} />
        <StatCard icon={MapIcon} label="Target Lock" value={searchQuery ? 'Custom' : 'Local'} helper={`${dronePos[0].toFixed(5)}, ${dronePos[1].toFixed(5)}`} tone="indigo" />
        <StatCard icon={Wifi} label="Link Strength" value="98.4dB" tone="indigo" />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <MapIcon className="mt-0.5 h-5 w-5 flex-none text-indigo-600" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Complete Target Location</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-900">{targetAddress}</p>
                </div>
              </div>
              <div className="flex flex-none items-center gap-2">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoom <= MIN_MAP_ZOOM}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition-all hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Zoom out"
                  title="Zoom out"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <div className="min-w-20 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-xs font-black text-slate-900">
                  {zoom}x
                </div>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoom >= MAX_MAP_ZOOM}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-900 text-white shadow-sm transition-all hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Zoom in"
                  title="Zoom in"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-black rounded-[40px] p-2 h-[550px] relative overflow-hidden border-4 border-slate-800 shadow-2xl">
            
            <MapContainer 
              center={dronePos} 
              zoom={zoom} 
              minZoom={MIN_MAP_ZOOM}
              maxZoom={MAX_MAP_ZOOM}
              className="h-full w-full rounded-[32px] overflow-hidden"
              zoomControl={true}
              dragging={true}
              touchZoom={true}
              doubleClickZoom={true}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Satellite imagery &copy; Esri"
                maxZoom={MAX_MAP_ZOOM}
                maxNativeZoom={MAX_MAP_ZOOM}
              />
              <TileLayer
                url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
                attribution="Routes &copy; Esri"
                maxZoom={MAX_MAP_ZOOM}
                maxNativeZoom={MAX_MAP_ZOOM}
                opacity={0.8}
              />
              <TileLayer
                url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                attribution="Labels &copy; Esri"
                maxZoom={MAX_MAP_ZOOM}
                maxNativeZoom={MAX_MAP_ZOOM}
                opacity={0.9}
              />
              <MapUpdater center={dronePos} zoom={zoom} />
              <DroneMapEvents onPlaceDrone={placeDroneAt} />
              <Marker position={dronePos}>
                <Popup>
                  <strong>Target location</strong>
                  <br />
                  {targetAddress}
                  <br />
                  {dronePos[0].toFixed(6)}, {dronePos[1].toFixed(6)}
                </Popup>
              </Marker>
            </MapContainer>

            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute inset-0 border-[40px] border-black/25" />
              <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_58%,rgba(0,0,0,0.28)_100%)]" />
              
              {status === 'Surveying' && (
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-indigo-500/10 animate-pulse" />
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <Crosshair className={`w-20 h-20 text-white/40 transition-all ${status === 'Surveying' ? 'scale-110' : 'scale-100'}`} />
              </div>

              <div className="absolute top-10 left-10 right-10 flex justify-between items-start font-mono">
                <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex gap-8 shadow-2xl text-white">
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">ALT</p>
                    <p className="text-2xl font-bold">{altitude}m</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">SPD</p>
                    <p className="text-2xl font-bold">{speed.toFixed(1)}<span className="text-xs text-slate-400">km/h</span></p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">DST</p>
                    <p className="text-2xl font-bold">{distance.toFixed(2)}<span className="text-xs text-slate-400">km</span></p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="bg-indigo-600 px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-indigo-900/50">
                    <div className={`w-2 h-2 bg-white rounded-full ${status === 'Surveying' ? 'animate-pulse' : 'opacity-50'}`} />
                    Tactical Feed
                  </div>
                  <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-white text-[10px] font-bold">
                    HD: 4K RES
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 right-10">
                <div className="relative w-24 h-24 border-2 border-indigo-500/20 rounded-full flex items-center justify-center bg-black/40 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent animate-spin duration-[4000ms]" />
                  <Target className="w-6 h-6 text-indigo-400 opacity-60" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-indigo-600" />
                Mission Waypoints
              </h3>
              <div className="space-y-3">
                {waypoints.map((wp, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    i === activeWaypoint ? 'border-indigo-600 bg-indigo-50' : 'border-slate-50 opacity-60'
                  }`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                      i <= activeWaypoint ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${i === activeWaypoint ? 'text-indigo-900' : 'text-slate-600'}`}>{wp.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{wp.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                Local Analytics
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Cloud Coverage', val: 'Minimal', color: 'text-emerald-600' },
                  { label: 'Ground Texture', val: 'Clear', color: 'text-indigo-600' },
                  { label: 'Thermal Sig', val: 'Searching...', color: 'text-slate-600' },
                  { label: 'Encryption', val: 'AES-256', color: 'text-indigo-600' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-500">{item.label}</span>
                    <span className={`text-xs font-black ${item.color}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-8 flex flex-col h-[750px]">
          <div className="flex items-center gap-2 mb-8 text-indigo-500">
            <Terminal className="w-5 h-5" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Satellite Command Console</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 font-mono text-[11px] custom-scrollbar pr-3">
            {logs.map((log, i) => (
              <div key={i} className={`p-3 rounded-xl border-l-4 ${
                log.includes('SYSTEM') ? 'text-indigo-300 border-indigo-500 bg-indigo-500/5' : 'text-slate-400 border-slate-800 bg-white/5'
              }`}>
                {log}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800">
            <p className="text-[9px] text-slate-600 italic text-center font-bold tracking-widest">
              SYSTEM CONNECTED TO GLOBAL SAT-NET
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneSimulationPage;
