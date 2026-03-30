import React from 'react';
import { ChevronLeft } from 'lucide-react';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

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
    <div className="flex flex-col h-screen w-full font-sans bg-slate-50 text-slate-900 overflow-x-hidden">
      <header className="shrink-0 h-15 bg-[#0F1F3D] text-white flex items-center justify-between px-4 z-50 sticky top-0 shadow-md">
        <div className="flex items-center gap-2">
          <button onClick={() => updateState({ view: 'calendar' })} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-lg">Attendance Logs</span>
        </div>
      </header>

      <div className="flex flex-col flex-1 bg-white">
        <nav className="sticky top-0 bg-white z-40 border-b border-slate-100 pb-4 pt-4">
          <div className="flex overflow-x-auto px-10 gap-10 items-center justify-center no-scrollbar">
            {dates.map((d, i) => {
              const isActive = d.toDateString() === state.selectedLogDate.toDateString();
              return (
                <div key={i} onClick={() => updateState({ selectedLogDate: d })} className={`flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 min-w-12.5 ${isActive ? '' : 'opacity-40 hover:opacity-100'}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>{DAYS[d.getDay()]}</span>
                  {isActive ? (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500 shadow-sm transform scale-110">
                      <span className="text-xl font-black text-blue-600">{d.getDate()}</span>
                    </div>
                  ) : (
                    <span className="text-xl font-black text-slate-800">{d.getDate()}</span>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        <main className="w-full max-w-4xl mx-auto px-4 space-y-6 pt-10 pb-10">
          {filteredLogs.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              No attendance records available for this date.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider">Subject</p>
                    <h2 className="text-xl font-bold text-slate-900">{log.subject}</h2>
                  </div>
                  <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${log.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    <span className="capitalize">{log.status}</span>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 border border-slate-200">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Date</p>
                    <p className="mt-2 text-sm text-slate-700">{new Date(log.date).toLocaleDateString()}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-slate-200">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Status</p>
                    <p className="mt-2 text-sm text-slate-700 capitalize">{log.status}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}