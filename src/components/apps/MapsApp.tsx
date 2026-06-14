import React, { useRef, useState, useEffect } from "react";
import { MapPin, ZoomIn, ZoomOut, Compass, Search, Navigation } from "lucide-react";

interface CityCoords {
  name: string;
  lat: string;
  lng: string;
  elevation: string;
  temp: string;
  desc: string;
}

export default function MapsApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [mapStyle, setMapStyle] = useState<"terrain" | "satellite" | "cyber">("cyber");
  const [searchCity, setSearchCity] = useState("");
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const [isFlying, setIsFlying] = useState(false);
  const flyOffsetRef = useRef(0);

  const CITIES: CityCoords[] = [
    { name: "Tokyo, Japan", lat: "35.6762° N", lng: "139.6503° E", elevation: "40 m", temp: "18°C", desc: "Shibuya hub overlay digital vector system" },
    { name: "New York, USA", lat: "40.7128° N", lng: "74.0060° W", elevation: "10 m", temp: "22°C", desc: "Manhattan grid satellite radar analysis" },
    { name: "Paris, France", lat: "48.8566° N", lng: "2.3522° E", elevation: "35 m", temp: "16°C", desc: "Seine valley radial telemetrics" },
    { name: "London, UK", lat: "51.5074° N", lng: "0.1278° W", elevation: "11 m", temp: "14°C", desc: "Thames sector logistics mapping grid" },
    { name: "Sydney, Australia", lat: "33.8688° S", lng: "151.2093° E", elevation: "19 m", temp: "21°C", desc: "Darling harbour coastline scan grids" },
    { name: "Cairo, Egypt", lat: "30.0444° N", lng: "31.2357° E", elevation: "23 m", temp: "29°C", desc: "Nile plateau orthographic delta" }
  ];

  const currentCity = CITIES[activeCityIndex];

  // Panoramic visual scan simulator loop
  useEffect(() => {
    let animationFrame: number;

    const renderMap = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Colors based on rendering themes
      if (mapStyle === "cyber") {
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, w, h);

        // Render abstract map blocks
        ctx.fillStyle = "#0f172a";
        for (let r = 0; r < 5; r++) {
          ctx.fillRect(50 + r * 60, 40 + r * 30, 45, 95);
        }

        // Draw coordinate grid lines
        ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // Animated scan line or crosshair
        ctx.strokeStyle = "rgba(59, 130, 246, 0.45)";
        ctx.beginPath();
        const scanY = (Date.now() / 25) % h;
        ctx.moveTo(0, scanY);
        ctx.lineTo(w, scanY);
        ctx.stroke();

        // Render stylized target location circles
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const circleRadius = 25 * (zoomLevel / 10) + (isFlying ? Math.sin(flyOffsetRef.current) * 10 : 0);
        ctx.arc(w / 2, h / 2, Math.max(10, circleRadius), 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 4, 0, Math.PI * 2);
        ctx.fill();

      } else if (mapStyle === "satellite") {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(0, 0, w, h);

        // Simulated high altitude coastline
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.moveTo(0, h * 0.4);
        ctx.bezierCurveTo(w * 0.3, h * 0.2, w * 0.7, h * 0.8, w, h * 0.5);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        // Green areas
        ctx.fillStyle = "#052e16";
        ctx.fillRect(w * 0.1, h * 0.1, 80, 50);
        ctx.fillRect(w * 0.5, h * 0.2, 50, 40);

        // Center cursor target
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 1;
        ctx.strokeRect(w / 2 - 15, h / 2 - 15, 30, 30);
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 3, 0, Math.PI * 2);
        ctx.fill();

      } else { // Terrain representation
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(0, 0, w, h);

        // Draw topographic fluid lines
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1.2;
        for (let l = 1; l < 6; l++) {
          ctx.beginPath();
          ctx.arc(w / 2, h / 2, l * 40 * (zoomLevel / 12), 0, Math.PI * 2);
          ctx.stroke();
        }

        // River veins
        ctx.strokeStyle = "#93c5fd";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.8);
        ctx.bezierCurveTo(w * 0.4, h * 0.7, w * 0.5, h * 0.3, w, h * 0.2);
        ctx.stroke();

        // Target pins
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Flyover step increments
      if (isFlying) {
        flyOffsetRef.current += 0.05;
        // Mock latitude coordinate shifting
        if (flyOffsetRef.current > Math.PI * 2) {
          setIsFlying(false);
          flyOffsetRef.current = 0;
        }
      }

      animationFrame = requestAnimationFrame(renderMap);
    };

    renderMap();
    return () => cancelAnimationFrame(animationFrame);
  }, [mapStyle, zoomLevel, isFlying, activeCityIndex]);

  const triggerFlyover = () => {
    setIsFlying(true);
    // Expand zoom slightly
    setZoomLevel(15);
  };

  const handleCitySearch = () => {
    if (!searchCity) return;
    const index = CITIES.findIndex(c => c.name.toLowerCase().includes(searchCity.toLowerCase()));
    if (index !== -1) {
      setActiveCityIndex(index);
      setSearchCity("");
    }
  };

  return (
    <div id="maps_canvas_viewport" className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500 text-white shadow-xs">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white leading-none">Google Maps Pro</h2>
            <p className="text-[9px] text-slate-400 mt-0.5">Global Navigation Scanning Suite</p>
          </div>
        </div>

        {/* City Location Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              id="maps_search_input"
              type="text"
              className="pl-8 pr-3 py-1 bg-slate-800 focus:bg-slate-700 text-xxs text-white rounded-lg focus:outline-hidden border border-slate-700/60 focus:ring-1 focus:ring-blue-500"
              placeholder="Search (Tokyo, Cairo...)"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCitySearch();
              }}
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1.5 text-slate-400 pointer-events-none" />
          </div>
          <button 
            id="maps_search_button"
            onClick={handleCitySearch}
            className="p-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Side menu splitter */}
      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {/* Left Side: Real-time telemetry specs */}
        <div className="w-full md:w-56 p-4.5 space-y-4 shrink-0 bg-slate-950/40">
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Map Engine Styles</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {(["cyber", "satellite", "terrain"] as const).map((style) => (
                <button
                  key={style}
                  id={`btn_mapStyle_${style}`}
                  onClick={() => setMapStyle(style)}
                  className={`py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer uppercase ${
                    mapStyle === style 
                      ? "bg-blue-600/20 border-blue-500 text-blue-400" 
                      : "bg-transparent border-slate-800 text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800/60 pt-3.5">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Current Location</h3>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <h4 className="text-xs font-extrabold text-blue-400 truncate flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 animate-spin text-blue-400" /> {currentCity.name}
              </h4>
              <p className="text-[10px] text-slate-300 font-normal leading-snug">{currentCity.desc}</p>
              
              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold font-mono text-slate-400 border-t border-slate-800/80 pt-2 shrink-0">
                <div>
                  <p className="text-[9px] text-slate-500 font-bold">LAT</p>
                  <p className="text-slate-300">{currentCity.lat}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold">LNG</p>
                  <p className="text-slate-300">{currentCity.lng}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold">ALT</p>
                  <p className="text-slate-300">{currentCity.elevation}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold">TEMP</p>
                  <p className="text-emerald-400">{currentCity.temp}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick city presets */}
          <div className="border-t border-slate-800/60 pt-3.5">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Location Presets</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {CITIES.map((city, idx) => (
                <button
                  key={city.name}
                  id={`preset_city_${idx}`}
                  onClick={() => setActiveCityIndex(idx)}
                  className={`p-1.5 rounded-lg text-left text-xxs font-bold truncate border transition-colors cursor-pointer ${
                    activeCityIndex === idx 
                      ? "bg-slate-800 text-blue-400 border-blue-500/30" 
                      : "bg-transparent text-slate-400 border-slate-800/60 hover:bg-slate-900"
                  }`}
                >
                  {city.name.split(",")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Primary Canvas Radar Mapping Pane */}
        <div className="flex-1 bg-slate-950 p-4 relative flex items-center justify-center min-h-[220px]">
          <canvas
            ref={canvasRef}
            width={320}
            height={260}
            className="w-full h-full block border border-slate-800 rounded-xl bg-black"
          />

          {/* Radar HUD Controls Map Floating Pill */}
          <div className="absolute right-8 bottom-8 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 flex flex-col gap-1.5 shadow-xl">
            <button
              id="zoom_in_map"
              onClick={() => setZoomLevel(prev => Math.min(20, prev + 1))}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              id="zoom_out_map"
              onClick={() => setZoomLevel(prev => Math.max(5, prev - 1))}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border-t border-slate-800/60 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          <button
            id="flyover_animation_trigger"
            onClick={triggerFlyover}
            disabled={isFlying}
            className="absolute left-8 bottom-8 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white hover:scale-103 active:scale-97 text-xxs font-bold rounded-full transition-all duration-200 shadow-xl flex items-center gap-1.5 cursor-pointer border border-blue-400/20"
          >
            <Compass className={`w-3.5 h-3.5 ${isFlying ? "animate-spin" : ""}`} />
            {isFlying ? "3D Flyover Scanning..." : "Trigger 3D Flyover"}
          </button>
        </div>
      </div>
    </div>
  );
}
