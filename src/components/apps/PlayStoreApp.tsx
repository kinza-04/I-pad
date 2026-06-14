import { useState } from "react";
import { PlayApp } from "../../types";
import { 
  Search, Star, Download, ShieldCheck, Tag, Info, ChevronLeft, Check, Award, Sparkles, MessageSquare, Plus, CheckCircle
} from "lucide-react";
import confetti from "canvas-confetti";

interface PlayStoreProps {
  apps: PlayApp[];
  onInstallApp: (id: string, progressCallback: (prog: number) => void, onComplete: () => void) => void;
  onLaunchApp: (id: string) => void;
}

interface AppReview {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

const DEFAULT_REVIEWS: Record<string, AppReview[]> = {
  gemini: [
    { id: "g1", user: "Kinza Murtaza", rating: 5, comment: "The server-side system controller is absolutely state-of-the-art. I can talk with Gemini naturally and it answers correctly, adjusting tablet properties like brightness or checking storage instantly!", date: "Jun 14, 2026" },
    { id: "g2", user: "Haris K.", rating: 5, comment: "I love the sleek styling in the dark mesh mode. Highly responsive.", date: "Jun 12, 2026" }
  ],
  gmail: [
    { id: "gm1", user: "Sarah Mitchell", rating: 5, comment: "Exactly what I wanted! Beautiful folders layout and the draft-writing assistant helper can write super polite business templates for me.", date: "Jun 14, 2026" },
    { id: "gm2", user: "Murtaza Ali", rating: 4, comment: "Works flawlessly in the tablet browser-chrome, very premium split design.", date: "Jun 13, 2026" }
  ],
  youtube: [
    { id: "yt1", user: "DeveloperPro", rating: 5, comment: "Real embed frames render WWII retrospectives, WWDC guides & tech reviews perfectly.", date: "Jun 14, 2026" }
  ],
  paint: [
    { id: "p1", user: "CreativeNook", rating: 5, comment: "Very precise touch physics. Excellent color options.", date: "Jun 10, 2026" }
  ]
};

export default function PlayStoreApp({ apps, onInstallApp, onLaunchApp }: PlayStoreProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<PlayApp | null>(null);

  // Review states
  const [reviews, setReviews] = useState<Record<string, AppReview[]>>(DEFAULT_REVIEWS);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const renderAppIcon = (icon: string, isBig: boolean = false) => {
    if (icon === "Sparkles") {
      return (
        <Sparkles 
          className={`${isBig ? "w-14 h-14" : "w-7 h-7"} text-white fill-current`} 
        />
      );
    }
    return (
      <span className={isBig ? "text-5xl" : "text-2xl"}>
        {icon}
      </span>
    );
  };

  const categories = [
    { id: "all", label: "For You" },
    { id: "productivity", label: "Productivity" },
    { id: "creativity", label: "Creativity" },
    { id: "gaming", label: "Gaming" },
    { id: "utilities", label: "Utilities" },
    { id: "entertainment", label: "Entertainment" }
  ];

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || app.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstallClick = (app: PlayApp) => {
    if (app.isInstalled || app.installing) return;

    onInstallApp(
      app.id,
      (prog) => {
        // Force refresh local app visual representation if selected
        if (selectedApp && selectedApp.id === app.id) {
          setSelectedApp(prev => prev ? { ...prev, installing: true, progress: prog } : null);
        }
      },
      () => {
        // Completion
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
        if (selectedApp && selectedApp.id === app.id) {
          setSelectedApp(prev => prev ? { ...prev, isInstalled: true, installing: false, progress: 100 } : null);
        }
      }
    );
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !newComment.trim()) {
      alert("Please fill out your name and comment.");
      return;
    }

    if (!selectedApp) return;

    const addedReview: AppReview = {
      id: Date.now().toString(),
      user: reviewerName,
      rating: newRating,
      comment: newComment,
      date: new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
    };

    setReviews(prev => {
      const existing = prev[selectedApp.id] || [];
      return {
        ...prev,
        [selectedApp.id]: [addedReview, ...existing]
      };
    });

    setReviewSuccess(true);
    setReviewerName("");
    setNewComment("");
    setNewRating(5);

    setTimeout(() => {
      setReviewSuccess(false);
    }, 3000);
  };

  // Get reactive instance of currently opened app
  const reactiveSelectedApp = selectedApp ? apps.find(a => a.id === selectedApp.id) || selectedApp : null;

  return (
    <div id="playstore_container" className="flex flex-col h-full bg-[#f8f9fa] text-gray-800 font-sans">
      {/* Play Store Global Header */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M5.25 3c-.221 0-.411.121-.516.3l9.023 9.023 2.766-2.766L5.766 3.19A1.49 1.49 0 0 0 5.25 3zM3 4.234v15.53l9.316-9.317L3 4.234zm13.344 6.784l2.89 2.89c.334-.334.516-.793.516-1.282 0-.422-.133-.822-.363-1.155L16.344 11.018zM5.766 20.81l10.742-6.195-2.61-2.61L4.734 20.7c.304.072.637.104.945.104c.03 0 .058 0 .087.006z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900 leading-tight">Google Play</h1>
            <p className="text-[10px] text-emerald-600 font-semibold tracking-wide uppercase">iPadOS Subsystem</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="playstore_search"
            type="text"
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-100 focus:bg-white border-0 rounded-full focus:ring-1.5 focus:ring-emerald-500 shadow-inner focus:outline-hidden transition-all duration-200"
            placeholder="Search android apps & games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {reactiveSelectedApp ? (
        /* App Detail View Layout */
        <div className="flex-1 overflow-y-auto px-6 py-6 max-w-4xl mx-auto w-full transition-all duration-300">
          <button 
            id="back_to_catalog"
            onClick={() => setSelectedApp(null)}
            className="group flex items-center gap-1.5 mb-5 text-gray-500 hover:text-emerald-600 font-medium text-xs transition-colors border-0 bg-transparent cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to store
          </button>

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col md:flex-row gap-6">
            {/* App Icon */}
            <div className={`w-28 h-28 ${reactiveSelectedApp.iconColor} rounded-2xl flex items-center justify-center shadow-md shrink-0 self-center md:self-stretch`}>
              {renderAppIcon(reactiveSelectedApp.icon, true)}
            </div>

            {/* App Header Description */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{reactiveSelectedApp.name}</h2>
                <p className="text-sm font-medium text-emerald-600 hover:underline cursor-pointer mb-2">{reactiveSelectedApp.developer}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-semibold">
                    Contains ads <Info className="w-3 h-3" />
                  </span>
                  <span className="text-xs text-gray-400 border-l border-gray-200 pl-2">Verified with Play Protect</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              {/* Install and Action Control */}
              <div className="flex items-center gap-3">
                {reactiveSelectedApp.isInstalled ? (
                  <>
                    <button
                      id={`launch_app_${reactiveSelectedApp.id}`}
                      onClick={() => onLaunchApp(reactiveSelectedApp.id)}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.02] active:scale-[0.98] text-xs font-semibold rounded-lg transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer border-0"
                    >
                      Open App
                    </button>
                    <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                      <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3px]" /> Installed onto Home Grid
                    </span>
                  </>
                ) : reactiveSelectedApp.installing ? (
                  <div className="w-full max-w-xs bg-gray-105 h-9 rounded-lg overflow-hidden relative border border-gray-200 shadow-inner flex items-center px-4">
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-emerald-600 transition-all duration-150"
                      style={{ width: `${reactiveSelectedApp.progress}%` }}
                    />
                    <span className="relative z-10 text-xs font-semibold text-gray-700 mix-blend-difference flex items-center gap-2">
                      Downloading & Installing... {reactiveSelectedApp.progress}%
                    </span>
                  </div>
                ) : (
                  <button
                    id={`install_btn_${reactiveSelectedApp.id}`}
                    onClick={() => handleInstallClick(reactiveSelectedApp)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.02] active:scale-[0.98] text-xs font-bold rounded-lg transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer border-0"
                  >
                    <Download className="w-4 h-4" /> Install App
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-3 gap-1 py-4 my-5 bg-white rounded-xl border border-gray-100 shadow-xs divide-x divide-gray-100 text-center">
            <div>
              <p className="text-xs font-bold text-gray-900 flex items-center justify-center gap-0.5">
                {reactiveSelectedApp.rating} <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              </p>
              <p className="text-[10px] text-gray-400 font-medium">{reactiveSelectedApp.reviewsCount} reviews</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">{reactiveSelectedApp.size}</p>
              <p className="text-[10px] text-gray-400 font-medium">Download size</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Rated 3+</p>
              <p className="text-[10px] text-gray-400 font-medium">Suitable for all</p>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs mb-5">
            <h3 className="text-sm font-bold text-gray-900 mb-2">About this app</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal mb-4">{reactiveSelectedApp.description}</p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
              <Tag className="w-3.5 h-3.5" />
              Category: {reactiveSelectedApp.category.toUpperCase()}
            </div>
          </div>

          {/* Highlights Screenshots Section */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs mb-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {reactiveSelectedApp.screenshots.map((shot, idx) => (
                <div key={idx} className="bg-slate-900 p-4 rounded-lg text-white border-2 border-slate-800 flex flex-col justify-between aspect-video relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-emerald-500 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Mock App
                  </div>
                  <div className="p-1 rounded-sm bg-slate-800 text-emerald-400 w-fit">
                    <Award className="w-4 h-4" />
                  </div>
                  <p className="text-xxs font-medium text-slate-300 leading-snug">{shot}</p>
                </div>
              ))}
            </div>
          </div>

          {/* New Interactive Reviews System */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <MessageSquare className="w-4.5 h-4.5 text-emerald-600" /> Ratings & Reviews
              </h3>
              <span className="text-[11px] font-semibold text-gray-550 border border-gray-200 px-2.5 py-0.5 rounded-full bg-slate-50">
                Sorted by most helpful
              </span>
            </div>

            {/* Write a review box */}
            <form onSubmit={submitReview} className="bg-[#fcfdfe] border border-emerald-100 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <Plus className="w-4 h-4 text-emerald-600" /> Rate and review this app
              </p>

              {reviewSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Thank you! Your review has been published live to the Play Store ledger.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Reviewer Name */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Your Name</label>
                  <input 
                    type="text" 
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. Kinza Murtaza"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                {/* Rating selection stars */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Star Rating</label>
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="border-0 bg-transparent cursor-pointer p-0.5 focus:outline-hidden text-amber-400 transition hover:scale-110"
                      >
                        <Star className={`w-5.5 h-5.5 ${star <= newRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Comment */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Comment review</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="How is your experience with this app on the iPad OS backend? Write details..."
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden font-normal"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer border-0 hover:scale-102 active:scale-98 transition-all"
              >
                Post Review
              </button>
            </form>

            {/* List current reviews */}
            <div className="space-y-3 pt-2">
              {(reviews[reactiveSelectedApp.id] || []).length === 0 ? (
                <p className="text-xs text-gray-400 font-medium italic text-center py-4">No reviews written yet. Be the first to rate!</p>
              ) : (
                (reviews[reactiveSelectedApp.id] || []).map((rev) => (
                  <div key={rev.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-800">{rev.user}</span>
                      <span className="text-[10px] font-mono text-gray-400">{rev.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                      ))}
                    </div>

                    <p className="text-[11px] text-gray-600 leading-normal font-normal pl-0.5 pt-0.5">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Store Home/Catalog List */
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Banner Promo */}
          <div className="bg-gradient-to-r from-emerald-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md mb-6 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
            <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-0 right-10 transform translate-y-6 w-32 h-32 bg-emerald-400/20 rounded-full blur-lg pointer-events-none" />
            <div className="relative z-10 max-w-sm">
              <span className="bg-white/15 text-xxs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 inline-block">
                Subsystem Installed
              </span>
              <h2 className="text-xl font-extrabold tracking-tight mb-1">Android Subsystem is Live!</h2>
              <p className="text-[11px] text-indigo-100">Install and expand iPad capability with functional Android application binaries dynamically.</p>
            </div>
          </div>

          {/* Categories Pill Navigation */}
          <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-none scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`cat_${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap scroll-snaps-start cursor-pointer transition-all duration-200 border ${
                  activeCategory === cat.id 
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" 
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* App List Catalog */}
          <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">Recommended Apps</h3>
          {filteredApps.length === 0 ? (
            <div className="text-center py-10 bg-white border border-dashed border-gray-200 rounded-xl">
              <p className="text-xs text-gray-500 font-medium">No applications found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {filteredApps.map((app) => (
                <div 
                  id={`store_card_${app.id}`}
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="bg-white rounded-xl p-4 border border-gray-100 hover:border-emerald-200 hover:shadow-xs transition-all duration-200 cursor-pointer flex gap-3 group relative"
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 ${app.iconColor} rounded-xl shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                    {renderAppIcon(app.icon, false)}
                  </div>

                  {/* Body Info */}
                  <div className="flex-1 flex flex-col justify-between overflow-hidden">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-600 truncate transition-colors leading-tight">
                        {app.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{app.developer}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] mt-1">
                      <div className="flex items-center gap-0.5 font-bold text-gray-700">
                        <span>{app.rating}</span>
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                      </div>
                      <div className="text-gray-400 font-medium">
                        {app.size}
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  {app.isInstalled ? (
                    <span className="absolute top-3 right-3 p-1 rounded-full bg-emerald-50 border border-emerald-200">
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3px]" />
                    </span>
                  ) : app.installing ? (
                    <span className="absolute top-3 right-4 text-xxs text-emerald-600 font-bold">
                      {app.progress}%
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
