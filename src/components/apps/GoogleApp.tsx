import React, { useState, useEffect } from "react";
import { Search, Globe, X, ArrowLeft, RefreshCw, Smartphone } from "lucide-react";

export default function GoogleApp() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    fetch(`/api/google/search?q=${encodeURIComponent(query.trim())}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results || []);
        setIsSearching(false);
      })
      .catch((err) => {
        console.error("Google App search error:", err);
        setIsSearching(false);
      });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans text-slate-100 relative selection:bg-blue-600/30">
      {/* Native App Top Header Chrome */}
      <div className="bg-slate-900 border-b border-slate-850 px-4 py-3 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          {activeUrl ? (
            <button 
              onClick={() => setActiveUrl(null)}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
              title="Back to search results"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          )}
          <span className="text-xxs font-extrabold tracking-widest text-slate-400 uppercase">
            {activeUrl ? "Google Sandbox Browser" : "Google Search Hub"}
          </span>
        </div>

        {activeUrl && (
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-[10px] text-slate-400 max-w-[250px] truncate font-mono">
            <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{activeUrl}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono select-none">
          <span className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded-md font-bold text-sky-400">Google LLC</span>
        </div>
      </div>

      {/* Main Container Area */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeUrl ? (
          /* High-Fidelity Website simulation sandbox inside Google App */
          <div className="h-full flex flex-col space-y-4">
            <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-850">
              <div className="space-y-1">
                <h3 className="text-xs font-black text-white">Sandboxed Web Viewer</h3>
                <p className="text-[10px] text-slate-400">
                  This page from <span className="text-sky-400 underline font-mono select-all">{activeUrl}</span> is presented securely via custom text components.
                </p>
              </div>
              <button 
                onClick={() => setActiveUrl(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xxs rounded-lg transition-colors cursor-pointer"
              >
                Back to Results
              </button>
            </div>

            <div className="flex-1 bg-slate-900/45 p-6 rounded-2xl border border-slate-850/50 flex flex-col justify-center items-center text-center space-y-4">
              <Globe className="w-12 h-12 text-slate-600" />
              <h4 className="text-sm font-black text-white">Browsing Secure Domain</h4>
              <p className="text-xxs text-slate-400 max-w-sm leading-relaxed">
                You are currently viewing: <span className="font-mono text-slate-300 underline break-all">{activeUrl}</span>.
                <br />
                The virtual sandboxed container isolates scripts, dynamic cookie storage, and tracking configurations for security inside the iPad subsystem.
              </p>
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl max-w-sm text-left font-mono text-[9px] text-zinc-400 leading-normal">
                <span className="text-sky-400 uppercase font-bold">Local Host Proxy Status:</span> ONLINE
                <br />
                <span className="text-sky-400 uppercase font-bold">Port Forwarding:</span> SECURE HTTPS
                <br />
                To browse external web domains freely, download apps, or play retro code engines, use Chrome or open our main application in a native browser window.
              </div>
            </div>
          </div>
        ) : (
          /* Main Google Search Input and Feed Component */
          <div className="max-w-xl mx-auto space-y-6 pt-4">
            {/* Cool Google Branding Illustration */}
            <div className="text-center space-y-1">
              <h1 className="text-5xl font-black tracking-tight select-none">
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                Premium Search Subsystem
              </p>
            </div>

            {/* Smart Search Form */}
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-4" />
              <input
                type="text"
                placeholder="Ask Google anything... (e.g. Marques Brownlee iPad, Lofi loops)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-full pl-11 pr-28 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-550 font-bold shadow-lg"
              />
              <button 
                type="submit" 
                className="absolute right-2 px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-full transition-all cursor-pointer shadow"
              >
                Search
              </button>
            </form>

            {/* Simulated query ideas */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {["Latest iPad Pro benchmarks", "Apple WWDC keynotes", "Deep Synthwave lofi beats", "Open Source game templates"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    // Fast execute
                    setIsSearching(true);
                    fetch(`/api/google/search?q=${encodeURIComponent(suggestion)}`)
                      .then((res) => res.json())
                      .then((data) => {
                        setResults(data.results || []);
                        setIsSearching(false);
                      })
                      .catch(() => setIsSearching(false));
                  }}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white rounded-lg text-[9px] cursor-pointer border border-slate-850 transition-colors font-semibold"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Feed area */}
            <div className="pt-2 space-y-4">
              {isSearching ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl animate-pulse space-y-2">
                      <div className="h-2.5 bg-slate-800 rounded w-1/4" />
                      <div className="h-3 bg-slate-800 rounded w-3/4" />
                      <div className="h-2 bg-slate-800 rounded w-5/6" />
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-[9px] text-slate-500 font-black font-mono uppercase tracking-wider">Search Results</p>
                  {results.map((res, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (res.url.startsWith("http")) {
                          setActiveUrl(res.url);
                        }
                      }}
                      className="p-4 bg-slate-905 hover:bg-slate-850 border border-slate-850 rounded-2xl cursor-pointer transition-all hover:translate-x-1 group"
                    >
                      <span className="text-[9px] text-slate-500 block truncate font-mono">{res.url}</span>
                      <h3 className="text-xs font-black text-sky-400 group-hover:text-sky-300 group-hover:underline mt-0.5">
                        {res.title}
                      </h3>
                      <p className="text-xxs text-slate-400 mt-1 leading-normal font-medium">{res.snippet}</p>
                    </div>
                  ))}
                </div>
              ) : (
                /* Google Discover-Like Beautiful feed by default */
                <div className="space-y-3.5">
                  <p className="text-[9px] text-slate-500 font-black font-mono uppercase tracking-wider">Discover For You</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div 
                      className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-1.5 hover:border-slate-800 transition-colors cursor-pointer"
                      onClick={() => {
                        setQuery("M4 iPad Pro review");
                        setQuery("M4 iPad Pro review");
                        setIsSearching(true);
                        fetch(`/api/google/search?q=${encodeURIComponent("M4 iPad Pro review")}`)
                          .then(res => res.json())
                          .then(data => { setResults(data.results || []); setIsSearching(false); });
                      }}
                    >
                      <span className="text-[8px] bg-indigo-950 font-bold text-indigo-400 px-1.5 py-0.5 rounded-md font-mono uppercase tracking-wide">Hardware</span>
                      <h3 className="text-xs font-extrabold text-white leading-snug">The M4 iPad Pro represents an unprecedented leap in tablet OLED displays.</h3>
                      <p className="text-xxs text-slate-400 leading-normal font-medium">Read tech critical summaries on performance, gaming frames, and pixel densities inside current iPad shells.</p>
                    </div>

                    <div 
                      className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-1.5 hover:border-slate-800 transition-colors cursor-pointer"
                      onClick={() => {
                        setQuery("Multimodal AI APIs news");
                        setIsSearching(true);
                        fetch(`/api/google/search?q=${encodeURIComponent("Multimodal AI APIs news")}`)
                          .then(res => res.json())
                          .then(data => { setResults(data.results || []); setIsSearching(false); });
                      }}
                    >
                      <span className="text-[8px] bg-green-950 font-bold text-green-400 px-1.5 py-0.5 rounded-md font-mono uppercase tracking-wide">AI Trends</span>
                      <h3 className="text-xs font-extrabold text-white leading-snug">Google releases Gemini 1.5 Series with massive contextual models.</h3>
                      <p className="text-xxs text-slate-400 leading-normal font-medium">Explore standard developer integrations, token calculations, and functional calls for coders worldwide.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
