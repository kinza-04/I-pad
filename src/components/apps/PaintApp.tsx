import React, { useRef, useState, useEffect } from "react";
import { Paintbrush, Eraser, RotateCcw, Download, Sparkles } from "lucide-react";

export default function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#4f46e5");
  const [brushSize, setBrushSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const [isPencilMode, setIsPencilMode] = useState(true); // Apple Pencil Tilt Simulation

  const PRESET_COLORS = [
    "#000000", "#ef4444", "#f97316", "#f59e0b", 
    "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", 
    "#ec4899", "#ffffff"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Build adaptive HDPI canvas buffer
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // Add white solid background
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Sync brush state attributes on update
  useEffect(() => {
    if (!contextRef.current) return;
    contextRef.current.strokeStyle = isEraser ? "#ffffff" : brushColor;
    contextRef.current.lineWidth = brushSize;
  }, [brushColor, brushSize, isEraser]);

  // Handle window resizing
  const triggerResize = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.getBoundingClientRect();
    // Cache the drawn image
    const tempImage = new Image();
    tempImage.src = canvas.toDataURL();
    
    // Resize
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    contextRef.current.scale(2, 2);
    contextRef.current.lineCap = "round";
    contextRef.current.lineJoin = "round";
    
    // Draw back
    tempImage.onload = () => {
      contextRef.current?.drawImage(tempImage, 0, 0, rect.width, rect.height);
    };
  };

  useEffect(() => {
    window.addEventListener("resize", triggerResize);
    return () => window.removeEventListener("resize", triggerResize);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!contextRef.current || !canvasRef.current) return;
    e.preventDefault();

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;
    e.preventDefault();

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Apply simulation multipliers (making stroke thickness react to tilt simulation if Apple Pencil setting active!)
    if (isPencilMode && !isEraser) {
      const speed = Math.abs(x - rect.width / 2) / rect.width;
      contextRef.current.lineWidth = brushSize * (1.2 - speed * 0.4);
    } else {
      contextRef.current.lineWidth = brushSize;
    }

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    contextRef.current.fillStyle = "#ffffff";
    contextRef.current.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
  };

  const saveCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `ipad-pennote-sketch-${Date.now()}.png`;
    link.click();
  };

  return (
    <div id="paint_app_viewport" className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans">
      {/* Tool Dock Area */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500 text-white shadow-xs">
            <Paintbrush className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-900 leading-none">Pixel Paint Pro</h2>
            <p className="text-[9px] text-gray-400 mt-0.5 font-medium">Apple Pencil Simulated Input</p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Apple Pencil Simulation Mode */}
          <button
            id="toggle_apple_pencil"
            onClick={() => setIsPencilMode(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xxs font-bold flex items-center gap-1.5 transition-all duration-200 border cursor-pointer ${
              isPencilMode 
                ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                : "bg-white border-gray-200 text-gray-400"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Pencil Tilt: {isPencilMode ? "Active" : "Standard"}
          </button>

          <button
            id="eraser_toggle_btn"
            onClick={() => setIsEraser(prev => !prev)}
            className={`p-2 rounded-lg transition-colors border cursor-pointer ${isEraser ? "bg-red-50 text-red-600 border-red-200" : "bg-white text-gray-400 border-gray-200"}`}
            title="Eraser tool"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          <button
            id="clear_paint_canvas"
            onClick={clearCanvas}
            className="p-2 bg-white text-gray-400 border border-gray-200 hover:text-rose-500 hover:border-rose-100 rounded-lg transition-colors cursor-pointer"
            title="Reset Canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            id="save_paint_sketch"
            onClick={saveCanvasImage}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xxs rounded-lg transition-colors shadow-xs hover:shadow-sm cursor-pointer flex items-center gap-1"
            title="Download illustration"
          >
            <Download className="w-3.5 h-3.5" /> Save Sketch
          </button>
        </div>
      </header>

      {/* Main Canvas + Control Board Grid */}
      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 overflow-hidden">
        {/* Left Control Panel / Toolbar */}
        <div className="w-full md:w-56 bg-white p-4.5 flex flex-row md:flex-col gap-4.5 shrink-0 overflow-x-auto md:overflow-y-auto">
          {/* Brush Sizes */}
          <div className="flex-1 md:flex-initial">
            <h3 className="text-xxs font-bold text-gray-400 uppercase tracking-widest mb-2.5">Brush Weight</h3>
            <div className="flex items-center gap-3">
              <input
                id="brush_weight_slider"
                type="range"
                min="2"
                max="32"
                step="1"
                className="flex-1 accent-indigo-600"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
              />
              <span className="text-[10px] font-bold font-mono text-gray-500 bg-gray-50 border px-1.5 py-0.5 rounded-sm shrink-0">
                {brushSize}px
              </span>
            </div>
          </div>

          {/* Canvas Color Board */}
          <div className="flex-1 md:flex-initial">
            <h3 className="text-xxs font-bold text-gray-400 uppercase tracking-widest mb-2.5">Palette Colors</h3>
            <div className="grid grid-cols-5 gap-2 w-fit">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  id={`color_${c}`}
                  onClick={() => {
                    setBrushColor(c);
                    setIsEraser(false);
                  }}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full border border-gray-100 cursor-pointer hover:scale-110 active:scale-90 transition-all shadow-xxs relative flex items-center justify-center`}
                >
                  {brushColor === c && !isEraser && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-xxs animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Hex Color Picker Input */}
            <div className="mt-3 flex items-center gap-2 border border-gray-100 p-1.5 rounded-lg bg-gray-50">
              <input 
                id="custom_hex_picker"
                type="color" 
                value={brushColor}
                onChange={(e) => {
                  setBrushColor(e.target.value);
                  setIsEraser(false);
                }}
                className="w-5 h-5 rounded-sm cursor-pointer border-0"
              />
              <input 
                type="text"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="bg-transparent text-[10px] font-bold font-mono text-gray-600 outline-hidden w-16"
              />
            </div>
          </div>
        </div>

        {/* Right Canvas Zone */}
        <div className="flex-1 bg-white relative p-4 flex items-center justify-center">
          <canvas
            id="sketch_drawing_canvas"
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="border border-gray-200 rounded-xl shadow-inner bg-white cursor-crosshair h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
