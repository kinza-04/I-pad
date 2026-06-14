import React, { useState, useEffect } from "react";
import { PLAY_STORE_APPS, WALLPAPERS } from "./data";
import { PlayApp } from "./types";
import { 
  Settings as SettingsIcon, FileText, Camera as CameraIcon, Play, Radio, Sparkles, 
  Wifi, Bluetooth, Battery, BatteryCharging, Lock, Unlock, ArrowDown, ChevronRight,
  Bell, Check, X, Tablet, Gamepad2, Paintbrush, Music, MapPin, Calculator as CalcIcon,
  HelpCircle, Globe, TrendingUp, Sun, Volume2, Moon
} from "lucide-react";

// Sub-app imports
import PlayStoreApp from "./components/apps/PlayStoreApp";
import GeminiApp from "./components/apps/GeminiApp";
import PaintApp from "./components/apps/PaintApp";
import GameApp from "./components/apps/GameApp";
import SpotifyApp from "./components/apps/SpotifyApp";
import MapsApp from "./components/apps/MapsApp";
import CalculatorApp from "./components/apps/CalculatorApp";
import NotesApp from "./components/apps/NotesApp";
import CameraApp from "./components/apps/CameraApp";
import SettingsApp from "./components/apps/SettingsApp";
import SafariApp from "./components/apps/SafariApp";
import StocksApp from "./components/apps/StocksApp";
import GoogleApp from "./components/apps/GoogleApp";
import YouTubeApp from "./components/apps/YouTubeApp";
import GitHubApp from "./components/apps/GitHubApp";

export default function App() {
  // Lock screen state
  const [isLocked, setIsLocked] = useState(true);

  // Tablet settings and telemetry
  const [tabletName, setTabletName] = useState("kinza@murtaza");
  const [activeWallpaperId, setActiveWallpaperId] = useState("cosmic-mist");
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [isCharging, setIsCharging] = useState(false);
  const [soundVolume, setSoundVolume] = useState(65);
  const [screenBrightness, setScreenBrightness] = useState(90);
  const [nightShiftActive, setNightShiftActive] = useState(false);
  
  // Apps databases
  const [apps, setApps] = useState<PlayApp[]>(PLAY_STORE_APPS);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);

  // Time hooks for dynamic widget updating
  const [currentTime, setCurrentTime] = useState(new Date());

  // Notification overlays
  const [notifications, setNotifications] = useState<string[]>([
    "Subsystem initialized successfully.",
    "Google Play Protections verified."
  ]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Standard Clock hook
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Standard charging simulation
  useEffect(() => {
    const batteryTimer = setInterval(() => {
      setBatteryLevel(prev => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 35000);
    return () => clearInterval(batteryTimer);
  }, []);

  // Trigger simulated application installation
  const handleInstallApp = (id: string, progressCallback: (prog: number) => void, onComplete: () => void) => {
    setApps(prevApps => 
      prevApps.map(app => (app.id === id ? { ...app, installing: true, progress: 0 } : app))
    );

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 20) + 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        setApps(prevApps => 
          prevApps.map(app => (app.id === id ? { ...app, installing: false, isInstalled: true, progress: 100 } : app))
        );

        // Add a notification
        setNotifications(prev => [
          `Installed: "${PLAY_STORE_APPS.find(a => a.id === id)?.name || id}" successfully.`,
          ...prev
        ]);

        onComplete();
      } else {
        setApps(prevApps => 
          prevApps.map(app => (app.id === id ? { ...app, progress: currentProgress } : app))
        );
        progressCallback(currentProgress);
      }
    }, 400);
  };

  const handleLaunchApp = (id: string) => {
    setActiveAppId(id);
  };

  const handleCloseActiveApp = () => {
    setActiveAppId(null);
  };

  const activeWallpaper = WALLPAPERS.find(w => w.id === activeWallpaperId) || WALLPAPERS[0];

  // Helper mapping to return standard app components
  const renderAppContent = () => {
    // Dynamically intercept gaming applications to route to unified, high-fidelity GameApp engine!
    const activeApp = apps.find(a => a.id === activeAppId);
    if (activeApp && activeApp.category === "gaming") {
      return <GameApp gameId={activeApp.id} gameName={activeApp.name} />;
    }

    switch (activeAppId) {
      case "playstore":
        return (
          <PlayStoreApp 
            apps={apps} 
            onInstallApp={handleInstallApp} 
            onLaunchApp={handleLaunchApp} 
          />
        );
      case "gemini":
        return <GeminiApp />;
      case "google":
        return <GoogleApp />;
      case "youtube":
        return <YouTubeApp />;
      case "github":
        return <GitHubApp />;
      case "paint":
        return <PaintApp />;
      case "game":
        return <GameApp gameId="game" gameName="Astro Runner (Classic Arcade)" />;
      case "spotify":
        return <SpotifyApp />;
      case "maps":
        return <MapsApp />;
      case "calculator":
        return <CalculatorApp />;
      case "notes":
        return <NotesApp />;
      case "camera":
        return <CameraApp />;
      case "safari":
        return <SafariApp />;
      case "stocks":
        return <StocksApp />;
      case "settings":
        return (
          <SettingsApp
            tabletName={tabletName}
            onUpdateTabletName={setTabletName}
            activeWallpaperId={activeWallpaperId}
            onUpdateWallpaper={setActiveWallpaperId}
            wifiEnabled={wifiEnabled}
            onToggleWifi={() => setWifiEnabled(!wifiEnabled)}
            bluetoothEnabled={bluetoothEnabled}
            onToggleBluetooth={() => setBluetoothEnabled(!bluetoothEnabled)}
          />
        );
      default:
        return null;
    }
  };

  // Pre-loaded desktop apps that are ALWAYS installed (pre-installed Core iPad suite!)
  const preInstalledApps = [
    { id: "safari", name: "Safari Browser", icon: "Globe", color: "bg-blue-600", rawIcon: <Globe className="w-5.5 h-5.5 text-white" /> },
    { id: "notes", name: "Notepad Docs", icon: "FileText", color: "bg-amber-500", rawIcon: <FileText className="w-5.5 h-5.5 text-white" /> },
    { id: "camera", name: "FaceTime & Filters", icon: "CameraIcon", color: "bg-pink-500", rawIcon: <CameraIcon className="w-5.5 h-5.5 text-white" /> },
    { id: "stocks", name: "Stocks Terminal", icon: "TrendingUp", color: "bg-neutral-900 border border-slate-800", rawIcon: <TrendingUp className="w-5.5 h-5.5 text-emerald-450" /> },
    { id: "settings", name: "Settings", icon: "SettingsIcon", color: "bg-slate-500", rawIcon: <SettingsIcon className="w-5.5 h-5.5 text-white" /> },
    { id: "github", name: "GitHub Client", icon: "🐈", color: "bg-zinc-800 border border-slate-800", rawIcon: <span className="text-xl select-none">🐈</span> },
    { id: "playstore", name: "Google Play", icon: "Play", color: "bg-emerald-600", rawIcon: (
      <svg className="w-5.5 h-5.5 fill-current text-white" viewBox="0 0 24 24">
        <path d="M5.25 3c-.221 0-.411.121-.516.3l9.023 9.023 2.766-2.766L5.766 3.19A1.49 1.49 0 0 0 5.25 3zM3 4.234v15.53l9.316-9.317L3 4.234zm13.344 6.784l2.89 2.89c.334-.334.516-.793.516-1.282 0-.422-.133-.822-.363-1.155L16.344 11.018zM5.766 20.81l10.742-6.195-2.61-2.61L4.734 20.7c.304.072.637.104.945.104c.03 0 .058 0 .087.006z" />
      </svg>
    ) },
  ];

  // Dynamically group downloaded apps
  const downloadedApps = apps.filter(app => app.isInstalled);

  // Helper icons mapper for home page downloaded lists
  const getAppRowIcon = (id: string) => {
    const app = apps.find(a => a.id === id);
    if (app) {
      if (app.icon === "Sparkles") {
        return <Sparkles className="w-5.5 h-5.5 text-white fill-current animate-pulse text-indigo-300" />;
      }
      if (app.icon === "Paintbrush" || app.icon === "🎨") {
        return <Paintbrush className="w-5.5 h-5.5 text-white" />;
      }
      if (app.icon === "Music" || app.icon === "🎵") {
        return <Music className="w-5.5 h-5.5 text-white" />;
      }
      if (app.icon === "MapPin" || app.icon === "📍") {
        return <MapPin className="w-5.5 h-5.5 text-white" />;
      }
      if (app.icon === "Calculator" || app.icon === "🧮") {
        return <CalcIcon className="w-5.5 h-5.5 text-white" />;
      }
      // If it has an emoji-like icon or symbol
      if (app.icon.length < 4) {
        return <span className="text-2xl select-none leading-none flex items-center justify-center font-semibold text-white">{app.icon}</span>;
      }
    }

    switch (id) {
      case "gemini":
        return <Sparkles className="w-5.5 h-5.5 text-white fill-current text-indigo-300 animate-pulse" />;
      case "paint":
        return <Paintbrush className="w-5.5 h-5.5 text-white" />;
      case "game":
        return <Gamepad2 className="w-5.5 h-5.5 text-white" />;
      case "spotify":
        return <Music className="w-5.5 h-5.5 text-white" />;
      case "maps":
        return <MapPin className="w-5.5 h-5.5 text-white" />;
      case "calculator":
        return <CalcIcon className="w-5.5 h-5.5 text-white" />;
      default:
        return <HelpCircle className="w-5.5 h-5.5 text-white" />;
    }
  };

  return (
    <div id="root_viewport" className="min-h-screen bg-gradient-to-tr from-[#1a1c2c] via-[#4a192c] to-[#121420] flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden overflow-y-auto relative">
      
      {/* Background Text Decor */}
      <div className="absolute top-10 left-10 text-white/5 text-7xl md:text-8xl font-black uppercase tracking-tighter select-none pointer-events-none z-0 leading-none">
        iPad Pro <br/> x Android
      </div>

      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_30%,#3b82f6_0%,transparent_50%),radial-gradient(circle_at_80%_70%,#ec4899_0%,transparent_50%)] pointer-events-none z-0"></div>
      
      {/* Dynamic iPad outer structural hardware mock borders */}
      <div 
        style={{ 
          filter: nightShiftActive ? "sepia(0.35) saturate(1.15) contrast(0.95)" : "none"
        }}
        className="relative border-[14px] border-slate-900 bg-black rounded-[48px] shadow-2xl max-w-4xl w-full aspect-[4/3] overflow-hidden flex flex-col justify-stretch z-10 transition-all duration-300"
      >
        
        {/* Dynamic hardware brightness overlay */}
        <div 
          style={{ opacity: Math.max(0, 1 - screenBrightness / 100) }}
          className="absolute inset-0 bg-black pointer-events-none z-50 transition-opacity duration-300" 
        />
        
        {/* iPad Top Bezel Accessory notch (Front Camera Eye) */}
        <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-800 rounded-full z-50 border border-slate-900 pointer-events-none" />

        {/* Lock Screen Display Context */}
        {isLocked ? (
          <div 
            style={{ background: activeWallpaper.url }} 
            className="absolute inset-0 z-40 flex flex-col justify-between p-12 text-white animate-fade-in relative overflow-hidden"
          >
            {/* Ambient workspace glass mesh overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xs pointer-events-none z-0" />

            {/* Top Date & Widget columns */}
            <div className="space-y-4 z-10 relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold tracking-wider text-slate-300 font-mono uppercase drop-shadow-sm">
                    {currentTime.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                  <h1 className="text-6xl font-black mt-2 leading-none font-sans select-none tracking-tight drop-shadow-md">
                    {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </h1>
                </div>

                {/* Battery state indicators widget with premium Frosted Glass styling */}
                <div className="bg-white/10 backdrop-blur-xl p-4 rounded-[22px] border border-white/20 shadow-xl flex items-center gap-3">
                  <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden">
                    <Battery className="w-10 h-10 text-emerald-300 stroke-[1.5px]" />
                    <span className="absolute text-[10px] font-black font-mono mt-0.5">{batteryLevel}%</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-white/50 uppercase leading-none">Status</p>
                    <p className="text-xs font-extrabold text-white mt-1">Charging Idle</p>
                  </div>
                </div>
              </div>

              {/* Personal Welcome Badge widget with premium Frosted Glass styling */}
              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 w-fit max-w-xs shadow-xl">
                <p className="text-[9px] text-white/50 uppercase font-black tracking-widest leading-none">Apple ID</p>
                <p className="text-sm font-extrabold mt-1 max-w-xs">{tabletName}</p>
              </div>
            </div>

            {/* Bottom Swipe / Unlock trigger panel */}
            <div className="flex flex-col items-center gap-3 z-10 relative">
              <button
                id="unlock_ipad_button"
                onClick={() => setIsLocked(false)}
                className="group px-7 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/25 rounded-2xl flex items-center gap-2.5 font-bold text-xs shadow-xl hover:scale-103 active:scale-97 transition-all cursor-pointer select-none"
              >
                <Unlock className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" /> 
                Tap to Unlock Subsystem
              </button>
              <p className="text-[10px] text-slate-200 font-medium drop-shadow-sm">Equipped with active Google Play Shield</p>
            </div>
          </div>
        ) : (
          /* Locked State Evaluated False: Interactive Live iPad OS screen frame! */
          <div 
            style={{ background: activeWallpaper.url }} 
            className="flex-1 flex flex-col justify-between text-slate-100 select-none relative overflow-hidden"
          >
            {/* Ambient workspace glass mesh overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xs pointer-events-none z-0" />

            {/* iPadOS top Status bar info grid with Frosted Glass styling */}
            <div className="relative z-30 px-6 py-2.5 bg-white/10 backdrop-blur-md border-b border-white/10 flex justify-between items-center text-xs shrink-0 font-medium select-none text-white font-sans">
              
              {/* Left clock */}
              <div className="flex items-center gap-1">
                <span>{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>

              {/* Center PlayStore warning or notification banner */}
              <p className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 bg-emerald-400/25 text-emerald-100 rounded-full border border-white/20 backdrop-blur-xs">
                iPad With G-Play Protect
              </p>

              {/* Right signals (WiFi, Bluetooth, Battery) */}
              <div className="flex items-center gap-3.5 relative">
                <button
                  id="notifications_menu_toggle"
                  onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                  className="p-1.5 hover:bg-white/15 rounded-md transition-colors relative"
                  title="Notifications logs"
                >
                  <Bell className="w-3.5 h-3.5 text-white" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  )}
                </button>

                <div className="flex items-center gap-1.5 font-semibold text-[10px]">
                  {wifiEnabled ? <Wifi className="w-3.5 h-3.5 text-emerald-300" /> : <Wifi className="w-3.5 h-3.5 text-slate-400 opacity-50" />}
                  {bluetoothEnabled ? <Bluetooth className="w-3.5 h-3.5 text-indigo-300" /> : <Bluetooth className="w-3.5 h-3.5 text-slate-400 opacity-50" />}
                </div>

                <div className="flex items-center gap-1 font-mono">
                  <span>{batteryLevel}%</span>
                  <Battery className="w-4 h-4 text-emerald-300 stroke-2" />
                </div>

                {/* Floating drop-down system notifications logger in Frosted glass style */}
                {showNotificationsDropdown && (
                  <div className="absolute right-0 top-8 w-64 bg-slate-950/75 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl z-50 text-slate-100">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                      <span className="text-[10px] uppercase font-bold text-white/50">System Logs ({notifications.length})</span>
                      <button 
                        onClick={() => setNotifications([])}
                        className="text-[9px] text-rose-400 hover:text-rose-300 font-bold"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-[10px] text-white/40 font-medium italic text-center py-4">No active logs.</p>
                      ) : (
                        notifications.map((not, idx) => (
                          <div key={idx} className="bg-white/5 p-2 rounded-lg text-[10px] text-slate-200 border border-white/5 leading-relaxed">
                            {not}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Desktop grid view container */}
            <div className="flex-1 flex gap-6 p-6 overflow-hidden z-10 relative">
              
              {/* Left Sidebar Widgets Segment (Presents real system info, widgets) */}
              <div className="w-52 shrink-0 flex flex-col gap-4 hidden md:flex overflow-y-auto pr-1">
                
                {/* Analog Widget: Calendar/Time details with beautiful frosted glass style */}
                <div className="bg-white/10 backdrop-blur-xl px-4.5 py-3 rounded-2xl border border-white/20 text-white flex flex-col justify-between min-h-[90px] shadow-xl hover:bg-white/15 transition-all duration-300">
                  <div>
                    <p className="text-[10px] uppercase font-black text-rose-300 tracking-wider">Today</p>
                    <h5 className="text-xl font-black mt-1 leading-none drop-shadow-xs">
                      {currentTime.toLocaleDateString([], { day: "numeric" })}
                    </h5>
                    <p className="text-[11px] font-bold text-slate-200 mt-0.5">
                      {currentTime.toLocaleDateString([], { weekday: "long" })}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold font-mono text-white/40 text-right uppercase">iPad Widget</span>
                      {/* Subsystem specs: Apple ID / Google Play compatibility info with Frosted Glass styling */}
                <div className="bg-white/10 backdrop-blur-xl p-3.5 rounded-2xl border border-white/20 text-white shadow-xl space-y-1 hover:bg-white/15 transition-all duration-300">
                  <p className="text-[9.5px] font-black uppercase text-emerald-300 tracking-wider">Subsystem Info</p>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-300 font-bold">OS Version:</span>
                    <span className="font-mono text-emerald-300">v18.42</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-300 font-bold">Containers:</span>
                    <span className="font-mono text-emerald-300 text-right">Dockerized</span>
                  </div>
                </div>

                {/* Interactive Apple Control Center Panel */}
                <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 text-white shadow-xl space-y-3 hover:bg-white/15 transition-all duration-300 text-left">
                  <p className="text-[10px] font-black uppercase text-indigo-300 tracking-wider">Control Center</p>
                  
                  {/* Screen Brightness Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-200">
                      <span className="flex items-center gap-1"><Sun className="w-3 h-3 text-amber-300" /> Brightness</span>
                      <span>{screenBrightness}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="15" 
                      max="100" 
                      value={screenBrightness}
                      onChange={(e) => setScreenBrightness(Number(e.target.value))}
                      className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                    />
                  </div>

                  {/* Volume Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-200">
                      <span className="flex items-center gap-1"><Volume2 className="w-3 h-3 text-sky-300" /> Volume</span>
                      <span>{soundVolume}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={soundVolume}
                      onChange={(e) => setSoundVolume(Number(e.target.value))}
                      className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                    />
                  </div>

                  {/* Night Shift Toggle */}
                  <div className="flex items-center justify-between pt-1 text-[9.5px] font-bold text-slate-200 border-t border-white/10">
                    <span className="flex items-center gap-1"><Moon className="w-3 h-3 text-indigo-300" /> Night Shift</span>
                    <button 
                      onClick={() => setNightShiftActive(!nightShiftActive)}
                      className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-tight cursor-pointer border ${
                        nightShiftActive 
                          ? "bg-amber-950/40 text-amber-305 border-amber-500/40" 
                          : "bg-black/30 text-slate-400 border-white/5"
                      }`}
                    >
                      {nightShiftActive ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>

                {/* System Storage Widget with Frosted Glass styling */}
                <div className="bg-white/10 backdrop-blur-xl p-3.5 rounded-2xl border border-white/20 text-white shadow-xl space-y-2 hover:bg-white/15 transition-all duration-300 text-left">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase text-indigo-300 tracking-wider">Device Storage</p>
                    <span className="text-[9px] font-bold text-slate-350">114.2GB GB Used</span>
                  </div>
                  <div className="w-full bg-black/35 h-2 rounded-full overflow-hidden p-[2px] border border-white/5">
                    <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-full rounded-full w-[22%]" />
                  </div>
                </div>            </div>
              </div>

              {/* Primary Workstation App Grid Context */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-6 content-start pb-6">
                  
                  {/* Map pre-installed core items */}
                  {preInstalledApps.map((subApp) => (
                    <button
                      id={`home_app_pre_${subApp.id}`}
                      key={subApp.id}
                      onClick={() => handleLaunchApp(subApp.id)}
                      className="group flex flex-col items-center text-center gap-1.5 bg-transparent border-0 cursor-pointer outline-hidden shrink-0"
                    >
                      <div className={`w-14 h-14 ${subApp.color} rounded-2xl shadow-xl border border-white/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center relative`}>
                        {subApp.rawIcon}
                        {/* Apple Core Indicator Dot */}
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/40 rounded-full" />
                      </div>
                      <span className="text-[10px] font-bold tracking-tight text-white drop-shadow-md text-shadow-sm truncate w-16 group-hover:scale-102 transition-transform">
                        {subApp.name}
                      </span>
                    </button>
                  ))}

                  {/* Render Downloaded items from Google Play Store */}
                  {downloadedApps.map((subApp) => (
                    <button
                      id={`home_app_downloaded_${subApp.id}`}
                      key={subApp.id}
                      onClick={() => handleLaunchApp(subApp.id)}
                      className="group flex flex-col items-center text-center gap-1.5 bg-transparent border-0 cursor-pointer outline-hidden shrink-0 animate-fade-in"
                    >
                      <div className={`w-14 h-14 ${subApp.iconColor} rounded-2xl shadow-xl border border-white/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center relative`}>
                        {getAppRowIcon(subApp.id)}
                        {/* Android Subsystem Indicator Dot */}
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-450 rounded-full" />
                      </div>
                      <span className="text-[10px] font-bold tracking-tight text-white drop-shadow-md text-shadow-sm truncate w-16 group-hover:scale-102 transition-transform">
                        {subApp.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom standard Dock (mimicking real iPadOS drawer dock) featuring Frosted Glass styling */}
            <div className="relative shrink-0 flex justify-center pb-4 px-6 z-30">
              <div className="px-5 py-2.5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[28px] flex items-center gap-4 shadow-2xl">
                
                {/* Preinstalled apps in Dock */}
                {preInstalledApps.map((subApp) => (
                  <button
                    id={`dock_app_pre_${subApp.id}`}
                    key={subApp.id}
                    onClick={() => handleLaunchApp(subApp.id)}
                    className="p-1 hover:scale-115 active:scale-90 transition-all duration-200 cursor-pointer outline-hidden"
                    title={subApp.name}
                  >
                    <div className={`w-11 h-11 ${subApp.color} rounded-xl flex items-center justify-center shadow-lg border border-white/15 relative`}>
                      {subApp.rawIcon}
                    </div>
                  </button>
                ))}

                {/* Simple partition divider between preinstalled and downloaded running apps */}
                {downloadedApps.length > 0 && <span className="w-px h-8 bg-white/10" />}

                {/* Downloaded apps inside Dock */}
                {downloadedApps.slice(0, 3).map((subApp) => (
                  <button
                    id={`dock_app_downloaded_${subApp.id}`}
                    key={subApp.id}
                    onClick={() => handleLaunchApp(subApp.id)}
                    className="p-1 hover:scale-115 active:scale-90 transition-all duration-200 cursor-pointer outline-hidden"
                    title={subApp.name}
                  >
                    <div className={`w-11 h-11 ${subApp.iconColor} rounded-xl flex items-center justify-center shadow-lg border border-white/15 relative`}>
                      {getAppRowIcon(subApp.id)}
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-450 scale-90 border border-slate-900" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Overlay Multitasking application window styled in premium frosted browser-chrome frame */}
        {activeAppId !== null && (
          <div className="absolute inset-2 bg-slate-900/65 backdrop-blur-xl border border-white/20 rounded-[32px] z-50 flex flex-col justify-stretch transition-all duration-300 overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Top glass browser-chrome header bar */}
            <div className="h-10 bg-white/15 border-b border-white/10 flex items-center px-4.5 justify-between select-none shrink-0">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 bg-rose-500/80 hover:bg-rose-500 rounded-full transition-colors cursor-pointer border border-rose-500/30" onClick={handleCloseActiveApp} title="Close window" />
                <span className="w-3 h-3 bg-amber-500/80 rounded-full border border-amber-500/30" />
                <span className="w-3 h-3 bg-emerald-500/80 rounded-full border border-emerald-500/30" />
              </div>
              <div className="bg-black/30 px-6 py-0.5 rounded-full text-[10px] text-white/70 font-mono tracking-wide">
                {activeAppId === "playstore" ? "play.google.com/store/apps" : `${activeAppId}.android.internal`}
              </div>
              <button
                onClick={handleCloseActiveApp}
                className="text-[10px] font-bold text-white/60 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-lg transition-all cursor-pointer border border-white/5"
              >
                Close
              </button>
            </div>

            {/* Embedded Active Viewport body */}
            <div className="flex-1 overflow-hidden relative bg-transparent">
              {renderAppContent()}

              {/* Bottom active iPad Home Indicator bar */}
              <button
                id="close_active_app"
                onClick={handleCloseActiveApp}
                className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/35 hover:bg-white/55 rounded-full cursor-pointer z-50 transition-all hover:scale-105 active:scale-95"
                title="Swipe to close application"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
