import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Calendar, BookOpen, FileText, ChevronDown, ArrowRight } from 'lucide-react';
import { verify } from '../services/verification.services';
import { Loading } from './Loading';

export function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const { type } = useParams();
    const [formData, setFormData] = useState({
        fromYear: '',
        toYear: '',
        semester: '',
        examType: '',
        examMethod: ''
    });
    const [authStatus, setAuthStatus] = useState({ loading: true, error: null });

    useEffect(() => {
        const verifyUser = async () => {
            const response = await verify(location, type);
            if (response && response.status) {
                setAuthStatus({ loading: false, error: null });
            } else {
                const errorMessage = response && response.message ? response.message : 'Unable to verify user.';
                setAuthStatus({ loading: false, error: errorMessage });
            }
        };
        verifyUser();
    }, [location, type]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const { fromYear, toYear, semester, examType, examMethod } = formData;
        if (!fromYear || !toYear || !semester || !examType || !examMethod) {
            alert('Please fill all result filters before proceeding.');
            return;
        }
        if (Number(fromYear) > Number(toYear)) {
            alert('From year cannot be greater than To year.');
            return;
        }
        if (authStatus.loading) return;
        if (authStatus.error) {
            alert(authStatus.error);
            return;
        }

        navigate(`/${type}/academics/results/${examType}?fromYear=${fromYear}&toYear=${toYear}&semester=${semester}&examMethod=${examMethod}`);
    };

    const years = [2021, 2022, 2023, 2024, 2025, 2026];

    if (authStatus.loading) {
        return <Loading title="Checking login status..." />;
    }

    return (
        <div className="bg-gray-50 font-body min-h-dvh flex flex-col text-gray-800">
            <header className="bg-[#051F3E] shadow-sm h-16 flex items-center px-4 sm:px-8 sticky top-0 z-40 shrink-0">
                <div className="flex items-center gap-4 w-full max-w-5xl">
                    <h1 className="font-heading font-bold text-lg text-white tracking-wide">Results</h1>
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-105 p-8 sm:p-10 border border-gray-100">
                    <div className="text-center mb-8">
                        <h2 className="font-heading text-[22px] font-bold text-[#0f172a] mb-2 tracking-tight">View Your Results</h2>
                        <p className="text-[13px] text-gray-500 font-medium">Select academic details, exam type and method to load your results.</p>
                    </div>
                    {authStatus.error ? (
                        <div className="rounded-3xl bg-red-50 p-8 text-center text-red-700 border border-red-200">
                            <p>{authStatus.error}</p>
                        </div>
                    ) : (
                        <form className="space-y-5">
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="block text-[13px] font-bold text-gray-800" htmlFor="fromYear">From Year</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Calendar className="w-4 h-4 text-gray-400 group-focus-within:text-[#051F3E] transition-colors" />
                                        </div>
                                        <select
                                            id="fromYear"
                                            name="fromYear"
                                            value={formData.fromYear}
                                            onChange={handleChange}
                                            className="w-full h-12 pl-10.5 pr-10 text-[14px] font-semibold bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#051F3E]/10 focus:border-[#051F3E] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:border-gray-300 shadow-sm"
                                        >
                                            <option value="" disabled>Select From Year</option>
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-gray-400 group-focus-within:text-[#051F3E]" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[13px] font-bold text-gray-800" htmlFor="toYear">To Year</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Calendar className="w-4 h-4 text-gray-400 group-focus-within:text-[#051F3E] transition-colors" />
                                        </div>
                                        <select
                                            id="toYear"
                                            name="toYear"
                                            value={formData.toYear}
                                            onChange={handleChange}
                                            className="w-full h-12 pl-10.5 pr-10 text-[14px] font-semibold bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#051F3E]/10 focus:border-[#051F3E] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:border-gray-300 shadow-sm"
                                        >
                                            <option value="" disabled>Select To Year</option>
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-gray-400 group-focus-within:text-[#051F3E]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="block text-[13px] font-bold text-gray-800" htmlFor="semester">Semester</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <BookOpen className="w-4 h-4 text-gray-400 group-focus-within:text-[#051F3E] transition-colors" />
                                        </div>
                                        <select
                                            id="semester"
                                            name="semester"
                                            value={formData.semester}
                                            onChange={handleChange}
                                            className="w-full h-12 pl-10.5 pr-10 text-[14px] font-semibold bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#051F3E]/10 focus:border-[#051F3E] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:border-gray-300 shadow-sm"
                                        >
                                            <option value="" disabled>Select Semester</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-gray-400 group-focus-within:text-[#051F3E]" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[13px] font-bold text-gray-800" htmlFor="examType">Internal / External</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FileText className="w-4 h-4 text-gray-400 group-focus-within:text-[#051F3E] transition-colors" />
                                        </div>
                                        <select
                                            id="examType"
                                            name="examType"
                                            value={formData.examType}
                                            onChange={handleChange}
                                            className="w-full h-12 pl-10.5 pr-10 text-[14px] font-semibold bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#051F3E]/10 focus:border-[#051F3E] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:border-gray-300 shadow-sm"
                                        >
                                            <option value="" disabled>Select Exam Type</option>
                                            <option value="internal">Internal</option>
                                            <option value="external">External</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-gray-400 group-focus-within:text-[#051F3E]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[13px] font-bold text-gray-800" htmlFor="examMethod">Regular / Supplementary</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FileText className="w-4 h-4 text-gray-400 group-focus-within:text-[#051F3E] transition-colors" />
                                    </div>
                                    <select
                                        id="examMethod"
                                        name="examMethod"
                                        value={formData.examMethod}
                                        onChange={handleChange}
                                        className="w-full h-12 pl-10.5 pr-10 text-[14px] font-semibold bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#051F3E]/10 focus:border-[#051F3E] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:border-gray-300 shadow-sm"
                                    >
                                        <option value="" disabled>Select Exam Method</option>
                                        <option value="regular">Regular</option>
                                        <option value="supplementary">Supplementary</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-gray-400 group-focus-within:text-[#051F3E]" />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="w-full h-12 bg-[#051F3E] hover:bg-[#031124] text-white rounded-[10px] font-bold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(5,31,62,0.39)] hover:shadow-[0_6px_20px_rgba(5,31,62,0.23)] hover:-translate-y-0.5"
                                >
                                    <span className="text-[14px]">View Results</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
