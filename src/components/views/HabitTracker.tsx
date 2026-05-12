import { Bolt, BarChart2, CheckCircle, Trophy, ArrowRight, Zap, Target, Droplets, BookOpen, Rocket } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function HabitTracker() {
  return (
    <div className="space-y-10">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Longest Streak', value: '42', unit: 'days', icon: Bolt, color: 'text-primary', bg: 'bg-primary/10', trend: '+12% vs LY' },
          { label: 'Consistency Rate', value: '94', unit: '%', icon: BarChart2, color: 'text-secondary', bg: 'bg-secondary/10', trend: 'Top 5%' },
          { label: 'Habits Done', value: '6/8', unit: '', icon: CheckCircle, color: 'text-orange-600', bg: 'bg-orange-50', trend: 'Today' },
          { label: 'Total Rewards', value: '12', unit: 'badges', icon: Trophy, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Level 14' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-xl", stat.bg)}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.trend}</span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-800">
              {stat.value} <span className="text-lg font-bold text-slate-400">{stat.unit}</span>
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Habit List */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Active Habits</h3>
            <button className="text-primary font-bold text-sm flex items-center gap-2 hover:underline">
              Manage All <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Morning Meditation', schedule: '15 mins daily • Morning', streak: '14 Days', active: true, icon: Zap },
              { name: 'Deep Work', schedule: '4 hours blocks • Workday', streak: '8 Days', active: false, icon: Target },
              { name: 'Hydration', schedule: '3L Water • Daily', streak: '31 Days', active: true, icon: Droplets },
              { name: 'Read 20 Pages', schedule: 'Science/Non-fiction • Evening', streak: '5 Days', active: false, icon: BookOpen },
            ].map((habit, i) => (
              <div key={i} className="glass-card p-6 rounded-[2rem] group hover:border-primary/30 cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors">{habit.name}</h4>
                    <p className="text-slate-400 text-xs font-medium">{habit.schedule}</p>
                  </div>
                  <div className={cn(
                    "w-12 h-6 rounded-full relative transition-all duration-300",
                    habit.active ? "bg-primary" : "bg-slate-200"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                      habit.active ? "left-7" : "left-1"
                    )} />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Current Streak</p>
                    <p className="text-2xl font-black text-slate-800">{habit.streak}</p>
                  </div>
                  <div className="flex gap-1 items-end h-12">
                    {[0.2, 0.4, 0.6, 1, 0.8, 0.5, 0.9].map((h, j) => (
                      <div 
                        key={j} 
                        className={cn(
                          "w-2 rounded-full transition-all",
                          habit.active ? "bg-primary" : "bg-slate-200"
                        )}
                        style={{ height: `${h * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <div className="glass-card p-8 rounded-[2rem]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg text-slate-800">Consistency Heatmap</h3>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0.1, 0.3, 0.5, 0.8, 1].map((o, i) => (
                    <div key={i} className="w-3 h-3 rounded-sm bg-primary" style={{ opacity: o }} />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto pb-4 no-scrollbar">
              {Array.from({ length: 364 }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-3 h-3 rounded-sm bg-primary" 
                  style={{ opacity: Math.random() > 0.3 ? Math.random() : 0.05 }} 
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="glass-card p-8 rounded-[2rem]">
            <h3 className="font-bold text-lg text-slate-800 mb-8">Weekly Performance</h3>
            <div className="flex items-end justify-between h-48 px-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const height = [60, 85, 40, 95, 70, 20, 10][i];
                return (
                  <div key={day} className="flex flex-col items-center gap-3 w-full group">
                    <div className="w-full max-w-[32px] bg-slate-100 rounded-t-xl relative overflow-hidden h-40">
                      <div 
                        className={cn(
                          "absolute bottom-0 w-full rounded-t-xl transition-all duration-500",
                          i === 3 ? "bg-primary" : "bg-primary/20 group-hover:bg-primary/40"
                        )}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg text-slate-800">Achievements</h3>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">8 Locked</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Consistency King', subtitle: '30 Day Streak', icon: Trophy, active: true },
                { title: '14-Day Warrior', subtitle: 'Active Now', icon: Zap, active: true },
                { title: 'Hydration Hero', subtitle: 'Lvl 5 Achieved', icon: Droplets, active: true },
                { title: 'Early Bird', subtitle: 'Locked', icon: Rocket, active: false },
              ].map((ach, i) => (
                <div key={i} className={cn(
                  "p-4 rounded-2xl border text-center transition-all hover:scale-105",
                  ach.active ? "bg-slate-50 border-slate-100" : "bg-slate-100/50 border-transparent opacity-40 grayscale"
                )}>
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3", ach.active ? "bg-primary/10 text-primary" : "bg-slate-200 text-slate-400")}>
                    <ach.icon size={24} />
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">{ach.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{ach.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-gradient-to-br from-primary to-indigo-700 p-8 rounded-[2rem] text-white overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6">Level 15 Goal</h3>
              <div className="space-y-6">
                {[
                  { label: 'Morning Rituals', progress: 85 },
                  { label: 'Deep Focus Blocks', progress: 42 },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                      <span>{item.label}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-1000" style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-3 bg-white text-primary font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:bg-slate-50 transition-all active:scale-95">
                Claim 500 XP
              </button>
            </div>
            <Rocket className="absolute -bottom-10 -right-10 text-white/5 w-48 h-48 -rotate-12 transition-transform duration-700 group-hover:translate-x-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
