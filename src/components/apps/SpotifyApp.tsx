import React, { useRef, useState, useEffect } from "react";
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Radio, Sparkles } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  tempo: number;
}

export default function SpotifyApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // Wave velocity scale
  const [synthesizerPitch, setSynthesizerPitch] = useState(0.8); // Wave amplitude scale
  const [volume, setVolume] = useState(70);
  const animationRef = useRef<number | null>(null);

  const playlist: Track[] = [
    { id: "t1", title: "Sunrise Neon Lofi", artist: "Silicon Valley Kid", duration: "3:42", tempo: 85 },
    { id: "t2", title: "Midnight Highway Cyber", artist: "TensorWave", duration: "2:55", tempo: 110 },
    { id: "t3", title: "Solar Retro Wind", artist: "Antigravity Beats", duration: "4:01", tempo: 90 },
    { id: "t4", title: "Deep Space Meditation", artist: "Gemini Oracle", duration: "5:12", tempo: 60 }
  ];

  const currentTrack = playlist[currentTrackIndex];

  // Frequency wave animator
  useEffect(() => {
    let offset = 0;

    const renderWave = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient background
      ctx.fillStyle = "#0c0a0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set wave parameters
      const numLines = 8;
      const step = canvas.height / (numLines + 1);

      ctx.lineWidth = 1.8;

      // Render interactive wave paths
      for (let i = 0; i < numLines; i++) {
        const lineY = step * (i + 1);
        ctx.beginPath();
        
        // Pick custom gradient line styles based on wave modes
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "rgba(99, 102, 241, 0.2)");
        gradient.addColorStop(0.5, isPlaying ? "rgba(236, 72, 153, 0.85)" : "rgba(99, 102, 241, 0.4)");
        gradient.addColorStop(1, "rgba(139, 92, 246, 0.2)");
        ctx.strokeStyle = gradient;

        for (let x = 0; x < canvas.width; x += 3) {
          // Adjust amplitude by synthesizer Pitch, speed by playback speed
          const amplitudeValue = isPlaying 
            ? (volume / 100) * 35 * Math.sin((x * 0.015) + offset + (i * 0.5)) * synthesizerPitch
            : 4 * Math.sin((x * 0.01) + (i * 0.2)); // Minor baseline vibration if paused

          const y = lineY + amplitudeValue;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Step wave offsets
      if (isPlaying) {
        offset += 0.035 * playbackSpeed * (playlist[currentTrackIndex].tempo / 75);
      } else {
        offset += 0.004; // Gentle idle wave speed
      }

      animationRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, currentTrackIndex, playbackSpeed, synthesizerPitch, volume]);

  const handleNextTrack = () => {
    setCurrentTrackIndex(prev => (prev + 1) % playlist.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex(prev => (prev - 1 + playlist.length) % playlist.length);
  };

  return (
    <div id="headphones_spotify_viewport" className="flex flex-col h-full bg-[#09070f] text-slate-100 font-sans">
      {/* Header banner */}
      <header className="px-6 py-3 border-b border-purple-950 bg-[#0d0a16] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-green-600 text-white shadow-xs">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white leading-none">Spotify Lite</h2>
            <p className="text-[9px] text-green-500 mt-0.5 font-bold tracking-wider uppercase">Synthwave Synthesizer Subsystem</p>
          </div>
        </div>
      </header>

      {/* App Body Panel Split */}
      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-purple-950">
        {/* Left Side: Wave Analyzer & Core Controls */}
        <div className="flex-1 p-5 flex flex-col justify-between gap-5">
          {/* Visual Canvas Analyzer (Rounded container) */}
          <div className="relative border border-purple-900 bg-black rounded-2xl overflow-hidden aspect-video w-full shadow-lg">
            <canvas
              ref={canvasRef}
              width={340}
              height={180}
              className="w-full h-full block"
            />
            {/* Analyzer overlays */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[9px] text-pink-400 font-bold px-2 py-1 rounded-full flex items-center gap-1.5 border border-purple-900/40">
              <Radio className="w-3.5 h-3.5 animate-pulse text-pink-500" /> Digital Canvas Visualizer
            </div>
            {isPlaying && (
              <span className="absolute bottom-3 right-3 text-[9px] font-mono text-slate-500">
                TEMP: {currentTrack.tempo} BPM
              </span>
            )}
          </div>

          {/* Album Information Plate */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-700 p-2.5 rounded-xl flex items-center justify-center shadow-lg relative shrink-0">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-sm text-white truncate leading-tight">{currentTrack.title}</h3>
              <p className="text-[11px] text-pink-400 font-semibold truncate mt-1">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Synthesizer Adjustment Sliders */}
          <div className="space-y-3 p-4 bg-purple-950/25 border border-purple-900/40 rounded-2xl">
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold tracking-wider uppercase mb-1">
                <span>Vibrate Velocity (Tempo)</span>
                <span className="text-pink-400 font-mono">{playbackSpeed.toFixed(1)}x</span>
              </div>
              <input
                id="wavespeed_track_slider"
                type="range"
                min="0.3"
                max="2.5"
                step="0.1"
                className="w-full h-1 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-pink-500"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold tracking-wider uppercase mb-1">
                <span>Synthesizer Pitch</span>
                <span className="text-pink-400 font-mono">{synthesizerPitch.toFixed(1)}Hz</span>
              </div>
              <input
                id="waveshape_pitch_slider"
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                className="w-full h-1 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-pink-500"
                value={synthesizerPitch}
                onChange={(e) => setSynthesizerPitch(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Playlist Tracker */}
        <div className="w-full md:w-64 p-5 flex flex-col justify-between gap-5 shrink-0 bg-[#0d0a16]/40">
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3.5">Playlist</h4>
            <div className="space-y-2">
              {playlist.map((track, idx) => (
                <button
                  id={`track_${track.id}`}
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border cursor-pointer transition-all duration-200 ${
                    currentTrackIndex === idx 
                      ? "bg-purple-950/40 border-purple-500/50 text-white" 
                      : "bg-transparent border-transparent text-slate-400 hover:bg-purple-950/20 hover:text-white"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold truncate leading-tight">{track.title}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{track.artist}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 select-none ml-2">
                    {track.duration}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Audio Console Controller Bar */}
          <div className="space-y-4 pt-4 border-t border-purple-950">
            {/* Play controls */}
            <div className="flex items-center justify-center gap-6">
              <button onClick={handlePrevTrack} className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <SkipBack className="w-4 h-4 fill-current" />
              </button>
              <button
                id="toggle_music_play"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button onClick={handleNextTrack} className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Volume Node */}
            <div className="flex items-center gap-2.5 px-2 bg-purple-950/20 py-2 rounded-xl">
              <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                id="music_volume"
                type="range"
                className="flex-1 accent-pink-500 cursor-pointer h-1"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
