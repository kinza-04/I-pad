import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "../../types";
import { Sparkles, Send, Trash2, Bot, User, CornerDownLeft, CircleAlert } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function GeminiApp({ onExecuteAction, systemMetrics }: { onExecuteAction?: (act: any) => void; systemMetrics?: any }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    { label: "🎨 Aesthetic Theme", text: "Please change the wallpaper to Neo Tokyo" },
    { label: "🚀 Launch Application", text: "Open YouTube and show me some videos" },
    { label: "🔊 Adjust Audio", text: "Set volume to 100% and screen brightness to 100%" },
    { label: "🔒 Dynamic Control", text: "Go ahead and lock my tablet securely" },
  ];

  // Instantly seed chat with introductory greetings
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "seq_seed_1",
          role: "model",
          content: "Hello! I am **Gemini 3.5**, your integrated Google Play Assistant.\n\nI am connected directly with the server-side runtime to execute operations. Type anything or click one of the quick prompts below to get started!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom when message log changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text || text.trim() === "") return;

    const userMsg: ChatMessage = {
      id: `m_user_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);
    setErrorText(null);

    const payloadMessages = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.content
    }));

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: payloadMessages,
          systemMetrics: systemMetrics
        })
      });

      if (!response.ok) {
        throw new Error(`Cloud connection response failure (HTTP ${response.status})`);
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `m_ai_${Date.now()}`,
        role: "model",
        content: data.reply || "No reply was received.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);

      // If Gemini returned an active assistant command action, execute it on the tablet chassis
      if (data.action && onExecuteAction) {
        onExecuteAction(data.action);
      }
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Failed to contact proxy API server.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "seq_seed_cleared",
        role: "model",
        content: "Chat cleared successfully! Let me know what you want to work on next.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div id="gemini_app_container" className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans">
      {/* App Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-radial from-blue-500 via-indigo-500 to-purple-600 text-white animate-pulse shadow-md">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Gemini AI <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-extrabold border border-indigo-500/30">Stable</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">Cloud Connected Services</p>
          </div>
        </div>

        <button
          id="clear_gemini_history"
          onClick={handleClearChat}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </header>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div 
              key={m.id} 
              className={`flex items-start gap-3.5 max-w-4xl mx-auto ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                isUser ? "bg-indigo-600 text-white" : "bg-slate-800 text-indigo-400"
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="flex flex-col max-w-[80%]">
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  isUser 
                    ? "bg-indigo-600 text-white rounded-tr-none" 
                    : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                }`}>
                  <div className="markdown-body">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
                <span className={`text-[9px] text-slate-500 mt-1 font-mono font-medium ${isUser ? "text-right" : "text-left"}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Pulse Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-4 max-w-4xl mx-auto">
            <div className="p-2 rounded-xl bg-slate-800 text-indigo-400 animate-pulse shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col max-w-[80%] space-y-1">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none shadow-xs">
                <div className="flex items-center gap-1.5 py-1">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Error Alerts */}
        {errorText && (
          <div className="max-w-4xl mx-auto flex items-center gap-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            <CircleAlert className="w-5 h-5 shrink-0 text-rose-400" />
            <div className="flex-1 font-medium">{errorText}</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Helper Prompt Starter Pills (Only show if messages is just the seed) */}
      {messages.length === 1 && !loading && (
        <div className="max-w-xl mx-auto px-6 pb-2 grid grid-cols-2 gap-2 w-full">
          {starterPrompts.map((p, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(p.text)}
              className="p-2.5 text-[10px] text-left border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-indigo-500/50 rounded-lg text-slate-300 transition-all font-medium duration-150 cursor-pointer"
            >
              <p className="font-bold text-indigo-400 mb-0.5">{p.label}</p>
              <p className="truncate text-slate-400">{p.text}</p>
            </button>
          ))}
        </div>
      )}

      {/* Message Submission Area */}
      <div className="px-6 py-4.5 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto relative flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1.5 focus-within:border-indigo-500/60 shadow-inner group transition-colors">
          <input
            id="gemini_user_input"
            type="text"
            className="flex-1 bg-transparent px-3.5 py-2 text-xs text-white focus:outline-hidden"
            placeholder="Type your question or request..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage(inputValue);
              }
            }}
          />
          <button
            id="gemini_send_btn"
            onClick={() => handleSendMessage(inputValue)}
            disabled={loading || !inputValue.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-600 rounded-lg transition-all duration-200 cursor-pointer shadow-md shrink-0 flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-center text-[9px] text-slate-500 mt-2 font-medium">
          Powered by Gemini 3.5. Requests are proxied server-side to protect operational credentials.
        </p>
      </div>
    </div>
  );
}
