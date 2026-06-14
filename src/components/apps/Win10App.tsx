import { useState, useEffect, useRef } from "react";
import { 
  Folder, FileText, Terminal, X, Search, Maximize2, Minimize2, ChevronRight, 
  Monitor, Trash2, Settings, Power, User, Image, Sun, Volume2, CloudSun, 
  RotateCcw, Check, RefreshCw, AlertCircle, HelpCircle, ArrowLeft, ArrowRight,
  Globe, Play, Trophy, Shield, Info, HardDrive, Edit
} from "lucide-react";

// Types for Files and Windows
interface FileItem {
  name: string;
  type: "folder" | "file";
  content?: string;
  size?: string;
}

interface WindowsDirectories {
  [path: string]: FileItem[];
}

interface WindowState {
  id: string; // "explorer" | "notepad" | "cmd" | "paint" | "ie" | "mines"
  title: string;
  icon: string;
  isOpen: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
}

export default function Win10App() {
  // Desktop background select options
  const backgrounds = [
    "bg-radial from-[#1060a0] via-[#053075] to-[#011535]", // Classic Win 10 Glow
    "bg-gradient-to-br from-[#1a1c2c] via-[#005a9e] to-[#011535]", // Deep Indigo Tech
    "bg-radial from-[#1e1e1e] to-[#0f0f0f]" // Dark Slate
  ];
  const [currentBg, setCurrentBg] = useState(backgrounds[0]);

  // Clock
  const [winTime, setWinTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setWinTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // System States
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [nextZ, setNextZ] = useState(10);
  const [searchActive, setSearchActive] = useState(false);

  // App-specific internal states
  // 1. File Explorer
  const [currentDirPath, setCurrentDirPath] = useState("C:\\Users\\Kinza\\Desktop");
  const [files, setFiles] = useState<WindowsDirectories>({
    "C:\\": [
      { name: "Users", type: "folder" },
      { name: "Windows", type: "folder" },
      { name: "Program Files", type: "folder" }
    ],
    "C:\\Users": [
      { name: "Kinza", type: "folder" }
    ],
    "C:\\Users\\Kinza": [
      { name: "Desktop", type: "folder" },
      { name: "Documents", type: "folder" },
      { name: "Pictures", type: "folder" }
    ],
    "C:\\Users\\Kinza\\Desktop": [
      { name: "ReadMe.txt", type: "file", content: "Welcome to Windows 10 Mobile OS Simulator!\n\nThis app runs as a nested desktop virtual machine inside your iPadOS Subsystem.\n\nEnjoy the interactive features:\n- Click folder icons to navigate the C:\\ Drive\n- Write and save text files in Notepad\n- Open CMD to run commands like 'hack' or 'systeminfo'\n- Play structural Minesweeper\n- Draw on the digital canvas in MS Paint\n- Query simulated websites on Internet Explorer!", size: "384 B" },
      { name: "System_Specs.txt", type: "file", content: "--- WIN10 SYSTEM SPECIFICATIONS ---\nHost IP: 127.0.0.1 (Sandbox Interface)\nCPU: Intel virtual Core i9 @ 3.8 GHz\nRAM: 16.0 GB virtualized SDRAM\nSystem Disk: 114.2 GB / 512 GB allocated Virtual NTFS\nPlatform: WebAssembly Node Ingress Routing", size: "240 B" },
      { name: "Secrets.txt", type: "file", content: "Kinza's iPadOS developer log:\nToday, we deployed Windows 10 inside Google Play Store! Everything renders flawlessly and is extremely fluid in this simulated layout framework. Absolute masterpieces of typography and visual layout balance achieved.", size: "185 B" },
      { name: "Minesweeper.lnk", type: "file", content: "LAUNCH_MINESWEEPER_EXE", size: "1 KB" }
    ],
    "C:\\Users\\Kinza\\Documents": [
      { name: "Resume.txt", type: "file", content: "Kinza Murtaza\nLead Subsystem Architect\n\nSkills:\n- React & Full-Stack Node.js Architecture\n- Virtual Device Simulations (Android/iPadOS)\n- Play Store Protection Compliance\n- Cloud Storage Optimization", size: "210 B" },
      { name: "Ideas.txt", type: "file", content: "- Integrate real-time peer-to-peer multiplayer terminal sessions\n- Add vintage Windows 95 themes\n- Configure custom system sounds inside the browser chrome", size: "155 B" }
    ],
    "C:\\Users\\Kinza\\Pictures": [
      { name: "WallpaperInfo.txt", type: "file", content: "To adjust wallpaper:\nOpen the Start Menu and click under personalize settings, or utilize our premium background switcher toggles inside Windows 10 desktop space directly.", size: "140 B" }
    ],
    "C:\\Windows": [
      { name: "system32", type: "folder" },
      { name: "explorer.exe", type: "file", content: "Windows core GUI launcher payload.", size: "12 MB" }
    ],
    "C:\\Windows\\system32": [
      { name: "cmd.exe", type: "file", content: "Command Line Terminal Interpreter binary.", size: "4 MB" },
      { name: "hal.dll", type: "file", content: "Hardware Abstraction Layer component library.", size: "2 MB" }
    ],
    "C:\\Program Files": [
      { name: "Internet Explorer", type: "folder" }
    ],
    "C:\\Program Files\\Internet Explorer": [
      { name: "iexplore.exe", type: "file", content: "Internet Explorer browser execute.", size: "6 MB" }
    ]
  });

  // 2. Notepad state
  const [notepadContent, setNotepadContent] = useState("");
  const [notepadFileName, setNotepadFileName] = useState("Untitled.txt");

  // 3. Command Prompt states
  const [cmdInput, setCmdInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([
    "Microsoft Windows [Version 10.0.19045.4170]",
    "(c) Microsoft Corporation. All rights reserved.",
    "",
    "Type 'help' to see list of valid console inputs.",
    "C:\\Users\\Kinza\\Desktop>"
  ]);
  const [isHacking, setIsHacking] = useState(false);
  const hackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 4. Paint states
  const [paintColor, setPaintColor] = useState("#000000");
  const [paintBrushSize, setPaintBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 5. Internet Explorer
  const [ieUrl, setIeUrl] = useState("https://www.google.com");
  const [ieSearchQuery, setIeSearchQuery] = useState("");
  const [ieResults, setIeResults] = useState<any[]>([]);
  const [ieLoading, setIeLoading] = useState(false);

  // 6. Minesweeper state
  const [minesGrid, setMinesGrid] = useState<{ value: number; revealed: boolean; flagged: boolean }[][]>([]);
  const [minesStatus, setMinesStatus] = useState<"ready" | "playing" | "won" | "lost">("ready");
  const [minesCount, setMinesCount] = useState(10);

  // Window Management States
  const [windows, setWindows] = useState<WindowState[]>([
    { id: "explorer", title: "File Explorer", icon: "📁", isOpen: false, isMaximized: false, x: 20, y: 20, w: 520, h: 360, zIndex: 1 },
    { id: "notepad", title: "Notepad", icon: "📄", isOpen: true, isMaximized: false, x: 80, y: 40, w: 460, h: 320, zIndex: 2 },
    { id: "cmd", title: "Command Prompt", icon: "💻", isOpen: false, isMaximized: false, x: 120, y: 70, w: 480, h: 350, zIndex: 1 },
    { id: "paint", title: "Paint Pro", icon: "🎨", isOpen: false, isMaximized: false, x: 40, y: 60, w: 500, h: 380, zIndex: 1 },
    { id: "ie", title: "Internet Explorer", icon: "🌐", isOpen: false, isMaximized: false, x: 100, y: 30, w: 540, h: 400, zIndex: 1 },
    { id: "mines", title: "Minesweeper", icon: "💣", isOpen: false, isMaximized: false, x: 140, y: 80, w: 320, h: 390, zIndex: 1 }
  ]);

  // Bring selected window to top focus
  const focusWindow = (id: string) => {
    setActiveWindow(id);
    setWindows(prev => {
      const highestZ = Math.max(...prev.map(w => w.zIndex), 0);
      return prev.map(w => {
        if (w.id === id) {
          return { ...w, zIndex: highestZ + 1 };
        }
        return w;
      });
    });
  };

  const toggleWindow = (id: string, action: "open" | "close" | "maximize" | "minimize") => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        if (action === "open") {
          focusWindow(id);
          return { ...w, isOpen: true };
        }
        if (action === "close") {
          return { ...w, isOpen: false };
        }
        if (action === "maximize") {
          return { ...w, isMaximized: !w.isMaximized };
        }
      }
      return w;
    }));
  };

  // Dragging windows simple mock handling across desktop
  const handleHeaderMouseDown = (id: string, e: React.MouseEvent) => {
    if (windows.find(w => w.id === id)?.isMaximized) return;
    
    focusWindow(id);
    const windowToDrag = windows.find(w => w.id === id);
    if (!windowToDrag) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initX = windowToDrag.x;
    const initY = windowToDrag.y;

    const handleMouseMove = (mvEvent: MouseEvent) => {
      const deltaX = mvEvent.clientX - startX;
      const deltaY = mvEvent.clientY - startY;

      setWindows(prev => prev.map(w => {
        if (w.id === id) {
          // Constrain movement within helpful bounds
          return {
            ...w,
            x: Math.min(Math.max(initX + deltaX, 0), 800),
            y: Math.min(Math.max(initY + deltaY, 0), 500)
          };
        }
        return w;
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // File system click helper
  const navigateFolder = (dirName: string) => {
    let target = "";
    if (dirName === "..") {
      const parts = currentDirPath.split("\\");
      if (parts.length > 1) {
        parts.pop();
        target = parts.join("\\");
      } else {
        target = "C:\\";
      }
    } else {
      target = currentDirPath === "C:\\" ? `C:\\${dirName}` : `${currentDirPath}\\${dirName}`;
    }

    if (files[target]) {
      setCurrentDirPath(target);
    }
  };

  const openFile = (file: FileItem) => {
    if (file.name === "Minesweeper.lnk" || file.content === "LAUNCH_MINESWEEPER_EXE") {
      toggleWindow("mines", "open");
      return;
    }

    if (file.type === "file") {
      setNotepadFileName(file.name);
      setNotepadContent(file.content || "");
      toggleWindow("notepad", "open");
    } else {
      navigateFolder(file.name);
    }
  };

  // File explorer directory content reader
  const currentDirectoryContents = files[currentDirPath] || [];

  // Notepad triggers
  const handleSaveNotepad = () => {
    const defaultTextName = notepadFileName.endsWith(".txt") ? notepadFileName : `${notepadFileName}.txt`;
    
    // Insert into current Directory C:\\Users\\Kinza\\Desktop
    const currentFiles = files[currentDirPath] || [];
    const exists = currentFiles.some(f => f.name === defaultTextName);

    const updatedFilesForDir = exists 
      ? currentFiles.map(f => f.name === defaultTextName ? { ...f, content: notepadContent, size: `${notepadContent.length} B` } : f)
      : [...currentFiles, { name: defaultTextName, type: "file" as const, content: notepadContent, size: `${notepadContent.length} B` }];

    setFiles(prev => ({
      ...prev,
      [currentDirPath]: updatedFilesForDir
    }));

    alert(`Saved ${defaultTextName} successfully into ${currentDirPath}!`);
  };

  // Command interpret
  const executeCmd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCmd = cmdInput.trim();
    if (!cleanCmd) return;

    const lowerCmd = cleanCmd.toLowerCase();
    let response: string[] = [];

    if (lowerCmd === "help") {
      response = [
        "Windows 10 console. Built-in instructions list:",
        "  dir            List items inside the current virtual folder",
        "  cd <folder>    Navigate virtual folder directories",
        "  cat <file>     Print file items read text contents",
        "  echo <text>    Print characters to screen console",
        "  systeminfo     Print Windows 10 OS subsystem configurations",
        "  winver         Open visual Windows build version summary dialog",
        "  color <val>    Change command prompt text hue (e.g. green, red, yellow)",
        "  hack           Unveil high-octane simulated hacker dashboard stream",
        "  cls            Clear console history lists"
      ];
    } else if (lowerCmd === "dir") {
      response = [
        ` Directory of ${currentDirPath}`,
        ""
      ];
      const items = files[currentDirPath] || [];
      items.forEach(itm => {
        const typeStr = itm.type === "folder" ? "<DIR>" : "       ";
        const sizeStr = itm.size ? itm.size.padStart(7) : "       ";
        response.push(`06/14/2026  10:00 AM    ${typeStr} ${sizeStr} ${itm.name}`);
      });
    } else if (lowerCmd.startsWith("cd ")) {
      const dest = cleanCmd.substring(3).trim();
      if (dest === "..") {
        const parts = currentDirPath.split("\\");
        if (parts.length > 1) {
          parts.pop();
          const target = parts.join("\\");
          if (files[target]) {
            setCurrentDirPath(target);
            response = [`Navigated to ${target}`];
          } else {
            response = [`Cannot find drive segment ${target}`];
          }
        } else {
          response = ["Already at root directory C:\\"];
        }
      } else {
        const target = currentDirPath === "C:\\" ? `C:\\${dest}` : `${currentDirPath}\\${dest}`;
        if (files[target]) {
          setCurrentDirPath(target);
          response = [`Navigated to ${target}`];
        } else {
          // Check relative path
          const relativeTarget = `${currentDirPath}\\${dest}`;
          if (files[relativeTarget]) {
            setCurrentDirPath(relativeTarget);
            response = [`Navigated to ${relativeTarget}`];
          } else {
            response = [`The system cannot find the path specified: "${dest}"`];
          }
        }
      }
    } else if (lowerCmd.startsWith("cat ")) {
      const fileName = cleanCmd.substring(4).trim();
      const items = files[currentDirPath] || [];
      const f = items.find(item => item.name.toLowerCase() === fileName.toLowerCase());
      if (f) {
        if (f.type === "file") {
          response = (f.content || "").split("\n");
        } else {
          response = [`"${fileName}" is a directory folder.`];
        }
      } else {
        response = [`File not found: "${fileName}"`];
      }
    } else if (lowerCmd.startsWith("echo ")) {
      response = [cleanCmd.substring(5)];
    } else if (lowerCmd === "systeminfo") {
      response = [
        "OS Name:                   Microsoft Windows 10 Pro Simulator",
        "OS Version:                10.0.19045 Build 19045",
        "OS Manufacturer:           Microsoft Corporation (Simulated)",
        "OS Config:                 Standalone Workstation",
        "Product ID:                00330-80000-00000-AA608",
        "System Manufacturer:       Apple iPadOS subsystem",
        "System Model:              Virtual X64 Container host",
        "Total Physical Memory:     16,384 MB SDRAM",
        "Storage Allocations:       512 GB Virtual NTFS Partition"
      ];
    } else if (lowerCmd === "winver") {
      response = [
        "About Windows 10 Integration",
        "Microsoft Windows Simulator Version 10.0 (Build 19045)",
        "(c) Microsoft Corporation. All rights reserved.",
        "The Windows 10 Pro desktop environment simulation is running",
        "actively inside the Play Store subsystem container."
      ];
    } else if (lowerCmd.startsWith("color ")) {
      const colorVal = lowerCmd.split(" ")[1];
      const validHues = ["green", "red", "yellow", "blue", "white", "purple"];
      if (validHues.includes(colorVal)) {
        // We will match the console text styling
        response = [`Text color set to ${colorVal}`];
      } else {
        response = [`Invalid value. Choose from: ${validHues.join(", ")}`];
      }
    } else if (lowerCmd === "hack") {
      // Start hacker stream
      setIsHacking(true);
      response = ["Initializing hack mode... Overriding network firewalls...", "Security compromised! Connected to simulated global satellites!"];
      setCmdInput("");
      
      let ctr = 0;
      if (hackIntervalRef.current) clearInterval(hackIntervalRef.current);
      hackIntervalRef.current = setInterval(() => {
        const hacks = [
          `ATTEMPT_BYPASS_ROUTER: [OK - Port ${Math.floor(Math.random()*60000)}]`,
          `RETRIEVING_DATA_BLOB: IP_SUITE=192.168.${Math.floor(Math.random()*254)}.${Math.floor(Math.random()*254)}`,
          `CORRUPTING_SYSTEM32_HAL_DLL... (Simulated)`,
          `DECRIPT_DEVICES_MATRIX: SEQUENCE=0x${Math.floor(Math.random()*999999).toString(16)}`,
          `DECRYPTION_HINT_OK: 'Kinza_iPad_Subsystem_Is_Stellar'`,
          `UPGRADE_SUCCESS: BYPASS_SSL_VERIFICATION=TRUE`,
          `INTRUSION_ALERT: PLAY_PROTECT_BYPASSED=TRUE`,
          `DOWNLOADING_VIRTUAL_MEMORIES...`
        ];
        setCmdHistory(prev => [...prev, hacks[ctr % hacks.length]]);
        ctr++;
        if (ctr > 30) {
          setIsHacking(false);
          if (hackIntervalRef.current) clearInterval(hackIntervalRef.current);
          setCmdHistory(prev => [...prev, "Hacking script ended safely. Ready.", "C:\\Users\\Kinza\\Desktop>"]);
        }
      }, 500);

      return;
    } else if (lowerCmd === "cls") {
      setCmdHistory([`${currentDirPath}>`]);
      setCmdInput("");
      return;
    } else {
      response = [`'${cleanCmd}' is not recognized as an internal or external command,`, "operable program or batch file. Type 'help' for instructions."];
    }

    setCmdHistory(prev => [...prev, `${currentDirPath}> ${cleanCmd}`, ...response, `${currentDirPath}>`]);
    setCmdInput("");
  };

  useEffect(() => {
    return () => {
      if (hackIntervalRef.current) clearInterval(hackIntervalRef.current);
    };
  }, []);

  // MS Paint Mouse Drawing callbacks
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get correct bounding offsets
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = paintColor;
    ctx.lineWidth = paintBrushSize;
    ctx.lineCap = "round";
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Re-initialize white background when Paint starts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && windows.find(w => w.id === "paint")?.isOpen) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [windows.find(w => w.id === "paint")?.isOpen]);

  // Internet Explorer Simulated Web Search
  const handleIeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ieSearchQuery.trim()) return;

    setIeLoading(true);
    setIeResults([]);

    setTimeout(() => {
      const q = ieSearchQuery.toLowerCase();
      let res = [
        { title: `Search Outcomes for '${ieSearchQuery}'`, url: `https://search.msn.com/q=${encodeURIComponent(q)}`, desc: "Browse high-precision relevant answers compiled instantly with speed." }
      ];

      if (q.includes("google") || q.includes("play")) {
        res = [
          { title: "Google Play Store Subsystem", url: "https://play.google.com/store", desc: "Experience the ultimate tablet simulation interface, backed by real-time Google services, Play Protect and custom sandbox environments." },
          { title: "Google Cloud Console Pro", url: "https://console.cloud.google.com", desc: "Access premium Kubernetes Engines, Firebase databases, and storage options with seamless developer controllers." }
        ];
      } else if (q.includes("kinza") || q.includes("murtaza")) {
        res = [
          { title: "Kinza Murtaza Portfolio Ledger", url: "https://github.com/kinzamurtaza", desc: "Subsystem developer specializing in premium full-stack responsive web engines, interactive operating system platforms, and custom iPadOS modules." },
          { title: "iPad x Android Simulator Project File", url: "C:\\Users\\Kinza\\Desktop\\Secrets.txt", desc: "Locally hosted document listing visual wallpaper metrics and advanced device lock credentials." }
        ];
      } else if (q.includes("weather") || q.includes("temperature")) {
        res = [
          { title: "Windows MSN Weather Forecast", url: "https://weather.msn.com", desc: "Sunny clouds. Current: 24°C. Humidity: 45%. Cloud protective shield: Optimal coverage." }
        ];
      } else if (q.includes("news") || q.includes("tech")) {
        res = [
          { title: "Wired Technology Ledger - June 2026", url: "https://wired.com/tech-news", desc: "System architects confirm that serverless sandboxing and browser-based operating system containers have crossed the high-fidelity threshold." }
        ];
      } else {
        res = [
          { title: `msn.com: Explore ${ieSearchQuery}`, url: `https://msn.com/${q}`, desc: `Latest stories, trending hot updates, and news snippets related to your search criteria: ${ieSearchQuery}.` },
          { title: `Wikipedia Info for "${ieSearchQuery}"`, url: `https://en.wikipedia.org/wiki/${ieSearchQuery}`, desc: `Read detailed references, historical records, and community explanations about ${ieSearchQuery}.` }
        ];
      }

      setIeResults(res);
      setIeLoading(false);
      setIeUrl(`https://search.msn.com?q=${encodeURIComponent(ieSearchQuery)}`);
    }, 800);
  };

  // Minesweeper game engine setup
  const initMinesweeper = () => {
    setMinesStatus("playing");
    const numRows = 8;
    const numCols = 8;
    const totalMines = 10;
    setMinesCount(totalMines);

    // Grid creation
    const tempGrid = Array.from({ length: numRows }, () => 
      Array.from({ length: numCols }, () => ({
        value: 0, // -1 is bomb, 0-8 count
        revealed: false,
        flagged: false
      }))
    );

    // Place mines randomly
    let placedMines = 0;
    while (placedMines < totalMines) {
      const r = Math.floor(Math.random() * numRows);
      const c = Math.floor(Math.random() * numCols);

      if (tempGrid[r][c].value !== -1) {
        tempGrid[r][c].value = -1;
        placedMines++;
      }
    }

    // Calculate neighboring mine numbers
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        if (tempGrid[r][c].value === -1) continue;

        let adjacentBombs = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols) {
              if (tempGrid[nr][nc].value === -1) adjacentBombs++;
            }
          }
        }
        tempGrid[r][c].value = adjacentBombs;
      }
    }

    setMinesGrid(tempGrid);
  };

  const cellClick = (r: number, c: number) => {
    if (minesStatus !== "playing") return;
    const cell = minesGrid[r][c];
    if (cell.revealed || cell.flagged) return;

    const nextGrid = [...minesGrid.map(row => [...row])];

    if (cell.value === -1) {
      // Loose game
      setMinesStatus("lost");
      // Double reveal all mines
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (nextGrid[i][j].value === -1) {
            nextGrid[i][j].revealed = true;
          }
        }
      }
      setMinesGrid(nextGrid);
      return;
    }

    // Flood fill uncover coordinates
    const revealCell = (row: number, col: number) => {
      if (row < 0 || row >= 8 || col < 0 || col >= 8) return;
      if (nextGrid[row][col].revealed || nextGrid[row][col].flagged) return;

      nextGrid[row][col].revealed = true;

      // Uncover neighbors if 0
      if (nextGrid[row][col].value === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            revealCell(row + dr, col + dc);
          }
        }
      }
    };

    revealCell(r, c);

    // Verify Win
    let cellsRemaining = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (nextGrid[i][j].value !== -1 && !nextGrid[i][j].revealed) {
          cellsRemaining++;
        }
      }
    }

    setMinesGrid(nextGrid);
    if (cellsRemaining === 0) {
      setMinesStatus("won");
    }
  };

  const rightClickCell = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (minesStatus !== "playing") return;
    const cell = minesGrid[r][c];
    if (cell.revealed) return;

    setMinesGrid(prev => prev.map((row, rid) => row.map((cl, cid) => {
      if (rid === r && cid === c) {
        const nextFlag = !cl.flagged;
        setMinesCount(curr => nextFlag ? curr - 1 : curr + 1);
        return { ...cl, flagged: nextFlag };
      }
      return cl;
    })));
  };

  // Start Minesweeper on load
  useEffect(() => {
    initMinesweeper();
  }, []);

  return (
    <div id="win10_desktop_wrapper" className={`w-full h-full ${currentBg} text-white flex flex-col relative select-none font-sans overflow-hidden`}>
      
      {/* Desktop Icons Array */}
      <div className="absolute top-4 left-4 grid grid-cols-1 gap-6 z-0 content-start">
        {[
          { id: "explorer", label: "This PC", icon: "💻", iconClass: "bg-[#0078d7]" },
          { id: "notepad", label: "Notepad Docs", icon: "📄", iconClass: "bg-amber-600" },
          { id: "cmd", label: "Command CMD", icon: "💻", iconClass: "bg-slate-800" },
          { id: "paint", label: "MS Paint Pro", icon: "🎨", iconClass: "bg-purple-600" },
          { id: "ie", label: "Int Explorer", icon: "🌐", iconClass: "bg-blue-650" },
          { id: "mines", label: "Minesweeper", icon: "💣", iconClass: "bg-amber-800" }
        ].map(item => (
          <button
            key={item.id}
            id={`desktop_win_shortcut_${item.id}`}
            onClick={() => toggleWindow(item.id, "open")}
            className="group flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/10 active:bg-white/15 cursor-pointer max-w-[80px] text-center gap-1.5 transition-all text-white border-0 bg-transparent shrink-0"
          >
            <div className={`w-10 h-10 rounded-xl ${item.iconClass} shadow-md border border-white/20 select-none flex items-center justify-center text-xl`}>
              {item.icon}
            </div>
            <span className="text-[9px] font-bold tracking-wide leading-tight drop-shadow-md select-none">
              {item.label}
            </span>
          </button>
        ))}

        {/* Quick personalize switcher floating tab */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-2 border border-white/10">
          <p className="text-[7.5px] uppercase font-bold text-slate-300 mb-1 leading-none">Personalize</p>
          <div className="flex gap-1">
            {backgrounds.map((bg, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBg(bg)}
                className={`w-3.5 h-3.5 rounded-full ${bg} border border-white/25 cursor-pointer`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Primary Workstation Canvas where Window overlays live */}
      <div className="flex-1 w-full h-full relative p-4 overflow-hidden z-10">

        {/* --- DYNAMIC WINDOWS RENDER LOOP --- */}
        {windows.map((win) => {
          if (!win.isOpen) return null;
          const isActive = activeWindow === win.id;

          return (
            <div
              key={win.id}
              style={{
                top: win.isMaximized ? "0" : `${win.y}px`,
                left: win.isMaximized ? "0" : `${win.x}px`,
                width: win.isMaximized ? "100%" : `${win.w}px`,
                height: win.isMaximized ? "calc(100% - 40px)" : `${win.h}px`,
                zIndex: win.zIndex
              }}
              onClick={() => focusWindow(win.id)}
              className={`absolute bg-slate-900 border ${
                isActive ? "border-[#0078d7] shadow-2xl" : "border-slate-700 shadow-md opacity-95"
              } rounded-lg flex flex-col justify-stretch overflow-hidden transition-all duration-150 animate-scale-up text-slate-100`}
            >
              {/* Windows 10 Title bar Chrome */}
              <div 
                onMouseDown={(e) => handleHeaderMouseDown(win.id, e)}
                className="h-9 bg-slate-950 px-3 border-b border-slate-800 flex items-center justify-between cursor-move select-none shrink-0"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  <span className="text-xs">{win.icon}</span>
                  <span className="text-slate-205 truncate max-w-[200px]">{win.title}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => toggleWindow(win.id, "close")}
                    title="Minimize application"
                    className="p-1 hover:bg-white/10 rounded cursor-pointer leading-none text-slate-400"
                  >
                    <Minimize2 className="w-3 h-3 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => toggleWindow(win.id, "maximize")}
                    title={win.isMaximized ? "Restore window" : "Maximize window"}
                    className="p-1 hover:bg-white/10 rounded cursor-pointer leading-none"
                  >
                    <Maximize2 className="w-3 h-3 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => toggleWindow(win.id, "close")}
                    title="Close"
                    className="p-1 hover:bg-rose-600 hover:text-white rounded cursor-pointer leading-none transition-colors border-0"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Windows Content switchboard */}
              <div className="flex-1 overflow-hidden relative bg-slate-950 flex flex-col justify-stretch">
                
                {/* 1. File Explorer Content */}
                {win.id === "explorer" && (
                  <div className="flex-1 flex overflow-hidden text-xs">
                    {/* Left path nav column */}
                    <aside className="w-40 bg-slate-900 border-r border-slate-850 p-2 space-y-1 overflow-y-auto shrink-0 font-medium">
                      <p className="text-[10px] font-bold text-slate-405 uppercase px-2 mb-1">Quick Directories</p>
                      <button 
                        onClick={() => {
                          setCurrentDirPath("C:\\");
                        }}
                        className={`w-full text-left px-2 py-1 rounded flex items-center gap-1.5 cursor-pointer ${
                          currentDirPath === "C:\\" ? "bg-[#0078d7] text-white" : "hover:bg-white/5"
                        }`}
                      >
                        <HardDrive className="w-3.5 h-3.5 shrink-0" />
                        <span>System (C:)</span>
                      </button>

                      <button 
                        onClick={() => {
                          setCurrentDirPath("C:\\Users\\Kinza\\Desktop");
                        }}
                        className={`w-full text-left px-2 py-1 rounded flex items-center gap-1.5 cursor-pointer ${
                          currentDirPath === "C:\\Users\\Kinza\\Desktop" ? "bg-[#0078d7] text-white" : "hover:bg-white/5"
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5 shrink-0" />
                        <span>Desktop</span>
                      </button>

                      <button 
                        onClick={() => {
                          setCurrentDirPath("C:\\Users\\Kinza\\Documents");
                        }}
                        className={`w-full text-left px-2 py-1 rounded flex items-center gap-1.5 cursor-pointer ${
                          currentDirPath === "C:\\Users\\Kinza\\Documents" ? "bg-[#0078d7] text-white" : "hover:bg-white/5"
                        }`}
                      >
                        <Folder className="w-3.5 h-3.5 shrink-0" />
                        <span>Documents</span>
                      </button>

                      <button 
                        onClick={() => {
                          setCurrentDirPath("C:\\Users\\Kinza\\Pictures");
                        }}
                        className={`w-full text-left px-2 py-1 rounded flex items-center gap-1.5 cursor-pointer ${
                          currentDirPath === "C:\\Users\\Kinza\\Pictures" ? "bg-[#0078d7] text-white" : "hover:bg-white/5"
                        }`}
                      >
                        <Image className="w-3.5 h-3.5 shrink-0" />
                        <span>Pictures</span>
                      </button>
                    </aside>

                    {/* Right Directory grid */}
                    <section className="flex-1 flex flex-col justify-stretch bg-[#111111]">
                      {/* Sub route status bar */}
                      <div className="p-1 px-3 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 select-none font-mono">
                        <button 
                          onClick={() => navigateFolder("..")}
                          disabled={currentDirPath === "C:\\"}
                          className="p-1 hover:bg-white/5 disabled:opacity-30 rounded cursor-pointer border-0"
                        >
                          <ArrowLeft className="w-3 h-3 text-white" />
                        </button>
                        <span className="text-[10px] text-slate-400 grow truncate">{currentDirPath}</span>
                        <button 
                          onClick={() => {
                            alert("Directory synched securely via Virtual NTFS.");
                          }}
                          className="p-1 hover:bg-white/5 rounded text-slate-400"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex-1 p-3 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-4 content-start">
                        {/* Parent dot segment directory */}
                        {currentDirPath !== "C:\\" && (
                          <div 
                            onClick={() => navigateFolder("..")}
                            className="group flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/5 cursor-pointer text-center"
                          >
                            <Folder className="w-8 h-8 text-amber-500 fill-amber-100/5 stroke-[1.2px]" />
                            <span className="text-[10px] font-bold text-slate-300 mt-1">..</span>
                          </div>
                        )}

                        {currentDirectoryContents.map((file, idx) => (
                          <div
                            key={idx}
                            onClick={() => openFile(file)}
                            className="group flex flex-col items-center justify-center p-2.5 rounded-lg hover:bg-white/10 hover:border-[#0078d7] border border-transparent cursor-pointer text-center relative"
                          >
                            {file.type === "folder" ? (
                              <Folder className="w-8 h-8 text-amber-500 fill-amber-100/10 stroke-[1.2px]" />
                            ) : (
                              <FileText className="w-8 h-8 text-sky-400 stroke-[1.2px]" />
                            )}
                            <span className="text-[10px] font-medium text-slate-200 mt-1 truncate max-w-[80px]">
                              {file.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {/* 2. Notepad Content */}
                {win.id === "notepad" && (
                  <div className="flex-1 flex flex-col justify-stretch bg-[#1a1a1a] text-slate-200 font-sans text-xs">
                    {/* Top menu bar */}
                    <div className="bg-slate-900 border-b border-slate-800 p-1 px-3 flex gap-4 select-none font-semibold text-slate-400">
                      <button onClick={handleSaveNotepad} className="hover:text-white cursor-pointer bg-transparent border-0">Save File</button>
                      <button onClick={() => {
                        setNotepadContent("");
                        setNotepadFileName("Untitled.txt");
                      }} className="hover:text-white cursor-pointer bg-transparent border-0">New</button>
                      <button onClick={() => toggleWindow("notepad", "close")} className="hover:text-white cursor-pointer bg-transparent border-0">Exit</button>
                    </div>

                    <div className="bg-slate-900 px-3 py-1 border-b border-slate-850 flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 uppercase font-mono">Filename:</span>
                      <input
                        type="text"
                        value={notepadFileName}
                        onChange={(e) => setNotepadFileName(e.target.value)}
                        className="bg-black/40 border border-slate-800 px-2 py-0.5 rounded text-[10px] text-white focus:outline-hidden max-w-[150px]"
                      />
                    </div>

                    <textarea
                      value={notepadContent}
                      onChange={(e) => setNotepadContent(e.target.value)}
                      placeholder="Compose document logs here... Click 'Save File' to store into dynamic File Explorer directory."
                      className="flex-1 w-full p-4 bg-[#111111] border-0 text-slate-200 font-mono text-xs focus:outline-hidden focus:ring-0 resize-none overflow-y-auto"
                    />
                  </div>
                )}

                {/* 3. Command Prompt CMD Content */}
                {win.id === "cmd" && (
                  <div className="flex-1 flex flex-col bg-black text-emerald-400 font-mono text-xs p-3 select-text select-all justify-stretch overflow-hidden">
                    <div className="flex-1 overflow-y-auto space-y-1">
                      {cmdHistory.map((line, idx) => (
                        <p key={idx} className="whitespace-pre-wrap leading-relaxed select-text">{line}</p>
                      ))}
                    </div>

                    {/* Input form */}
                    <form onSubmit={executeCmd} className="flex gap-1.5 items-center mt-2 border-t border-slate-900 pt-2 bg-black">
                      <span className="shrink-0">{currentDirPath}&gt;</span>
                      <input
                        type="text"
                        value={cmdInput}
                        disabled={isHacking}
                        onChange={(e) => setCmdInput(e.target.value)}
                        className="flex-1 bg-transparent border-0 text-white outline-hidden font-mono text-xs focus:ring-0 focus:outline-hidden"
                        placeholder="Type 'help'..."
                        autoFocus
                      />
                    </form>
                  </div>
                )}

                {/* 4. Paint Pro Content */}
                {win.id === "paint" && (
                  <div className="flex-1 flex flex-col justify-stretch bg-[#111] text-xs">
                    {/* Controls shelf */}
                    <div className="p-2 bg-slate-900 border-b border-slate-830 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="text-[9px] font-bold text-slate-400 block leading-none">Color Palette:</label>
                        <div className="flex gap-1">
                          {["#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ffffff"].map(c => (
                            <button
                              key={c}
                              onClick={() => setPaintColor(c)}
                              style={{ backgroundColor: c }}
                              className={`w-4 h-4 rounded-full border border-white/20 cursor-pointer ${
                                paintColor === c ? "ring-2 ring-[#0078d7]" : ""
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <label className="text-[9px] text-slate-400 font-bold block">Size:</label>
                        <input 
                          type="range"
                          min="1"
                          max="20"
                          value={paintBrushSize}
                          onChange={(e) => setPaintBrushSize(Number(e.target.value))}
                          className="w-16 h-1 bg-black rounded cursor-pointer accent-purple-500"
                        />
                        <span className="text-[10px] font-semibold text-slate-350">{paintBrushSize}px</span>
                      </div>

                      <button 
                        onClick={clearCanvas}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer border-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Clear Canvas
                      </button>
                    </div>

                    {/* Main canvas space */}
                    <div className="flex-1 bg-slate-950 flex items-center justify-center p-3 relative overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        width={460}
                        height={280}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="bg-white border border-slate-700 rounded shadow-inner cursor-crosshair max-w-full"
                      />
                    </div>
                  </div>
                )}

                {/* 5. Internet Explorer Web Search Content */}
                {win.id === "ie" && (
                  <div className="flex-1 flex flex-col justify-stretch bg-[#111111] text-xs font-sans text-slate-200">
                    {/* Navigation layout banner */}
                    <div className="p-2 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 select-none">
                      <div className="flex gap-1">
                        <span className="p-1 cursor-pointer rounded hover:bg-white/10 opacity-55 text-xs">←</span>
                        <span className="p-1 cursor-pointer rounded hover:bg-white/10 opacity-55 text-xs">→</span>
                      </div>

                      {/* address bar */}
                      <div className="flex-1 bg-black/60 rounded px-2.5 py-1 text-[10px] text-slate-300 font-mono truncate flex items-center gap-1 border border-slate-800">
                        <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{ieUrl}</span>
                      </div>
                    </div>

                    {/* Main Webpage render frame */}
                    <div className="flex-1 p-4 bg-white text-slate-800 overflow-y-auto">
                      <div className="max-w-md mx-auto space-y-4">
                        {/* Google/MSN banner mock head */}
                        <div className="flex flex-col items-center gap-2 pb-2 border-b border-slate-100">
                          <h1 className="text-2xl font-black tracking-tight text-blue-600 flex items-center gap-1">
                            <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-serif italic text-lg leading-none">e</span>
                            <span className="text-slate-800 font-sans tracking-wide">Internet MSN Explorer</span>
                          </h1>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Simulated browser</p>
                        </div>

                        {/* Search Input bar */}
                        <form onSubmit={handleIeSearch} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Search web portals (e.g. 'google', 'kinza', 'weather')"
                            value={ieSearchQuery}
                            onChange={(e) => setIeSearchQuery(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 font-normal outline-hidden"
                          />
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs cursor-pointer border-0"
                          >
                            Web Search
                          </button>
                        </form>

                        {/* Main Outcomes */}
                        {ieLoading ? (
                          <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400 text-center">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-[11px] font-semibold text-slate-405 leading-none mt-1">Connecting index databases...</p>
                          </div>
                        ) : ieResults.length > 0 ? (
                          <div className="space-y-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Search Outcomes:</p>
                            {ieResults.map((itm, idx) => (
                              <div key={idx} className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg space-y-1">
                                <h3 className="text-xs font-bold text-blue-700 hover:underline cursor-pointer">{itm.title}</h3>
                                <p className="text-[9.5px] text-emerald-600 font-mono leading-none truncate">{itm.url}</p>
                                <p className="text-[10.5px] text-slate-600 font-normal leading-normal">{itm.desc}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-6 text-center text-slate-400 space-y-2">
                            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                            <p className="text-[11px] font-semibold">Ready to navigate world wide web?</p>
                            <p className="text-[10px] text-slate-405 font-normal">Enter keywords above like 'kinza' or 'play store' to test the deep search simulation.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Minesweeper Content */}
                {win.id === "mines" && (
                  <div className="flex-1 flex flex-col justify-stretch bg-[#222222] p-4 text-xs select-none">
                    
                    {/* Header stats bar */}
                    <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-2.5 rounded-xl mb-3 mb-4 shrink-0">
                      <div className="text-left">
                        <p className="text-[8px] font-black uppercase text-slate-400 leading-none">Mines Left</p>
                        <p className="text-sm font-black text-rose-400 mt-1 leading-none">{minesCount}</p>
                      </div>

                      {/* Reset button face emoji */}
                      <button 
                        onClick={initMinesweeper}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded-lg text-lg leading-none cursor-pointer"
                        title="Restart game"
                      >
                        {minesStatus === "won" ? "😎" : minesStatus === "lost" ? "😵" : "🙂"}
                      </button>

                      <div className="text-right">
                        <p className="text-[8px] font-black uppercase text-slate-400 leading-none">Game Status</p>
                        <p className="text-xs font-bold text-slate-300 uppercase mt-1 leading-none">{minesStatus}</p>
                      </div>
                    </div>

                    {/* Minesweeper Visual Grid and alerts layout */}
                    <div className="flex-1 flex items-center justify-center p-1 overflow-auto">
                      <div className="inline-grid grid-cols-8 gap-1 bg-[#111] p-2.5 rounded-xl shadow-inner border border-slate-800">
                        {minesGrid.map((row, rIdx) => 
                          row.map((cell, cIdx) => {
                            let cellBg = "bg-slate-800 hover:bg-slate-750";
                            let cellContent = "";
                            let cellColor = "";

                            if (cell.revealed) {
                              cellBg = "bg-slate-900";
                              if (cell.value === -1) {
                                cellContent = "💣";
                                cellBg = "bg-rose-900/40";
                              } else if (cell.value > 0) {
                                cellContent = cell.value.toString();
                                const colors: Record<number, string> = {
                                  1: "text-blue-400 font-extrabold",
                                  2: "text-green-400 font-extrabold",
                                  3: "text-red-400 font-extrabold",
                                  4: "text-purple-405 font-extrabold"
                                };
                                cellColor = colors[cell.value] || "text-amber-400";
                              }
                            } else if (cell.flagged) {
                              cellContent = "🚩";
                              cellBg = "bg-slate-800";
                            }

                            return (
                              <button
                                key={`${rIdx}-${cIdx}`}
                                onClick={() => cellClick(rIdx, cIdx)}
                                onContextMenu={(e) => rightClickCell(e, rIdx, cIdx)}
                                className={`w-8 h-8 rounded text-xs select-none border-0 flex items-center justify-center cursor-pointer transition-colors font-bold ${cellBg} ${cellColor}`}
                              >
                                {cellContent}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Alerts panel banner */}
                    {minesStatus === "won" && (
                      <div className="mt-2.5 p-2 bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 text-[10px] font-bold rounded-lg text-center animate-pulse shrink-0">
                        🏆 AMAZING! WINDOWS 10 RECORD HIGH SCORE UNLOCKED!
                      </div>
                    )}
                    {minesStatus === "lost" && (
                      <div className="mt-2.5 p-2 bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bold rounded-lg text-center animate-shake shrink-0">
                        💥 MINESWEEPER EXPLODED! Click face emoji to respawn!
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          );
        })}

      </div>

      {/* --- WINDOWS 10 BOTTOM BAR TASKBAR --- */}
      <footer className="h-10 bg-[#101525]/90 backdrop-blur-md border-t border-white/10 z-20 flex items-center justify-between px-3 shrink-0 select-none">
        
        {/* Left Side: Start buttons, Cortana search */}
        <div className="flex items-center gap-1.5 h-full relative">
          
          {/* Windows Start Button */}
          <button
            id="win_start_trigger"
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            className={`w-9 h-full flex items-center justify-center hover:bg-white/10 ${
              startMenuOpen ? "bg-[#0078d7]" : ""
            } cursor-pointer transition-colors border-0`}
            title="Start"
          >
            <svg 
              viewBox="0 0 24 24" 
              className={`w-4 h-4 text-white fill-current ${startMenuOpen ? "text-white" : "group-hover:text-blue-400"}`}
            >
              <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.101zM10.8 1.95L24 0v11.55H10.8V1.95zM10.8 12.45H24v11.55l-13.2-1.95v-9.6z" />
            </svg>
          </button>

          {/* Cortana Search widget block */}
          <div className="h-7 w-40 bg-[#1e2538] hover:bg-[#28314a] rounded px-2.5 flex items-center gap-1.5 border border-white/5 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Type here to search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchActive(e.target.value.trim().length > 0);
                if (!startMenuOpen && e.target.value.trim().length > 0) {
                  setStartMenuOpen(true);
                }
              }}
              className="bg-transparent border-0 w-full focus:outline-hidden text-[10px] text-white focus:ring-0 focus:outline-hidden py-0"
            />
          </div>

          {/* Core Mini shortcuts */}
          <div className="flex gap-0.5">
            {[
              { id: "explorer", icon: "📁", title: "File Explorer" },
              { id: "notepad", icon: "📄", title: "Notepad Document" },
              { id: "cmd", icon: "💻", title: "CMD Shell interpreter" }
            ].map(app => {
              const isOpen = windows.find(w => w.id === app.id)?.isOpen;
              return (
                <button
                  key={app.id}
                  onClick={() => toggleWindow(app.id, "open")}
                  className={`w-8 h-8 rounded text-sm hover:bg-white/10 flex items-center justify-center cursor-pointer border-0 ${
                    isOpen ? "border-b-2 border-[#0078d7]" : ""
                  }`}
                  title={app.title}
                >
                  {app.icon}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Tray parameters (clock, signals) */}
        <div className="flex items-center gap-3.5 h-full text-white/85 text-[10px] font-medium px-1">
          
          <div className="flex items-center gap-1">
            <span>🌐 WiFi: OK</span>
          </div>

          <div className="flex items-center gap-1 text-slate-300">
            <span>🔊 100%</span>
          </div>

          {/* Digital Date block typical Win10 */}
          <div className="text-right flex flex-col justify-center leading-tight">
            <span>{winTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })}</span>
            <span className="text-[8.5px] font-mono text-slate-400">
              {winTime.toLocaleDateString([], { month: "numeric", day: "numeric", year: "numeric" })}
            </span>
          </div>

          {/* Show Desktop strip */}
          <button 
            onClick={() => {
              // Minimize all windows
              setWindows(prev => prev.map(w => ({ ...w, isOpen: false })));
              setStartMenuOpen(false);
            }}
            title="Minimize all windows to desktop view"
            className="w-1.5 h-full border-l border-white/15 hover:bg-white/5 cursor-pointer"
          />
        </div>

        {/* --- START MENU DROPDOWN PANEL --- */}
        {startMenuOpen && (
          <div className="absolute left-1 bottom-11 w-80 bg-[#161a28] border border-white/15 rounded-xl shadow-2xl z-30 overflow-hidden flex flex-col justify-stretch animate-scale-up text-slate-100 min-h-[340px]">
            
            {/* Search items display overriding */}
            {searchActive ? (
              <div className="flex-1 p-3 text-xs space-y-2">
                <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest px-1">Search Results for "{searchQuery}"</p>
                <div className="space-y-1 max-h-[290px] overflow-y-auto pr-1">
                  {[
                    { id: "explorer", name: "File Explorer (Drive C:)", icon: "📁", desc: "Browse system files and data folders." },
                    { id: "notepad", name: "Notepad Document Editor", icon: "📄", desc: "Write documentation, logs or templates." },
                    { id: "cmd", name: "Command Prompt CMD shell", icon: "💻", desc: "Execute core commands, scripts and tools." },
                    { id: "paint", name: "MS Paint Pro canvas", icon: "🎨", desc: "Sketch illustrations and export custom fields." },
                    { id: "ie", name: "Internet Explorer browser", icon: "🌐", desc: "Explore external search indexes or MSN portals." },
                    { id: "mines", name: "Minesweeper classic arcade", icon: "💣", desc: "Defuse explosive tokens on coordinate grids." }
                  ].filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.desc.toLowerCase().includes(searchQuery.toLowerCase())).map(app => (
                    <button
                      key={app.id}
                      onClick={() => {
                        toggleWindow(app.id, "open");
                        setStartMenuOpen(false);
                        setSearchActive(false);
                        setSearchQuery("");
                      }}
                      className="w-full text-left p-2.5 bg-white/5 hover:bg-white/10 rounded-lg flex items-center gap-3 cursor-pointer border border-transparent hover:border-[#0078d7]"
                    >
                      <span className="text-lg">{app.icon}</span>
                      <div>
                        <p className="font-bold text-[10.5px] text-white leading-none">{app.name}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5 leading-none">{app.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Regular Split Start Menu elements */
              <div className="flex-1 flex overflow-hidden">
                
                {/* Left skinny quick rail */}
                <aside className="w-11 bg-[#10131e] flex flex-col justify-between items-center py-3 border-r border-white/5">
                  <div className="space-y-4">
                    <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-black select-none pointer-events-none text-white shadow-md">
                      KM
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={() => {
                        toggleWindow("explorer", "open");
                        setStartMenuOpen(false);
                      }}
                      title="Documents folder" 
                      className="p-1.5 hover:bg-white/10 rounded cursor-pointer border-0 bg-transparent text-white"
                    >
                      <Folder className="w-4 h-4 text-slate-300" />
                    </button>

                    <button 
                      onClick={() => {
                        alert("Settings system panel loaded.");
                      }}
                      title="Settings" 
                      className="p-1.5 hover:bg-white/10 rounded cursor-pointer border-0 bg-transparent text-white"
                    >
                      <Settings className="w-4 h-4 text-slate-300" />
                    </button>

                    <button 
                      onClick={() => {
                        setStartMenuOpen(false);
                        alert("Simulating standard computer reboot. Reseting device registers.");
                      }}
                      title="Shut Down PC system" 
                      className="p-1.5 hover:bg-rose-950/40 hover:text-rose-400 rounded cursor-pointer border-0 bg-transparent text-white"
                    >
                      <Power className="w-4 h-4 text-slate-300 hover:text-rose-400" />
                    </button>
                  </div>
                </aside>

                {/* Right app launcher & dynamic tile dashboard segment */}
                <section className="flex-1 p-3 overflow-y-auto space-y-4">
                  
                  {/* Left Column list */}
                  <div>
                    <h4 className="text-[8px] font-black uppercase text-slate-400 tracking-wider mb-2 leading-none">Frequently Used</h4>
                    <div className="space-y-1 select-none">
                      {[
                        { id: "explorer", name: "File Explorer", icon: "📁" },
                        { id: "notepad", name: "Notepad Tools", icon: "📄" },
                        { id: "cmd", name: "Command Prompt", icon: "💻" },
                        { id: "paint", name: "MS Paint", icon: "🎨" },
                        { id: "ie", name: "Internet Explorer", icon: "🌐" },
                        { id: "mines", name: "Minesweeper", icon: "💣" }
                      ].map(app => (
                        <button
                          key={app.id}
                          onClick={() => {
                            toggleWindow(app.id, "open");
                            setStartMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-[10px] hover:bg-[#0078d7] flex items-center gap-2.5 transition-colors cursor-pointer border-0 bg-transparent text-white font-medium"
                        >
                          <span className="text-xs">{app.icon}</span>
                          <span>{app.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Windows 10 Live Tiles Board */}
                  <div>
                    <h4 className="text-[8px] font-black uppercase text-slate-400 tracking-wider mb-2 leading-none">Live Tiles</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Weather tile */}
                      <div className="p-2.5 rounded-xl bg-blue-600 flex flex-col justify-between h-16 shadow hover:scale-[1.03] transition-transform">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-bold text-blue-100">MSN Weather</span>
                          <CloudSun className="w-4 h-4 text-amber-200 fill-amber-200/20" />
                        </div>
                        <p className="text-xs font-black">24°C <span className="text-[9px] font-normal text-blue-200">Sunny</span></p>
                      </div>

                      {/* Store banner tile */}
                      <div className="p-2.5 rounded-xl bg-[#0078d7] flex flex-col justify-between h-16 shadow hover:scale-[1.03] transition-transform">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-bold text-blue-100">Play Store</span>
                          <Play className="w-3.5 h-3.5 text-emerald-300" />
                        </div>
                        <p className="text-[10px] font-black text-white">System Verified</p>
                      </div>
                    </div>
                  </div>

                </section>
              </div>
            )}
          </div>
        )}

      </footer>

    </div>
  );
}
