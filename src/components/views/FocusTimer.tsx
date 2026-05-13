import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Maximize2, Sliders, Target, ChevronDown, Activity, CloudRain, Music, Wind, Flame, PenTool, Lock, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../auth/AuthProvider';
import { startWorkSession, endWorkSession } from '../../lib/api/sessions';

export function FocusTimer() {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'classic' | 'extended' | 'deep'>('classic');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sounds = [
    { id: 'rain', name: 'Rain Forest', icon: CloudRain, url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg' },
    { id: 'lofi', name: 'Lo-Fi Beats', icon: Music, url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf7f5.mp3' },
    { id: 'noise', name: 'White Noise', icon: Wind, url: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg' },
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if (activeSound) {
      const sound = sounds.find(s => s.id === activeSound);
      if (sound) {
        audioRef.current = new Audio(sound.url);
        audioRef.current.loop = true;
        audioRef.current.volume = volume;
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [activeSound]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleSessionEnd();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleSessionStart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      setIsActive(true);
      startTimeRef.current = Date.now();
      const session = await startWorkSession(user.id);
      if (session) {
        setSessionId(session.id);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSessionEnd = async () => {
    setIsActive(false);
    if (sessionId && startTimeRef.current) {
      setLoading(true);
      try {
        const durationMs = Date.now() - startTimeRef.current;
        const durationMins = Math.floor(durationMs / 60000);
        await endWorkSession(sessionId, durationMins);
        setSessionId(null);
        startTimeRef.current = null;
      } finally {
        setLoading(false);
      }
    }
  };

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
        <div className="glass-card p-6 rounded-none flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-none flex items-center justify-center text-primary">
              <Target size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Current Focus</p>
              <h3 className="text-xl font-bold text-text-primary">Redesign Dashboard Components</h3>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-2 bg-surface-dim rounded-none text-text-muted font-bold text-sm hover:bg-surface-dim transition-all">
            Switch Task <ChevronDown size={18} />
          </button>
        </div>

        {/* The Timer */}
        <div className="glass-card flex-1 rounded-none p-12 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-none blur-[100px]" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/5 rounded-none blur-[100px]" />

          <div className="bg-surface-dim p-1.5 rounded-none flex gap-2 mb-16 relative z-10">
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
                  "px-6 py-2.5 rounded-none font-bold text-sm transition-all",
                  mode === m.id ? "bg-surface-bright text-primary shadow-sm" : "text-text-muted hover:text-text-muted"
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
                className="text-surface-bright"
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
              <span className="text-[100px] font-black text-text-primary leading-none tracking-tighter tabular-nums drop-shadow-sm">
                {formatTime(timeLeft)}
              </span>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-text-muted mt-4">Stay Focused</p>
            </div>
          </div>

          <div className="mt-16 flex items-center gap-10 relative z-10">
            <button 
              onClick={() => {
                setTimeLeft(mode === 'classic' ? 25 * 60 : mode === 'extended' ? 45 * 60 : 60 * 60);
                setIsActive(false);
              }}
              className="w-14 h-14 rounded-none border border-slate-200 text-text-muted hover:text-primary hover:border-primary transition-all flex items-center justify-center bg-surface-bright shadow-sm"
            >
              <RotateCcw size={24} />
            </button>
            <button 
              onClick={() => isActive ? handleSessionEnd() : handleSessionStart()}
              disabled={loading}
              className="w-24 h-24 rounded-none bg-primary text-text-on-primary flex items-center justify-center shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={32} className="animate-spin" />
              ) : isActive ? (
                <Pause size={48} className="fill-current" />
              ) : (
                <Play size={48} />
              )}
            </button>
            <button className="w-14 h-14 rounded-none border border-slate-200 text-text-muted hover:text-primary hover:border-primary transition-all flex items-center justify-center bg-surface-bright shadow-sm">
              <SkipForward size={24} />
            </button>
          </div>

          <div className="absolute bottom-8 right-8 flex gap-3">
            <button className="p-3 bg-white/50 hover:bg-surface-bright rounded-none text-text-muted hover:text-primary transition-all shadow-sm">
              <Maximize2 size={20} />
            </button>
            <button className="p-3 bg-white/50 hover:bg-surface-bright rounded-none text-text-muted hover:text-primary transition-all shadow-sm">
              <Sliders size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-8">
        <div className="glass-card p-8 rounded-none">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-bold text-text-primary">Productivity</h4>
            <Activity size={20} className="text-text-muted" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-surface-dim p-5 rounded-none border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Focus Time</p>
              <span className="text-3xl font-black text-text-primary">4.5h</span>
            </div>
            <div className="bg-surface-dim p-5 rounded-none border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Session Streak</p>
              <span className="text-3xl font-black text-primary">8</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-text-muted">Daily Goal Progress</span>
              <span className="text-text-primary">75%</span>
            </div>
            <div className="w-full h-3 bg-surface-dim rounded-none overflow-hidden">
              <div className="h-full bg-primary rounded-none transition-all duration-1000" style={{ width: '75%' }} />
            </div>
            <p className="text-[10px] text-text-muted font-medium">45 mins left to reach your daily 'Deep Work' target.</p>
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

        <div className="glass-card p-8 rounded-none">
          <h4 className="text-xl font-bold text-text-primary mb-6">Focus Sounds</h4>
          <div className="space-y-4">
            {sounds.map((sound) => {
              const isActive = activeSound === sound.id;
              return (
                <div 
                  key={sound.id} 
                  onClick={() => setActiveSound(isActive ? null : sound.id)}
                  className={cn(
                    "p-5 rounded-none border transition-all flex items-center justify-between group cursor-pointer",
                    isActive ? "bg-surface-bright border-primary/20 shadow-sm" : "hover:bg-surface-bright border-transparent"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <sound.icon size={20} className={isActive ? "text-primary" : "text-text-muted"} />
                    <span className={cn("font-bold text-sm", isActive ? "text-text-primary" : "text-text-muted")}>{sound.name}</span>
                  </div>
                  {isActive ? (
                    <div className="flex items-center gap-3 w-32" onClick={(e) => e.stopPropagation()}>
                      <Wind size={14} className="text-text-muted" />
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-surface-dim rounded-none appearance-none cursor-pointer accent-primary"
                        title="Volume"
                      />
                    </div>
                  ) : (
                    <Play size={20} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-8 rounded-none bg-indigo-50/50">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="text-orange-500 fill-orange-500" />
            <h4 className="text-xl font-bold text-text-primary">Focus Master</h4>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {[
              { label: '7 Day Streak', icon: Flame, color: 'text-orange-500', bg: 'bg-surface-bright' },
              { label: '100h Focus', icon: PenTool, color: 'text-primary', bg: 'bg-surface-bright' },
              { label: 'Level 5', icon: Lock, color: 'text-text-muted', bg: 'bg-surface-dim/50', dotted: true },
            ].map((ach, i) => (
              <div key={i} className={cn(
                "min-w-[100px] aspect-square rounded-none flex flex-col items-center justify-center shadow-sm border",
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
