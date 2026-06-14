import React, { useState, useEffect } from "react";
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, Award, ArrowUpRight, 
  ArrowDownRight, Search, Activity, RotateCcw, Newspaper, CheckCircle2 
} from "lucide-react";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: { [key: string]: number[] };
  high: number;
  low: number;
  volume: string;
}

export default function StocksApp() {
  const [stocks, setStocks] = useState<Stock[]>([
    { 
      symbol: "AAPL", 
      name: "Apple Inc.", 
      price: 182.35, 
      change: 1.45, 
      changePercent: 0.82,
      history: {
        "1D": [180.5, 181.2, 179.8, 181.9, 182.35],
        "1W": [178.2, 179.4, 180.1, 181.5, 180.9, 181.8, 182.35],
        "1M": [172.5, 175.1, 176.8, 174.9, 178.6, 179.8, 182.35],
        "1Y": [150.2, 155.6, 162.8, 158.4, 168.9, 175.2, 182.35],
      },
      high: 183.10,
      low: 179.50,
      volume: "52.4M"
    },
    { 
      symbol: "GOOGL", 
      name: "Alphabet Inc.", 
      price: 147.60, 
      change: -0.92, 
      changePercent: -0.62,
      history: {
        "1D": [148.8, 148.1, 147.2, 147.9, 147.60],
        "1W": [146.5, 147.2, 149.1, 148.3, 146.9, 147.8, 147.6],
        "1M": [142.1, 144.5, 143.2, 146.8, 145.9, 148.2, 147.6],
        "1Y": [120.4, 125.8, 131.2, 135.6, 139.1, 142.8, 147.6]
      },
      high: 149.20,
      low: 146.80,
      volume: "28.1M"
    },
    { 
      symbol: "NVDA", 
      name: "NVIDIA Corp.", 
      price: 875.12, 
      change: 22.45, 
      changePercent: 2.63,
      history: {
        "1D": [845.0, 852.1, 849.5, 868.2, 875.12],
        "1W": [820.5, 835.4, 842.1, 851.9, 849.0, 860.5, 875.12],
        "1M": [780.2, 792.8, 810.5, 835.1, 846.9, 859.4, 875.12],
        "1Y": [450.5, 520.1, 610.8, 580.4, 695.2, 785.6, 875.12]
      },
      high: 882.00,
      low: 840.10,
      volume: "44.8M"
    },
    { 
      symbol: "TSLA", 
      name: "Tesla Inc.", 
      price: 171.05, 
      change: -4.32, 
      changePercent: -2.46,
      history: {
        "1D": [176.4, 174.2, 172.9, 173.5, 171.05],
        "1W": [182.1, 179.8, 178.5, 176.9, 175.2, 173.8, 171.05],
        "1M": [195.4, 188.1, 186.2, 182.5, 180.9, 175.4, 171.05],
        "1Y": [245.2, 230.1, 215.8, 222.4, 205.2, 188.6, 171.05]
      },
      high: 177.20,
      low: 170.10,
      volume: "88.2M"
    },
    { 
      symbol: "BTC", 
      name: "Bitcoin Core", 
      price: 68420.00, 
      change: 1250.00, 
      changePercent: 1.86,
      history: {
        "1D": [67100, 67800, 67400, 68100, 68420],
        "1W": [65200, 66100, 66900, 65800, 67200, 68100, 68420],
        "1M": [60100, 62400, 64200, 61900, 65600, 67100, 68420],
        "1Y": [35200, 39600, 44800, 41400, 52900, 61200, 68420]
      },
      high: 68900.00,
      low: 66800.00,
      volume: "35.1B"
    },
    { 
      symbol: "ETH", 
      name: "Ethereum Spark", 
      price: 3750.50, 
      change: -45.20, 
      changePercent: -1.19,
      history: {
        "1D": [3810, 3795, 3730, 3775, 3750.50],
        "1W": [3680, 3715, 3810, 3790, 3720, 3780, 3750.50],
        "1M": [3350, 3490, 3540, 3420, 3610, 3720, 3750.50],
        "1Y": [1850, 2010, 2250, 2120, 2850, 3210, 3750.50]
      },
      high: 3825.00,
      low: 3710.00,
      volume: "18.4B"
    },
  ]);

  const [activeSymbol, setActiveSymbol] = useState<string>("AAPL");
  const [timeRange, setTimeRange] = useState<"1D" | "1W" | "1M" | "1Y">("1D");
  const [searchVal, setSearchVal] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Local persisted portfolio attributes
  const [cashBalance, setCashBalance] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("sub_stocks_cash");
      return stored ? Number(stored) : 50000.00; // $50,000 starting cash
    } catch {
      return 50000.00;
    }
  });

  const [portfolio, setPortfolio] = useState<{ [symbol: string]: number }>(() => {
    try {
      const stored = localStorage.getItem("sub_stocks_shares");
      return stored ? JSON.parse(stored) : { "AAPL": 10, "BTC": 0.2 };
    } catch {
      return { "AAPL": 10, "BTC": 0.2 };
    }
  });

  // Ticking live price updates loop
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          // generate slight random flux
          const fluxPercent = (Math.random() - 0.5) * 0.007; // max ±0.35%
          const priceChange = stock.price * fluxPercent;
          const nextPrice = Math.max(0.1, Number((stock.price + priceChange).toFixed(2)));
          const totalChange = Number((stock.change + priceChange).toFixed(2));
          const totalChangePercent = Number(((totalChange / (nextPrice - totalChange)) * 100).toFixed(2));

          // also slightly flux standard high/low boundaries
          const nextHigh = Math.max(nextPrice, stock.high);
          const nextLow = Math.min(nextPrice, stock.low);

          // Update historical trace array dynamically (the last index is current price)
          const nextHistory = { ...stock.history };
          Object.keys(nextHistory).forEach(range => {
            const arr = [...nextHistory[range]];
            if (arr.length > 0) {
              arr[arr.length - 1] = nextPrice;
            }
            nextHistory[range] = arr;
          });

          return {
            ...stock,
            price: nextPrice,
            change: totalChange,
            changePercent: totalChangePercent,
            high: nextHigh,
            low: nextLow,
            history: nextHistory
          };
        })
      );
    }, 4000);

    return () => clearInterval(tickInterval);
  }, []);

  // Save changes to disk
  useEffect(() => {
    try {
      localStorage.setItem("sub_stocks_cash", String(cashBalance));
      localStorage.setItem("sub_stocks_shares", JSON.stringify(portfolio));
    } catch (e) {
      console.warn(e);
    }
  }, [cashBalance, portfolio]);

  const activeStock = stocks.find(s => s.symbol === activeSymbol) || stocks[0];
  const chartPoints = activeStock.history[timeRange] || [100, 105, 102, 110];

  // Manual Buy order executor
  const handleBuyOrder = () => {
    const cost = activeStock.price * quantity;
    if (cashBalance >= cost) {
      setCashBalance(prev => Number((prev - cost).toFixed(2)));
      setPortfolio(prev => {
        const shares = prev[activeSymbol] || 0;
        return {
          ...prev,
          [activeSymbol]: Number((shares + quantity).toFixed(4))
        };
      });
      triggerActionToast(`Successfully purchased ${quantity} units of ${activeSymbol}!`);
    } else {
      triggerActionToast(`Insufficient cash reserves to purchase ${quantity} units.`);
    }
  };

  // Sell order exec
  const handleSellOrder = () => {
    const owned = portfolio[activeSymbol] || 0;
    if (owned >= quantity) {
      const revenue = activeStock.price * quantity;
      setCashBalance(prev => Number((prev + revenue).toFixed(2)));
      setPortfolio(prev => {
        const nextOwned = Number((owned - quantity).toFixed(4));
        const copy = { ...prev };
        if (nextOwned <= 0) {
          delete copy[activeSymbol];
        } else {
          copy[activeSymbol] = nextOwned;
        }
        return copy;
      });
      triggerActionToast(`Liquidated ${quantity} shares of ${activeSymbol}!`);
    } else {
      triggerActionToast(`Holdings too low. You only own ${owned} of ${activeSymbol}.`);
    }
  };

  const triggerActionToast = (txt: string) => {
    setLastAction(txt);
    setTimeout(() => {
      setLastAction(null);
    }, 3000);
  };

  // Reset core balance values
  const handleResetSim = () => {
    setCashBalance(50000.00);
    setPortfolio({ "AAPL": 10, "BTC": 0.2 });
    triggerActionToast("Initialized simulated portfolio back to default!");
  };

  // Dynamic portfolio value calculation
  const calculatePortfolioValue = () => {
    let holdingsTotal = 0;
    Object.keys(portfolio).forEach((sym) => {
      const rate = stocks.find(s => s.symbol === sym)?.price || 0;
      holdingsTotal += (portfolio[sym] * rate);
    });
    return Number((holdingsTotal + cashBalance).toFixed(2));
  };

  const filteredStocks = stocks.filter(s => 
    s.symbol.toLowerCase().includes(searchVal.toLowerCase()) || 
    s.name.toLowerCase().includes(searchVal.toLowerCase())
  );

  // SVG drawing calculators
  const generateSvgPath = () => {
    const width = 360;
    const height = 150;
    const padding = 15;

    const min = Math.min(...chartPoints);
    const max = Math.max(...chartPoints);
    const delta = max - min === 0 ? 1 : max - min;

    const coords = chartPoints.map((val, idx) => {
      const x = padding + (idx / (chartPoints.length - 1)) * (width - padding * 2);
      // invert Y coordinate since SVG (0,0) is top-left
      const y = height - padding - ((val - min) / delta) * (height - padding * 2);
      return { x, y };
    });

    return coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  };

  return (
    <div id="stocks_app_viewport" className="flex flex-col h-full bg-slate-950 font-sans text-slate-100 relative">
      
      {/* Top Header Section */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xs font-bold leading-none text-white">Subsystem Trading Desk</h2>
            <p className="text-[9px] text-emerald-400 mt-1 font-mono uppercase tracking-widest leading-none">Dynamic stock market simulator</p>
          </div>
        </div>

        {/* Global Net Balance indicators */}
        <div className="flex items-center gap-5">
          <div className="text-right">
            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold leading-none block">Virtual Net Worth</span>
            <span className="text-xs font-black font-mono mt-0.5 text-emerald-450 flex items-center justify-end leading-none">
              <DollarSign className="w-3.5 h-3.5" /> {calculatePortfolioValue().toLocaleString()}
            </span>
          </div>

          <button 
            onClick={handleResetSim}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset simulation holdings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Body Columns */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Stock Listing Picker */}
        <div className="w-full md:w-56 bg-slate-900/65 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col overflow-hidden shrink-0">
          {/* Search Header */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1 px-8 text-[10px] text-white focus:outline-hidden focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* List panel */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-850 p-2 space-y-1.5">
            {filteredStocks.map((s) => {
              const isUp = s.change >= 0;
              const isSelected = s.symbol === activeSymbol;
              return (
                <button
                  key={s.symbol}
                  id={`stock_ticker_btn_${s.symbol.toLowerCase()}`}
                  onClick={() => {
                    setActiveSymbol(s.symbol);
                    setTimeRange("1D");
                  }}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer border ${
                    isSelected 
                      ? "bg-slate-800 border-emerald-500/35 text-white" 
                      : "bg-transparent border-transparent text-slate-350 hover:bg-slate-850"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 leading-none">
                      <span className="font-black text-xxs tracking-wide">{s.symbol}</span>
                      <span className="text-[8px] text-slate-500 font-bold truncate max-w-[80px]">{s.name}</span>
                    </div>
                    {/* Share count user owns overlay */}
                    {portfolio[s.symbol] > 0 && (
                      <span className="text-[8px] text-emerald-400 bg-emerald-950 px-1 rounded-sm mt-1 inline-block border border-emerald-900 font-mono leading-none">Owned: {portfolio[s.symbol]}</span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xxs font-black block leading-none">${s.price.toFixed(2)}</span>
                    <span className={`text-[8px] font-bold font-mono mt-0.5 inline-flex items-center gap-0.5 leading-none px-1 py-0.5 rounded-sm ${
                      isUp ? "text-emerald-400 bg-emerald-950" : "text-rose-400 bg-rose-950"
                    }`}>
                      {isUp ? "+" : ""}{s.changePercent}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Stock details, Dynamic charts & Trading logs */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5">
          {/* Active Header Row */}
          <div className="bg-slate-900/40 p-4.5 rounded-2xl border border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-3 select-all">
                <h3 className="text-base font-black text-white">{activeStock.symbol}</h3>
                <span className="text-[10px] text-slate-400 font-bold tracking-tight">{activeStock.name}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono leading-none">
                Volume: <span className="text-slate-300 font-bold">{activeStock.volume}</span> • Today's Range: <span className="text-slate-300 font-bold">${activeStock.low} - ${activeStock.high}</span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <h2 className="text-xl font-mono font-black text-white leading-none">${activeStock.price.toFixed(2)}</h2>
              <div className="flex items-center gap-1.5 sm:justify-end mt-1 font-mono text-[10px] font-bold">
                <span className={activeStock.change >= 0 ? "text-emerald-400" : "text-rose-400"}>
                  {activeStock.change >= 0 ? "+" : ""}{activeStock.change.toFixed(2)}
                </span>
                <span className={`px-1 rounded-xs ${
                  activeStock.change >= 0 ? "text-emerald-400 bg-emerald-950" : "text-rose-400 bg-rose-950"
                }`}>
                  {activeStock.change >= 0 ? "▲" : "▼"} {activeStock.changePercent}%
                </span>
              </div>
            </div>
          </div>

          {/* SVG financial visual plot chart card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-inner">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 leading-none">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Real-time Price Index
              </span>

              {/* Time Range Selector */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(["1D", "1W", "1M", "1Y"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all cursor-pointer ${
                      timeRange === range 
                        ? "bg-slate-850 text-white shadow-xs font-black" 
                        : "text-slate-500 hover:text-white"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Render direct SVG line vector chart */}
            <div className="relative aspect-[16/6] w-full">
              <svg viewBox="0 0 360 150" className="w-full h-full">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={activeStock.change >= 0 ? "#10b981" : "#ef4444"} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={activeStock.change >= 0 ? "#10b981" : "#ef4444"} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="15" y1="20" x2="345" y2="20" stroke="rgba(255,255,255,0.02)" strokeDasharray="2,2" />
                <line x1="15" y1="75" x2="345" y2="75" stroke="rgba(255,255,255,0.02)" strokeDasharray="2,2" />
                <line x1="15" y1="130" x2="345" y2="130" stroke="rgba(255,255,255,0.02)" strokeDasharray="2,2" />

                {/* SVG path mapping */}
                <path
                  d={generateSvgPath()}
                  fill="none"
                  stroke={activeStock.change >= 0 ? "#34d399" : "#f87171"}
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Shaded Area Underneath */}
                <path
                  d={`${generateSvgPath()} L 345 135 L 15 135 Z`}
                  fill="url(#chartGlow)"
                />
              </svg>
            </div>
          </div>

          {/* Bottom Grid Split: Buy/Sell Execution Deck vs Owned portfolio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Buy / Sell Desk Terminal */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4.5 space-y-4">
              <h4 className="text-[9px] uppercase font-bold text-slate-400 tracking-wider leading-none flex items-center gap-1.5 select-none">
                <DollarSign className="w-3.5 h-3.5 text-emerald-450" /> Trading Execution Terminal
              </h4>

              {/* Quantity config */}
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-bold">Volume Units</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl font-bold font-mono text-slate-300 hover:text-white"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-center text-xs font-black focus:outline-hidden"
                  />
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl font-bold font-mono text-slate-300 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total cost evaluation */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850 flex justify-between items-center text-xxs font-semibold">
                <span className="text-slate-500 font-bold">Estimated Cost</span>
                <span className="text-slate-200 font-mono font-bold">${(activeStock.price * quantity).toLocaleString()}</span>
              </div>

              {/* Order buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleBuyOrder}
                  className="py-3 bg-emerald-600 hover:bg-emerald-500 hover:scale-103 rounded-xl border border-emerald-500/20 shadow-lg text-white font-black text-xxs active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  Buy Ticker
                </button>
                <button
                  onClick={handleSellOrder}
                  className="py-3 bg-rose-650 hover:bg-rose-600 hover:scale-103 rounded-xl border border-rose-500/20 shadow-lg text-white font-black text-xxs active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  Sell Holdings
                </button>
              </div>
            </div>

            {/* Portable Owned Assets division */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4.5 space-y-4">
              <h4 className="text-[9px] uppercase font-bold text-slate-400 tracking-wider leading-none flex items-center gap-1.5 select-none">
                <Wallet className="w-3.5 h-3.5 text-sky-400" /> Wallet Balances & Shares
              </h4>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850">
                  <span className="text-[8px] text-slate-500 font-bold uppercase leading-none block">Sim Cash Balance</span>
                  <span className="text-xs font-mono font-black text-white mt-1.5 block">${cashBalance.toLocaleString()}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850">
                  <span className="text-[8px] text-slate-500 font-bold uppercase leading-none block">Est. Stock Value</span>
                  <span className="text-xs font-mono font-black text-emerald-400 mt-1.5 block">
                    ${(calculatePortfolioValue() - cashBalance).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Owned items lists */}
              <div className="space-y-2">
                <h5 className="text-[9px] uppercase font-bold text-slate-500 tracking-wider leading-none select-none">Your Holdings Ledger</h5>
                <div className="max-h-[105px] overflow-y-auto pr-1 space-y-1.5">
                  {Object.keys(portfolio).length === 0 ? (
                    <p className="text-[10px] text-slate-500 font-medium italic text-center py-4">No active stock investments.</p>
                  ) : (
                    Object.keys(portfolio).map((sym) => {
                      const qtyOwned = portfolio[sym];
                      const rate = stocks.find(s => s.symbol === sym)?.price || 0;
                      return (
                        <div key={sym} className="p-2 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between font-mono text-xxs">
                          <div className="font-sans">
                            <span className="font-extrabold text-white">{sym}</span>
                            <span className="text-slate-500 text-[9px] ml-1.5">Qty: {qtyOwned}</span>
                          </div>
                          <span className="font-black text-emerald-450">${(qtyOwned * rate).toLocaleString()}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Floating message banner on execution */}
          {lastAction && (
            <div className="bg-emerald-600/90 text-white text-[10px] font-extrabold py-2 px-4.5 rounded-full border border-emerald-400/20 shadow-2xl flex items-center gap-2 max-w-sm mx-auto animate-bounce select-none">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{lastAction}</span>
            </div>
          )}

          {/* Finance News Tab Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4.5 space-y-3">
            <h4 className="text-[9px] uppercase font-bold text-slate-400 tracking-wider leading-none flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5 text-amber-400" /> Market Intelligence Bulletin
            </h4>
            
            <div className="divide-y divide-slate-850">
              <div className="py-2 flex items-center justify-between text-xxs gap-2">
                <p className="text-slate-350 hover:text-white cursor-pointer select-text font-bold flex-1">NVIDIA surges over 2% inside simulated sub-runtimes as heavy parallel models scaling speeds benchmarks.</p>
                <span className="text-[9px] text-slate-550 font-bold font-mono">15m ago</span>
              </div>
              <div className="py-2 flex items-center justify-between text-xxs gap-2">
                <p className="text-slate-350 hover:text-white cursor-pointer select-text font-bold flex-1">Bitcoin holds strong above $68K support levels while local investment desks purchase simulated cryptocurrency units.</p>
                <span className="text-[9px] text-slate-550 font-bold font-mono">1h ago</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
