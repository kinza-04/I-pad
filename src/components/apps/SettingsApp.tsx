import React, { useState } from "react";
import { Settings, Info, RefreshCw, UserCheck, ShieldAlert, Image, Wifi, Bluetooth } from "lucide-react";
import { WALLPAPERS } from "../../data";

interface SettingsAppProps {
  tabletName: string;
  onUpdateTabletName: (name: string) => void;
  activeWallpaperId: string;
  onUpdateWallpaper: (id: string) => void;
  wifiEnabled: boolean;
  onToggleWifi: () => void;
  bluetoothEnabled: boolean;
  onToggleBluetooth: () => void;
}

export default function SettingsApp({
  tabletName,
  onUpdateTabletName,
  activeWallpaperId,
  onUpdateWallpaper,
  wifiEnabled,
  onToggleWifi,
  bluetoothEnabled,
  onToggleBluetooth
}: SettingsAppProps) {
  const [activeTab, setActiveTab] = useState<"general" | "wallpaper" | "about">("general");
  const [localNameInput, setLocalNameInput] = useState(tabletName);

  const handleApplyName = () => {
    onUpdateTabletName(localNameInput);
  };

  return (
    <div id="settings_app_viewport" className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-xxs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-slate-500 text-white shadow-xs">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-900 leading-none">Settings</h2>
            <p className="text-[9px] text-gray-400 mt-0.5">iPadOS System Preferences Context</p>
          </div>
        </div>
      </header>

      {/* Settings layout split */}
      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 overflow-hidden">
        {/* Left segment side drawer */}
        <div className="w-full md:w-52 bg-white/65 p-3.5 space-y-1 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto">
          <button
            id="tab_settings_general"
            onClick={() => setActiveTab("general")}
            className={`w-full p-2.5 rounded-xl text-left text-xxs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "general" 
                ? "bg-slate-300/15 border border-slate-300 text-slate-900" 
                : "bg-transparent border border-transparent text-gray-400 hover:bg-slate-300/10"
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" /> General Specs
          </button>

          <button
            id="tab_settings_wallpaper"
            onClick={() => setActiveTab("wallpaper")}
            className={`w-full p-2.5 rounded-xl text-left text-xxs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "wallpaper" 
                ? "bg-slate-300/15 border border-slate-300 text-slate-900" 
                : "bg-transparent border border-transparent text-gray-400 hover:bg-slate-300/10"
            }`}
          >
            <Image className="w-3.5 h-3.5 text-slate-500" /> Wallpaper Screen
          </button>

          <button
            id="tab_settings_about"
            onClick={() => setActiveTab("about")}
            className={`w-full p-2.5 rounded-xl text-left text-xxs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "about" 
                ? "bg-slate-300/15 border border-slate-300 text-slate-900" 
                : "bg-transparent border border-transparent text-gray-400 hover:bg-slate-300/10"
            }`}
          >
            <Info className="w-3.5 h-3.5 text-slate-500" /> Applet Info
          </button>
        </div>

        {/* Right Tab panels */}
        <div className="flex-1 bg-white p-5 md:p-6 overflow-y-auto">
          {activeTab === "general" && (
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">General Controls</h3>
              
              {/* Apple ID Name settings */}
              <div className="space-y-2 max-w-sm">
                <label className="text-xxs font-bold text-gray-400 uppercase tracking-wide">Owner / Apple ID Account</label>
                <div className="flex gap-2">
                  <input
                    id="owner_name_input"
                    type="text"
                    className="flex-1 px-3 py-1.5 text-xs border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-slate-500 rounded-lg"
                    placeholder="E.g. kinza@murtaza"
                    value={localNameInput}
                    onChange={(e) => setLocalNameInput(e.target.value)}
                  />
                  <button
                    id="settings_apply_name"
                    onClick={handleApplyName}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xxs rounded-lg shadow-xxs cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Save ID
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="border-t border-gray-100 pt-4 max-w-sm space-y-3.5">
                <h4 className="text-xxs font-bold text-gray-400 uppercase tracking-wide">Dynamic Signals</h4>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <Wifi className="w-4 h-4 text-emerald-500" />
                    <p className="text-xxs font-bold text-gray-700">Wi-Fi Connection</p>
                  </div>
                  <button
                    id="toggle_wifi"
                    onClick={onToggleWifi}
                    className={`px-3 py-1 text-xxs font-bold rounded-full border cursor-pointer ${
                      wifiEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-400 border-gray-200"
                    }`}
                  >
                    {wifiEnabled ? "Active" : "Disabled"}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <Bluetooth className="w-4 h-4 text-orange-500" />
                    <p className="text-xxs font-bold text-gray-700">Bluetooth Tethering</p>
                  </div>
                  <button
                    id="toggle_bluetooth"
                    onClick={onToggleBluetooth}
                    className={`px-3 py-1 text-xxs font-bold rounded-full border cursor-pointer ${
                      bluetoothEnabled ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-gray-100 text-gray-400 border-gray-200"
                    }`}
                  >
                    {bluetoothEnabled ? "Active" : "Disabled"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "wallpaper" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">Wallpapers Collection</h3>
              <p className="text-xxs text-gray-500 leading-snug">Choose an outer canvas gradient theme for your iPad virtual desktop grid.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {WALLPAPERS.map((wall) => (
                  <button
                    key={wall.id}
                    id={`wallpaper_preset_${wall.id}`}
                    onClick={() => onUpdateWallpaper(wall.id)}
                    style={{ background: wall.url }}
                    className={`h-22 rounded-xl relative border shadow-sm group hover:scale-104 active:scale-96 font-bold cursor-pointer transition-all ${
                      activeWallpaperId === wall.id 
                        ? "border-slate-800 scale-102 ring-2 ring-slate-400" 
                        : "border-gray-200 hover:border-slate-400"
                    }`}
                  >
                    <div className="absolute inset-0 bg-black/30 rounded-xl group-hover:bg-black/10 transition-colors" />
                    <span className="absolute bottom-2 left-3 z-10 text-[10px] text-white">
                      {wall.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-4 max-w-md">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">About Simulator</h3>
              
              <div className="bg-slate-50 p-4 border rounded-xl space-y-3.5">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-500" />
                  <h4 className="text-xs font-black text-gray-950">iPad Subsystem Suite</h4>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-normal">An innovative, dual layer emulator bridging customized Apple iPadOS aesthetics with mock Android executable container models (Play Store downloads).</p>
                <div className="border-t border-gray-200/60 pt-3.5 grid grid-cols-2 gap-3 text-xxs font-mono text-gray-500">
                  <div>
                    <span className="text-gray-400">Firmware Build:</span>
                    <p className="font-bold text-gray-700">iPadOS 18 + Tensor V14</p>
                  </div>
                  <div>
                    <span className="text-gray-400">PlayProtect:</span>
                    <p className="font-bold text-emerald-600">Active Secures</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Allocation Memory:</span>
                    <p className="font-bold text-gray-700">12GB LPDDR5X</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Virtual Storage:</span>
                    <p className="font-bold text-gray-700">114.2GB / 512GB Free</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
