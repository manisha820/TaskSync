import { Search, Bell, MoreVertical, Plus, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
  title: string;
  viewMode: 'day' | 'week' | 'month';
  setViewMode: (mode: 'day' | 'week' | 'month') => void;
}

export function Header({ title, viewMode, setViewMode }: HeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-surface/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">{title}</h2>
        {(title === 'Productivity Dashboard' || title === 'Academic Calendar') && (
          <nav className="flex gap-6">
            {[
              { id: 'month', label: 'Month' },
              { id: 'week', label: 'Week' },
              { id: 'day', label: 'Day' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as any)}
                className={cn(
                  "text-sm transition-all decoration-2 underline-offset-8 decoration-primary",
                  viewMode === tab.id 
                    ? "text-primary font-bold underline" 
                    : "text-text-muted hover:text-primary font-medium hover:underline"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden lg:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="pl-10 pr-4 py-2 bg-surface-dim border-none rounded-none text-sm w-64 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-text-muted hover:text-primary hover:bg-surface-dim rounded-none transition-all">
            <Bell size={20} />
          </button>
          <button className="p-2 text-text-muted hover:text-primary hover:bg-surface-dim rounded-none transition-all">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="h-8 w-px bg-surface-dim" />

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-text-muted font-bold text-sm rounded-none hover:bg-surface-dim transition-all">
            <Share2 size={16} />
            Share
          </button>
          <div className="w-10 h-10 rounded-none border-2 border-white shadow-sm flex items-center justify-center bg-primary/10 text-primary font-black">
            {title[0]}
          </div>
        </div>
      </div>
    </header>
  );
}
