import React, { useRef, useState, useEffect } from "react";
import { 
  Camera, RefreshCw, Sparkles, Image as ImageIcon, CircleDot, ShieldCheck, 
  Heart, Grid, Video, VideoOff, Square, Trash2, ArrowDownCircle, Volume2, VolumeX, Eye
} from "lucide-react";

interface CapturedPhoto {
  id: string;
  url: string;
  filter: string;
  sticker: string;
  ratio: string;
  time: string;
}

export default function CameraApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Basic states
  const [streamActive, setStreamActive] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("normal");
  const [photosRoll, setPhotosRoll] = useState<CapturedPhoto[]>([]);
  const [toastText, setToastText] = useState<string | null>(null);

  // Advanced features state
  const [faceSticker, setFaceSticker] = useState<string>("none");
  const [activeRatio, setActiveRatio] = useState<"4_3" | "1_1" | "16_9">("4_3");
  const [gridEnabled, setGridEnabled] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recSeconds, setRecSeconds] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [viewerPhoto, setViewerPhoto] = useState<CapturedPhoto | null>(null);

  const FILTERS = [
    { id: "normal", label: "Normal", css: "" },
    { id: "bw", label: "Mono Noir", css: "grayscale(100%) contrast(1.2)" },
    { id: "sunset", label: "Sunset Lofi", css: "sepia(70%) saturate(1.8) hue-rotate(-15deg)" },
    { id: "cyber", label: "Cyber Neon", css: "hue-rotate(180deg) saturate(2.5) contrast(1.3)" },
    { id: "vintage", label: "Vintage Film", css: "contrast(0.9) brightness(1.1) sepia(30%)" },
  ];

  const STICKERS = [
    { id: "none", label: "No Mask", icon: "🚫" },
    { id: "glasses", label: "Sunglasses 🕶️", emoji: "🕶️", classes: "text-4xl animate-bounce" },
    { id: "crown", label: "Royal Crown 👑", emoji: "👑", classes: "text-4xl animate-pulse" },
    { id: "whiskers", label: "Whiskers 🐱", emoji: "🐱", classes: "text-4xl" },
    { id: "neonvisor", label: "Neon Visor 🤖", emoji: "🤖", classes: "text-4xl animate-pulse" },
    { id: "mustache", label: "Mustache 🥸", emoji: "🥸", classes: "text-4xl hover:scale-110 transition-transform" },
  ];

  const RATIOS = {
    "4_3": { label: "4:3 Classic", container: "aspect-[4/3]" },
    "1_1": { label: "1:1 Square", container: "aspect-square" },
    "16_9": { label: "16:9 Cinema", container: "aspect-video" },
  };

  // Webcam listener setup
  useEffect(() => {
    let localStream: MediaStream | null = null;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          localStream = stream;
          setStreamActive(true);
        }
      })
      .catch((err) => {
        console.warn("Camera hardware or permissions unavailable. Initializing mock simulator views.", err);
        setErrorText("Using simulated FaceTime photographic filter stream.");
      });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Recording counter timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Format record timer output
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const leftSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${leftSecs.toString().padStart(2, "0")}`;
  };

  const takeCaptureSnapshot = () => {
    // White shutter flash flare animation
    setFlashOn(true);
    setTimeout(() => setFlashOn(false), 200);

    // Play virtual beep shutter sound effects
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } catch (err) {
        console.log("Audio feedback omitted inside sandbox", err);
      }
    }

    const canvas = canvasRef.current;
    let photoUrl = "";

    try {
      if (streamActive && videoRef.current && canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = videoRef.current.videoWidth || 640;
          canvas.height = videoRef.current.videoHeight || 480;
          ctx.filter = FILTERS.find(f => f.id === activeFilter)?.css || "";
          
          // Mirror rendering matching the preview
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);

          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          
          // reset scaling matrix to overlay sticker
          ctx.setTransform(1, 0, 0, 1, 0, 0);

          const activeStickerData = STICKERS.find(s => s.id === faceSticker);
          if (activeStickerData && activeStickerData.emoji) {
            ctx.font = "60px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(activeStickerData.emoji, canvas.width / 2, canvas.height / 2);
          }

          photoUrl = canvas.toDataURL("image/jpeg");
        }
      }
    } catch {
      // triggers sandbox fallback below
    }

    // Default robust high fidelity filter illustration fallback
    if (!photoUrl) {
      const collectionBySticker: { [key: string]: string } = {
        none: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=480&auto=format&fit=crop&q=80",
        glasses: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=480&auto=format&fit=crop&q=80",
        crown: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=480&auto=format&fit=crop&q=80",
        whiskers: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=480&auto=format&fit=crop&q=80",
        neonvisor: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=480&auto=format&fit=crop&q=80",
        mustache: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=480&auto=format&fit=crop&q=80"
      };
      photoUrl = collectionBySticker[faceSticker] || collectionBySticker["none"];
    }

    const newPhoto: CapturedPhoto = {
      id: `p_photo_${Date.now()}`,
      url: photoUrl,
      filter: activeFilter,
      sticker: faceSticker,
      ratio: activeRatio,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setPhotosRoll(prev => [newPhoto, ...prev]);
    showToast("Captured photograph saved to iPad Roll!");
  };

  const showToast = (txt: string) => {
    setToastText(txt);
    setTimeout(() => {
      setToastText(null);
    }, 2500);
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotosRoll(prev => prev.filter(p => p.id !== id));
    if (viewerPhoto?.id === id) {
      setViewerPhoto(null);
    }
    showToast("Snapshot purged from tablet cache.");
  };

  const handleDownloadPhoto = (p: CapturedPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const link = document.createElement('a');
      link.href = p.url;
      link.download = `facetime-ipad-${p.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Triggered image export download!");
    } catch (err) {
      showToast("Download unsupported in current sandbox.");
    }
  };

  const handleToggleVideoRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      showToast("Simulation video file cached to memory!");
    } else {
      setIsRecording(true);
      showToast("Started simulated FaceTime recording loop!");
    }
  };

  return (
    <div id="camera_app_viewport" className="flex flex-col h-full bg-black text-slate-100 font-sans select-none">
      
      {/* Top Header Controls Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-pink-500 text-white shadow-xs">
            <Camera className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white leading-none">FaceTime Pro Cam</h2>
            <p className="text-[9px] text-pink-400 mt-0.5 font-bold uppercase tracking-wider font-mono">Multitasking media studio</p>
          </div>
        </div>

        {/* Audio feedback, Grid overlay and Reset shortcuts */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGridEnabled(!gridEnabled)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              gridEnabled 
                ? "bg-pink-600/10 border-pink-500/40 text-pink-400" 
                : "bg-transparent border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Toggle Grid Guidelines (3x3)"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              soundEnabled 
                ? "bg-pink-600/10 border-pink-500/40 text-pink-400" 
                : "bg-transparent border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Toggle Shutter Beep"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main split work area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-800">
        
        {/* Left segment: Active Live view stage */}
        <div className="flex-1 p-5 flex flex-col justify-between items-center bg-[#070709] relative overflow-y-auto">
          
          {/* Top Stage Settings (Ratio layout chooser) */}
          <div className="flex bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 w-fit shrink-0 gap-1 z-20">
            {(Object.keys(RATIOS) as Array<"4_3" | "1_1" | "16_9">).map((r) => (
              <button
                key={r}
                onClick={() => setActiveRatio(r)}
                className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all cursor-pointer uppercase ${
                  activeRatio === r 
                    ? "bg-pink-550 text-white shadow-md font-bold" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {RATIOS[r].label}
              </button>
            ))}
          </div>

          {/* Core frame with Selected Ratio */}
          <div className={`relative border-[5px] border-slate-900 bg-slate-950 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center my-4 max-w-lg w-full transition-all duration-300 ${RATIOS[activeRatio].container}`}>
            
            {/* 3x3 Grid Overlay line traces */}
            {gridEnabled && (
              <div className="absolute inset-0 z-20 pointer-events-none select-none">
                {/* vertical divisions */}
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20 border-dotted" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20 border-dotted" />
                {/* horiz divisions */}
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20 border-dotted" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20 border-dotted" />
              </div>
            )}

            {/* Simulated Shutter White Flash layer */}
            <div className={`absolute inset-0 bg-white z-30 transition-opacity duration-150 pointer-events-none ${
              flashOn ? "opacity-100" : "opacity-0"
            }`} />

            {/* Active User Streaming Video */}
            {streamActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ filter: FILTERS.find(f => f.id === activeFilter)?.css }}
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              /* Simulated stage scene */
              <div 
                style={{ filter: FILTERS.find(f => f.id === activeFilter)?.css }}
                className="w-full h-full bg-gradient-to-tr from-[#12111d] via-[#05030a] to-[#251025] flex flex-col items-center justify-center p-6 text-center select-none relative"
              >
                <div className="absolute top-4 left-4 text-white/20 text-[9px] font-mono leading-none flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" /> SIMULATOR PREVIEW ACTIVE
                </div>

                <div className="p-3.5 bg-pink-500/10 rounded-full text-pink-500 border border-pink-500/20 mb-3.5">
                  <Heart className="w-8 h-8 animate-pulse fill-pink-500" />
                </div>
                <h3 className="text-xs font-black text-slate-200">FaceTime Simulated Lens</h3>
                <p className="text-[10px] text-slate-500 max-w-xs mt-1 leading-normal font-medium px-4">Applying premium active real-time CSS filters inside client browser. Enable webcam to unlock real hardware streams!</p>
              </div>
            )}

            {/* Floating Live Stickers rendering onto the viewport relative to the video center */}
            {faceSticker !== "none" && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none select-none text-center">
                <span className={`text-6xl select-none inline-block filter-none ${STICKERS.find(s => s.id === faceSticker)?.classes}`}>
                  {STICKERS.find(s => s.id === faceSticker)?.emoji}
                </span>
              </div>
            )}

            {/* Pulse Recording overlays */}
            {isRecording && (
              <div className="absolute top-4 right-4 bg-red-600/90 text-white text-[9px] font-extrabold px-3 py-1 rounded-full border border-red-500/20 shadow-lg tracking-wide flex items-center gap-1.5 animate-pulse z-20 font-mono select-none">
                <CircleDot className="w-3 h-3 text-red-200 fill-current animate-ping" />
                <span>REC {formatTime(recSeconds)}</span>
              </div>
            )}

            {/* Ambient Toast banner alert inside video frame */}
            {toastText && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-600/90 text-white text-[10px] font-black py-1.5 px-4.5 rounded-full border border-emerald-400/20 shadow-2xl z-40 animate-bounce select-none">
                {toastText}
              </div>
            )}
          </div>

          {/* Trigger Deck Rows */}
          <div className="flex items-center gap-5 py-1.5 shrink-0 z-10">
            {/* Record toggler */}
            <button
              onClick={handleToggleVideoRecording}
              className={`p-3.5 rounded-full border shadow-xl transition-all active:scale-90 cursor-pointer ${
                isRecording 
                  ? "bg-red-650 border-red-500/40 text-white" 
                  : "bg-slate-900 border-slate-800 text-slate-350 hover:text-white"
              }`}
              title={isRecording ? "Stop Video Recording" : "Record Video Clip"}
            >
              {isRecording ? <Square className="w-5 h-5" /> : <Video className="w-5 h-5 text-red-500" />}
            </button>

            {/* Primary snapshot take trigger */}
            <button
              id="capture_snapshot"
              onClick={takeCaptureSnapshot}
              className="p-5.5 bg-white hover:bg-slate-200 text-black rounded-full active:scale-92 transition-all shadow-2xl cursor-pointer border border-slate-300 flex items-center justify-center relative group"
              title="Take Photo Snapshot"
            >
              <CircleDot className="w-7 h-7 text-pink-500 scale-103 group-hover:scale-110 transition-transform" />
            </button>

            {/* Quick clean camera options reset button */}
            <button
              onClick={() => {
                setActiveFilter("normal");
                setFaceSticker("none");
                setGridEnabled(false);
                setIsRecording(false);
                showToast("Cleared active filter settings!");
              }}
              className="p-3.5 bg-slate-900 border border-slate-800 text-slate-350 hover:text-white rounded-full active:scale-90 cursor-pointer shadow-xl"
              title="Reset configuration"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Right segment: Filter panels and Gallery caches */}
        <div className="w-full md:w-56 p-4 bg-slate-950/40 space-y-4 overflow-y-auto shrink-0 flex flex-col">
          
          {/* Section 1: Filters */}
          <div>
            <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase leading-none block mb-2">Photographic Filters</span>
            <div className="space-y-1.5">
              {FILTERS.map((f) => {
                const isSelected = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    id={`btn_filter_${f.id}`}
                    onClick={() => setActiveFilter(f.id)}
                    className={`w-full p-2 rounded-lg text-left text-[10px] font-bold transition-all border flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? "bg-pink-600/10 border-pink-500/35 text-pink-400 font-extrabold" 
                        : "bg-transparent border-slate-800 text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    <span>{f.label}</span>
                    <div 
                      style={{ filter: f.css }} 
                      className="w-5.5 h-3.5 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-sm shrink-0 ml-2" 
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Interactive Face Stickers */}
          <div>
            <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase leading-none block mb-2">Dynamic Face Stickers</span>
            <div className="grid grid-cols-2 gap-1.5">
              {STICKERS.map((s) => {
                const isSelected = faceSticker === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setFaceSticker(s.id);
                      showToast(`Equipped facemask sticker ${s.label}!`);
                    }}
                    className={`p-2 rounded-lg text-center text-[9px] font-bold transition-all border cursor-pointer flex flex-col items-center gap-1 leading-tight ${
                      isSelected 
                        ? "bg-pink-650/15 border-pink-500/40 text-pink-400 font-extrabold" 
                        : "bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-850"
                    }`}
                  >
                    <span className="text-lg">{s.emoji || "🚫"}</span>
                    <span className="truncate max-w-[80px]">{s.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Captured Photo gallery lists with full deletion and downloading */}
          <div className="flex-1 flex flex-col pt-2 min-h-[160px]">
            <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase leading-none block mb-2.5 flex items-center gap-1.5 select-none">
              <ImageIcon className="w-3.5 h-3.5 text-pink-500" /> Interactive Gallery ({photosRoll.length})
            </span>
            
            {photosRoll.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-slate-800 rounded-xl text-center select-none">
                <p className="text-[10px] text-slate-600 font-bold leading-normal">Take a snap shot to save image assets into roll.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                {photosRoll.map((p) => (
                  <div 
                    key={p.id} 
                    onClick={() => setViewerPhoto(p)}
                    className="relative group rounded-xl overflow-hidden aspect-video border border-slate-800 cursor-pointer hover:border-pink-500/45 transition-colors"
                  >
                    <img 
                      src={p.url} 
                      alt="captured freeze clip" 
                      className="w-full h-full object-cover bg-slate-900" 
                      referrerPolicy="no-referrer"
                    />

                    {/* Mask sticker badge display on snapshot top */}
                    {p.sticker !== "none" && (
                      <span className="absolute top-1 left-1 bg-black/60 rounded-xs text-[8px] px-1 font-sans">
                        {STICKERS.find(s => s.id === p.sticker)?.emoji} Masked
                      </span>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-1">
                      <button
                        onClick={(e) => handleDownloadPhoto(p, e)}
                        className="p-1 bg-slate-900 hover:bg-pink-650 hover:text-white rounded-md text-slate-300 pointer-events-auto"
                        title="Export picture"
                      >
                        <ArrowDownCircle className="w-3 h-3" />
                      </button>
                      
                      <button
                        onClick={(e) => handleDeletePhoto(p.id, e)}
                        className="p-1 bg-slate-900 hover:bg-rose-650 hover:text-white rounded-md text-rose-300 pointer-events-auto"
                        title="Delete picture"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="absolute bottom-1 right-1 bg-black/70 text-[7px] font-mono font-bold px-1 rounded-sm leading-none py-0.5">
                      {p.time.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating full-scale Single Photo zoom modal */}
      {viewerPhoto && (
        <div className="absolute inset-0 bg-black/92 backdrop-blur-md z-50 flex flex-col justify-between p-6 select-text animate-fade-in">
          {/* Viewer top bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 select-none">
            <div>
              <h4 className="text-xs font-black text-white">Interactive Picture Viewer</h4>
              <p className="text-[9px] text-pink-400 font-bold tracking-tight uppercase mt-0.5">Capture Snapshot Detail</p>
            </div>
            
            <button
              onClick={() => setViewerPhoto(null)}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 hover:text-white rounded-xl text-xxs font-bold text-slate-300 transition-colors cursor-pointer"
            >
              Back To Studio
            </button>
          </div>

          {/* Core frame display */}
          <div className="flex-1 flex items-center justify-center p-4 relative max-h-[70%]">
            <div className={`relative border mb-[10px] bg-slate-950 border-white/10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] max-w-md w-full`}>
              <img 
                src={viewerPhoto.url} 
                alt="zoomed detailed preview" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />

              {/* metadata block details badge */}
              <div className="absolute top-3 left-3 bg-black/75 px-3 py-1 rounded-full text-[9px] text-pink-300 font-black border border-white/5 uppercase">
                Filter: <span className="text-white font-bold">{viewerPhoto.filter}</span>
              </div>
            </div>
          </div>

          {/* Action Row options */}
          <div className="flex justify-center gap-3.5 pb-2 border-t border-white/10 pt-4 select-none">
            <button
              onClick={(e) => handleDownloadPhoto(viewerPhoto, e)}
              className="px-6 py-2.5 bg-pink-555 hover:bg-pink-600 hover:scale-102 transition-all text-white font-black text-xxs rounded-xl cursor-pointer shadow-lg flex items-center gap-1.5"
            >
              <ArrowDownCircle className="w-3.5 h-3.5" /> Export To iPad
            </button>
            <button
              onClick={(e) => {
                handleDeletePhoto(viewerPhoto.id, e);
                setViewerPhoto(null);
              }}
              className="px-6 py-2.5 bg-rose-700/20 hover:bg-rose-650 text-rose-350 hover:text-white hover:scale-102 transition-all font-black text-xxs rounded-xl cursor-pointer border border-rose-500/25 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Purge Cache File
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
