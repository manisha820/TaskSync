import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TaskDashboard } from './components/views/TaskDashboard';
import { KanbanBoard } from './components/views/KanbanBoard';
import { NotesSystem } from './components/views/NotesSystem';
import { HabitTracker } from './components/views/HabitTracker';
import { FocusTimer } from './components/views/FocusTimer';
import { CalendarView } from './components/views/CalendarView';
import { Menu } from 'lucide-react';
import { useAuth } from './components/auth/AuthProvider';
import { Login } from './components/auth/Login';
import { UniversalModal } from './components/UniversalModal';

export type ModalConfig = {
  isOpen: boolean;
  tab?: 'task' | 'note' | 'habit' | 'event';
  status?: string;
  initialDate?: Date;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modal, setModal] = useState<ModalConfig>({ isOpen: false });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user, session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Loading TaskSync...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  const openModal = (tab?: 'task' | 'note' | 'habit' | 'event', status?: string, initialDate?: Date) => {
    setModal({ isOpen: true, tab, status, initialDate });
  };

  const closeModal = () => setModal({ isOpen: false });

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Productivity Dashboard';
      case 'tasks': return 'Task Board';
      case 'habits': return 'Habit Tracker';
      case 'notes': return 'Notes & Brainstorm';
      case 'calendar': return 'Academic Calendar';
      case 'settings': return 'Settings';
      default: return 'TaskSync';
    }
  };

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12 pb-20">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-text-primary tracking-tight">Active Focus</h3>
                <button onClick={() => setActiveTab('habits')} className="text-primary font-bold text-sm hover:underline">
                  View Habits →
                </button>
              </div>
              <FocusTimer />
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-text-primary tracking-tight">Assignments & Deadlines</h3>
                <button onClick={() => setActiveTab('tasks')} className="text-primary font-bold text-sm hover:underline">
                  Full Board →
                </button>
              </div>
              <TaskDashboard
                viewMode={viewMode}
                selectedDate={selectedDate}
              />
            </section>
          </div>
        );

      case 'tasks':
        return (
          <KanbanBoard
            openModal={(tab, status) => openModal(tab, status)}
          />
        );

      case 'habits':
        return (
          <HabitTracker
            openModal={(tab) => openModal(tab)}
          />
        );

      case 'notes':
        return <NotesSystem />;

      case 'calendar':
        return (
          <CalendarView
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
            }}
            openModal={(tab, date) => openModal(tab, undefined, date)}
          />
        );

      case 'settings':
        return (
          <div className="space-y-8 max-w-2xl">
            <div className="glass-card p-8 border border-white/5">
              <h3 className="text-xl font-bold text-text-primary mb-4">Account</h3>
              <p className="text-text-muted text-sm">Logged in as <strong className="text-text-primary">{user?.email}</strong></p>
            </div>
            <div className="glass-card p-8 border border-white/5">
              <h3 className="text-xl font-bold text-text-primary mb-4">Theme</h3>
              <p className="text-text-muted text-sm">Dark mode is active. Light mode coming soon.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col lg:ml-64 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 flex items-center px-4 bg-surface/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-text-primary hover:bg-surface-dim rounded-none transition-all"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-black text-xl tracking-tight text-text-primary">TaskSync</span>
        </div>

        {/* Header (hidden for notes — it has its own layout) */}
        {activeTab !== 'notes' && (
          <Header
            title={getTitle()}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        )}

        {/* Main Content */}
        <div className={activeTab === 'notes' ? 'flex-1 overflow-hidden' : 'p-8 flex-1 overflow-y-auto'}>
          {renderView()}
        </div>
      </main>

      {/* Universal Modal */}
      <UniversalModal
        key={modal.isOpen ? `open-${modal.tab}-${modal.status}` : 'closed'}
        isOpen={modal.isOpen}
        onClose={closeModal}
        userId={user?.id || ''}
        initialTab={modal.tab}
        initialStatus={modal.status}
        initialDate={modal.initialDate}
      />
    </div>
  );
}
