// import React, { useEffect, useRef } from 'react';
// import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// const MO = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// export function CalendarView({ state, updateState, attendanceRecords = [], subjects = [] }) {
//   const dropdownRef = useRef(null);
//   const selectedSubject = state.selectedSubject || 'All Subjects';
//   const subjectOptions = subjects.length
//     ? ['All Subjects', ...subjects]
//     : ['All Subjects', 'Compiler Design', 'Database Systems', 'Web Technology', 'Software Engineering'];

//   const attendanceMap = attendanceRecords.reduce((map, record) => {
//     const subjectName = record.subject_id?.name;
//     if (selectedSubject !== 'All Subjects' && subjectName !== selectedSubject) return map;
//     (record.day_by_day || []).forEach((entry) => {
//       const date = new Date(entry.date);
//       const key = date.toISOString().slice(0, 10);
//       if (!map[key]) map[key] = [];
//       map[key].push({ subject: subjectName, status: String(entry.status || '').toLowerCase() });
//     });
//     return map;
//   }, {});

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         updateState({ isDropdownOpen: false });
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [updateState]);

//   const getDayInfo = (day, month, year) => {
//     const date = new Date(year, month, day);
//     const key = date.toISOString().slice(0, 10);
//     const entries = attendanceMap[key] || [];
//     if (entries.length === 0) return { s: 'empty' };

//     const statuses = entries.map((entry) => entry.status);
//     const hasPresent = statuses.includes('present');
//     const hasAbsent = statuses.includes('absent');
//     const hasOther = statuses.some((status) => status !== 'present' && status !== 'absent');

//     if (hasPresent && !hasAbsent && !hasOther) return { s: 'present' };
//     if (!hasPresent && hasAbsent && !hasOther) return { s: 'absent' };
//     return { s: 'mixed' };
//   };

//   const changeMonth = (delta) => {
//     const newDate = new Date(state.currentDate);
//     newDate.setMonth(newDate.getMonth() + delta);
//     updateState({ currentDate: newDate });
//   };

//   const openDayLogs = (day) => {
//     const date = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), day);
//     updateState({ view: 'logs', selectedLogDate: date });
//   };

//   const yr = state.currentDate.getFullYear();
//   const mo = state.currentDate.getMonth();
//   const fd = new Date(yr, mo, 1).getDay();
//   const dim = new Date(yr, mo + 1, 0).getDate();
//   const pd = new Date(yr, mo, 0).getDate();
//   const today = new Date();

//   const cells = [];

//   for (let i = fd - 1; i >= 0; i--) {
//     cells.push(<div key={`prev-${i}`} className="bg-slate-50 flex flex-col items-end p-1.5"><span className="text-[11px] font-extrabold text-slate-300">{pd - i}</span></div>);
//   }

//   for (let d = 1; d <= dim; d++) {
//     const info = getDayInfo(d, mo, yr);
//     const isToday = today.getDate() === d && today.getMonth() === mo && today.getFullYear() === yr;
    
//     let bgColor = 'bg-green-100';
//     if (info.s === 'absent') bgColor = 'bg-rose-100';
//     else if (info.s === 'mixed') bgColor = 'bg-orange-100';
//     else if (info.s === 'empty') bgColor = 'bg-slate-100';
//     else if (info.s === 'holiday') bgColor = 'bg-slate-200';

//     cells.push(
//       <div 
//         key={`day-${d}`} 
//         onClick={() => openDayLogs(d)}
//         className={`relative flex flex-col items-end p-1.5 cursor-pointer hover:brightness-95 transition-all min-h-15 ${bgColor} ${isToday ? 'ring-2 ring-inset ring-blue-500' : ''}`}
//       >
//         <span className="text-[11px] font-extrabold text-slate-700">{d}</span>
//         {isToday && <div className="absolute top-0 left-0 bg-blue-500 text-white text-[6px] font-bold px-1 py-0.5 rounded-br uppercase tracking-wider">Today</div>}
//       </div>
//     );
//   }

//   const rem = 42 - fd - dim;
//   for (let i = 1; i <= rem; i++) {
//     cells.push(<div key={`next-${i}`} className="bg-slate-50 flex flex-col items-end p-1.5"><span className="text-[11px] font-extrabold text-slate-300">{i}</span></div>);
//   }

//   return (
//     <div className="flex flex-col h-screen w-full font-sans bg-slate-50 text-slate-900 overflow-x-hidden">
//       <header className="shrink-0 h-15 bg-[#0F1F3D] text-white flex items-center justify-between px-4 z-50 sticky top-0 shadow-md">
//         <div className="flex items-center gap-2">
//           <span className="font-bold text-lg">Attendance</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <button onClick={() => updateState({ mode: 'day', selectedSubject: 'All Subjects', isDropdownOpen: false })} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${state.mode === 'day' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
//             <CalendarIcon size={14} /> Day Wise
//           </button>
//           <div className="relative" ref={dropdownRef}>
//             <button onClick={() => updateState({ isDropdownOpen: !state.isDropdownOpen })} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${state.mode === 'subject' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
//               <span>{state.selectedSubject || 'Subject Wise'}</span>
//               <ChevronDown size={14} className={`transition-transform ${state.isDropdownOpen ? 'rotate-180' : ''}`} />
//             </button>
//             {state.isDropdownOpen && (
//               <div className="absolute right-0 top-[calc(100%+6px)] w-52 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-200">
//                 {subjectOptions.map((subj) => (
//                   <button 
//                     key={subj}
//                     onClick={() => updateState({ mode: 'subject', selectedSubject: subj, isDropdownOpen: false })}
//                     className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 border-b border-slate-50 last:border-0 transition-colors"
//                   >
//                     {subj}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       <div className="flex flex-col flex-1 h-full p-2 bg-slate-50">
//         <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
//           <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-wrap gap-2">
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider"><div className="w-2.5 h-2.5 rounded-sm bg-green-100 border border-green-200"></div>Present</div>
//               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider"><div className="w-2.5 h-2.5 rounded-sm bg-orange-100 border border-orange-200"></div>Mixed / Not updated</div>
//               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider"><div className="w-2.5 h-2.5 rounded-sm bg-rose-100 border border-rose-200"></div>Absent</div>
//               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider"><div className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-slate-200"></div>No Data</div>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="flex bg-slate-100 rounded-lg p-0.5">
//                 <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-white rounded-md transition-colors"><ChevronLeft size={16} /></button>
//                 <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-white rounded-md transition-colors"><ChevronRight size={16} /></button>
//               </div>
//               <div className="font-bold text-sm w-28 text-center text-slate-800">{MO[mo]} {yr}</div>
//               <button onClick={() => updateState({ currentDate: new Date() })} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white rounded-md hover:bg-slate-700 transition-colors">Today</button>
//             </div>
//           </div>
//           <div className="grid grid-cols-7 bg-slate-800">
//             {DAYS.map(d => <div key={d} className="py-2 text-center text-[10px] font-bold text-white uppercase tracking-wider border-r border-white/10 last:border-0">{d}</div>)}
//           </div>
//           <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-slate-200">
//             {cells}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

const MO = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({ state, updateState, attendanceRecords = [] }) {
  const selectedSubject = state.selectedSubject || 'All Subjects';

  const attendanceMap = attendanceRecords.reduce((map, record) => {
    const subjectName = record.subject_id?.name;
    if (selectedSubject !== 'All Subjects' && subjectName !== selectedSubject) return map;
    (record.day_by_day || []).forEach((entry) => {
      const date = new Date(entry.date);
      const key = date.toISOString().slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push({ subject: subjectName, status: String(entry.status || '').toLowerCase() });
    });
    return map;
  }, {});

  const getDayInfo = (day, month, year) => {
    const date = new Date(year, month, day);
    if (date.getDay() === 0) return { s: 'holiday' };

    const key = date.toISOString().slice(0, 10);
    const entries = attendanceMap[key] || [];
    if (entries.length === 0) return { s: 'empty' };

    const present = entries.filter(e => e.status === 'present').length;
    const absent = entries.filter(e => e.status === 'absent').length;
    const pending = entries.length - present - absent;

    if (present > 0 && absent === 0 && pending === 0) return { s: 'present', p: present, T: entries.length };
    if (present === 0 && (absent > 0 || pending > 0)) return { s: 'absent', a: absent, T: entries.length };
    return { s: 'pending', p: present, pend: pending, T: entries.length };
  };

  const changeMonth = (delta) => {
    const newDate = new Date(state.currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    updateState({ currentDate: newDate });
  };

  const openDayLogs = (day) => {
    const date = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), day);
    updateState({ view: 'logs', selectedLogDate: date });
  };

  const yr = state.currentDate.getFullYear();
  const mo = state.currentDate.getMonth();
  const fd = new Date(yr, mo, 1).getDay();
  const dim = new Date(yr, mo + 1, 0).getDate();
  const pd = new Date(yr, mo, 0).getDate();
  const today = new Date();

  const renderCell = (day, type, isToday = false) => {
    if (type === 'inactive') {
      return (
        <div key={`inactive-${day}-${Math.random()}`} className="bg-[#F8FAFC] flex flex-col items-end p-2 border-r border-b border-slate-100 last:border-r-0">
          <span className="text-[11px] font-extrabold text-slate-300">{day}</span>
        </div>
      );
    }

    const info = getDayInfo(day, mo, yr);
    
    let bgColor = 'bg-white';
    let tooltipBg = '#16A34A';
    let tooltipContent = '';

    if (info.s === 'present') {
      bgColor = 'bg-[#DCFCE7]'; tooltipBg = '#16A34A';
      tooltipContent = `Present: ${info.p}/${info.T}<br/>Absent: 0/${info.T}`;
    } else if (info.s === 'pending') {
      bgColor = 'bg-[#FFEDD5]'; tooltipBg = '#F97316';
      tooltipContent = `Present: ${info.p}/${info.T}<br/>Pending: ${info.pend} sessions`;
    } else if (info.s === 'absent') {
      bgColor = 'bg-[#F1F5F9]'; tooltipBg = '#64748B';
      tooltipContent = 'Absent';
    } else if (info.s === 'holiday') {
      bgColor = 'bg-[#F1F5F9]'; tooltipBg = '#94A3B8';
      tooltipContent = 'Holiday';
    } else if (info.s === 'empty') {
      bgColor = 'bg-white'; tooltipBg = '#94A3B8';
      tooltipContent = 'No Records Available';
    }

    return (
      <div 
        key={`active-${day}`} 
        onClick={() => openDayLogs(day)}
        className={`group relative flex flex-col items-end p-2 cursor-pointer hover:filter hover:brightness-95 transition-all min-h-[60px] sm:min-h-[80px] border-r border-b border-slate-100 last:border-r-0 ${bgColor} ${isToday ? 'ring-2 ring-inset ring-blue-500 z-10' : ''}`}
      >
        <span className="text-[11px] font-extrabold text-slate-700 leading-none">{day}</span>
        
        {tooltipContent && (
          <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-[400] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 transition-all duration-[0.14s] ease-out whitespace-nowrap min-w-max">
            <div 
              className="text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.22)] leading-[1.55] relative font-body"
              style={{ backgroundColor: tooltipBg }}
            >
              <div dangerouslySetInnerHTML={{ __html: tooltipContent }} />
              <div 
                className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent"
                style={{ borderTop: `5px solid ${tooltipBg}` }}
              ></div>
            </div>
          </div>
        )}

        {isToday && (
          <div className="absolute top-0 left-0 bg-blue-500 text-white text-[6px] font-extrabold px-1.5 py-0.5 rounded-br-md uppercase tracking-wider shadow-sm">
            Today
          </div>
        )}
      </div>
    );
  };

  const cells = [];
  for (let i = fd - 1; i >= 0; i--) cells.push(renderCell(pd - i, 'inactive'));
  for (let d = 1; d <= dim; d++) {
    const isToday = today.getDate() === d && today.getMonth() === mo && today.getFullYear() === yr;
    cells.push(renderCell(d, 'active', isToday));
  }
  const rem = 42 - fd - dim;
  for (let i = 1; i <= rem; i++) cells.push(renderCell(i, 'inactive'));

  return (
    <div className="flex-1 flex flex-col bg-white rounded-[16px] border border-slate-200 overflow-visible shadow-[0_1px_6px_rgba(0,0,0,0.07)]">
      {/* Top bar */}
      <div className="flex-shrink-0 h-[48px] flex items-center justify-between px-4 border-b border-slate-100 gap-2 bg-white">
        <div className="hidden lg:flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#DCFCE7] border border-[#BBF7D0]"></div> Present
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#FFEDD5] border border-[#FED7AA]"></div> Pending
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#F1F5F9] border border-slate-200"></div> Absent
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end lg:flex-none">
          <div className="flex bg-[#F1F5F9] rounded-lg p-0.5 shadow-inner border border-slate-200/50">
            <button onClick={() => changeMonth(-1)} className="p-1 px-1.5 hover:bg-white rounded-md transition-all text-slate-600 hover:text-indigo-600 active:scale-95">
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <button onClick={() => changeMonth(1)} className="p-1 px-1.5 hover:bg-white rounded-md transition-all text-slate-600 hover:text-indigo-600 active:scale-95">
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
          <div className="font-heading text-sm sm:text-[15px] font-extrabold text-slate-800 min-w-[124px] text-center tracking-tight">
            {MO[mo]} {yr}
          </div>
          <button onClick={() => updateState({ currentDate: new Date() })} className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] bg-slate-900 border border-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all active:scale-95 shadow-sm">
            Today
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="flex-shrink-0 h-[34px] grid grid-cols-7 bg-[#1E293B]">
        {DAYS.map(d => (
          <div key={d} className="flex items-center justify-center text-[11px] font-extrabold text-white uppercase tracking-widest border-r border-white/5 last:border-none">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-7 grid-rows-6 bg-slate-200 gap-px border-b border-slate-200">
        {cells}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 h-[32px] flex items-center gap-2 px-4 bg-[#F8FAFC] text-[10px] text-slate-400 font-medium">
        <Info size={13} className="text-slate-300" />
        <span>Data is live, updated every 24 hrs. Click a date for detailed logs.</span>
      </div>
    </div>
  );
}