// import React from 'react';
// import { ChevronLeft } from 'lucide-react';

// const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// export function LogsView({ state, updateState, attendanceRecords = [] }) {
//   const selectedDate = new Date(state.selectedLogDate);
//   const selectedDateKey = selectedDate.toISOString().slice(0, 10);

//   const logs = attendanceRecords.flatMap((record) => {
//     const subjectName = record.subject_id?.name || 'Unknown Subject';
//     return (record.day_by_day || [])
//       .filter((entry) => new Date(entry.date).toISOString().slice(0, 10) === selectedDateKey)
//       .map((entry, index) => ({
//         id: `${selectedDateKey}-${record._id || subjectName}-${index}`,
//         subject: subjectName,
//         status: entry.status,
//         date: entry.date,
//       }));
//   });

//   const filteredLogs = state.selectedSubject && state.selectedSubject !== 'All Subjects'
//     ? logs.filter((log) => log.subject === state.selectedSubject)
//     : logs;
//   const dates = [];
  
//   for (let i = -3; i <= 3; i++) {
//     const d = new Date(state.selectedLogDate);
//     d.setDate(d.getDate() + i);
//     dates.push(d);
//   }

//   return (
//     <div className="flex flex-col h-screen w-full font-sans bg-slate-50 text-slate-900 overflow-x-hidden">
//       <header className="shrink-0 h-15 bg-[#0F1F3D] text-white flex items-center justify-between px-4 z-50 sticky top-0 shadow-md">
//         <div className="flex items-center gap-2">
//           <button onClick={() => updateState({ view: 'calendar' })} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
//             <ChevronLeft size={20} />
//           </button>
//           <span className="font-bold text-lg">Attendance Logs</span>
//         </div>
//       </header>

//       <div className="flex flex-col flex-1 bg-white">
//         <nav className="sticky top-0 bg-white z-40 border-b border-slate-100 pb-4 pt-4">
//           <div className="flex overflow-x-auto px-10 gap-10 items-center justify-center no-scrollbar">
//             {dates.map((d, i) => {
//               const isActive = d.toDateString() === state.selectedLogDate.toDateString();
//               return (
//                 <div key={i} onClick={() => updateState({ selectedLogDate: d })} className={`flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 min-w-12.5 ${isActive ? '' : 'opacity-40 hover:opacity-100'}`}>
//                   <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>{DAYS[d.getDay()]}</span>
//                   {isActive ? (
//                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500 shadow-sm transform scale-110">
//                       <span className="text-xl font-black text-blue-600">{d.getDate()}</span>
//                     </div>
//                   ) : (
//                     <span className="text-xl font-black text-slate-800">{d.getDate()}</span>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </nav>

//         <main className="w-full max-w-4xl mx-auto px-4 space-y-6 pt-10 pb-10">
//           {filteredLogs.length === 0 ? (
//             <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
//               No attendance records available for this date.
//             </div>
//           ) : (
//             filteredLogs.map((log) => (
//               <div key={log.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                   <div>
//                     <p className="text-sm text-slate-500 uppercase tracking-wider">Subject</p>
//                     <h2 className="text-xl font-bold text-slate-900">{log.subject}</h2>
//                   </div>
//                   <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${log.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
//                     <span className="capitalize">{log.status}</span>
//                   </div>
//                 </div>
//                 <div className="mt-4 grid gap-3 sm:grid-cols-2">
//                   <div className="rounded-2xl bg-white p-4 border border-slate-200">
//                     <p className="text-xs text-slate-400 uppercase tracking-wider">Date</p>
//                     <p className="mt-2 text-sm text-slate-700">{new Date(log.date).toLocaleDateString()}</p>
//                   </div>
//                   <div className="rounded-2xl bg-white p-4 border border-slate-200">
//                     <p className="text-xs text-slate-400 uppercase tracking-wider">Status</p>
//                     <p className="mt-2 text-sm text-slate-700 capitalize">{log.status}</p>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }


import React from 'react';
import { ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2, XCircle } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function LogsView({ state, updateState, attendanceRecords = [] }) {
  const selectedDate = new Date(state.selectedLogDate);
  const selectedDateKey = selectedDate.toISOString().slice(0, 10);

  const logs = attendanceRecords.flatMap((record) => {
    const subjectName = record.subject_id?.name || 'Unknown Subject';
    return (record.day_by_day || [])
      .filter((entry) => new Date(entry.date).toISOString().slice(0, 10) === selectedDateKey)
      .map((entry, index) => ({
        id: `${selectedDateKey}-${record._id || subjectName}-${index}`,
        subject: subjectName,
        status: entry.status,
        date: entry.date,
      }));
  });

  const filteredLogs = state.selectedSubject && state.selectedSubject !== 'All Subjects'
    ? logs.filter((log) => log.subject === state.selectedSubject)
    : logs;
    
  const dates = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(state.selectedLogDate);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }

  return (
    <div className="flex flex-col flex-1 bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-slate-100 pb-5 pt-5 shadow-sm">
        <div className="flex overflow-x-auto px-6 gap-8 items-center justify-center no-scrollbar">
          {dates.map((d, i) => {
            const isActive = d.toDateString() === state.selectedLogDate.toDateString();
            return (
              <div 
                key={i} 
                onClick={() => updateState({ selectedLogDate: d })} 
                className={`flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 min-w-[50px] group ${isActive ? '' : 'opacity-40 hover:opacity-100'}`}
              >
                <span className={`text-[10px] font-extrabold uppercase tracking-[0.1em] ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {DAYS[d.getDay()]}
                </span>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-blue-100 border-2 border-blue-500 shadow-md scale-110' : 'bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-300'}`}>
                  <span className={`text-lg font-black ${isActive ? 'text-blue-600' : 'text-slate-700'}`}>{d.getDate()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 space-y-6">
        {filteredLogs.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center flex flex-col items-center gap-4">
            <div className="p-4 bg-white border border-slate-100 rounded-full shadow-sm"><CalendarIcon className="w-8 h-8 text-slate-200" /></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No records for this date</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="rounded-[32px] border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-[20px] transition-colors ${log.status === 'present' ? 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white'}`}>
                    {log.status === 'present' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.1em] mb-1">Subject</p>
                    <h2 className="text-lg sm:text-xl font-heading font-extrabold text-slate-800 leading-tight truncate max-w-[200px] sm:max-w-md">{log.subject}</h2>
                  </div>
                </div>
                
                <div className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-widest shadow-sm ${log.status === 'present' ? 'bg-[#DCFCE7] text-emerald-700 border border-[#BBF7D0]' : 'bg-[#FFE4E6] text-rose-700 border border-[#FECDD3]'}`}>
                  <div className={`w-2 h-2 rounded-full ${log.status === 'present' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                  {log.status}
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4 group/item hover:border-blue-200 transition-colors">
                  <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl group-hover/item:bg-blue-500 group-hover/item:text-white transition-colors">
                    <CalendarIcon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Date</p>
                    <p className="mt-1 text-sm font-bold text-slate-700 font-body">{new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="rounded-[24px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4 group/item hover:border-blue-200 transition-colors">
                  <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl group-hover/item:bg-indigo-500 group-hover/item:text-white transition-colors">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Logged Time</p>
                    <p className="mt-1 text-sm font-bold text-slate-700 font-body">10:00 AM - 11:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}