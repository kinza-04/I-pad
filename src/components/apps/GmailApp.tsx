import { useState, useEffect } from "react";
import { 
  Mail, Star, Trash2, PenTool, Search, Sparkles, Send, Inbox, 
  Archive, User, Check, Loader2, ArrowLeft, AlertCircle, RefreshCw,
  Tag, Info, Users, Clock, Reply
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  senderInitials: string;
  subject: string;
  body: string;
  time: string;
  date: string;
  category: "primary" | "social" | "promotions";
  read: boolean;
  starred: boolean;
  folder: "inbox" | "sent" | "drafts" | "spam" | "trash";
}

export default function GmailApp() {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: "1",
      sender: "Google Play Support",
      senderEmail: "noreply@google.com",
      senderInitials: "GP",
      subject: "Welcome to your upgraded iPadOS Subsystem!",
      body: "Hello Premium User,\n\nCongratulations on installing and initializing your high-fidelity iPad x Android simulator! You now have fully integrated access to Google Play Store protections, dynamic hardware telemetry widgets, and our advanced server-side Gemini AI Assistant.\n\nWe are pleased to notify you that Gemini can now act as an active assistant inside this ecosystem. Try asking Gemini to change your device wallpaper, adjust sound volume, dim the screen brightness, or check active storage specs.\n\nBest regards,\nGoogle Play Team",
      time: "10:24 AM",
      date: "Jun 14, 2026",
      category: "primary",
      read: false,
      starred: true,
      folder: "inbox"
    },
    {
      id: "2",
      sender: "Gemini AI Core",
      senderEmail: "assistant@gemini.google.com",
      senderInitials: "G",
      subject: "✨ Unleash Intelligent Mail Drafting inside Gmail!",
      body: "Hi Kinza,\n\nDid you know your brand new Gmail application is fully synchronized with Gemini? \n\nWhen writing a new email, click the **'Draft with Gemini'** wizard button. Describe what you'd like to say (e.g., *'write a polite apology for a late meeting'*) and my language model will draft a perfect, professional email message for you instantly.\n\nYou can also click **'AI Summarize'** at the top of any reading pane to get a 2-sentence breakdown of long business emails instantly. Try it on this computer and experience the ultimate future of productivity!\n\nWarmly,\nGemini Assistant",
      time: "09:45 AM",
      date: "Jun 14, 2026",
      category: "primary",
      read: false,
      starred: false,
      folder: "inbox"
    },
    {
      id: "3",
      sender: "System Administrator",
      senderEmail: "admin@kinza-murtaza.internal",
      senderInitials: "SA",
      subject: "Security Audit Confirmed: Play Protect Status",
      body: "ALERT: Device Security Status OK.\n\nA complete device system audit has finished for the host iPad device under name token 'kinza@murtaza'.\n\n- Active Antivirus: Google Play Protect v5.8\n- Sandbox: Node.js Cloud Ingress Router\n- Local Storage: Verified secure local sandbox state.\n\nNo malicious activities or compromised sandboxes detected. To preserve absolute lock control, ask your assistant to 'lock my iPad securely' whenever you plan to step away from your workstation desktop.",
      time: "Yesterday",
      date: "Jun 13, 2026",
      category: "primary",
      read: true,
      starred: false,
      folder: "inbox"
    },
    {
      id: "4",
      sender: "Sarah Mitchell",
      senderEmail: "sarahm@workspace.io",
      senderInitials: "SM",
      subject: "Dinner plans at Tokyo Shibuya Skye?",
      body: "Hey there! Are we still on for dinner this group week? I heard Shibuya Skye has an absolute stellar twilight view. Let me know what times you're free, and we can check the table bookings! Let's invite John too.",
      time: "Yesterday",
      date: "Jun 13, 2026",
      category: "social",
      read: true,
      starred: true,
      folder: "inbox"
    },
    {
      id: "5",
      sender: "GitHub Alerts",
      senderEmail: "noreply@github.com",
      senderInitials: "GH",
      subject: "[GitHub] [Security] Advisory found on node-express packages",
      body: "[GitHub Security Advisory]\n\nOne of your repositories has been identified as using a vulnerable version of express parser modules. Please run a fresh npm update task to retrieve dependencies updates.\n\nThis is a standard system verification message.",
      time: "Jun 12",
      date: "Jun 12, 2026",
      category: "promotions",
      read: true,
      starred: false,
      folder: "inbox"
    }
  ]);

  const [activeFolder, setActiveFolder] = useState<"inbox" | "starred" | "sent" | "drafts" | "trash">("inbox");
  const [activeTab, setActiveTab] = useState<"primary" | "social" | "promotions">("primary");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  // Compose State
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Gemini Integration States
  const [isGeminiComposing, setIsGeminiComposing] = useState(false);
  const [geminiComposeQuery, setGeminiComposeQuery] = useState("");
  const [geminiComposeError, setGeminiComposeError] = useState("");
  
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const [quickReplyTone, setQuickReplyTone] = useState<string | null>(null);
  const [isQuickReplying, setIsQuickReplying] = useState(false);

  // Reset email detail features when changing selected email
  useEffect(() => {
    setAiSummary(null);
    setQuickReplyTone(null);
  }, [selectedEmail?.id]);

  const handleToggleStar = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEmails(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(prev => prev ? { ...prev, starred: !prev.starred } : null);
    }
  };

  const handleMarkRead = (id: string, read: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEmails(prev => prev.map(m => m.id === id ? { ...m, read } : m));
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(prev => prev ? { ...prev, read } : null);
    }
  };

  const handleDeleteEmail = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setEmails(prev => prev.map(m => {
      if (m.id === id) {
        if (m.folder === "trash") {
          // Permanent delete or remove from list
          return null;
        } else {
          return { ...m, folder: "trash" as const };
        }
      }
      return m;
    }).filter((m): m is Email => m !== null));

    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(null);
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo || !composeSubject || !composeBody) {
      alert("Please fill in To, Subject and Message fields.");
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      const newEmail: Email = {
        id: Date.now().toString(),
        sender: "Me",
        senderEmail: "kinza.murtaza@playstore.subs",
        senderInitials: "ME",
        subject: composeSubject,
        body: composeBody,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }),
        category: "primary",
        read: true,
        starred: false,
        folder: "sent"
      };

      setEmails(prev => [newEmail, ...prev]);
      setIsSending(false);
      setShowCompose(false);
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
      setIsGeminiComposing(false);
      setGeminiComposeQuery("");
    }, 800);
  };

  // Gemini API Calls via local Node chat proxy
  const handleGenerateDraftWithGemini = async () => {
    if (!geminiComposeQuery.trim()) {
      setGeminiComposeError("Please enter a brief outline of what you want to write.");
      return;
    }

    setIsGeminiComposing(true);
    setGeminiComposeError("");

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Write a polished, professional email draft without subject lines or conversational remarks at the start. Answer ONLY with the body. The context outline: "${geminiComposeQuery}"`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error("Could not connect to Gemini.");
      }

      const data = await response.json();
      const reply = data.reply || "";
      
      // Clean up markdown markers like ``` if returned
      const cleaned = reply.replace(/```[a-z]*\n?/gi, "").trim();
      setComposeBody(cleaned);
      setIsGeminiComposing(false);
    } catch (err: any) {
      console.error(err);
      setGeminiComposeError("Failed to contact Gemini key proxy. Using simulated template instead.");
      
      // High fidelity simulation backup
      setTimeout(() => {
        const words = geminiComposeQuery.toLowerCase();
        let fallback = `Dear Recipient,\n\nI am reaching out regarding your inquiry about ${geminiComposeQuery}.\n\nWe would love to coordinate on this right away. Let me know what date works best on your side!\n\nBest regards,\nKinza Murtaza`;
        if (words.includes("apology") || words.includes("sorry")) {
          fallback = `Hi there,\n\nI sincerely apologize for the delay in following up about this. We encountered some unexpected layout updates on the iPadOS sub-system, which pushed back my timeline.\n\nI highly appreciate your patience and would love to move forward tomorrow if possible.\n\nBest,\nKinza Murtaza`;
        } else if (words.includes("dinner") || words.includes("invite")) {
          fallback = `Hi Sarah,\n\nThat sounds brilliant! I'd love to join you for dinner. Shibuya Skye sounds absolutely stunning. I am free this Saturday from 7:00 PM onwards.\n\nLet's definitely invite John as well.\n\nSee ya,\nKinza`;
        }
        setComposeBody(fallback);
        setIsGeminiComposing(false);
      }, 1000);
    }
  };

  const handleSummarizeWithGemini = async (email: Email) => {
    setIsSummarizing(true);
    setAiSummary(null);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Provide a extremely concise, 2-sentence summary of this email. Start directly with the summary, do not add introductory text. Email: \nSender: ${email.sender}\nSubject: ${email.subject}\nBody: ${email.body}`
            }
          ]
        })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setAiSummary(data.reply || "Unable to summarize.");
    } catch {
      // High fidelity backup summary
      setTimeout(() => {
        if (email.id === "1") {
          setAiSummary("🤖 **Gemini AI Summary**: Google Play Team congratulates you on the deployment of your responsive iPad subsystem simulator. It informs you that the server-hosted Gemini assistant is now fully operational to control tablet properties.");
        } else if (email.id === "2") {
          setAiSummary("🤖 **Gemini AI Summary**: Gemini AI introduces its newly integrated features inside your Gmail app. It guides you to use 'Draft with Gemini' inside Composing, or execute 'AI Summarize' for reading long threads.");
        } else {
          setAiSummary(`🤖 **Gemini AI Summary**: A summary of message: "${email.subject}". This communication focuses on updating operational tasks and confirms all telemetry metrics have passed security scopes.`);
        }
        setIsSummarizing(false);
      }, 800);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateReplyWithGemini = async (email: Email, tone: "professional" | "casual" | "short") => {
    setQuickReplyTone(tone);
    setIsQuickReplying(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Write a quick ${tone} reply to this email. Respond only with the reply body content, no placeholder elements. Email to reply to:\nFrom: ${email.sender}\nSubject: ${email.subject}\nMessage received: ${email.body}`
            }
          ]
        })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      
      // Auto open compose window with custom pre-filled responses
      setComposeTo(email.senderEmail);
      setComposeSubject(`Re: ${email.subject}`);
      setComposeBody(data.reply.replace(/```[a-z]*\n?/gi, "").trim());
      setShowCompose(true);
    } catch {
      // Simulated tone-accurate replies
      setTimeout(() => {
        setComposeTo(email.senderEmail);
        setComposeSubject(`Re: ${email.subject}`);
        
        let draft = "";
        if (tone === "professional") {
          draft = `Dear ${email.sender},\n\nThank you for reaching out with this message. I have reviewed your email and would be glad to coordinate details.\n\nI will review our workspace schedules and follow up with a concrete timeline shortly.\n\nSincerely,\nKinza Murtaza`;
        } else if (tone === "casual") {
          draft = `Hi ${email.sender.split(" ")[0]}!\n\nThanks for your note—this is super cool! I'm completely down for this. Let's touch base soon to secure our slots.\n\nTalk tomorrow,\nKinza`;
        } else {
          draft = `Hi ${email.sender.split(" ")[0]},\n\nGot it! Thank you for the update. All looks good to go on my end. 👍\n\nThanks,\nKinza`;
        }
        
        setComposeBody(draft);
        setShowCompose(true);
        setIsQuickReplying(false);
      }, 700);
    } finally {
      setIsQuickReplying(false);
    }
  };

  // Filtered list compilation
  const filteredEmails = emails.filter(m => {
    // Check folder
    if (activeFolder === "starred" && !m.starred) return false;
    if (activeFolder !== "starred" && m.folder !== activeFolder) return false;

    // If we are in inbox, filter primary/social/promotions
    if (activeFolder === "inbox" && m.category !== activeTab) return false;

    // Search query filtration
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return m.subject.toLowerCase().includes(q) || 
           m.sender.toLowerCase().includes(q) || 
           m.body.toLowerCase().includes(q);
  });

  return (
    <div id="gmail_container" className="flex h-full bg-[#f6f8fc] text-slate-800 font-sans">
      
      {/* Gmail Left Sidebar Drawer */}
      <aside className="w-56 bg-[#f6f8fc] flex flex-col justify-between p-3 shrink-0 border-r border-slate-205">
        <div>
          {/* Main Compose trigger button */}
          <button 
            id="gmail_compose_btn"
            onClick={() => {
              setComposeTo("");
              setComposeSubject("");
              setComposeBody("");
              setShowCompose(true);
            }}
            className="flex items-center gap-3.5 px-6 py-4 bg-[#c2e7ff] text-[#001d35] hover:bg-[#b0dcfa] active:scale-[0.98] rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer w-full mb-5"
          >
            <PenTool className="w-4.5 h-4.5 text-slate-900" />
            <span>Compose</span>
          </button>

          {/* Mailbox lists */}
          <nav className="space-y-0.5">
            {[
              { id: "inbox", label: "Inbox", icon: Inbox, count: emails.filter(m => m.folder === "inbox" && !m.read).length },
              { id: "starred", label: "Starred", icon: Star, count: emails.filter(m => m.starred).length },
              { id: "sent", label: "Sent", icon: Send, count: emails.filter(m => m.folder === "sent").length },
              { id: "drafts", label: "Drafts", icon: Archive, count: emails.filter(m => m.folder === "drafts").length },
              { id: "trash", label: "Trash", icon: Trash2, count: emails.filter(m => m.folder === "trash").length }
            ].map(f => {
              const Icon = f.icon;
              const isActive = activeFolder === f.id;
              return (
                <button
                  key={f.id}
                  id={`gmail_folder_${f.id}`}
                  onClick={() => {
                    setActiveFolder(f.id as any);
                    setSelectedEmail(null);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                    isActive 
                      ? "bg-[#e8f0fe] text-[#0b57d0]" 
                      : "text-slate-600 hover:bg-slate-200/55"
                  }`}
                >
                  <div className="flex items-center gap-3 text-[11px]">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#0b57d0]" : "text-slate-500"}`} />
                    <span>{f.label}</span>
                  </div>
                  {f.count > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-[#c2e7ff] text-[#0a58d0]" : "bg-slate-200 text-slate-600"}`}>
                      {f.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Security badge at lower corner */}
        <div className="p-3 bg-white/45 border border-slate-200 rounded-xl text-[9px] text-slate-500 font-mono space-y-1">
          <p className="font-extrabold text-[#001d35] flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" /> Play Mail Shield
          </p>
          <p>End-to-end sandbox routing active.</p>
        </div>
      </aside>

      {/* Main Mail roster & detailed reader view split */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Middle Column: Email Roster List */}
        <section className={`flex-1 flex flex-col bg-white overflow-hidden border-2 border-[#f0f4f9] ${selectedEmail ? "hidden md:flex" : "flex"}`}>
          
          {/* Top Search bar inside mail layout */}
          <div className="p-3 bg-white border-b border-gray-150 flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="search_mail_input"
                type="text"
                placeholder="Search letters, senders, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#f1f3f4] focus:bg-white text-xs rounded-lg focus:ring-1.5 focus:ring-indigo-500 border-0 focus:outline-hidden transition-all shadow-inner"
              />
            </div>
            <button 
              onClick={() => {
                // Instantly seed standard letters again
                setSearchQuery("");
                alert("Inbox synchronized with mail server.");
              }}
              title="Refresh mail server sync"
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Primary/Social/Promotions Tabs if in Inbox */}
          {activeFolder === "inbox" && (
            <div className="flex border-b border-gray-100">
              {[
                { id: "primary", label: "Primary", icon: Inbox, color: "text-[#0b57d0]" },
                { id: "social", label: "Social", icon: Users, color: "text-emerald-600" },
                { id: "promotions", label: "Promotions", icon: Tag, color: "text-amber-600" }
              ].map(t => {
                const TabIcon = t.icon;
                const isSelected = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab(t.id as any);
                      setSelectedEmail(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-tight border-b-2 transition-all cursor-pointer ${
                      isSelected 
                        ? "border-[#0b57d0] text-[#0b57d0] bg-[#f8fafd]" 
                        : "border-transparent text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <TabIcon className="w-4.5 h-4.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Email Item rows list */}
          <div className="flex-1 overflow-y-auto">
            {filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <Mail className="w-12 h-12 stroke-[1.2px] mb-2.5 text-slate-300" />
                <p className="text-sm font-semibold">Clean mailbox ledger</p>
                <p className="text-xs text-slate-400 mt-1">No items found matching the selected settings.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredEmails.map((mail) => {
                  const isOpened = selectedEmail?.id === mail.id;
                  return (
                    <div
                      key={mail.id}
                      id={`gmail_row_${mail.id}`}
                      onClick={() => {
                        handleMarkRead(mail.id, true);
                        setSelectedEmail(mail);
                      }}
                      className={`group flex items-start gap-3.5 p-3.5 hover:bg-slate-50 cursor-pointer select-none relative transition-colors ${
                        !mail.read ? "bg-slate-100/55 font-semibold text-slate-900 border-l-4 border-[#0b57d0]" : "text-slate-600"
                      } ${isOpened ? "bg-indigo-50/70 border-l-4 border-indigo-500" : ""}`}
                    >
                      {/* Avatar */}
                      <div className="w-9 h-9 text-xs font-black rounded-full bg-slate-205 flex items-center justify-center text-slate-700 shrink-0 select-none">
                        {mail.senderInitials}
                      </div>

                      {/* Header, text previews */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className={`text-xs font-bold truncate ${!mail.read ? "text-slate-900" : "text-slate-700"}`}>
                            {mail.sender}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {mail.time}
                          </span>
                        </div>
                        <p className={`text-xs font-black truncate mb-1 ${!mail.read ? "text-slate-900" : "text-slate-800"}`}>
                          {mail.subject}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate font-normal leading-normal">
                          {mail.body}
                        </p>
                      </div>

                      {/* Action Overlays visible on row hover */}
                      <div className="absolute right-3 top-3 py-1 px-1.5 hidden group-hover:flex items-center gap-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                        <button
                          onClick={(e) => handleToggleStar(mail.id, e)}
                          title="Toggle Star"
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-amber-400 transition"
                        >
                          <Star className={`w-3.5 h-3.5 ${mail.starred ? "fill-amber-400 text-amber-400" : ""}`} />
                        </button>
                        <button
                          onClick={(e) => handleMarkRead(mail.id, !mail.read, e)}
                          title={mail.read ? "Mark as Unread" : "Mark as Read"}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-500 transition"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteEmail(mail.id, e)}
                          title="Delete Email"
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-500 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Active Email Detail Reading Pane */}
        {selectedEmail ? (
          <section className="flex-1 md:w-3/5 bg-white border-2 border-[#f0f4f9] flex flex-col overflow-hidden">
            
            {/* Thread Header action shelf */}
            <div className="p-3 bg-white border-b border-slate-150 flex items-center justify-between">
              <button 
                onClick={() => setSelectedEmail(null)}
                className="md:hidden flex items-center gap-1 text-slate-500 font-bold text-xs"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="flex items-center gap-2 text-slate-500 ms-auto">
                <button
                  onClick={() => handleToggleStar(selectedEmail.id)}
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-amber-400 transition"
                  title="Star Email"
                >
                  <Star className={`w-4 h-4 ${selectedEmail.starred ? "fill-amber-400 text-amber-400" : ""}`} />
                </button>
                <button
                  onClick={() => handleDeleteEmail(selectedEmail.id)}
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-rose-500 transition"
                  title="Move to Trash"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Email reading pane contents */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              
              {/* Intelligent AI summarize box if clicked / loading status */}
              {aiSummary && (
                <div className="mb-5 bg-purple-50 rounded-xl p-4 border border-purple-100 text-xs text-purple-900 shadow-md">
                  <div className="flex items-center gap-1.5 font-bold mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600 fill-current animate-pulse" />
                    <span>Gemini AI Thread Summary</span>
                  </div>
                  <p className="leading-relaxed font-normal">{aiSummary}</p>
                </div>
              )}

              {/* Sender Details Header */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4">
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-full font-black bg-slate-200 text-slate-800 flex items-center justify-center text-sm">
                    {selectedEmail.senderInitials}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                      {selectedEmail.sender}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      &lt;{selectedEmail.senderEmail}&gt;
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400">
                    {selectedEmail.date} ({selectedEmail.time})
                  </span>
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                  {selectedEmail.subject}
                </h2>

                {/* AI Helper shelf triggers */}
                <div className="flex flex-wrap items-center gap-2 bg-[#f0f4f9] p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase px-2">Gemini:</span>
                  <button
                    disabled={isSummarizing}
                    onClick={() => handleSummarizeWithGemini(selectedEmail)}
                    className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 disabled:opacity-50 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSummarizing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Summarizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" /> AI Summarize
                      </>
                    )}
                  </button>

                  <button
                    disabled={isQuickReplying}
                    onClick={() => handleGenerateReplyWithGemini(selectedEmail, "professional")}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0b57d0] text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Reply className="w-3 h-3 text-[#0b57d0]" /> AI Prof Reply
                  </button>

                  <button
                    disabled={isQuickReplying}
                    onClick={() => handleGenerateReplyWithGemini(selectedEmail, "casual")}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Reply className="w-3 h-3 text-emerald-600" /> AI Casual Reply
                  </button>
                </div>

                {/* Actual Message Body Container */}
                <div className="prose prose-sm font-normal text-xs leading-relaxed text-slate-800 whitespace-pre-line mt-6">
                  {selectedEmail.body}
                </div>
              </div>

              {/* Footer Quick Action controls */}
              <div className="mt-8 pt-5 border-t border-gray-100 flex items-center gap-3">
                <button
                  id="gmail_respond_trigger"
                  onClick={() => {
                    setComposeTo(selectedEmail.senderEmail);
                    setComposeSubject(`Re: ${selectedEmail.subject}`);
                    setComposeBody(`\n\nOn ${selectedEmail.date} at ${selectedEmail.time}, ${selectedEmail.sender} wrote:\n> ${selectedEmail.body.split("\n")[0]}...`);
                    setShowCompose(true);
                  }}
                  className="px-5 py-2 bg-[#1a73e8] hover:bg-[#155cb0] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer border border-transparent"
                >
                  <Reply className="w-4 h-4 text-white" />
                  Reply Email
                </button>
                
                <button
                  onClick={() => {
                    alert("Email conversations archived in local workspace.");
                  }}
                  className="px-5 py-2 hover:bg-slate-100 text-slate-600 border border-slate-205 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-slate-500" /> Mark Archive
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* Empty Active reader pane state */
          <section className="hidden md:flex flex-1 md:w-3/5 bg-slate-50 items-center justify-center text-slate-400 text-center font-sans">
            <div className="max-w-xs space-y-1.5">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-md border border-slate-100 text-slate-400">
                <Mail className="w-7 h-7 stroke-[1.2px]" />
              </div>
              <p className="text-xs font-bold text-slate-800">Select an email to read</p>
              <p className="text-[11px] text-slate-400 font-normal">Choose from items on your list to see contents, generate intelligent summaries or prepare tone replies.</p>
            </div>
          </section>
        )}
      </main>

      {/* Interactive Compose Window Modal overlay */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-3xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col justify-stretch overflow-hidden border border-slate-200 animate-scale-up">
            
            {/* Header */}
            <div className="px-5 py-3 bg-[#f2f6fc] border-b border-slate-150 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">New Message</span>
              <button 
                onClick={() => {
                  setShowCompose(false);
                  setIsGeminiComposing(false);
                }}
                className="p-1 hover:bg-slate-200 rounded text-slate-500 font-black cursor-pointer text-xs"
              >
                Close
              </button>
            </div>

            {/* Compose Form inputs */}
            <form onSubmit={handleSendEmail} className="flex-1 flex flex-col justify-stretch p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-500 w-10">To:</span>
                <input
                  id="compose_mail_to"
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="name@workspace.com"
                  className="flex-1 border-0 focus:outline-hidden text-xs font-semibold focus:ring-0 text-slate-800"
                  required
                />
              </div>

              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-500 w-10">Subject:</span>
                <input
                  id="compose_mail_subject"
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Subject title"
                  className="flex-1 border-0 focus:outline-hidden text-xs font-extrabold focus:ring-0 text-slate-800"
                  required
                />
              </div>

              {/* Gemini Magic assistant drafting box */}
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-100 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-purple-900 font-extrabold">
                    <Sparkles className="w-4 h-4 text-purple-600 fill-current animate-pulse" />
                    <span>Smart Compose with Gemini AI</span>
                  </div>
                  {isGeminiComposing && <Loader2 className="w-3.5 h-3.5 text-purple-700 animate-spin" />}
                </div>

                <div className="flex gap-2">
                  <input
                    id="gemini_compose_prompt"
                    type="text"
                    value={geminiComposeQuery}
                    onChange={(e) => setGeminiComposeQuery(e.target.value)}
                    placeholder="Describe what to draft (e.g., 'Polite apology for delayed tasks')"
                    className="flex-1 px-2.5 py-1 bg-white border border-purple-200 rounded-lg text-xxs focus:ring-1 focus:ring-purple-500 text-slate-850 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    disabled={isGeminiComposing}
                    onClick={handleGenerateDraftWithGemini}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-[10px] font-bold text-white rounded-lg cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    Draft with AI
                  </button>
                </div>
                {geminiComposeError && (
                  <p className="text-[10px] font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {geminiComposeError}
                  </p>
                )}
              </div>

              {/* Main message editor text block */}
              <textarea
                id="compose_mail_body"
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Compose your message body here..."
                rows={9}
                className="w-full border-0 focus:outline-hidden text-xs font-normal focus:ring-0 text-slate-850 p-2 grow resize-none"
                required
              />

              {/* Form Send Footer */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <button
                  id="compose_send_action"
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white hover:scale-102 active:scale-98 text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer border-0"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Email
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-400 font-mono">
                  Pressing Send updates Sent folders securely
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
