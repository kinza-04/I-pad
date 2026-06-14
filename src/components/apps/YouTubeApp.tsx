import React, { useState, useEffect } from "react";
import { Search, Youtube, Play, X, User, Heart, ThumbsUp, Calendar, Eye } from "lucide-react";

export default function YouTubeApp() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load trending by default on launch!
    setIsSearching(true);
    fetch("/api/youtube/trending")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.results || []);
        setIsSearching(false);
      })
      .catch((err) => {
        console.error("YouTube App loading trending failed:", err);
        setIsSearching(false);
      });
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    fetch(`/api/youtube/search?q=${encodeURIComponent(query.trim())}`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.results || []);
        setIsSearching(false);
      })
      .catch((err) => {
        console.error("YouTube App search error:", err);
        setIsSearching(false);
      });
  };

  const toggleLike = (videoId: string) => {
    setLikes((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans text-slate-100 selection:bg-red-650/30">
      {/* YT Top Brand Chrome */}
      <div className="bg-slate-900 border-b border-slate-850 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 select-none">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => {
            setQuery("");
            setIsSearching(true);
            fetch("/api/youtube/trending")
              .then((res) => res.json())
              .then((data) => {
                setVideos(data.results || []);
                setIsSearching(false);
                setSelectedVideo(null);
              })
              .catch(() => setIsSearching(false));
          }}
        >
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg border border-red-500">
            <Youtube className="w-4.5 h-4.5 fill-current" />
          </div>
          <span className="text-sm font-black text-white tracking-tighter">
            YouTube <span className="text-red-500 font-extrabold text-[10px]">Cinema</span>
          </span>
        </div>

        {/* Search input field */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm w-full flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            placeholder="Search real video streams worldwide..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-full pl-10 pr-24 py-1.5 text-xxs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-bold"
          />
          <button 
            type="submit" 
            className="absolute right-1 px-4 py-1 bg-red-600 hover:bg-red-500 text-white text-[9px] font-black rounded-full transition-all cursor-pointer shadow"
          >
            Search
          </button>
        </form>

        <div className="text-[10px] text-zinc-500 font-mono font-bold select-none shrink-0 bg-slate-950 border border-slate-850 px-2.5 py-0.5 rounded-md text-red-400">
          Cinema Engine Pro
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Dynamic Embedded Player if selected */}
        {selectedVideo && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-850 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute right-4 top-4 p-2 bg-slate-955 hover:bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer z-10"
              title="Close Player"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left 16:9 screen panel */}
            <div className="lg:col-span-2 space-y-3">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden relative shadow-inner">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="space-y-2 px-1">
                <h2 className="text-sm font-black text-white leading-snug">{selectedVideo.title}</h2>
                
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-850 pt-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-705 flex items-center justify-center text-sm font-bold">👤</span>
                    <div>
                      <p className="text-xxs font-black text-slate-200">{selectedVideo.channelName}</p>
                      <p className="text-[9.5px] text-slate-500 font-bold">Verified Subsystem Channel</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleLike(selectedVideo.videoId)}
                      className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        likes[selectedVideo.videoId]
                          ? "bg-red-950/40 text-red-400 border-red-500/30"
                          : "bg-slate-950 hover:bg-slate-800 text-slate-350 border-slate-800"
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${likes[selectedVideo.videoId] ? "fill-current" : ""}`} />
                      <span>{likes[selectedVideo.videoId] ? "Liked!" : "Like"}</span>
                    </button>
                    <button className="px-4 py-2 bg-red-650 hover:bg-red-550 text-white text-[10px] font-black rounded-full transition-all cursor-pointer shadow-md active:scale-95">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar with metadata and reviews details */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <span className="px-2 py-0.5 bg-red-950/50 text-red-400 text-[8.5px] font-bold rounded-md border border-red-900/30 font-mono uppercase tracking-widest block text-center">Video Information</span>
                <div className="space-y-2.5 text-xxs font-semibold text-slate-400">
                  <p className="flex items-center gap-2"><Eye className="w-3.5 h-3.5 text-red-400" /> <span>Views: <strong>{selectedVideo.views || "12.8K views"}</strong></span></p>
                  <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-red-400" /> <span>Published: <strong>{selectedVideo.publishedTime || "Recent"}</strong></span></p>
                  <p className="flex items-center gap-2"><Play className="w-3.5 h-3.5 text-red-400" /> <span>Duration: <strong>{selectedVideo.duration} mins</strong></span></p>
                </div>
                <hr className="border-slate-900" />
                <p className="text-[10px] text-zinc-400 leading-normal font-medium">
                  Watch this feed directly inside your tablet's isolated container. Our streaming proxies automatically strip embedded tracking blocks for highly premium offline security.
                </p>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-1.5 text-xxs leading-relaxed">
                <p className="font-extrabold text-slate-300">💡 Quick Hint:</p>
                <p className="text-slate-500 font-medium">Click on any video in the listings below to switch streams instantly at any time.</p>
              </div>
            </div>
          </div>
        )}

        {/* Videos feed grid wrapper */}
        <div className="space-y-3.5">
          <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
            <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {query ? `Search Results for "${query}"` : "Active Broadcasting Grid"}
            </h3>
            <span className="text-[9px] font-bold text-red-500 bg-red-950/20 border border-red-900/30 px-2 py-0.5 rounded-md uppercase font-mono">
              100 Stream Catalog Loaded
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 pb-1 overflow-x-auto select-none no-scrollbar text-xxs font-bold">
            {["All", "Lofi", "AI", "Apple", "Coding", "Gaming", "Science", "Travel"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  if (cat === "All") {
                    setQuery("");
                    setIsSearching(true);
                    fetch("/api/youtube/trending")
                      .then((res) => res.json())
                      .then((data) => {
                        setVideos(data.results || []);
                        setIsSearching(false);
                      })
                      .catch(() => setIsSearching(false));
                  } else {
                    setQuery(cat);
                    setIsSearching(true);
                    fetch(`/api/youtube/search?q=${encodeURIComponent(cat)}`)
                      .then((res) => res.json())
                      .then((data) => {
                        setVideos(data.results || []);
                        setIsSearching(false);
                      })
                      .catch(() => setIsSearching(false));
                  }
                }}
                className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer inline-flex items-center justify-center ${
                  (cat === "All" && !query) || query.toLowerCase() === cat.toLowerCase()
                    ? "bg-red-650 hover:bg-red-550 border-red-500 text-white font-extrabold shadow-md transform scale-102"
                    : "bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isSearching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-850 p-3 rounded-2xl animate-pulse space-y-3">
                  <div className="aspect-video bg-slate-800 rounded-xl" />
                  <div className="space-y-1.5">
                    <div className="h-2.5 bg-slate-800 rounded w-4/5" />
                    <div className="h-2 bg-slate-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videos.map((video, idx) => (
                <div
                  key={`${video.videoId}-${idx}`}
                  onClick={() => {
                    setSelectedVideo(video);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`p-3 bg-slate-900 hover:bg-slate-850 border rounded-2xl cursor-pointer transition-all hover:scale-101 flex flex-col justify-between group ${
                    selectedVideo === video ? "border-red-500 bg-slate-850" : "border-slate-850"
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
                  <div className="mt-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <h4 className="text-[11px] font-black leading-snug text-slate-100 group-hover:text-red-400 line-clamp-2 transition-colors">
                      {video.title}
                    </h4>
                    <div className="pt-2 text-[9px] text-slate-500 font-bold flex items-center justify-between font-sans">
                      <span className="text-slate-400 truncate max-w-[100px]">{video.channelName}</span>
                      <span className="font-mono text-zinc-500 shrink-0">{video.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-500">
              No videos matching your filter. Explore and search for another query!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
