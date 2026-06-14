import React, { useState } from "react";
import { Calculator, RotateCcw, ArrowLeft, Equal } from "lucide-react";

export default function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const handleKeyPress = (val: string) => {
    setDisplay(prev => {
      if (prev === "0" && val !== ".") {
        return val;
      }
      return prev + val;
    });
    setEquation(prev => prev + val);
  };

  const handleOperator = (op: string) => {
    setDisplay("0");
    setEquation(prev => {
      // Check if last character was already an operator and swap if so
      const last = prev.trim().slice(-1);
      if (["+", "-", "*", "/"].includes(last)) {
        return prev.slice(0, -1) + ` ${op} `;
      }
      return prev + ` ${op} `;
    });
  };

  const clearCalc = () => {
    setDisplay("0");
    setEquation("");
  };

  const backspace = () => {
    setDisplay(prev => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
    setEquation(prev => {
      if (prev.length <= 1) return "";
      return prev.slice(0, -1);
    });
  };

  const calculateResult = () => {
    try {
      if (!equation) return;
      // Sanitize equation for basic calculations
      const sanitized = equation.replace(/×/g, "*").replace(/÷/g, "/");
      // Use standard safe arithmetic evaluator (or Function construct safely for simple floats)
      const result = Number(new Function(`return (${sanitized})`)());
      
      const formattedResult = Number.isInteger(result) ? result.toString() : result.toFixed(4);
      
      setHistory(prev => [ `${equation} = ${formattedResult}`, ...prev].slice(0, 10));
      setDisplay(formattedResult);
      setEquation(formattedResult);
    } catch {
      setDisplay("Error");
      setEquation("");
    }
  };

  const handleScientific = (type: string) => {
    try {
      const num = Number(display);
      let result = 0;
      switch (type) {
        case "sin": result = Math.sin(num); break;
        case "cos": result = Math.cos(num); break;
        case "tan": result = Math.tan(num); break;
        case "sqrt": result = Math.sqrt(num); break;
        case "sqr": result = num * num; break;
        case "pi": result = Math.PI; break;
        default: return;
      }
      const formatted = result.toFixed(5);
      setDisplay(formatted);
      setEquation(formatted);
    } catch {
      setDisplay("Error");
    }
  };

  const keysConfig = [
    { label: "sin", action: () => handleScientific("sin"), style: "bg-slate-800 text-slate-300 font-medium" },
    { label: "cos", action: () => handleScientific("cos"), style: "bg-slate-800 text-slate-300 font-medium" },
    { label: "tan", action: () => handleScientific("tan"), style: "bg-slate-800 text-slate-300 font-medium" },
    { label: "√", action: () => handleScientific("sqrt"), style: "bg-slate-800 text-slate-300 font-medium" },
    
    { label: "C", action: clearCalc, style: "bg-amber-500 text-white font-black" },
    { label: "⌫", action: backspace, style: "bg-slate-800 text-stone-200" },
    { label: "x²", action: () => handleScientific("sqr"), style: "bg-slate-800 text-slate-300" },
    { label: "÷", action: () => handleOperator("/"), style: "bg-indigo-600 text-white font-extrabold" },

    { label: "7", action: () => handleKeyPress("7"), style: "bg-slate-900 border border-slate-800 text-stone-100" },
    { label: "8", action: () => handleKeyPress("8"), style: "bg-slate-900 border border-slate-800 text-stone-100" },
    { label: "9", action: () => handleKeyPress("9"), style: "bg-slate-900 border border-slate-800 text-stone-100" },
    { label: "×", action: () => handleOperator("*"), style: "bg-indigo-600 text-white font-extrabold" },

    { label: "4", action: () => handleKeyPress("4"), style: "bg-slate-900 border border-slate-800 text-stone-100" },
    { label: "5", action: () => handleKeyPress("5"), style: "bg-slate-900 border border-slate-800 text-stone-100" },
    { label: "6", action: () => handleKeyPress("6"), style: "bg-slate-900 border border-slate-800 text-stone-100" },
    { label: "-", action: () => handleOperator("-"), style: "bg-indigo-600 text-white font-extrabold" },

    { label: "1", action: () => handleKeyPress("1"), style: "bg-slate-900 border border-slate-800 text-stone-100" },
    { label: "2", action: () => handleKeyPress("2"), style: "bg-slate-900 border border-slate-800 text-stone-100" },
    { label: "3", action: () => handleKeyPress("3"), style: "bg-slate-900 border border-slate-800 text-stone-100" },
    { label: "+", action: () => handleOperator("+"), style: "bg-indigo-600 text-white font-extrabold" },

    { label: "π", action: () => handleScientific("pi"), style: "bg-slate-800 text-slate-300" },
    { label: "0", action: () => handleKeyPress("0"), style: "bg-slate-900 border border-slate-800 text-stone-100" },
    { label: ".", action: () => handleKeyPress("."), style: "bg-slate-900 border border-slate-800 text-stone-100" },
    { label: "=", action: calculateResult, style: "bg-emerald-600 text-white font-black" },
  ];

  return (
    <div id="calculator_container" className="flex flex-col h-full bg-slate-950 text-slate-200 font-sans">
      <header className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500 text-white shadow-xs">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white leading-none">Calculator Pro</h2>
            <p className="text-[9px] text-stone-400 mt-0.5">Scientific Fluid Grid Subsystem</p>
          </div>
        </div>
      </header>

      {/* Calculator splitter */}
      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden">
        {/* Left numeric input grid */}
        <div className="flex-1 p-5 flex flex-col justify-end gap-4 min-h-[220px]">
          {/* Display panel */}
          <div className="text-right p-4.5 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col justify-between shrink-0 mb-2 min-h-[85px]">
            <p className="text-xxs text-slate-500 font-mono font-bold tracking-wider truncate mb-1.5">
              {equation || "0"}
            </p>
            <p className="text-2xl font-black font-mono text-emerald-400 truncate leading-none">
              {display}
            </p>
          </div>

          {/* Numeric Pad Layout Grid */}
          <div className="grid grid-cols-4 gap-2 flex-1 items-stretch">
            {keysConfig.map((k, idx) => (
              <button
                id={`calc_key_${idx}`}
                key={idx}
                onClick={k.action}
                className={`py-2 rounded-xl text-xxs font-extrabold hover:scale-103 active:scale-97 select-none cursor-pointer duration-150 transition-all flex items-center justify-center shadow-xs ${k.style}`}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right history sidebar panel */}
        <div className="w-full md:w-56 p-4.5 flex flex-col justify-between shrink-0 bg-slate-950/40">
          <div>
            <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">Logs History</h3>
            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-xxs text-slate-600 font-medium">No calculation logs available.</p>
              ) : (
                history.map((h, i) => (
                  <div key={i} className="bg-slate-900/40 border border-slate-800/80 p-2 rounded-lg font-mono text-xxs text-slate-400">
                    {h}
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            id="clear_calc_history"
            onClick={() => setHistory([])}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-stone-450 hover:text-rose-400 text-xxs font-bold border border-slate-800/80 rounded-xl transition-colors cursor-pointer"
          >
            Reset History Logs
          </button>
        </div>
      </div>
    </div>
  );
}
