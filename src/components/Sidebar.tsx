import { Home, CheckSquare, TrendingUp, FileText, Calendar, Settings, LogOut, Star, X, Menu } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from './auth/AuthProvider';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'habits', label: 'Habit Tracker', icon: TrendingUp },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 sidebar-gradient flex flex-col p-6 z-50 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-bright rounded-none flex items-center justify-center text-primary font-bold text-2xl shadow-lg">
              s
            </div>
            <div>
              <h1 className="text-text-primary text-2xl font-black tracking-tight leading-none">TaskSync</h1>
              <p className="text-text-primary/60 text-[10px] font-semibold uppercase tracking-wider mt-1">AI Productivity</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-text-muted hover:text-primary p-2">
            <X size={20} />
          </button>
        </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full text-left transition-all duration-200 flex items-center gap-3 px-4 py-3",
              activeTab === item.id ? "nav-item-active" : "nav-item"
            )}
          >
            <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4 pt-6 border-t border-white/10">
        <button className="w-full flex items-center justify-between bg-white/10 p-3 rounded-none hover:bg-white/20 transition-all group text-text-primary">
          <span className="font-bold text-sm">Go Pro</span>
          <Star size={16} className="group-hover:fill-white transition-all" />
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-none border-2 border-white/20 bg-primary/10 flex items-center justify-center text-primary font-black shrink-0">
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div className="text-text-primary min-w-0">
              <p className="text-sm font-bold leading-tight truncate">
                {user?.user_metadata?.name || 'User'}
              </p>
              <p className="text-[10px] opacity-60 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="text-text-primary/60 hover:text-text-primary transition-colors p-2"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
