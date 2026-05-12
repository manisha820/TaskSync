/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HabitTracker } from './components/views/HabitTracker';
import { FocusTimer } from './components/views/FocusTimer';
import { TaskDashboard } from './components/views/TaskDashboard';
import { KanbanBoard } from './components/views/KanbanBoard';
import { NotesSystem } from './components/views/NotesSystem';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12 pb-20">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Active Focus</h3>
                <button 
                  onClick={() => setActiveTab('habits')}
                  className="text-primary font-bold text-sm hover:underline"
                >
                  All Stats
                </button>
              </div>
              <FocusTimer />
            </section>
            
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Academic Overview</h3>
                <button 
                   onClick={() => setActiveTab('tasks')}
                   className="text-primary font-bold text-sm hover:underline"
                >
                  Full Board
                </button>
              </div>
              <TaskDashboard />
            </section>
          </div>
        );
      case 'tasks':
        return <KanbanBoard />;
      case 'habits':
        return <HabitTracker />;
      case 'notes':
        return <NotesSystem />;
      case 'calendar':
        return (
          <div className="flex flex-col items-center justify-center p-20 glass-card rounded-[3rem] text-center">
            <h3 className="text-2xl font-black text-slate-800 mb-4">Calendar View</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              Integrate your Google Calendar or Outlook to sync all your deadlines and study sessions.
            </p>
            <button className="mt-8 px-8 py-3 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:shadow-primary/40 transition-all">
              Connect Calendar
            </button>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-2xl space-y-8">
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">Settings</h3>
            <div className="space-y-4">
              {[
                'Account Preferences',
                'Notification System',
                'Design & Appearance',
                'Cloud Sync (Autosave)',
                'Privacy & Security',
                'Integrations (API)',
              ].map((setting) => (
                <div key={setting} className="glass-card p-6 rounded-2xl flex items-center justify-between hover:bg-white cursor-pointer group">
                  <span className="font-bold text-slate-700 group-hover:text-primary transition-colors">{setting}</span>
                  <Plus size={20} className="text-slate-300 group-hover:text-primary transition-all group-hover:rotate-45" />
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <TaskDashboard />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'tasks': return 'Kanban Board';
      case 'habits': return 'Habit Consistency';
      case 'notes': return 'Knowledge Base';
      case 'calendar': return 'Academic Schedule';
      case 'settings': return 'System Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-surface font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pl-64 min-h-screen flex flex-col">
        {activeTab !== 'notes' && <Header title={getTitle()} />}
        
        <div className={activeTab === 'notes' ? "flex-1" : "p-8 flex-1"}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full"
            >
              {activeTab === 'dashboard' ? (
                <div className="space-y-12 pb-20">
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">Active Focus</h3>
                      <button 
                        onClick={() => setActiveTab('habits')}
                        className="text-primary font-bold text-sm hover:underline"
                      >
                        All Stats
                      </button>
                    </div>
                    <FocusTimer />
                  </section>
                  
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">Assignments & Deadlines</h3>
                      <button 
                         onClick={() => setActiveTab('tasks')}
                         className="text-primary font-bold text-sm hover:underline"
                      >
                        Full List
                      </button>
                    </div>
                    <TaskDashboard />
                  </section>
                </div>
              ) : (
                renderView()
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <button className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-[2rem] shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <Plus size={32} strokeWidth={3} className="transition-transform group-hover:rotate-90" />
      </button>
    </div>
  );
}

