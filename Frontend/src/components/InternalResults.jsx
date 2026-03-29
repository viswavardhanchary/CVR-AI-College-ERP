import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import { verify } from '../services/verification.services';
import { getResultsByStudentByExamType } from '../services/result.services';
import { Loading } from './Loading';

export function InternalResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const { type } = useParams();
    const [state, setState] = useState({ loading: true, error: null, rows: [], metadata: null });

    useEffect(() => {
        const fetchResults = async () => {
            setState({ loading: true, error: null, rows: [], metadata: null });
            const response = await verify(location, type);
            if (!response || !response.status) {
                const message = response && response.message ? response.message : 'Unable to verify user.';
                setState({ loading: false, error: message, rows: [], metadata: null });
                return;
            }

            const query = new URLSearchParams(location.search);
            const fromYear = query.get('fromYear');
            const toYear = query.get('toYear');
            const semester = query.get('semester');
            const examMethod = query.get('examMethod');
            const token = localStorage.getItem('token');

            try {
                const results = await getResultsByStudentByExamType(
                    type,
                    response.college._id,
                    response.user._id,
                    'internal',
                    token,
                    {
                        from_year: fromYear,
                        to_year: toYear,
                        semester,
                        exam_method: examMethod
                    }
                );

                const rows = [];

                results.forEach(result => {
                    if (!result.years) return;
                    result.years.forEach(year => {
                        if (!year.semesters) return;
                        year.semesters.forEach(sem => {
                            if (!sem.registerd_subjects) return;
                            sem.registerd_subjects.forEach(subject => {
                                rows.push({
                                    id: subject._id,
                                    subjectName: subject.subject_id && subject.subject_id.name ? subject.subject_id.name : 'Unknown Subject',
                                    marks: subject.marks,
                                    grade: subject.grade,
                                    status: subject.status,
                                    semesterNumber: sem.sem_number,
                                    examMethod: sem.exam_method,
                                    yearFrom: year.from ? new Date(year.from).getFullYear() : '',
                                    yearTo: year.to ? new Date(year.to).getFullYear() : ''
                                });
                            });
                        });
                    });
                });

                setState({ loading: false, error: null, rows, metadata: { fromYear, toYear, semester, examMethod } });
            } catch (error) {
                const message = error && error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : (error && error.message ? error.message : 'Unable to load results.');
                setState({ loading: false, error: message, rows: [], metadata: null });
            }
        };
        fetchResults();
    }, [location, type]);

    if (state.loading) {
        return <Loading title="Loading internal results..." />;
    }

    return (
        <div className="bg-gray-50 font-body min-h-screen text-gray-800">
            <header className="bg-[#051F3E] shadow-md h-16 flex items-center px-4 sm:px-8 sticky top-0 z-40">
                <div className="flex items-center gap-4 w-full max-w-5xl">
                    <button onClick={() => navigate(`/${type}/academics/results`)} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:ring-2 focus:ring-white/20">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="font-heading font-bold text-lg text-white">Internal Assessment Results</h1>
                </div>
            </header>
            <main className="p-4 sm:p-8 flex justify-center pb-20">
                <div className="w-full max-w-5xl">
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
                        <div>
                            <h2 className="text-2xl font-bold font-heading text-[#051F3E] mb-1">Internal Assessment Results</h2>
                            <p className="text-sm font-medium text-gray-500">
                                {state.metadata ? `Year ${state.metadata.fromYear} - ${state.metadata.toYear} · Semester ${state.metadata.semester} · ${state.metadata.examMethod ? state.metadata.examMethod : 'N/A'}` : 'Filtered internal results'}
                            </p>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl inline-flex items-center gap-2 shadow-sm">
                            <Info className="w-4 h-4 text-[#051F3E]" />
                            <span className="text-sm font-semibold text-[#051F3E]">Internal Assessment</span>
                        </div>
                    </div>
                    {state.error ? (
                        <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-red-200 text-red-600">
                            <p>{state.error}</p>
                        </div>
                    ) : state.rows.length === 0 ? (
                        <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-gray-200">
                            <p className="text-gray-600">No internal results found for the selected filters.</p>
                        </div>
                    ) : (
                        <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-125">
                                    <thead>
                                        <tr className="bg-[#051F3E] border-b border-[#051F3E]">
                                            <th className="px-6 py-4 text-sm font-bold text-white font-heading">Subject</th>
                                            <th className="px-6 py-4 text-sm font-bold text-white font-heading">Marks</th>
                                            <th className="px-6 py-4 text-sm font-bold text-white font-heading">Grade</th>
                                            <th className="px-6 py-4 text-sm font-bold text-white font-heading">Status</th>
                                            <th className="px-6 py-4 text-sm font-bold text-white font-heading">Semester</th>
                                            <th className="px-6 py-4 text-sm font-bold text-white font-heading">Academic Year</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {state.rows.map(row => (
                                            <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-700">{row.subjectName}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{row.marks != null ? row.marks : '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{row.grade != null ? row.grade : '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{row.status ? row.status : '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{row.semesterNumber ? row.semesterNumber : '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{row.yearFrom && row.yearTo ? `${row.yearFrom} - ${row.yearTo}` : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
