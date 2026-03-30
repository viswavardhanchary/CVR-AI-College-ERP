import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CalendarView } from './CalendarView';
import { LogsView } from './LogsView';
import { verify } from '../services/verification.services';
import { getStudentAttendance, getAllAttendance } from '../services/attendance.services';

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
  });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-slate-50">
      {loading && (
        <div className="p-6 text-sm text-slate-600">Loading attendance...</div>
      )}

      {error && (
        <div className="p-6 mb-4 rounded-xl bg-rose-100 text-rose-700">{error}</div>
      )}

      {!loading && !error && (
        <>
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
        </>
      )}
    </div>
  );
}