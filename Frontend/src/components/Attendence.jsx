// import React, { useEffect, useState } from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import { CalendarView } from './CalendarView';
// import { LogsView } from './LogsView';
// import { verify } from '../services/verification.services';
// import { getStudentAttendance, getAllAttendance } from '../services/attendance.services';

// export function Attendance() {
//   const { type } = useParams();
//   const location = useLocation();
//   const [state, setState] = useState({
//     view: 'calendar', // 'calendar' | 'logs'
//     mode: 'day',      // 'day' | 'subject'
//     selectedSubject: 'All Subjects',
//     currentDate: new Date(),
//     selectedLogDate: new Date(), 
//     isDropdownOpen: false,
//   });
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }));

//   useEffect(() => {
//     loadAttendance();
//   }, [type, location.search, state.currentDate]);

//   const loadAttendance = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Authentication token not found. Please log in again.');

//       const verification = await verify(location, type);
//       if (!verification.status) {
//         throw new Error(verification.message || 'Unable to verify user.');
//       }

//       const collegeId = verification.college._id;
//       const userId = verification.user?._id;
//       const month = state.currentDate.getMonth() + 1;
//       const year = state.currentDate.getFullYear();
//       const attendanceResponse = type === 's'
//         ? await getStudentAttendance(type, collegeId, userId, token, month, year)
//         : await getAllAttendance(type, collegeId, token, month, year);

//       if (!attendanceResponse.status) {
//         throw new Error('Unable to load attendance data.');
//       }

//       const records = Array.isArray(attendanceResponse.data) ? attendanceResponse.data : [];
//       setAttendanceRecords(records);

//       const uniqueSubjects = Array.from(
//         new Set(
//           records
//             .map((record) => record.subject_id?.name)
//             .filter(Boolean)
//         )
//       );
//       setSubjects(uniqueSubjects);
//       setState((prev) => ({
//         ...prev,
//         selectedSubject: prev.selectedSubject || 'All Subjects',
//       }));
//     } catch (err) {
//       setAttendanceRecords([]);
//       setSubjects([]);
//       setError(err.message || 'Failed to load attendance data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {loading && (
//         <div className="p-6 text-sm text-slate-600">Loading attendance...</div>
//       )}

//       {error && (
//         <div className="p-6 mb-4 rounded-xl bg-rose-100 text-rose-700">{error}</div>
//       )}

//       {!loading && !error && (
//         <>
//           {state.view === 'calendar' ? (
//             <CalendarView
//               state={state}
//               updateState={updateState}
//               attendanceRecords={attendanceRecords}
//               subjects={subjects}
//             />
//           ) : (
//             <LogsView
//               state={state}
//               updateState={updateState}
//               attendanceRecords={attendanceRecords}
//               subjects={subjects}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CalendarView } from './CalendarView';
import { LogsView } from './LogsView';
import { verify } from '../services/verification.services';
import { getStudentAttendance, getAllAttendance } from '../services/attendance.services';
import { AttendanceCard } from './AttendanceCard';
import { Calendar as CalendarIcon, ChevronDown, BarChart2 } from 'lucide-react';

export function Attendance() {
  const { type } = useParams();
  const location = useLocation();
  const [state, setState] = useState({
    view: 'calendar', // 'calendar' | 'logs'
    mode: 'day',      // 'day' | 'subject'
    selectedSubject: 'All Subjects',
    currentDate: new Date(),
    selectedLogDate: new Date(), 
    isDropdownOpen: false,
    showCard: false,
  });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  let cardHideTimer = null;

  const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }));

  useEffect(() => {
    loadAttendance();
  }, [type, location.search, state.currentDate]);

  const loadAttendance = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found. Please log in again.');

      const verification = await verify(location, type);
      if (!verification.status) {
        throw new Error(verification.message || 'Unable to verify user.');
      }

      const collegeId = verification.college._id;
      const userId = verification.user?._id;
      const month = state.currentDate.getMonth() + 1;
      const year = state.currentDate.getFullYear();
      const attendanceResponse = type === 's'
        ? await getStudentAttendance(type, collegeId, userId, token, month, year)
        : await getAllAttendance(type, collegeId, token, month, year);

      if (!attendanceResponse.status) {
        throw new Error('Unable to load attendance data.');
      }

      const records = Array.isArray(attendanceResponse.data) ? attendanceResponse.data : [];
      setAttendanceRecords(records);

      // Calculate Summary Stats
      const totalPossible = records.length * 53; // Mocking total for full month percentage as in reference
      let totalP = 0;
      let totalA = 0;
      let totalNU = 0;

      records.forEach(r => {
        (r.day_by_day || []).forEach(e => {
          if (e.status?.toLowerCase() === 'present') totalP++;
          else if (e.status?.toLowerCase() === 'absent') totalA++;
          else totalNU++;
        });
      });

      setSummaryData({
        overall: { 
          title: verification.user?.batch || '23-SECTION D-II SEM', 
          present: totalP, 
          absent: totalA, 
          total: totalP + totalA + totalNU, 
          nu: totalNU 
        }
      });

      const uniqueSubjects = Array.from(
        new Set(
          records
            .map((record) => record.subject_id?.name)
            .filter(Boolean)
        )
      );
      setSubjects(uniqueSubjects);
      setState((prev) => ({
        ...prev,
        selectedSubject: prev.selectedSubject || 'All Subjects',
      }));
    } catch (err) {
      setAttendanceRecords([]);
      setSubjects([]);
      setError(err.message || 'Failed to load attendance data.');
    } finally {
      setLoading(false);
    }
  };

  const showCard = () => {
    if (cardHideTimer) clearTimeout(cardHideTimer);
    updateState({ showCard: true });
  };
  const hideCardSched = () => {
    cardHideTimer = setTimeout(() => updateState({ showCard: false }), 200);
  };
  const cancelHide = () => {
    if (cardHideTimer) clearTimeout(cardHideTimer);
  };

  const toggleS = () => updateState({ isDropdownOpen: !state.isDropdownOpen });
  const setMode = (m) => updateState({ mode: m, selectedSubject: m === 'day' ? 'All Subjects' : state.selectedSubject });
  const pickS = (s) => updateState({ selectedSubject: s, mode: 'subject', isDropdownOpen: false });

  return (
    <div className="min-h-screen bg-[#EEF2F7] font-body selection:bg-blue-100 selection:text-blue-900">
      <header className="shrink-0 h-[60px] bg-[#0F1F3D] text-white flex items-center justify-between px-4 sm:px-6 z-[100] sticky top-0 shadow-[0_2px_12px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-2">
          {state.view === 'logs' && (
            <button onClick={() => updateState({ view: 'calendar' })} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors mr-1">
              <ChevronDown className="rotate-90 w-5 h-5" />
            </button>
          )}
          <span className="font-heading text-lg font-bold tracking-tight">Attendance</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button 
            onClick={() => setMode('day')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold transition-all border-2 ${state.mode === 'day' ? 'bg-blue-500 border-blue-400 text-white' : 'bg-white/10 border-white/10 text-white/90 hover:bg-white/20'}`}
          >
            <CalendarIcon size={14} /> <span className="hidden sm:inline">Day Wise</span>
          </button>

          <div className="relative">
            <button 
              onClick={toggleS}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold transition-all border-2 ${state.mode === 'subject' ? 'bg-blue-500 border-blue-400 text-white' : 'bg-white/10 border-white/10 text-white/90 hover:bg-white/20'}`}
            >
              <span>{state.selectedSubject === 'All Subjects' ? 'Subject Wise' : state.selectedSubject}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${state.isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {state.isDropdownOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white border border-slate-200 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.18)] overflow-hidden z-[200] animate-[fadeIn_0.15s_ease-out]">
                {['All Subjects', ...subjects].map((s) => (
                  <button 
                    key={s}
                    onClick={() => pickS(s)}
                    className="w-full text-left px-4 py-3 text-[12px] font-bold text-slate-700 hover:bg-blue-50 border-b border-slate-50 last:border-0 transition-colors font-body"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onMouseEnter={showCard}
            onMouseLeave={hideCardSched}
            onFocus={showCard}
            onBlur={hideCardSched}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all outline-none"
          >
            <BarChart2 size={14} /> <span className="hidden sm:inline">Avg Attendance</span>
          </button>
        </div>
      </header>

      <AttendanceCard 
        data={summaryData?.overall} 
        isVisible={state.showCard} 
        onMouseEnter={cancelHide}
        onMouseLeave={hideCardSched}
      />

      <main className="content p-2 min-h-0 flex-1 flex flex-col pt-4">
        {loading && (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading attendance data...</p>
          </div>
        )}

        {error && (
          <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="flex-1 min-h-0 flex flex-col">
            {state.view === 'calendar' ? (
              <CalendarView
                state={state}
                updateState={updateState}
                attendanceRecords={attendanceRecords}
                subjects={subjects}
              />
            ) : (
              <LogsView
                state={state}
                updateState={updateState}
                attendanceRecords={attendanceRecords}
                subjects={subjects}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}