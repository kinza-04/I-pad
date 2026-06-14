import React, { useState, useEffect } from "react";
import { 
  Globe, ChevronLeft, ChevronRight, RotateCw, Search, Bookmark, 
  BookOpen, Plus, X, Laptop, Sparkles, Youtube, AlignLeft, Info
} from "lucide-react";

interface Tab {
  id: string;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
}

export default function SafariApp() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "tab-1", title: "Smart Search", url: "safari://start", history: ["safari://start"], historyIndex: 0 }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("tab-1");
  const [inputVal, setInputVal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReaderMode, setIsReaderMode] = useState<boolean>(false);

  // Real-time Search Integration States
  const [googleQueryVal, setGoogleQueryVal] = useState("");
  const [googleResults, setGoogleResults] = useState<any[]>([]);
  const [isSearchingGoogle, setIsSearchingGoogle] = useState(false);

  const [youtubeQueryVal, setYoutubeQueryVal] = useState("");
  const [youtubeResults, setYoutubeResults] = useState<any[]>([]);
  const [isSearchingYoutube, setIsSearchingYoutube] = useState(false);
  const [activeYoutubeVideo, setActiveYoutubeVideo] = useState<any>(null);

  const getSearchParam = (url: string, param: string) => {
    try {
      if (url.startsWith("safari://")) return "";
      const parsed = new URL(url);
      return parsed.searchParams.get(param) || "";
    } catch {
      const match = url.match(new RegExp(`[?&]${param}=([^&]+)`));
      return match ? decodeURIComponent(match[1]) : "";
    }
  };

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    const url = activeTab.url;
    
    // Auto Google Search loader
    if (url.includes("google.com/search")) {
      const q = getSearchParam(url, "q");
      setGoogleQueryVal(q);
      if (q) {
        setIsSearchingGoogle(true);
        fetch(`/api/google/search?q=${encodeURIComponent(q)}`)
          .then(res => res.json())
          .then(data => {
            setGoogleResults(data.results || []);
            setIsSearchingGoogle(false);
          })
          .catch(err => {
            console.error("Google search fetch error:", err);
            setIsSearchingGoogle(false);
          });
      } else {
        setGoogleResults([]);
      }
    } else if (url === "https://www.google.com" || url === "http://www.google.com") {
      setGoogleQueryVal("");
      setGoogleResults([]);
    }

    // Auto YouTube Search loader
    if (url.includes("youtube.com")) {
      const q = getSearchParam(url, "q") || getSearchParam(url, "search_query");
      setYoutubeQueryVal(q || "");
      setIsSearchingYoutube(true);
      if (q) {
        fetch(`/api/youtube/search?q=${encodeURIComponent(q)}`)
          .then(res => res.json())
          .then(data => {
            setYoutubeResults(data.results || []);
            setIsSearchingYoutube(false);
          })
          .catch(err => {
            console.error("YouTube search fetch error:", err);
            setIsSearchingYoutube(false);
          });
      } else {
        fetch(`/api/youtube/trending`)
          .then(res => res.json())
          .then(data => {
            setYoutubeResults(data.results || []);
            setIsSearchingYoutube(false);
          })
          .catch(err => {
            console.error("YouTube trending fetch error:", err);
            setIsSearchingYoutube(false);
          });
      }
    }
  }, [activeTab.url]);

  // Quick favorite links
  const FAVORITES = [
    { title: "Google", url: "https://www.google.com", icon: "🔍", color: "bg-blue-500" },
    { title: "Wikipedia", url: "https://en.wikipedia.org", icon: "📜", color: "bg-slate-700" },
    { title: "YouTube", url: "https://www.youtube.com", icon: "▶️", color: "bg-rose-600" },
    { title: "Reddit", url: "https://www.reddit.com", icon: "🤖", color: "bg-orange-500" },
    { title: "AI Studio", url: "https://ai.studio.google", icon: "✨", color: "bg-indigo-600" },
    { title: "GitHub", url: "https://github.com", icon: "🐈", color: "bg-zinc-800" },
  ];

  const navigateTo = (urlStr: string) => {
    setIsLoading(true);
    let resolvedUrl = urlStr;
    if (!urlStr.startsWith("http://") && !urlStr.startsWith("https://") && !urlStr.startsWith("safari://")) {
      resolvedUrl = `https://www.google.com/search?q=${encodeURIComponent(urlStr)}`;
    }

    setTimeout(() => {
      setTabs(prev => prev.map(t => {
        if (t.id === activeTabId) {
          const nextHistory = t.history.slice(0, t.historyIndex + 1);
          nextHistory.push(resolvedUrl);
          const nextIdx = nextHistory.length - 1;
          
          let title = "Web Page";
          if (resolvedUrl.includes("google.com/search")) title = "Google Search";
          else if (resolvedUrl.includes("google.com")) title = "Google";
          else if (resolvedUrl.includes("wikipedia.org")) title = "Wikipedia";
          else if (resolvedUrl.includes("youtube.com")) title = "YouTube";
          else if (resolvedUrl.includes("reddit.com")) title = "Reddit";
          else if (resolvedUrl.includes("ai.studio.google")) title = "Google AI Studio";
          else if (resolvedUrl.includes("github.com")) title = "GitHub Core";
          else if (resolvedUrl === "safari://start") title = "Smart Search";

          return {
            ...t,
            url: resolvedUrl,
            title,
            history: nextHistory,
            historyIndex: nextIdx
          };
        }
        return t;
      }));
      setInputVal(resolvedUrl === "safari://start" ? "" : resolvedUrl);
      setIsLoading(false);
    }, 600);
  };

  const handleGoBack = () => {
    if (activeTab.historyIndex > 0) {
      const nextIdx = activeTab.historyIndex - 1;
      const resolvedUrl = activeTab.history[nextIdx];
      setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, historyIndex: nextIdx, url: resolvedUrl } : t));
      setInputVal(resolvedUrl === "safari://start" ? "" : resolvedUrl);
    }
  };

  const handleGoForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const nextIdx = activeTab.historyIndex + 1;
      const resolvedUrl = activeTab.history[nextIdx];
      setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, historyIndex: nextIdx, url: resolvedUrl } : t));
      setInputVal(resolvedUrl === "safari://start" ? "" : resolvedUrl);
    }
  };

  const handleAddNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newId,
      title: "Smart Search",
      url: "safari://start",
      history: ["safari://start"],
      historyIndex: 0
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setInputVal("");
    setIsReaderMode(false);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Prevent closing the ultimate tab
    const nextTabs = tabs.filter(t => t.id !== id);
    setTabs(nextTabs);
    if (activeTabId === id) {
      setActiveTabId(nextTabs[nextTabs.length - 1].id);
      setInputVal(nextTabs[nextTabs.length - 1].url === "safari://start" ? "" : nextTabs[nextTabs.length - 1].url);
    }
  };

  return (
    <div id="safari_app_viewport" className="flex flex-col h-full bg-slate-910 font-sans text-slate-100 select-all">
      {/* Top Chrome Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 p-2.5 space-y-2 shrink-0 select-none">
        {/* Tab Strip Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pr-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTabId(tab.id);
                setInputVal(tab.url === "safari://start" ? "" : tab.url);
                setIsReaderMode(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xxs font-extrabold flex items-center gap-2 border transition-all shrink-0 max-w-[130px] shadow-xs cursor-pointer ${
                activeTabId === tab.id 
                  ? "bg-slate-800 border-slate-700 text-white shadow-md font-black" 
                  : "bg-transparent border-transparent text-slate-400 hover:bg-slate-850"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate flex-1 text-left">{tab.title}</span>
              {tabs.length > 1 && (
                <X 
                  className="w-3 h-3 hover:bg-slate-700 rounded-sm p-0.5" 
                  onClick={(e) => handleCloseTab(tab.id, e)}
                />
              )}
            </button>
          ))}
          <button
            onClick={handleAddNewTab}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 border border-slate-800 border-dashed"
            title="Open New Tab"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Safari Actions & Input Fields Row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleGoBack}
              disabled={activeTab.historyIndex === 0}
              className="p-1.5 hover:bg-slate-800 disabled:opacity-30 rounded-lg transition-all cursor-pointer text-slate-300"
              title="Back"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleGoForward}
              disabled={activeTab.historyIndex === activeTab.history.length - 1}
              className="p-1.5 hover:bg-slate-800 disabled:opacity-30 rounded-lg transition-all cursor-pointer text-slate-300"
              title="Forward"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo(activeTab.url)}
              className="p-1.5 hover:bg-slate-800 rounded-lg transition-all cursor-pointer text-slate-300"
              title="Refresh Page"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Smart URL address search bar */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-500">
              <Search className="w-3.5 h-3.5" />
              {activeTab.url.startsWith("https://") && (
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-950 px-1 rounded-sm border border-emerald-900 leading-none select-none">Secure</span>
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigateTo(inputVal);
              }}
            >
              <input
                id="safari_address_bar"
                type="text"
                placeholder="Search queries or enter URL addresses..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 pl-18 pr-24 py-1.5 rounded-xl text-xxs text-white focus:outline-hidden focus:border-sky-500 select-all font-mono"
              />
            </form>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {activeTab.url !== "safari://start" && (
                <button
                  onClick={() => setIsReaderMode(!isReaderMode)}
                  className={`p-1 rounded-md transition-all cursor-pointer ${
                    isReaderMode 
                      ? "bg-sky-550/15 text-sky-400 border border-sky-500/30" 
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                  title="Toggle Reader Mode"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="text-[10px] text-slate-400 font-bold font-mono uppercase bg-slate-850 px-1.5 py-0.5 rounded-md border border-slate-800 select-none">Web</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic linear loading bar indicator */}
      {isLoading && (
        <div className="w-full bg-slate-800 h-0.5 shrink-0 overflow-hidden">
          <div className="bg-sky-400 h-full animate-progress" />
        </div>
      )}

      {/* Main Website Frame Sandbox */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-6 relative">
        {/* Safari Initial Browser Start Page */}
        {activeTab.url === "safari://start" && (
          <div className="max-w-xl mx-auto space-y-6 pt-6 select-none animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-sky-500/10">
                <Globe className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-sm font-black text-white">iPad Custom Core Safari</h2>
              <p className="text-[10px] text-slate-400 max-w-sm mx-auto font-medium">Browse high-fidelity, interactive representations of your favorite websites, blogs, and query portals.</p>
            </div>

            {/* Smart Favorites Dashboard Grid */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Smart Bookmarks Favorites</h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3.5">
                {FAVORITES.map((f) => (
                  <button
                    id={`safari_favorites_link_${f.title.toLowerCase()}`}
                    key={f.title}
                    onClick={() => {
                      navigateTo(f.url);
                    }}
                    className="p-3 bg-slate-900 hover:bg-slate-850 rounded-xl flex flex-col items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all text-center group cursor-pointer border border-slate-800"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{f.icon}</span>
                    <span className="text-[9px] font-black text-slate-200 mt-1">{f.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Suggestion Section */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xxs font-semibold">
              <h5 className="font-extrabold text-slate-400 flex items-center gap-1.5 leading-none">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Search Ideas
              </h5>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["Apple iPad Subsystem", "Gemini 2.5 Flash", "Latest Tech Stock Trends", "Best Lofi Synth Loops", "Vite React Templates"].map((q) => (
                  <button 
                    key={q}
                    onClick={() => {
                      navigateTo(q);
                    }}
                    className="px-2.5 py-1 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-lg text-[9px] cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Reader view overrides */}
        {activeTab.url !== "safari://start" && isReaderMode ? (
          <div className="max-w-lg mx-auto bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-5 animate-scale-up select-all font-serif">
            <h1 className="text-2xl font-bold font-sans text-white leading-tight">Reader Mode: {activeTab.title}</h1>
            <p className="text-[11px] font-mono uppercase text-sky-400 tracking-wider leading-none font-bold">Simplified ad-free presentation</p>
            <hr className="border-slate-800" />
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              This simplified text extract bypasses client script loading, image assets, or dynamic frames to save networking bandwidth inside the iPadOS subsystem.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              When surfing via the iPad subsystem, Safari parses document trees to isolate semantic articles. Under active conditions, the text is reorganized into reader-safe display lists utilizing optimal serif spacing, providing a peaceful and comfortable layout for reading.
            </p>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] text-sky-300 space-y-1">
              <p className="font-bold underline uppercase">System Meta</p>
              <p>Host: {activeTab.url}</p>
              <p>Type: Secure HTTPS Static Sandbox</p>
            </div>
          </div>
        ) : (
          /* Multi-site simulation containers based on URL routing */
          activeTab.url !== "safari://start" && (
            <div className="max-w-2xl mx-auto animate-fade-in text-slate-300 space-y-6 select-text h-full">
              {/* GOOGLE PAGE SIMULATION */}
              {(activeTab.url.includes("google.com/search") || activeTab.url === "https://www.google.com" || activeTab.url === "http://www.google.com") && (
                <div className="space-y-6">
                  {/* Google Brand Header */}
                  <div className="flex flex-col items-center justify-center pt-2">
                    <h1 className="text-4xl font-extrabold tracking-tight select-none cursor-pointer" onClick={() => navigateTo("https://www.google.com")}>
                      <span className="text-blue-500">G</span>
                      <span className="text-red-500">o</span>
                      <span className="text-yellow-500">o</span>
                      <span className="text-blue-500">g</span>
                      <span className="text-green-500">l</span>
                      <span className="text-red-500">e</span>
                    </h1>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 font-bold">Subsystem Live Search Proxy</span>
                  </div>

                  {/* Search Engine Area */}
                  <div className="max-w-xl mx-auto">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (googleQueryVal.trim()) {
                        navigateTo(`https://www.google.com/search?q=${encodeURIComponent(googleQueryVal.trim())}`);
                      }
                    }} className="relative flex items-center">
                      <Search className="w-4 h-4 text-slate-400 absolute left-4" />
                      <input
                        type="text"
                        placeholder="Search Google with real scraper backend..."
                        value={googleQueryVal}
                        onChange={(e) => setGoogleQueryVal(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-full pl-12 pr-28 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold shadow-inner"
                      />
                      <button type="submit" className="absolute right-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-full transition-all cursor-pointer">
                        Search Log
                      </button>
                    </form>
                  </div>

                  {activeTab.url.includes("google.com/search") ? (
                    <div className="space-y-4 max-w-xl mx-auto font-sans">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold border-b border-slate-900 pb-2">
                        <span>Search Results for "{getSearchParam(activeTab.url, "q")}"</span>
                        <span className="font-mono text-emerald-500">Active Live Scrape Done</span>
                      </div>

                      {isSearchingGoogle ? (
                        <div className="space-y-4 py-4">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 bg-slate-900/50 border border-slate-850/50 rounded-2xl animate-pulse space-y-2">
                              <div className="h-2 bg-slate-800 rounded-md w-1/3" />
                              <div className="h-3 bg-slate-800 rounded-md w-2/3" />
                              <div className="h-2 bg-slate-800 rounded-md w-5/6" />
                            </div>
                          ))}
                        </div>
                      ) : googleResults.length > 0 ? (
                        <div className="space-y-3.5">
                          {googleResults.map((res, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => {
                                if (res.url.startsWith("http")) {
                                  navigateTo(res.url);
                                }
                              }}
                              className="p-4 bg-slate-900 hover:bg-slate-855 border border-slate-850 rounded-2xl transition-all cursor-pointer shadow-sm hover:translate-x-1 group"
                            >
                              <span className="text-[9px] text-slate-500 block truncate font-mono">{res.url}</span>
                              <h3 className="text-xs font-black text-sky-400 group-hover:text-sky-300 group-hover:underline mt-0.5">{res.title}</h3>
                              <p className="text-xxs text-slate-400 mt-1 leading-normal font-medium">{res.snippet}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-xs text-slate-500">
                          No results returned. Try searching another term or open Safari in a new tab!
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Google Homepage shortcuts */
                    <div className="max-w-md mx-auto grid grid-cols-2 gap-3 text-center pt-2">
                      <div className="p-3 bg-slate-900/65 rounded-xl border border-slate-850 hover:border-blue-500/40 cursor-pointer text-xxs font-bold text-slate-400 hover:text-white transition-all" onClick={() => navigateTo("https://www.google.com/search?q=latest+ipad+pro+m4")}>
                        🔍 iPad Pro M4 Reviews
                      </div>
                      <div className="p-3 bg-slate-900/65 rounded-xl border border-slate-850 hover:border-blue-500/40 cursor-pointer text-xxs font-bold text-slate-400 hover:text-white transition-all" onClick={() => navigateTo("https://www.google.com/search?q=google+gemini+ai+news")}>
                        ✨ Gemini AI News
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* WIKIPEDIA PAGE SIMULATION */}
              {activeTab.url.includes("wikipedia.org") && (
                <div className="p-5 bg-[#fafcfd] text-slate-900 rounded-2xl border border-slate-200 shadow-md flex flex-col space-y-4 font-serif">
                  <div className="flex justify-between items-center border-b border-gray-300 pb-3 select-none">
                    <span className="text-xl font-bold font-sans">WIKIPEDIA</span>
                    <span className="text-[10px] text-slate-500 font-sans font-bold uppercase tracking-wider">The Free Encyclopedia</span>
                  </div>
                  
                  <h1 className="text-2xl font-bold font-sans leading-tight">Virtual iPad Subsystems</h1>
                  <p className="text-[11px] font-mono text-zinc-500 leading-none">From Wikipedia, the free encyclopedia</p>
                  
                  <div className="p-3 bg-slate-50 border-l-4 border-slate-400 rounded-r-lg font-sans text-xxs text-slate-600 leading-normal">
                    This article relates to the virtualization layers bridging iOS-designed tablet frames with compiled Android Package binaries.
                  </div>

                  <p className="text-xs leading-relaxed text-slate-800">
                    On modern web-virtualized sandboxes, an <strong>iPad Subsystem</strong> acts as an interactive simulation framework that encapsulates mobile operating assets (like a multi-app launcher system, localized note databases, camera capture canvas buffers, play market installer triggers, etc.) inside single-page web execution blocks.
                  </p>

                  <h3 className="text-sm font-bold font-sans border-b border-gray-300 pb-1 mt-4">History & Core Frameworks</h3>
                  <p className="text-xs leading-relaxed text-slate-800">
                    Early desktop simulators relied on heavy compilation runtimes. Web components introduced standard sandboxing boundaries, enabling modular sub-apps (like scientific calculators, synthetic lofi frequency filters, D-pad gaming engines) to communicate via shared parent hooks, resulting in very fast responses without native storage footprints.
                  </p>
                </div>
              )}

              {/* YOUTUBE SIMULATION */}
              {activeTab.url.includes("youtube.com") && (
                <div className="space-y-4">
                  {/* Embedded Player Overlay */}
                  {activeYoutubeVideo && (
                    <div className="p-4 bg-slate-900 border border-red-500/25 rounded-3xl space-y-3 shadow-2xl relative animate-scale-up">
                      <button 
                        onClick={() => setActiveYoutubeVideo(null)}
                        className="absolute right-4 top-4 p-2 bg-slate-950/80 hover:bg-slate-955 rounded-full border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer z-20"
                        title="Close Player"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="aspect-video bg-black rounded-2xl overflow-hidden relative shadow-inner">
                        <iframe
                          src={`https://www.youtube.com/embed/${activeYoutubeVideo.videoId}?autoplay=1`}
                          title={activeYoutubeVideo.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>

                      <div className="space-y-1.5 px-1 pt-1">
                        <span className="px-2 py-0.5 bg-red-950/60 text-red-400 text-[9px] font-bold rounded-md border border-red-900/30 font-mono uppercase tracking-widest">Currently Playing</span>
                        <h2 className="text-xs font-black text-white leading-snug">{activeYoutubeVideo.title}</h2>
                        <div className="flex items-center justify-between pt-1 font-sans">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">👤</span>
                            <div>
                              <p className="text-xxs font-black text-slate-200">{activeYoutubeVideo.channelName}</p>
                              <p className="text-[9px] text-slate-500 font-bold">120K Subscribers</p>
                            </div>
                          </div>
                          <button className="px-3.5 py-1.5 bg-red-650 hover:bg-red-500 text-white text-[10px] font-extrabold rounded-full transition-all cursor-pointer shadow-md active:scale-95">
                            Subscribe
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* YouTube Search Header */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-slate-900 pb-3">
                    <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigateTo("https://www.youtube.com")}>
                      <div className="w-7 h-7 bg-red-650 rounded-lg flex items-center justify-center text-white font-extrabold">▶️</div>
                      <span className="text-sm font-black text-white tracking-tight">YouTube <span className="text-[10px] text-red-550 font-semibold">Subsystem</span></span>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (youtubeQueryVal.trim()) {
                        navigateTo(`https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeQueryVal.trim())}`);
                      }
                    }} className="relative flex-1 max-w-sm w-full flex items-center">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5" />
                      <input
                        type="text"
                        placeholder="Search YouTube videos..."
                        value={youtubeQueryVal}
                        onChange={(e) => setYoutubeQueryVal(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-full pl-10 pr-24 py-1.5 text-xxs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-bold"
                      />
                      <button type="submit" className="absolute right-1 px-3.5 py-1 bg-red-650 hover:bg-red-500 text-white text-[9px] font-black rounded-full transition-all cursor-pointer">
                        Search
                      </button>
                    </form>
                  </div>

                  {/* Content grid */}
                  <div className="space-y-3 font-sans">
                    <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      {youtubeQueryVal ? `Search Results for "${youtubeQueryVal}"` : "Trending & Hot Broadcasts"}
                    </h3>

                    {isSearchingYoutube ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 4, 5].map((i) => (
                          <div key={i} className="bg-slate-900/60 border border-slate-850/50 rounded-2xl p-3 animate-pulse space-y-3">
                            <div className="aspect-video bg-slate-800 rounded-xl" />
                            <div className="space-y-1.5">
                              <div className="h-2.5 bg-slate-800 rounded-md w-3/4" />
                              <div className="h-2 bg-slate-800 rounded-md w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : youtubeResults.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {youtubeResults.map((video) => (
                          <div 
                            key={video.videoId}
                            onClick={() => {
                              setActiveYoutubeVideo(video);
                              document.getElementById("safari_app_viewport")?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`p-3 bg-slate-900/80 hover:bg-slate-850 border rounded-2xl cursor-pointer transition-all hover:scale-101 flex flex-col justify-between group ${
                              activeYoutubeVideo?.videoId === video.videoId ? "border-red-500 bg-slate-850" : "border-slate-850"
                            }`}
                          >
                            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden shrink-0 shadow-sm">
                              <img 
                                src={video.thumbnail} 
                                alt={video.title} 
                                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/85 text-[8.5px] font-mono rounded-md font-bold text-white border border-white/5">
                                {video.duration}
                              </div>
                            </div>
                            <div className="mt-2.5 space-y-1 flex-1 flex flex-col justify-between">
                              <h4 className="text-[11px] font-black leading-snug text-slate-100 group-hover:text-red-400 line-clamp-2 transition-colors">{video.title}</h4>
                              <div className="pt-1.5 text-[9px] text-slate-500 font-bold flex items-center justify-between">
                                <span className="text-slate-400">{video.channelName}</span>
                                <span className="font-mono text-slate-500">{video.views}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-xs text-slate-500">
                        No videos found. Check your search query or refresh of streams!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* REDDIT SIMULATION */}
              {activeTab.url.includes("reddit.com") && (
                <div className="space-y-4 text-slate-200">
                  <div className="flex items-center gap-2 border-b border-orange-500/20 pb-3">
                    <span className="text-xl">🤖</span>
                    <span className="text-xs font-black font-sans uppercase tracking-widest text-orange-400">reddit.com</span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex gap-3">
                      <div className="flex flex-col items-center shrink-0">
                        <button className="text-sm font-bold text-orange-400 hover:text-orange-300 font-mono">▲</button>
                        <span className="text-[10px] font-mono select-none font-bold">542</span>
                        <button className="text-sm font-bold text-slate-500 font-mono">▼</button>
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <span className="text-[9px] text-slate-500 font-bold">Posted by r/ipad in 2026</span>
                        <h4 className="text-xs font-bold text-white hover:underline cursor-pointer">Unbelievable! I managed to spin up a fully operational Android subsystem in React!</h4>
                        <p className="text-xxs text-slate-400">Everything is working including Play Store, scientific mathematical formulas, vector maps coordinates and retro arcade D-pads.</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex gap-3">
                      <div className="flex flex-col items-center shrink-0">
                        <button className="text-sm font-semibold text-slate-400 font-mono">▲</button>
                        <span className="text-[10px] font-mono select-none font-bold">128</span>
                        <button className="text-sm font-semibold text-slate-500 font-mono">▼</button>
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <span className="text-[9px] text-slate-500 font-bold">Posted by r/webdev in 2026</span>
                        <h4 className="text-xs font-bold text-white hover:underline cursor-pointer">What is your go-to typography pairing for minimalist dashboard modules?</h4>
                        <p className="text-xxs text-slate-400">I are increasingly pairing Space Grotesk elegant displays with JetBrains Mono code tags, and Inter in body descriptions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI STUDIO SIMULATION */}
              {activeTab.url.includes("ai.studio.google") && (
                <div className="bg-slate-900/40 p-5 rounded-2xl border border-indigo-500/15 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                      <span className="text-xs font-black text-white">Google AI Studio</span>
                    </div>
                    <span className="text-[9px] bg-indigo-950 font-bold text-indigo-300 font-mono px-2 py-0.5 rounded-md border border-indigo-900/50">Gemini Pro API</span>
                  </div>

                  {/* interactive dummy chat box */}
                  <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-xxs font-semibold flex gap-2">
                      <span className="text-slate-500 select-none font-sans font-bold">User:</span>
                      <p className="text-slate-300">How do I create a beautiful responsive grid view using Tailwind?</p>
                    </div>
                    <div className="bg-indigo-600/10 p-3 rounded-xl border border-indigo-500/10 text-xxs font-semibold flex gap-2">
                      <span className="text-indigo-400 select-none font-sans font-bold">Gemini:</span>
                      <p className="text-slate-200">You can use grid classes. Specifically: <code className="font-mono text-indigo-300 text-[10px] bg-slate-950 px-1 rounded-sm">grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6</code> to adapt fluidly to screen margins.</p>
                    </div>
                  </div>

                  {/* Interactive field */}
                  <div className="flex gap-2">
                    <input
                      id="ai-studio-mock-prompt"
                      type="text"
                      placeholder="Ask the simulated Gemini anything..."
                      className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xxs focus:border-indigo-500 font-medium"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const input = e.target as HTMLInputElement;
                          if (!input.value) return;
                          
                          // Add prompt
                          const container = document.getElementById("ai-studio-mock-prompt");
                          alert("A virtual sandbox simulation. Google API credentials fully secure on backends!");
                          input.value = "";
                        }
                      }}
                    />
                    <button 
                      onClick={() => alert("Simulated prompt executed!")}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-slate-800 text-white font-extrabold text-[10px] rounded-xl cursor-pointer"
                    >
                      Prompt
                    </button>
                  </div>
                </div>
              )}

              {/* DEFAULT ANY OTHER WEB SIMULATION */}
              {!activeTab.url.includes("google.com") && 
               !activeTab.url.includes("wikipedia.org") && 
               !activeTab.url.includes("youtube.com") && 
               !activeTab.url.includes("reddit.com") && 
               !activeTab.url.includes("ai.studio.google") && (
                <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
                  <Globe className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="text-sm font-black text-white">Custom Sandboxed URL Domain</h3>
                  <p className="text-[11px] text-slate-400">You are browsing: <span className="font-mono text-zinc-300 underline font-semibold break-all">{activeTab.url}</span></p>
                  <div className="p-3.5 bg-slate-950 border border-slate-855 rounded-xl inline-block max-w-sm text-xxs text-left font-black tracking-wide leading-normal">
                    This iPad Subsystem is operating in offline sandbox Mode. For native external browsing, open this application in a new browser tab or configure standard proxy routing.
                  </div>
                  <div>
                    <button
                      onClick={() => navigateTo("safari://start")}
                      className="px-5 py-2.5 bg-sky-550 hover:bg-sky-600 font-extrabold text-[10px] text-white rounded-xl cursor-pointer shadow-lg"
                    >
                      Return to Smart Search Homepage
                    </button>
                  </div>
                </div>
              )}

            </div>
          )
        )}
      </div>
    </div>
  );
}
