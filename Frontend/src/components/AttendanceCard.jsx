import React from 'react';

export function AttendanceCard({ data, isVisible, onMouseEnter, onMouseLeave }) {
  if (!data) return null;

  const total = data.present + data.absent;
  const presentPct = total > 0 ? ((data.present / total) * 100).toFixed(1) : '0.0';
  const absentPct = total > 0 ? ((data.absent / total) * 100).toFixed(1) : '0.0';
  const overallPct = data.total > 0 ? ((data.present / data.total) * 100).toFixed(1) : '0.0';

  return (
    <div 
      id="att-card" 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed top-[calc(60px+8px)] right-3 w-[300px] bg-white border border-slate-200 rounded-[18px] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)] z-[150] transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
    >
      <div className="flex items-center gap-3.5">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 36 36" width="96" height="96" className="-rotate-90">
            {/* Background track */}
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="3.5"/>
            {/* Absent segment (orange) */}
            <circle 
              cx="18" cy="18" r="15.915" fill="none" stroke="#F97316" strokeWidth="3.5" 
              strokeDasharray={`${absentPct} ${100 - absentPct}`} 
              strokeDashoffset="0"
              className="transition-all duration-700 ease-in-out"
            />
            {/* Present segment (blue) */}
            <circle 
              cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="3.5" 
              strokeDasharray={`${presentPct} ${100 - presentPct}`} 
              strokeDashoffset={`-${absentPct}`}
              className="transition-all duration-700 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[17px] font-black text-slate-800 leading-none">{presentPct}%</span>
            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Attend.</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
          <div className="font-heading text-[13px] font-extrabold text-slate-800 leading-tight truncate uppercase">
            {data.title || 'Overall Attendance'}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Avg: <span className="text-blue-500 font-bold">{overallPct}%</span>
          </div>
          <hr className="border-none border-t border-slate-100 my-0.5" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div> Present
            </div>
            <div className="text-[11px] font-bold text-slate-500">
              {data.present}/{data.total} | {overallPct}%
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div> Absent
            </div>
            <div className="text-[11px] font-bold text-slate-500">
              {data.absent}/{data.total} | {((data.absent/data.total)*100).toFixed(1)}%
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 text-center bg-slate-50 py-1.5 rounded-lg mt-1 tracking-tight">
            [ Not Updated {data.nu || 0} ]
          </div>
        </div>
      </div>
    </div>
  );
}
