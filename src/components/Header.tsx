import { Search, Bell, MoreVertical, Plus, Share2 } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-surface/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
        {title === 'Task Dashboard' || title === 'Kanban Board' ? (
          <nav className="flex gap-8">
            <button className="text-slate-400 hover:text-gray-800 transition-colors font-semibold text-sm">By Status</button>
            <button className="text-primary border-b-2 border-primary font-bold text-sm pb-1 flex items-center gap-2">
              By Total Tasks
              <span className="bg-indigo-50 text-primary text-[10px] px-1.5 py-0.5 rounded-md">12</span>
            </button>
            <button className="text-slate-400 hover:text-gray-800 transition-colors font-semibold text-sm">Tasks Due</button>
            <button className="text-slate-400 hover:text-gray-800 transition-colors font-semibold text-sm">Extra Tasks</button>
            <button className="text-slate-400 hover:text-gray-800 transition-colors font-semibold text-sm">Completed</button>
          </nav>
        ) : (
          <nav className="flex gap-6">
            <button className="text-slate-400 hover:text-primary font-medium text-sm transition-colors decoration-2 underline-offset-8 decoration-primary hover:underline">Month</button>
            <button className="text-primary font-bold text-sm underline decoration-2 underline-offset-8 decoration-primary">Week</button>
            <button className="text-slate-400 hover:text-primary font-medium text-sm transition-colors decoration-2 underline-offset-8 decoration-primary hover:underline">Day</button>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden lg:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-full transition-all">
            <Bell size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-full transition-all">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-all">
            <Share2 size={16} />
            Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">
            <Plus size={16} />
            Add Event
          </button>
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          />
        </div>
      </div>
    </header>
  );
}
