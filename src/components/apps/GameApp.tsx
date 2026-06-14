import React, { useRef, useState, useEffect } from "react";
import { Gamepad2, Play, RotateCcw, Award, ShieldAlert, Sparkles, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";

interface GameAppProps {
  gameId?: string;
  gameName?: string;
}

interface Meteor {
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
  color: string;
}

interface Pipe {
  x: number;
  gapTop: number;
  gapHeight: number;
  width: number;
  passed: boolean;
}

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function GameApp({ gameId = "game", gameName = "Astro Runner" }: GameAppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [score, setScore] = useState(0);
  
  const hKey = `high_score_${gameId}`;
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem(hKey) || "0");
    } catch {
      return 0;
    }
  });

  // Determine game engine type based on real game ID
  const getEngineType = (): "runner" | "breaker" | "flappy" | "snake" | "match" => {
    const runnerGames = ["game", "subway_surfers", "temple_run_2", "sonic_dash", "crossy_road", "vector", "traffic_rider", "dr_driving", "alto_adventure"];
    const breakerGames = ["minecraft", "roblox", "asphalt_9", "hill_climb", "geometry_dash", "pubg", "cod_mobile", "free_fire", "shadow_fight_3", "mobile_legends", "genshin_impact", "sniper_3d", "clash_of_kings"];
    const flappyGames = ["angry_birds", "flappy_bird", "doodle_jump", "jetpack_joyride", "badland", "limbo", "helix_jump", "stack", "piano_tiles"];
    const snakeGames = ["slither_io", "plants_vs_zombies", "pvz_2", "among_us", "pou", "clash_of_clans", "clash_royale", "brawl_stars"];
    
    if (runnerGames.includes(gameId)) return "runner";
    if (breakerGames.includes(gameId)) return "breaker";
    if (flappyGames.includes(gameId)) return "flappy";
    if (snakeGames.includes(gameId)) return "snake";
    return "match"; // defaults to puzzle matching for Candy Crush, Board games, Sudoku, Tetris etc.
  };

  const engineType = getEngineType();

  // Color customization based on game flavor
  const getGameThemeColor = () => {
    if (gameId.includes("subway") || gameId.includes("temple")) return "#eab308"; // Golden Warm
    if (gameId.includes("candy") || gameId.includes("crush")) return "#f472b6"; // Sweet Pink
    if (gameId.includes("angry") || gameId.includes("fire") || gameId.includes("pubg")) return "#ef4444"; // Fire Red
    if (gameId.includes("mine") || gameId.includes("slither") || gameId.includes("plants")) return "#22c55e"; // Grass Green
    return "#3b82f6"; // Cyber Blue
  };

  const themeColor = getGameThemeColor();

  // --- REFS & ENGINE STATES ---
  const gameLoopRef = useRef<number | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // 1. Runner Engine State
  const runnerPlayerRef = useRef({ x: 120, y: 220, width: 22, height: 26 });
  const runnerObstaclesRef = useRef<Meteor[]>([]);

  // 2. Breaker Engine State
  const breakerPaddleRef = useRef({ x: 110, y: 250, width: 60, height: 8 });
  const breakerBallRef = useRef({ x: 140, y: 200, dx: 1.8, dy: -1.8, radius: 5 });
  const breakerBricksRef = useRef<Brick[]>([]);

  // 3. Flappy Hopper State
  const flappyBirdRef = useRef({ x: 50, y: 120, velocity: 0, gravity: 0.16, jumpForce: -3.8, radius: 7 });
  const flappyPipesRef = useRef<Pipe[]>([]);

  // 4. Snake State
  const snakeSegmentsRef = useRef<{ x: number; y: number }[]>([]);
  const snakeDirectionRef = useRef({ dx: 1, dy: 0 }); // Current step direction
  const snakeFoodRef = useRef({ x: 5, y: 5 });
  const snakeTicksRef = useRef(0);

  // 5. Memory Match State (React State)
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);

  // Custom theme match symbols
  const getMatchSymbols = () => {
    if (gameId.includes("candy") || gameId.includes("crush")) {
      return ["🍬", "🍭", "🍫", "🍩", "🍒", "🍇"];
    }
    if (gameId.includes("eight") || gameId.includes("ludo") || gameId.includes("board")) {
      return ["🎲", "🎱", "🎯", "🏆", "🃏", "👑"];
    }
    return ["👾", "🚀", "🌟", "🛡️", "🔮", "💎"];
  };

  const initMemoryMatch = () => {
    const rawSymbols = getMatchSymbols();
    const duplicated = [...rawSymbols, ...rawSymbols];
    // Shuffle
    const shuffled = duplicated
      .map((sym, index) => ({ id: index, symbol: sym, isFlipped: false, isMatched: false }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setSelectedCardIds([]);
    setScore(0);
    setGameOver(false);
    setHasWon(false);
  };

  // Keyboard listeners Setup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      
      // Flappy jump shortcut
      if (e.key === " " || e.key === "ArrowUp") {
        if (engineType === "flappy") {
          flappyBirdRef.current.velocity = flappyBirdRef.current.jumpForce;
        }
      }

      // Snake directions
      if (engineType === "snake") {
        const cur = snakeDirectionRef.current;
        if ((e.key === "ArrowUp" || e.key === "w" || e.key === "W") && cur.dy === 0) {
          snakeDirectionRef.current = { dx: 0, dy: -1 };
        }
        if ((e.key === "ArrowDown" || e.key === "s" || e.key === "S") && cur.dy === 0) {
          snakeDirectionRef.current = { dx: 0, dy: 1 };
        }
        if ((e.key === "ArrowLeft" || e.key === "a" || e.key === "A") && cur.dx === 0) {
          snakeDirectionRef.current = { dx: -1, dy: 0 };
        }
        if ((e.key === "ArrowRight" || e.key === "d" || e.key === "D") && cur.dx === 0) {
          snakeDirectionRef.current = { dx: 1, dy: 0 };
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [engineType]);

  const handleGameOver = (finalScore: number) => {
    setGameOver(true);
    setIsPlaying(false);
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);

    setHighScore(prev => {
      const next = Math.max(prev, finalScore);
      try {
        localStorage.setItem(hKey, String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleGameWin = (finalScore: number) => {
    setHasWon(true);
    setIsPlaying(false);
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);

    setHighScore(prev => {
      const next = Math.max(prev, finalScore);
      try {
        localStorage.setItem(hKey, String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setHasWon(false);
    setScore(0);

    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    if (engineType === "runner") {
      runnerPlayerRef.current = { x: 120, y: 220, width: 22, height: 26 };
      runnerObstaclesRef.current = [
        { x: 40, y: -40, size: 16, speed: 2.1 },
        { x: 110, y: -120, size: 22, speed: 1.8 },
        { x: 190, y: -200, size: 15, speed: 2.6 }
      ];
      runRunnerLoop();
    } else if (engineType === "breaker") {
      breakerPaddleRef.current = { x: 110, y: 250, width: 60, height: 8 };
      breakerBallRef.current = { x: 140, y: 200, dx: 1.6, dy: -1.6, radius: 5 };
      
      // Seed bricks
      const cols = 5;
      const rows = 3;
      const spacing = 45;
      const paddingLeft = 30;
      const tempBricks: Brick[] = [];
      const brickColors = ["#ef4444", "#a855f7", "#ec4899"];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          tempBricks.push({
            x: paddingLeft + c * spacing,
            y: 40 + r * 15,
            width: 36,
            height: 10,
            alive: true,
            color: brickColors[r % brickColors.length]
          });
        }
      }
      breakerBricksRef.current = tempBricks;
      runBreakerLoop();
    } else if (engineType === "flappy") {
      flappyBirdRef.current = { x: 60, y: 100, velocity: 0, gravity: 0.16, jumpForce: -3.8, radius: 7 };
      flappyPipesRef.current = [
        { x: 260, gapTop: 60, gapHeight: 85, width: 32, passed: false },
        { x: 400, gapTop: 100, gapHeight: 85, width: 32, passed: false }
      ];
      runFlappyLoop();
    } else if (engineType === "snake") {
      snakeSegmentsRef.current = [
        { x: 7, y: 7 },
        { x: 6, y: 7 },
        { x: 5, y: 7 }
      ];
      snakeDirectionRef.current = { dx: 1, dy: 0 };
      snakeFoodRef.current = { x: 10, y: 4 };
      snakeTicksRef.current = 0;
      runSnakeLoop();
    } else if (engineType === "match") {
      initMemoryMatch();
    }
  };

  // 1. RUNNER ENGINE DRAW
  const runRunnerLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const player = runnerPlayerRef.current;
    const speed = 4;

    if (keysRef.current["ArrowLeft"] || keysRef.current["a"] || keysRef.current["A"]) {
      player.x = Math.max(0, player.x - speed);
    }
    if (keysRef.current["ArrowRight"] || keysRef.current["d"] || keysRef.current["D"]) {
      player.x = Math.min(canvas.width - player.width, player.x + speed);
    }

    // Update obstacles
    const obs = runnerObstaclesRef.current;
    for (let i = 0; i < obs.length; i++) {
      const o = obs[i];
      o.y += o.speed;

      if (o.y > canvas.height) {
        o.y = -30;
        o.x = Math.random() * (canvas.width - o.size);
        o.speed = 1.6 + Math.random() * 2 + (score * 0.05);
        setScore(prev => prev + 1);
      }

      // Check collision
      if (
        player.x < o.x + o.size &&
        player.x + player.width > o.x &&
        player.y < o.y + o.size &&
        player.y + player.height > o.y
      ) {
        handleGameOver(score);
        return;
      }
    }

    // Render Setup
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0c0f1d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid details
    ctx.strokeStyle = "rgba(99, 102, 241, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Render Obstacles
    for (const o of obs) {
      ctx.fillStyle = themeColor;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(o.x + o.size/2, o.y + o.size/2, o.size/2, 0, Math.PI * 2);
      ctx.fill();
    }
    // Reset shadow
    ctx.shadowBlur = 0;

    // Render character
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(player.x + player.width/2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();

    // Thrust flame
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(player.x + player.width/2 - 2, player.y + player.height, 4, 4);

    gameLoopRef.current = requestAnimationFrame(runRunnerLoop);
  };

  // 2. BREAKER ENGINE DRAW
  const runBreakerLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pad = breakerPaddleRef.current;
    const ball = breakerBallRef.current;
    const bricks = breakerBricksRef.current;

    // Move paddle
    const padSpeed = 4.5;
    if (keysRef.current["ArrowLeft"] || keysRef.current["a"] || keysRef.current["A"]) {
      pad.x = Math.max(0, pad.x - padSpeed);
    }
    if (keysRef.current["ArrowRight"] || keysRef.current["d"] || keysRef.current["D"]) {
      pad.x = Math.min(canvas.width - pad.width, pad.x + padSpeed);
    }

    // Move Ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce walls
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
      ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    }

    // Bounce paddle
    if (
      ball.y + ball.radius >= pad.y &&
      ball.x >= pad.x &&
      ball.x <= pad.x + pad.width
    ) {
      ball.dy = -Math.abs(ball.dy);
    }

    // Fall below
    if (ball.y + ball.radius > canvas.height) {
      handleGameOver(score);
      return;
    }

    // Break Bricks
    let bricksLeft = 0;
    for (const b of bricks) {
      if (!b.alive) continue;
      bricksLeft++;

      if (
        ball.x + ball.radius >= b.x &&
        ball.x - ball.radius <= b.x + b.width &&
        ball.y + ball.radius >= b.y &&
        ball.y - ball.radius <= b.y + b.height
      ) {
        b.alive = false;
        ball.dy = -ball.dy;
        setScore(prev => {
          const next = prev + 10;
          if (bricksLeft - 1 === 0) {
            handleGameWin(next);
          }
          return next;
        });
        break;
      }
    }

    // Render
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0c0a1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Bricks
    for (const b of bricks) {
      if (!b.alive) continue;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.width, b.height);
    }

    // Draw Paddle
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(pad.x, pad.y, pad.width, pad.height);

    // Draw Ball
    ctx.fillStyle = themeColor;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    gameLoopRef.current = requestAnimationFrame(runBreakerLoop);
  };

  // 3. FLAPPY ENGINE DRAW
  const runFlappyLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const b = flappyBirdRef.current;
    b.velocity += b.gravity;
    b.y += b.velocity;

    // Bounds check
    if (b.y - b.radius < 0 || b.y + b.radius > canvas.height) {
      handleGameOver(score);
      return;
    }

    // Pipes updating
    const pipes = flappyPipesRef.current;
    for (let i = 0; i < pipes.length; i++) {
      const p = pipes[i];
      p.x -= 1.8;

      // Respawn pipe
      if (p.x < -p.width) {
        p.x = canvas.width + 40;
        p.gapTop = 40 + Math.random() * 110;
        p.passed = false;
      }

      // Add score
      if (!p.passed && p.x + p.width < b.x) {
        p.passed = true;
        setScore(prev => prev + 1);
      }

      // Collide
      const inX = b.x + b.radius > p.x && b.x - b.radius < p.x + p.width;
      const collideTop = b.y - b.radius < p.gapTop;
      const collideBottom = b.y + b.radius > p.gapTop + p.gapHeight;

      if (inX && (collideTop || collideBottom)) {
        handleGameOver(score);
        return;
      }
    }

    // Render
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0a0f18";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pipes
    ctx.fillStyle = "rgba(34, 197, 94, 0.75)";
    for (const p of pipes) {
      // Top pipe
      ctx.fillRect(p.x, 0, p.width, p.gapTop);
      // Bottom pipe
      ctx.fillRect(p.x, p.gapTop + p.gapHeight, p.width, canvas.height - (p.gapTop + p.gapHeight));
    }

    // Draw bird character
    ctx.fillStyle = themeColor;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(b.x + 3, b.y - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    gameLoopRef.current = requestAnimationFrame(runFlappyLoop);
  };

  // 4. SNAKE ENGINE DRAW
  const runSnakeLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    snakeTicksRef.current++;

    // Slow down snake ticks
    if (snakeTicksRef.current % 12 === 0) {
      const segs = snakeSegmentsRef.current;
      const dir = snakeDirectionRef.current;

      const head = { x: segs[0].x + dir.dx, y: segs[0].y + dir.dy };

      // Wall crash
      const gridCount = 20; // 280 / 14 = 20 grids
      if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount) {
        handleGameOver(score);
        return;
      }

      // Self crash
      for (const s of segs) {
        if (s.x === head.x && s.y === head.y) {
          handleGameOver(score);
          return;
        }
      }

      // Prep segments
      segs.unshift(head);

      // Eat food
      const food = snakeFoodRef.current;
      if (head.x === food.x && head.y === food.y) {
        // Find new food spot
        let placed = false;
        while (!placed) {
          const rx = Math.floor(Math.random() * gridCount);
          const ry = Math.floor(Math.random() * gridCount);
          // check not on snake
          const onSnake = segs.some(s => s.x === rx && s.y === ry);
          if (!onSnake) {
            snakeFoodRef.current = { x: rx, y: ry };
            placed = true;
          }
        }
        setScore(prev => prev + 10);
      } else {
        segs.pop(); // remove tail
      }
    }

    // Render
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#040c11";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gridSize = 14; // each grid cell is 14px

    // Food
    const food = snakeFoodRef.current;
    ctx.fillStyle = "#ea580c";
    ctx.fillRect(food.x * gridSize + 1, food.y * gridSize + 1, gridSize - 2, gridSize - 2);

    // Snake
    ctx.fillStyle = themeColor;
    const segs = snakeSegmentsRef.current;
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      ctx.fillStyle = i === 0 ? "#ffffff" : themeColor;
      ctx.fillRect(s.x * gridSize + 1, s.y * gridSize + 1, gridSize - 2, gridSize - 2);
    }

    gameLoopRef.current = requestAnimationFrame(runSnakeLoop);
  };

  // 5. MEMORY PUZZLE EVENT HANDLE
  const handleCardClick = (id: number) => {
    if (!isPlaying || gameOver || hasWon) return;
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    // Flip card
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));

    const nextSelected = [...selectedCardIds, id];
    if (nextSelected.length === 2) {
      setSelectedCardIds([]);
      const [firstId, secondId] = nextSelected;
      const first = cards.find(c => c.id === firstId)!;
      const second = cards.find(c => c.id === secondId)!;

      if (first.symbol === second.symbol) {
        // Matched!
        setCards(prev => prev.map(c => 
          c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
        ));
        setScore(prev => {
          const next = prev + 25;
          // Check if solved
          const matchedCount = cards.filter(c => c.isMatched || c.id === firstId || c.id === secondId).length;
          if (matchedCount === cards.length) {
            handleGameWin(next);
          }
          return next;
        });
      } else {
        // Hold flip then flip back
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === firstId || c.id === secondId) && !c.isMatched 
              ? { ...c, isFlipped: false } 
              : c
          ));
        }, 750);
      }
    } else {
      setSelectedCardIds(nextSelected);
    }
  };

  const manualMoveRunner = (direction: "left" | "right") => {
    if (!isPlaying) return;
    const player = runnerPlayerRef.current;
    if (direction === "left") {
      player.x = Math.max(0, player.x - 25);
    } else {
      player.x = Math.min(280 - player.width, player.x + 25);
    }
  };

  const manualMoveBreaker = (direction: "left" | "right") => {
    if (!isPlaying) return;
    const pad = breakerPaddleRef.current;
    if (direction === "left") {
      pad.x = Math.max(0, pad.x - 30);
    } else {
      pad.x = Math.min(280 - pad.width, pad.x + 30);
    }
  };

  const manualJumpFlappy = () => {
    if (!isPlaying) return;
    flappyBirdRef.current.velocity = flappyBirdRef.current.jumpForce;
  };

  const manualMoveSnake = (direction: "up" | "down" | "left" | "right") => {
    if (!isPlaying) return;
    const cur = snakeDirectionRef.current;
    if (direction === "up" && cur.dy === 0) snakeDirectionRef.current = { dx: 0, dy: -1 };
    if (direction === "down" && cur.dy === 0) snakeDirectionRef.current = { dx: 0, dy: 1 };
    if (direction === "left" && cur.dx === 0) snakeDirectionRef.current = { dx: -1, dy: 0 };
    if (direction === "right" && cur.dx === 0) snakeDirectionRef.current = { dx: 1, dy: 0 };
  };

  return (
    <div id="game_app_viewport" className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans">
      {/* App Header */}
      <header className="bg-slate-950 px-6 py-3 shrink-0 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-red-600 border border-red-500 text-white shadow-md">
            <Gamepad2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-xs font-black text-white leading-none tracking-tight">{gameName}</h2>
            <p className="text-[9px] text-slate-400 mt-1 font-mono uppercase tracking-widest">{engineType} arcade Subsystem</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider leading-none">Score</p>
            <p className="text-sm font-black font-mono text-emerald-400 mt-0.5">{score}</p>
          </div>
          <div className="text-right border-l border-slate-800 pl-4 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider leading-none">Record</p>
              <p className="text-sm font-black font-mono text-amber-400 mt-0.5">{highScore}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Stage Segment */}
      <div className="flex-1 flex flex-col md:flex-row gap-5 p-5 items-center justify-center overflow-hidden relative">
        <div className="relative border-4 border-slate-950 bg-slate-950 rounded-2xl shadow-2xl overflow-hidden aspect-[4/3] w-full max-w-sm flex items-center justify-center">
          
          {/* Card Match Grid Engine */}
          {engineType === "match" && isPlaying ? (
            <div className="grid grid-cols-4 gap-2.5 p-4.5 w-full h-full bg-[#080710] auto-rows-fr">
              {cards.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCardClick(c.id)}
                  className={`rounded-xl border flex items-center justify-center text-3xl transition-all duration-300 cursor-pointer ${
                    c.isFlipped || c.isMatched
                      ? "bg-slate-900 border-indigo-500 text-white shadow-xl scale-100"
                      : "bg-indigo-600/35 hover:bg-indigo-600/50 border-white/10 hover:border-white/20 text-transparent scale-[0.96]"
                  }`}
                >
                  {(c.isFlipped || c.isMatched) ? c.symbol : "❓"}
                </button>
              ))}
            </div>
          ) : (
            /* Canvas-based Arcades Grid */
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="w-full h-full block bg-slate-950"
            />
          )}

          {/* Opening Setup Dialog */}
          {!isPlaying && !gameOver && !hasWon && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-20 animate-fade-in">
              <div 
                className="p-4 rounded-full border mb-4 shadow-xl"
                style={{ backgroundColor: `${themeColor}20`, borderColor: `${themeColor}40`, color: themeColor }}
              >
                <Gamepad2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-sm font-black text-white mb-1.5">{gameName}</h3>
              <p className="text-[11px] text-zinc-400 max-w-[200px] mb-5 leading-normal">
                {engineType === "runner" && "Steer with Left and Right controllers to dodge vertical obstacles!"}
                {engineType === "breaker" && "Bounce cyber spheres to mine block tiles!"}
                {engineType === "flappy" && "Tap to jump and hover between obstacles!"}
                {engineType === "snake" && "Eat food pellets to grow without crashing walls!"}
                {engineType === "match" && "Match exact pairs of candy or arcade symbols!"}
              </p>
              <button
                id="start_game_button"
                onClick={startGame}
                style={{ backgroundColor: themeColor }}
                className="px-6 py-2.5 text-white hover:scale-105 rounded-xl text-xs font-extrabold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Start Play
              </button>
            </div>
          )}

          {/* Game Over Panel */}
          {gameOver && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-20 animate-fade-in">
              <div className="p-3.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-3.5 shadow-lg">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest leading-none mb-1.5">Game Over</h3>
              <p className="text-xxs text-slate-500 font-semibold mb-4 leading-none">Your final score: <span className="text-emerald-400 font-mono font-bold text-xs">{score}</span></p>
              <button
                id="game_restart_btn"
                onClick={startGame}
                style={{ backgroundColor: themeColor }}
                className="px-6 py-2.5 text-white rounded-xl text-xs font-extrabold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-105"
              >
                <RotateCcw className="w-3.5 h-3.5 animate-spin-reverse" /> Respawn
              </button>
            </div>
          )}

          {/* Victory Win Panel */}
          {hasWon && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-20 animate-fade-in">
              <div className="p-3.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3.5 shadow-lg animate-bounce">
                <Sparkles className="w-8 h-8 fill-current" />
              </div>
              <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest leading-none mb-1.5">Victory achieved!</h3>
              <p className="text-xxs text-slate-350 font-semibold mb-4 leading-none">Perfect Match Score: <span className="text-emerald-400 font-mono font-bold text-xs">{score}</span></p>
              <button
                id="game_restart_btn"
                onClick={startGame}
                style={{ backgroundColor: themeColor }}
                className="px-6 py-2.5 text-white rounded-xl text-xs font-extrabold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-105"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Replay Saga
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Tactile Controllers based on active Game Engine */}
        {isPlaying && (
          <div className="w-full max-w-xs md:w-36 shrink-0 flex flex-col gap-3.5 relative z-10 transition-all">
            <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-center">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center select-none leading-none">Tactile D-Pad</h4>
              
              {/* Controller buttons layout */}
              {engineType === "runner" && (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => manualMoveRunner("left")}
                    className="py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-black text-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-md select-none"
                  >
                    <ArrowLeft className="w-4 h-4 mr-0.5" /> Left
                  </button>
                  <button
                    onClick={() => manualMoveRunner("right")}
                    className="py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-black text-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-md select-none"
                  >
                    Right <ArrowRight className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              )}

              {engineType === "breaker" && (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => manualMoveBreaker("left")}
                    className="py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-black text-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-md select-none"
                  >
                    <ArrowLeft className="w-4 h-4 mr-0.5" /> Left
                  </button>
                  <button
                    onClick={() => manualMoveBreaker("right")}
                    className="py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-black text-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-md select-none"
                  >
                    Right <ArrowRight className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              )}

              {engineType === "flappy" && (
                <button
                  onClick={manualJumpFlappy}
                  style={{ backgroundColor: themeColor }}
                  className="py-4 text-white rounded-2xl font-black text-xs active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-lg select-none"
                >
                  <ArrowUp className="w-5 h-5 animate-bounce" /> Flap Wings
                </button>
              )}

              {engineType === "snake" && (
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    onClick={() => manualMoveSnake("up")}
                    className="w-11 h-11 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg flex items-center justify-center shadow-md active:scale-95"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <div className="flex justify-between w-full h-11 px-2.5">
                    <button
                      onClick={() => manualMoveSnake("left")}
                      className="w-11 h-11 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg flex items-center justify-center shadow-md active:scale-95"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => manualMoveSnake("right")}
                      className="w-11 h-11 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg flex items-center justify-center shadow-md active:scale-95"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => manualMoveSnake("down")}
                    className="w-11 h-11 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg flex items-center justify-center shadow-md active:scale-95"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              )}

              {engineType === "match" && (
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider text-center py-2 select-none leading-relaxed">
                  Point-And-Click <br/> Card flip matching!
                </p>
              )}

              <p className="text-[9px] text-slate-500 font-medium text-center mt-3 select-none leading-snug">
                Keyboard bindings are also fully active!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
