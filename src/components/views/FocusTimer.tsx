import { useState, useEffect } from 'react';
import { Play, RotateCcw, SkipForward, Maximize2, Sliders, Target, ChevronDown, Activity, CloudRain, Music, Wind, Flame, PenTool, Lock } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'classic' | 'extended' | 'deep'>('classic');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'classic' ? 25 * 60 : mode === 'extended' ? 45 * 60 : 60 * 60)) * 100;

  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
        {/* Task Selector */}
        <div className="glass-card p-6 rounded-[2rem] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-primary">
              <Target size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Focus</p>
              <h3 className="text-xl font-bold text-slate-800">Redesign Dashboard Components</h3>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-2 bg-slate-100 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all">
            Switch Task <ChevronDown size={18} />
          </button>
        </div>

        {/* The Timer */}
        <div className="glass-card flex-1 rounded-[3rem] p-12 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />

          <div className="bg-slate-100 p-1.5 rounded-3xl flex gap-2 mb-16 relative z-10">
            {[
              { id: 'classic', label: '25/5 Classic' },
              { id: 'extended', label: '45/15 Extended' },
              { id: 'deep', label: '60/20 Deep Work' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id as any);
                  setTimeLeft(m.id === 'classic' ? 25 * 60 : m.id === 'extended' ? 45 * 60 : 60 * 60);
                  setIsActive(false);
                }}
                className={cn(
                  "px-6 py-2.5 rounded-2xl font-bold text-sm transition-all",
                  mode === m.id ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="relative w-80 h-80 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-100"
              />
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={880}
                strokeDashoffset={880 - (880 * progress) / 100}
                strokeLinecap="round"
                className="text-primary transition-all duration-1000 ease-linear shadow-lg"
              />
            </svg>
            <div className="text-center">
              <span className="text-[100px] font-black text-slate-800 leading-none tracking-tighter tabular-nums drop-shadow-sm">
                {formatTime(timeLeft)}
              </span>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mt-4">Stay Focused</p>
            </div>
          </div>

          <div className="mt-16 flex items-center gap-10 relative z-10">
            <button 
              onClick={() => {
                setTimeLeft(mode === 'classic' ? 25 * 60 : mode === 'extended' ? 45 * 60 : 60 * 60);
                setIsActive(false);
              }}
              className="w-14 h-14 rounded-full border border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all flex items-center justify-center bg-white shadow-sm"
            >
              <RotateCcw size={24} />
            </button>
            <button 
              onClick={() => setIsActive(!isActive)}
              className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Play size={48} className={cn(isActive && "fill-current")} />
            </button>
            <button className="w-14 h-14 rounded-full border border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all flex items-center justify-center bg-white shadow-sm">
              <SkipForward size={24} />
            </button>
          </div>

          <div className="absolute bottom-8 right-8 flex gap-3">
            <button className="p-3 bg-white/50 hover:bg-white rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm">
              <Maximize2 size={20} />
            </button>
            <button className="p-3 bg-white/50 hover:bg-white rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm">
              <Sliders size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-8">
        <div className="glass-card p-8 rounded-[2rem]">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-bold text-slate-800">Productivity</h4>
            <Activity size={20} className="text-slate-400" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Focus Time</p>
              <span className="text-3xl font-black text-slate-800">4.5h</span>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Session Streak</p>
              <span className="text-3xl font-black text-primary">8</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-500">Daily Goal Progress</span>
              <span className="text-slate-800">75%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '75%' }} />
            </div>
            <p className="text-[10px] text-slate-400 font-medium">45 mins left to reach your daily 'Deep Work' target.</p>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 h-24 flex items-end justify-between gap-1.5 px-1">
            {[30, 50, 20, 70, 100, 40, 60].map((h, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-full rounded-t-lg transition-all duration-700",
                  i === 4 ? "bg-primary" : "bg-primary/10"
                )} 
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2rem]">
          <h4 className="text-xl font-bold text-slate-800 mb-6">Focus Sounds</h4>
          <div className="space-y-4">
            {[
              { name: 'Rain Forest', icon: CloudRain, active: true, val: 65 },
              { name: 'Lo-Fi Beats', icon: Music, active: false },
              { name: 'White Noise', icon: Wind, active: false },
            ].map((sound, i) => (
              <div key={i} className={cn(
                "p-5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer",
                sound.active ? "bg-white border-primary/20 shadow-sm" : "hover:bg-white border-transparent"
              )}>
                <div className="flex items-center gap-4">
                  <sound.icon size={20} className={sound.active ? "text-primary" : "text-slate-400"} />
                  <span className={cn("font-bold text-sm", sound.active ? "text-slate-800" : "text-slate-400")}>{sound.name}</span>
                </div>
                {sound.active ? (
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${sound.val}%` }} />
                    </div>
                  </div>
                ) : (
                  <Play size={20} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2rem] bg-indigo-50/50">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="text-orange-500 fill-orange-500" />
            <h4 className="text-xl font-bold text-slate-800">Focus Master</h4>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {[
              { label: '7 Day Streak', icon: Flame, color: 'text-orange-500', bg: 'bg-white' },
              { label: '100h Focus', icon: PenTool, color: 'text-primary', bg: 'bg-white' },
              { label: 'Level 5', icon: Lock, color: 'text-slate-300', bg: 'bg-slate-100/50', dotted: true },
            ].map((ach, i) => (
              <div key={i} className={cn(
                "min-w-[100px] aspect-square rounded-[2rem] flex flex-col items-center justify-center shadow-sm border",
                ach.bg, 
                ach.dotted ? "border-dashed border-slate-300" : "border-slate-100"
              )}>
                <ach.icon size={32} className={ach.color} />
                <span className="text-[10px] font-black uppercase tracking-widest mt-2">{ach.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
