import React, { useState, useEffect } from "react";
import { NotesItem } from "../../types";
import { ListTodo, Search, FilePenLine, Trash2, Calendar, FileText } from "lucide-react";

export default function NotesApp() {
  const [notes, setNotes] = useState<NotesItem[]>(() => {
    try {
      const saved = localStorage.getItem("ipad_playstore_notes");
      return saved ? JSON.parse(saved) : [
        {
          id: "n_default_1",
          title: "🤖 Welcome to iPadOS Subsystem",
          content: "This simulated device runs complete Play Store application containers alongside iPad workflows.\n\nOpen Google Play from your dock to expand capabilities, download paint boards, running games, satellite maps or cloud connected Gemini intelligences.\n\nHave fun drafting reports!",
          updatedAt: new Date().toLocaleDateString()
        }
      ];
    } catch {
      return [];
    }
  });

  const [activeId, setActiveId] = useState<string>(() => {
    return notes[0]?.id || "";
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Sync back to local preferences
  useEffect(() => {
    try {
      localStorage.setItem("ipad_playstore_notes", JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeId);

  const createNote = () => {
    const newNote: NotesItem = {
      id: `n_note_${Date.now()}`,
      title: "New Sketchnote",
      content: "",
      updatedAt: new Date().toLocaleDateString()
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveId(newNote.id);
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (activeId === id) {
      setActiveId(updated[0]?.id || "");
    }
  };

  const updateActiveNoteField = (field: "title" | "content", val: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id === activeId) {
        return {
          ...n,
          [field]: val,
          updatedAt: new Date().toLocaleDateString()
        };
      }
      return n;
    }));
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="notes_app_viewport" className="flex flex-col h-full bg-[#fdfaf2] text-stone-800 font-sans">
      <header className="bg-[#fcf7e8] border-b border-stone-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#bda45d] text-white">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-stone-900 leading-none">Notepad Docs</h2>
            <p className="text-[9px] text-[#bda45d] mt-0.5 font-bold">iPad Local Storage Scratchpad</p>
          </div>
        </div>

        <button
          id="btn_new_note"
          onClick={createNote}
          className="px-3.5 py-1.5 bg-[#bda45d] hover:bg-[#a58e50] text-white hover:scale-103 font-bold text-xxs rounded-lg transition-transform shadow-xs cursor-pointer flex items-center gap-1"
        >
          <FilePenLine className="w-3.5 h-3.5" /> New Note
        </button>
      </header>

      {/* Side segment split */}
      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-stone-200 overflow-hidden">
        {/* Left segment side list */}
        <div className="w-full md:w-56 p-4 bg-[#fbf5e4]/60 flex flex-col justify-stretch shrink-0 overflow-y-auto">
          {/* Quick search */}
          <div className="relative mb-3.5 shrink-0">
            <input
              id="notes_filter_input"
              type="text"
              className="w-full pl-8 pr-3 py-1 bg-[#fbf5e4] focus:bg-white text-xxs text-stone-800 rounded-lg outline-hidden border border-stone-300 placeholder-stone-400 focus:ring-1 focus:ring-[#bda45d]"
              placeholder="Search scratchpad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1.5 text-stone-400 pointer-events-none" />
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <p className="text-[11px] text-stone-400 font-medium italic text-center py-5">No reports found.</p>
            ) : (
              filteredNotes.map((n) => (
                <button
                  id={`note_item_${n.id}`}
                  key={n.id}
                  onClick={() => setActiveId(n.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex justify-between gap-2 overflow-hidden items-start ${
                    activeId === n.id 
                      ? "bg-[#bda45d]/10 border-[#bda45d]/40 text-[#54471f]" 
                      : "bg-[#fcf7e8]/40 border-stone-200 text-stone-600 hover:bg-[#bda45d]/5"
                  }`}
                >
                  <div className="overflow-hidden">
                    <h4 className="text-xxs font-black truncate leading-tight">{n.title || "Untitled Document"}</h4>
                    <p className="text-[10px] text-stone-400 truncate mt-1">{n.content || "Empty notepad details..."}</p>
                    <span className="text-[9px] text-[#bda45d] font-bold block mt-1.5">{n.updatedAt}</span>
                  </div>
                  <button
                    id={`delete_note_${n.id}`}
                    onClick={(e) => deleteNote(n.id, e)}
                    className="p-1 hover:bg-stone-200/40 rounded-sm text-stone-400 hover:text-rose-500 scale-90 transition-colors shrink-0"
                    title="Delete notepad row"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right active text editor context */}
        <div className="flex-1 bg-white p-6 overflow-y-auto">
          {activeNote ? (
            <div className="h-full flex flex-col justify-stretch gap-4.5">
              <input
                id="active_note_title"
                type="text"
                className="w-full text-lg font-bold border-b border-stone-100 pb-2 text-stone-900 focus:outline-hidden placeholder-stone-300"
                placeholder="Title"
                value={activeNote.title}
                onChange={(e) => updateActiveNoteField("title", e.target.value)}
              />

              <div className="flex items-center gap-1.5 text-stone-400 text-xxs font-semibold shrink-0">
                <Calendar className="w-3.5 h-3.5 text-[#bda45d]" /> Last saved on {activeNote.updatedAt}
              </div>

              <textarea
                id="active_note_content"
                className="w-full flex-1 text-xs text-stone-700 leading-relaxed bg-transparent resize-none focus:outline-hidden placeholder-stone-300 h-full min-h-[160px]"
                placeholder="Draft note..."
                value={activeNote.content}
                onChange={(e) => updateActiveNoteField("content", e.target.value)}
              />
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center p-6 bg-[#fdfaf2]/20 border border-dashed border-stone-200 rounded-2xl">
              <ListTodo className="w-8 h-8 text-[#bda45d] mb-2.5 animate-pulse" />
              <h3 className="text-xs font-bold text-stone-850">No Document Selected</h3>
              <p className="text-[11px] text-stone-400 max-w-xs mt-1">Pick a notepad entry on the left side or create a new draft outline.</p>
              <button
                id="notepad_placeholder_creation"
                onClick={createNote}
                className="mt-4 px-3.5 py-1.5 bg-[#bda45d] hover:bg-[#a58e50] text-stone-50 font-bold text-xxs rounded-lg shadow-xs"
              >
                Create Scratch Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
