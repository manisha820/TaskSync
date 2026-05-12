import { Folder, FileText, ChevronRight, Share2, Bell, Plus, Search, Sparkles, Send, Link2, LayoutGrid, MoreVertical, Terminal, ArrowRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function NotesSystem() {
  return (
    <div className="flex h-full -m-8 overflow-hidden">
      {/* Search/Folders Sidebar */}
      <div className="w-80 bg-slate-50 border-r border-slate-200/50 p-8 flex flex-col gap-8 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Folders</h3>
            <button className="text-primary hover:bg-white p-1 rounded-lg transition-all"><Plus size={18} /></button>
          </div>
          <div className="space-y-1">
            <div className="space-y-1">
              <div className="flex items-center gap-3 p-3 text-slate-800 font-bold text-sm hover:bg-white rounded-xl transition-all cursor-pointer">
                <ChevronRight size={16} className="text-slate-400 rotate-90" />
                <Folder size={18} className="text-primary" />
                Business
              </div>
              <div className="ml-8 space-y-1">
                <div className="flex items-center gap-3 p-3 bg-primary/5 text-primary font-bold text-sm rounded-xl border-l-2 border-primary">
                  <FileText size={16} />
                  Productivity System
                </div>
                <div className="flex items-center gap-3 p-3 text-slate-400 font-bold text-sm hover:bg-white rounded-xl transition-all cursor-pointer">
                  <FileText size={16} />
                  Quarterly Review
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 text-slate-400 font-bold text-sm hover:bg-white rounded-xl transition-all cursor-pointer">
              <ChevronRight size={16} />
              <Folder size={18} className="text-secondary" />
              Personal
            </div>
            <div className="flex items-center gap-3 p-3 text-slate-400 font-bold text-sm hover:bg-white rounded-xl transition-all cursor-pointer">
              <ChevronRight size={16} />
              <Folder size={18} className="text-orange-500" />
              Study
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'High Priority', color: 'bg-primary/10 text-primary' },
              { label: 'Draft', color: 'bg-indigo-100 text-indigo-600' },
              { label: 'Archive', color: 'bg-slate-100 text-slate-400' },
            ].map((tag, i) => (
              <span key={i} className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-105 transition-all", tag.color)}>
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-slate-200">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Network Graph</h3>
          <div className="h-40 bg-white rounded-[2rem] border border-slate-100 relative shadow-sm overflow-hidden flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-3 h-3 bg-primary rounded-full absolute top-1/4 left-1/3" />
            <div className="w-5 h-5 bg-primary rounded-full absolute top-1/2 left-1/2" />
            <div className="w-2 h-2 bg-indigo-300 rounded-full absolute bottom-1/4 left-1/4" />
            <div className="w-2 h-2 bg-indigo-300 rounded-full absolute top-1/3 right-1/4" />
            <div className="w-3 h-3 bg-indigo-300 rounded-full absolute bottom-1/3 right-1/3" />
            
            {/* SVG lines */}
            <svg className="absolute inset-0 w-full h-full stroke-primary/10">
              <line x1="33%" y1="25%" x2="50%" y2="50%" />
              <line x1="25%" y1="75%" x2="50%" y2="50%" />
              <line x1="75%" y1="33%" x2="50%" y2="50%" />
              <line x1="66%" y1="66%" x2="50%" y2="50%" />
            </svg>
          </div>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="flex-1 bg-white p-16 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Workspace</span>
            <ChevronRight size={12} />
            <span>Business</span>
            <ChevronRight size={12} />
            <span className="text-primary">Productivity System</span>
          </div>

          <h1 className="text-6xl font-black text-slate-800 tracking-tighter leading-none outline-none" contentEditable spellCheck="false" suppressContentEditableWarning={true}>
            Productivity System Design
          </h1>

          <div className="prose prose-slate max-w-none space-y-8 text-lg font-medium text-slate-500 leading-relaxed italic border-l-4 border-slate-100 pl-8 py-2">
            <p className="outline-none" contentEditable spellCheck="false" suppressContentEditableWarning={true}>
              Building a high-performance mental model requires the integration of capture, synthesis, and actionable output. System design should prioritize friction-less entry followed by algorithmic organization.
            </p>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">1. Core Philosophy</h2>
            <p className="text-lg font-medium text-slate-500 leading-relaxed outline-none" contentEditable spellCheck="false" suppressContentEditableWarning={true}>
              The system is built on the <span className="text-primary bg-primary/5 px-2 py-0.5 rounded-lg">Second Brain</span> methodology, emphasizing that digital tools should serve as cognitive extensions rather than simple repositories.
            </p>

            <div className="bg-slate-900 rounded-[2rem] p-10 font-mono text-sm relative group">
              <div className="absolute top-4 right-8 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              <pre className="text-indigo-300">
                <code>
                  {`const productivitySystem = {\n  input: "raw_data",\n  process: (data) => summarize(data),\n  output: "knowledge_asset"\n};`}
                </code>
              </pre>
              <div className="absolute top-4 left-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Markdown Code Block</div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mt-12">2. Implementation Steps</h2>
            <div className="overflow-hidden border border-slate-100 rounded-3xl">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-100">
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Stage</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Action</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-8 py-5 font-bold text-slate-800 text-sm">Capture</td>
                    <td className="px-8 py-5 text-sm text-slate-500">Voice memo / Quick Note</td>
                    <td className="px-8 py-5 text-xs font-black text-indigo-500 uppercase tracking-widest">Real-time</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-5 font-bold text-slate-800 text-sm">Review</td>
                    <td className="px-8 py-5 text-sm text-slate-500">Nested organization</td>
                    <td className="px-8 py-5 text-xs font-black text-primary uppercase tracking-widest">Daily</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center gap-3 text-slate-300 transition-all font-medium animate-pulse">
              <Terminal size={20} />
              <span>Type / for commands...</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      <div className="w-96 bg-slate-100 border-l border-slate-200/50 p-10 flex flex-col gap-10">
        <div className="flex items-center gap-3">
          <Sparkles className="text-primary" />
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">AI Assistant</h3>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-[2rem] bg-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Sparkles size={14} />
                Summarization
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-600 leading-relaxed">
              Compress this 12-page document into 5 key bullet points for executive review.
            </p>
            <div className="mt-4 flex justify-end">
              <ArrowRight size={20} className="text-primary/40 group-hover:text-primary transition-all group-hover:translate-x-1" />
            </div>
          </div>

          <div className="glass-card p-6 rounded-[2rem] bg-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                <Sparkles size={14} />
                Flashcard Gen
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-600 leading-relaxed">
              Create Anki-style study cards from the "Philosophy" section automatically.
            </p>
            <div className="mt-4 flex justify-end">
              <ArrowRight size={20} className="text-indigo-500/40 group-hover:text-indigo-500 transition-all group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Linked Suggestions</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4 group cursor-pointer p-4 rounded-2xl hover:bg-white transition-all">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Link2 size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Zettelkasten Basics</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">92% Match • Study Folder</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer p-4 rounded-2xl hover:bg-white transition-all">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <Link2 size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Workflow Automations</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Relevant to "process"</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto relative">
          <input 
            type="text" 
            placeholder="Ask AI anything..." 
            className="w-full bg-white border border-slate-200 rounded-[2rem] py-5 px-8 pr-16 text-sm font-semibold shadow-inner focus:ring-4 focus:ring-primary/5 transition-all outline-none"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
