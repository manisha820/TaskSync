import { Clock, GraduationCap, ClipboardList, TrendingUp, ChevronRight, MoreHorizontal, Plus, Share2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function TaskDashboard() {
  return (
    <div className="space-y-10">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Current GPA', value: '3.8', icon: GraduationCap, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Assignments Due', value: '4', icon: ClipboardList, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Days until Finals', value: '12', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((metric, i) => (
          <div key={i} className="glass-card p-8 rounded-3xl flex items-center gap-6">
            <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center", metric.bg, metric.color)}>
              <metric.icon size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{metric.label}</p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">{metric.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Table Content */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xl font-bold text-slate-800 tracking-tight">Upcoming Assignments</h4>
            <button className="text-primary font-bold text-sm hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Assignment</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Due Date</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { subject: 'Physics', subColor: 'bg-blue-100 text-blue-600', name: 'Quantum Mechanics Problem Set', status: 'In Progress', statusColor: 'bg-indigo-500', date: 'Oct 24, 2023', priority: 'High', priorityColor: 'bg-red-50 text-red-500' },
                  { subject: 'Literature', subColor: 'bg-orange-100 text-orange-600', name: 'Modernist Poetry Analysis', status: 'Not Started', statusColor: 'bg-slate-300', date: 'Oct 27, 2023', priority: 'Medium', priorityColor: 'bg-slate-100 text-slate-500' },
                  { subject: 'Comp Sci', subColor: 'bg-indigo-100 text-indigo-600', name: 'Data Structures Lab 4', status: 'In Progress', statusColor: 'bg-primary', date: 'Oct 28, 2023', priority: 'High', priorityColor: 'bg-red-50 text-red-500' },
                  { subject: 'Economics', subColor: 'bg-emerald-100 text-emerald-600', name: 'Market Equilibrium Essay', status: 'Not Started', statusColor: 'bg-slate-300', date: 'Nov 02, 2023', priority: 'Low', priorityColor: 'bg-emerald-50 text-emerald-500' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                    <td className="px-8 py-6">
                      <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", row.subColor)}>
                        {row.subject}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-700">{row.name}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", row.statusColor)} />
                        <span className="text-xs font-semibold text-slate-500">{row.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-400">{row.date}</td>
                    <td className="px-8 py-6">
                      <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", row.priorityColor)}>
                        {row.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-bold text-slate-800 tracking-tight">Exam Countdown</h4>
              <Clock size={20} className="text-slate-400" />
            </div>
            <div className="space-y-8">
              {[
                { name: 'Advanced Calculus', date: 'Thursday, Oct 26', left: '2 Days Left', progress: 85, color: 'bg-primary' },
                { name: 'Microeconomics', date: 'Monday, Oct 30', left: '6 Days Left', progress: 40, color: 'bg-indigo-400' },
                { name: 'Modern History', date: 'Wednesday, Nov 08', left: '15 Days Left', progress: 15, color: 'bg-orange-400' },
              ].map((exam, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{exam.name}</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{exam.date}</p>
                    </div>
                    <p className={cn("text-[10px] font-black uppercase tracking-widest", i === 0 ? "text-primary" : "text-slate-400")}>
                      {exam.left}
                    </p>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-1000", exam.color)} style={{ width: `${exam.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem]">
            <h4 className="text-xl font-bold text-slate-800 tracking-tight mb-8">GPA Analytics</h4>
            <div className="flex items-end justify-between h-48 px-2 gap-3">
              {['SEM 1', 'SEM 2', 'SEM 3', 'SEM 4', 'CURRENT'].map((sem, i) => {
                const heights = [60, 75, 70, 85, 95];
                return (
                  <div key={sem} className="flex-1 flex flex-col items-center gap-3 group translate-y-2">
                    <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden h-40 relative">
                      <div 
                        className={cn(
                          "absolute bottom-0 w-full rounded-t-xl transition-all duration-700",
                          i === 4 ? "bg-primary" : "bg-primary/20 group-hover:bg-primary/40"
                        )}
                        style={{ height: `${heights[i]}%` }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {[3.4, 3.6, 3.5, 3.8, 3.9][i]}
                        </div>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      i === 4 ? "text-primary" : "text-slate-400"
                    )}>{sem}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="col-span-12 glass-card p-10 rounded-[3rem]">
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-2xl font-bold text-slate-800 tracking-tight">Today's Schedule</h4>
            <p className="text-primary font-black uppercase tracking-widest text-xs">Tuesday, Oct 24</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { time: '09:00', period: 'AM', title: 'Advanced Calculus', loc: 'Room 402 • Prof. Higgins' },
              { time: '11:30', period: 'AM', title: 'Digital Systems', loc: 'Lab C • Dr. Chen' },
              { time: '02:00', period: 'PM', title: 'Physics Seminar', loc: 'Lecture Hall 2 • Guest Speaker' },
            ].map((slot, i) => (
              <div key={i} className="flex items-center gap-6 p-6 rounded-[2rem] border border-slate-100 hover:border-primary/20 hover:bg-slate-50 transition-all group cursor-pointer">
                <div className="w-20 text-center border-r border-slate-100 pr-6 shrink-0">
                  <p className="text-xl font-black text-slate-800">{slot.time}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{slot.period}</p>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">{slot.title}</p>
                  <p className="text-xs font-semibold text-slate-400 mt-1">{slot.loc}</p>
                </div>
                <ChevronRight size={24} className="text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
