import { Home, CheckSquare, TrendingUp, FileText, Calendar, Settings, LogOut, Star } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'habits', label: 'Habit Tracker', icon: TrendingUp },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 sidebar-gradient flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary font-bold text-2xl shadow-lg">
          s
        </div>
        <div>
          <h1 className="text-white text-2xl font-black tracking-tight leading-none">TaskSync</h1>
          <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider mt-1">AI Productivity</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full text-left transition-all duration-200",
              activeTab === item.id ? "nav-item-active" : "nav-item"
            )}
          >
            <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-sm font-medium">{item.label}</span>
            {item.id === 'tasks' && activeTab !== 'tasks' && (
              <span className="ml-auto bg-white text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">10</span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4 pt-6 border-t border-white/10">
        <button className="w-full flex items-center justify-between bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition-all group text-white">
          <span className="font-bold text-sm">Go Pro</span>
          <Star size={16} className="group-hover:fill-white transition-all" />
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white/20 object-cover"
            />
            <div className="text-white">
              <p className="text-sm font-bold leading-tight">Azunyan U. Wu</p>
              <p className="text-[10px] opacity-60">Basic Member</p>
            </div>
          </div>
          <button className="text-white/60 hover:text-white transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
