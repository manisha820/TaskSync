import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Folder, FileText, Plus, Sparkles, Send, Terminal, Loader2, Pin, Search, Calendar as CalIcon, Trash2, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../auth/AuthProvider';
import { fetchNotes, saveNote, deleteNote, Note } from '../../lib/api/notes';
import { summarizeNote, chatWithNote } from '../../lib/api/ai';

const CATEGORIES = [
  'Personal Work',
  'High Priority Important',
  'Meeting Notes',
  'Ideas & Brainstorm',
  'Project Drafts'
];

export function NotesSystem() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', parts: {text: string}[]}[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      loadNotes();
      const channel = supabase.channel('notes-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notes', filter: `user_id=eq.${user.id}` }, loadNotes)
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  const loadNotes = async () => {
    if (!user) return;
    const fetched = await fetchNotes(user.id);
    setNotes(fetched);
    if (fetched.length > 0 && !activeNote) {
      setActiveNote(fetched[0]);
    }
  };

  const createNewNote = async () => {
    if (!user) return;
    setIsSaving(true);
    const cat = activeCategory || 'Personal Work';
    const newNote = await saveNote(null, user.id, '', '', [], cat, false, null);
    if (newNote) {
      setNotes([newNote, ...notes]);
      setActiveNote(newNote);
    }
    setIsSaving(false);
  };

  const handleNoteChange = (field: keyof Note, value: any) => {
    if (!activeNote || !user) return;
    const updatedNote = { ...activeNote, [field]: value } as Note;
    setActiveNote(updatedNote);

    // Optimistic UI update
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));

    setIsSaving(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      await saveNote(
        updatedNote.id, user.id, updatedNote.title, updatedNote.content, 
        updatedNote.tags, updatedNote.category, updatedNote.is_pinned, updatedNote.associated_date
      );
      setIsSaving(false);
    }, 1000);
  };

  const handleDelete = async () => {
    if (!activeNote || !user) return;
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    await deleteNote(activeNote.id);
    setNotes(notes.filter(n => n.id !== activeNote.id));
    setActiveNote(null);
  };

  const handleSummarize = async () => {
    if (!activeNote) return;
    setIsAiLoading(true);
    const summary = await summarizeNote(activeNote.title || 'Untitled', activeNote.content || '');
    setAiResponse(summary);
    setIsAiLoading(false);
  };

  const handleChat = async () => {
    if (!activeNote || !chatInput.trim()) return;
    setIsAiLoading(true);
    const userMsg = chatInput;
    setChatInput('');
    const newHistory = [...chatHistory, { role: 'user' as const, parts: [{ text: userMsg }] }];
    setChatHistory(newHistory);
    
    const response = await chatWithNote(activeNote.title || 'Untitled', activeNote.content || '', userMsg, chatHistory);
    setChatHistory([...newHistory, { role: 'model' as const, parts: [{ text: response }] }]);
    setIsAiLoading(false);
  };

  const filteredNotes = notes.filter(n => {
    if (activeCategory && n.category !== activeCategory) return false;
    if (searchQuery && !(n.title?.toLowerCase().includes(searchQuery.toLowerCase()) || n.content?.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="flex h-full -m-8 overflow-hidden">
      {/* Category & List Sidebar */}
      <div className="w-96 bg-surface-dim border-r border-white/5 flex flex-col overflow-hidden">
        
        {/* Search & Add */}
        <div className="p-6 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight text-text-primary">Workspace</h3>
            <button onClick={createNewNote} className="bg-primary/10 text-primary p-2 hover:bg-primary/20 transition-all rounded-none" title="New Note">
              <Plus size={18} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-bright border border-white/5 text-sm py-2 pl-9 pr-4 rounded-none outline-none focus:border-primary/40 text-text-primary placeholder:text-text-muted/50 transition-colors"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="p-6 border-b border-white/5">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">Categories</h4>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveCategory(null)}
              className={cn("w-full text-left px-3 py-2 text-sm font-semibold rounded-none flex items-center justify-between transition-colors", 
                activeCategory === null ? "bg-primary/10 text-primary" : "text-text-muted hover:text-text-primary hover:bg-surface-bright"
              )}
            >
              <span>All Notes</span>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-none">{notes.length}</span>
            </button>
            {CATEGORIES.map(cat => {
              const count = notes.filter(n => n.category === cat).length;
              return (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn("w-full text-left px-3 py-2 text-sm font-semibold rounded-none flex items-center justify-between transition-colors", 
                    activeCategory === cat ? "bg-primary/10 text-primary" : "text-text-muted hover:text-text-primary hover:bg-surface-bright"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Folder size={14} className={activeCategory === cat ? "text-primary" : "text-text-muted/50"} />
                    <span className="truncate">{cat}</span>
                  </div>
                  {count > 0 && <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-none">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-sm italic">
              No notes found.
            </div>
          ) : (
            filteredNotes.map(note => (
              <div 
                key={note.id}
                onClick={() => setActiveNote(note)}
                className={cn(
                  "p-4 cursor-pointer transition-all border-l-2 rounded-none group",
                  activeNote?.id === note.id 
                    ? "bg-primary/5 border-primary" 
                    : "border-transparent hover:bg-surface-bright"
                )}
              >
                <div className="flex items-start justify-between mb-1">
                  <h5 className={cn("font-bold text-sm truncate pr-2", activeNote?.id === note.id ? "text-primary" : "text-text-primary")}>
                    {note.title || 'Untitled Note'}
                  </h5>
                  {note.is_pinned && <Pin size={12} className="text-primary shrink-0 mt-0.5" />}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-semibold text-text-muted uppercase tracking-widest mt-2">
                  <span className="truncate max-w-[100px]">{note.category}</span>
                  {note.associated_date && <span>• {new Date(note.associated_date).toLocaleDateString()}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor Surface */}
      <div className="flex-1 bg-surface-bright p-16 overflow-y-auto relative flex flex-col">
        {activeNote ? (
          <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8">
              <div className="flex items-center gap-4">
                <select 
                  value={activeNote.category || 'Personal Work'}
                  onChange={(e) => handleNoteChange('category', e.target.value)}
                  className="bg-surface-dim border border-white/5 text-xs font-bold text-text-primary px-3 py-1.5 rounded-none outline-none focus:border-primary/40 cursor-pointer"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                
                <div className="flex items-center gap-2 bg-surface-dim border border-white/5 px-3 py-1.5 rounded-none focus-within:border-primary/40 transition-colors cursor-pointer">
                  <CalIcon size={14} className="text-text-muted" />
                  <input 
                    type="date"
                    value={activeNote.associated_date || ''}
                    onChange={(e) => handleNoteChange('associated_date', e.target.value)}
                    className="bg-transparent text-xs font-bold text-text-primary outline-none"
                    title="Associate with Date"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mr-4">
                  {isSaving ? <span className="flex items-center gap-1.5 text-primary"><Loader2 size={12} className="animate-spin" /> Saving</span> : 'Saved'}
                </span>
                
                <button 
                  onClick={() => handleNoteChange('is_pinned', !activeNote.is_pinned)}
                  className={cn("p-2 rounded-none transition-all", activeNote.is_pinned ? "bg-primary/20 text-primary" : "bg-surface-dim text-text-muted hover:text-text-primary")}
                  title={activeNote.is_pinned ? "Unpin Note" : "Pin Note"}
                >
                  <Pin size={16} className={activeNote.is_pinned ? "fill-current" : ""} />
                </button>
                <button 
                  onClick={handleDelete}
                  className="p-2 rounded-none bg-surface-dim text-red-400 hover:bg-red-500/20 transition-all"
                  title="Delete Note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Editor */}
            <input 
              value={activeNote.title || ''}
              onChange={(e) => handleNoteChange('title', e.target.value)}
              placeholder="Note Title"
              className="w-full bg-transparent text-5xl font-black text-text-primary tracking-tighter leading-tight outline-none placeholder:text-text-muted/30 mb-8"
            />

            <textarea 
              value={activeNote.content || ''}
              onChange={(e) => handleNoteChange('content', e.target.value)}
              placeholder="Start typing your thoughts..."
              className="w-full flex-1 bg-transparent text-lg font-medium text-text-muted leading-relaxed outline-none resize-none placeholder:text-text-muted/30 min-h-[400px]"
            />
            
            <div className="flex items-center gap-3 text-text-muted transition-all font-medium mt-8 pt-8 border-t border-white/5">
              <Terminal size={18} />
              <span className="text-sm">Workspace automatically syncs to cloud.</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted flex-col gap-4">
            <FileText size={64} className="opacity-10 mb-4" />
            <p className="font-bold text-lg text-text-primary">No Note Selected</p>
            <p className="text-sm text-text-muted">Select a note from the sidebar or create a new one.</p>
            <button onClick={createNewNote} className="mt-4 btn-primary px-6 py-2">
              Create First Note
            </button>
          </div>
        )}
      </div>

      {/* AI Assistant Sidebar */}
      <div className="w-96 bg-surface-dim border-l border-white/5 p-8 flex flex-col gap-8">
        <div className="flex items-center gap-3 border-b border-white/5 pb-6">
          <div className="w-8 h-8 rounded-none bg-primary/20 flex items-center justify-center">
            <Sparkles className="text-primary" size={16} />
          </div>
          <h3 className="text-lg font-bold text-text-primary tracking-tight">AI Assistant</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          <div 
            onClick={handleSummarize}
            className="glass-card p-6 rounded-none bg-surface-bright hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group border border-white/5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Sparkles size={14} /> Summarize Note
              </span>
              {isAiLoading && <Loader2 size={14} className="animate-spin text-primary" />}
            </div>
            <p className="text-sm font-semibold text-text-muted leading-relaxed">
              {aiResponse || "Click here to generate a summary of the current note."}
            </p>
          </div>

          {chatHistory.length > 0 && (
            <div className="space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={cn("p-4 text-xs rounded-none border", msg.role === 'user' ? "bg-primary/5 border-primary/20 ml-8" : "bg-surface-bright border-white/5 mr-8")}>
                  <p className="font-black uppercase tracking-widest opacity-40 mb-2 text-[9px]">{msg.role === 'user' ? 'You' : 'TaskSync AI'}</p>
                  <p className="text-text-primary leading-relaxed whitespace-pre-wrap font-medium">{msg.parts[0].text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto relative pt-4">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
            placeholder="Ask AI about this note..." 
            className="w-full bg-surface-bright border border-white/10 text-text-primary rounded-none py-4 px-6 pr-14 text-sm font-semibold shadow-inner focus:outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
          />
          <button 
            onClick={handleChat}
            disabled={isAiLoading || !activeNote}
            className="absolute right-2 top-1/2 -translate-y-1/2 mt-2 w-10 h-10 bg-primary text-text-on-primary rounded-none flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
