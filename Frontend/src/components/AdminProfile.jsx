import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { verify } from "../services/verification.services";
import { Camera, Settings, MessageSquareText, Activity, LogOut, ChevronDown, User } from "lucide-react";

export function AdminProfile() {
    const location = useLocation();
    const { type } = useParams();
    const [state, setState] = useState({
        accordion: {
            personal: true,
            admin: true,
            contact: true,
            address: true
        },
        admindata: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getDetails();
    }, []);

    const getDetails = async () => {
        setLoading(true);
        setError(null);
        const response = await verify(location, type);
        if (response.status) {
            setState(prev => ({ ...prev, admindata: response.user }));
        } else {
            setError(response.message || 'Unable to fetch admin details');
        }
        setLoading(false);
    }

    function formatDate(isoString) {
        if (!isoString) return '-';
        return new Date(isoString).toISOString().split('T')[0];
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f4f6fa] p-4">
                <div className="rounded-2xl bg-white p-10 shadow-xl text-center">
                    <p className="text-lg font-semibold text-slate-700">Loading profile...</p>
                    <p className="mt-2 text-sm text-slate-500">Fetching admin details from the backend.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f4f6fa] p-4">
                <div className="rounded-2xl bg-white p-10 shadow-xl text-center text-red-600">
                    <p className="text-lg font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    function togglePersonalSection() {
        setState(prev => ({
            ...prev,
            accordion: { ...prev.accordion, personal: !prev.accordion.personal }
        }));
    }

    function toggleAdminSection() {
        setState(prev => ({
            ...prev,
            accordion: { ...prev.accordion, admin: !prev.accordion.admin }
        }));
    }

    function toggleContactSection() {
        setState(prev => ({
            ...prev,
            accordion: { ...prev.accordion, contact: !prev.accordion.contact }
        }));
    }

    function toggleAddressSection() {
        setState(prev => ({
            ...prev,
            accordion: { ...prev.accordion, address: !prev.accordion.address }
        }));
    }

    return (
        <div className="bg-[#f4f6fa] flex items-center justify-center min-h-screen p-4 sm:p-8 font-body">
            <div className="w-full max-w-6xl mx-auto rounded-2xl overflow-hidden bg-white shadow-xl">

                <div className="relative bg-white">
                    <div className="h-52 bg-[#100636] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>

                        <button className="absolute top-6 right-6 w-9 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-lg border border-white/20 group/cam" title="Change Cover Photo">
                            <Camera className="w-4.5 h-4.5 group-hover/cam:scale-110 transition-transform" />
                        </button>
                    </div>

                    <div className="px-8 pb-8 -mt-16 relative z-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4">

                        <div className="flex flex-col items-center md:items-start group/avatar">
                            <div className="w-40 h-40 rounded-full bg-white p-1 shadow-2xl transition-transform duration-500 group-hover/avatar:scale-105 ring-[6px] ring-white relative overflow-hidden">
                                {state.admindata?.profile?.file_url ? (
                                    <img src={state.admindata.profile.file_url} alt="Photo" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center">
                                        <User className="w-16 h-16 text-slate-500" />
                                    </div>
                                )}
                                <div className="absolute bottom-0 right-3 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-end pt-16 md:pt-20">
                            <div className="flex flex-wrap items-center gap-4 absolute right-0 mr-7">
                                <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/20 flex items-center gap-2 group/btn active:scale-95 text-sm">
                                    <Settings className="w-4 h-4 transition-transform group-hover/btn:rotate-90" />
                                    Configure Settings
                                </button>

                                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 shadow-sm">
                                    <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all duration-300 group shadow-sm" title="Messages">
                                        <MessageSquareText className="w-5 h-5 group-hover:scale-110" />
                                    </button>
                                    <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all duration-300 group shadow-sm" title="Logs">
                                        <Activity className="w-5 h-5 group-hover:rotate-12" />
                                    </button>
                                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                    <button className="w-10 h-10 flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-white rounded-lg transition-all duration-300 group shadow-sm" title="Sign Out">
                                        <LogOut className="w-5 h-5 group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-4 text-center md:text-left">
                            <h1 className="font-heading font-extrabold text-3xl text-gray-800 tracking-tight leading-none">{state.admindata.first_name} {state.admindata.last_name}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                                <span className="text-green-600 text-[10px] font-bold tracking-widest uppercase py-0.5 px-3 bg-green-50 rounded-full border border-green-100 shadow-sm">{state.admindata.dept}</span>
                                <span className="text-cyan-600 text-[10px] font-bold tracking-widest uppercase py-0.5 px-3 bg-cyan-50 rounded-full border border-cyan-100 shadow-sm">{state.admindata.roll_no}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-4 space-y-4">

                    <section className="bg-slate-100/70 rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
                        <button onClick={togglePersonalSection} className="w-full flex items-center justify-between p-5 hover:bg-gray-50/80 transition-colors group">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-heading font-bold text-gray-800">Personal Information</h2>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${state.accordion.personal ? 'rotate-180' : ''}`} />
                        </button>
                        {state.accordion.personal && (
                            <div className="transition-all duration-300">
                                <div className="p-6 pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1 opacity-60">First Name</p>
                                            <p className="text-gray-900 font-semibold text-sm uppercase leading-none">{state.admindata.first_name}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1 opacity-60">Last Name</p>
                                            <p className="text-gray-900 font-semibold text-sm uppercase leading-none">{state.admindata.last_name}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1 opacity-60">Date of Birth</p>
                                            <p className="text-gray-900 font-semibold text-sm leading-none">{formatDate(state.admindata.date_of_birth)}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1 opacity-60">Gender</p>
                                            <p className="text-gray-900 font-semibold text-sm uppercase leading-none">{state.admindata.gender}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="bg-slate-100/70 rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
                        <button onClick={toggleAdminSection} className="w-full flex items-center justify-between p-5 hover:bg-gray-50/80 transition-colors group">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-heading font-bold text-gray-800">Administrative Details</h2>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${state.accordion.admin ? 'rotate-180' : ''}`} />
                        </button>
                        {state.accordion.admin && (
                            <div className="transition-all duration-300">
                                <div className="p-6 pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1 opacity-60">Admin ID</p>
                                            <p className="text-gray-900 font-semibold text-sm uppercase leading-none">{state.admindata.roll_no}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1 opacity-60">Department</p>
                                            <p className="text-gray-900 font-semibold text-sm uppercase leading-none">{state.admindata.dept}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1 opacity-60">Designation</p>
                                            <p className="text-gray-900 font-semibold text-sm uppercase leading-none">{state.admindata.position === "office" ? "Office Administrator" : state.admindata.position}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1 opacity-60">Position Type</p>
                                            <p className="text-gray-900 font-semibold text-sm uppercase leading-none">{state.admindata.position}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1 opacity-60">Access Level</p>
                                            <p className="text-gray-900 font-semibold text-sm uppercase leading-none">Super Admin</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1 opacity-60">Joining Date</p>
                                            <p className="text-gray-900 font-semibold text-sm uppercase leading-none">{formatDate(state.admindata.joining)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="bg-slate-100/70 rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
                        <button onClick={toggleContactSection} className="w-full flex items-center justify-between p-5 hover:bg-gray-50/80 transition-colors group">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-heading font-bold text-gray-800">Contact Details</h2>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${state.accordion.contact ? 'rotate-180' : ''}`} />
                        </button>
                        {state.accordion.contact && (
                            <div className="transition-all duration-300">
                                <div className="p-6 pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest mb-1 opacity-60">Contact Number</p>
                                            <p className="text-gray-900 font-semibold text-sm leading-none">{state.admindata.phone_number}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest mb-1 opacity-60">Official Email</p>
                                            <p className="text-gray-900 font-semibold text-sm lowercase leading-none">{state.admindata.college_email}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest mb-1 opacity-60">Personal Email</p>
                                            <p className="text-gray-900 font-semibold text-sm lowercase leading-none">{state.admindata.personal_email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="bg-slate-100/70 rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
                        <button onClick={toggleAddressSection} className="w-full flex items-center justify-between p-5 hover:bg-gray-50/80 transition-colors group">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-heading font-bold text-gray-800">Address & Location</h2>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${state.accordion.address ? 'rotate-180' : ''}`} />
                        </button>
                        {state.accordion.address && (
                            <div className="transition-all duration-300">
                                <div className="p-6 pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1 opacity-60">Block</p>
                                            <p className="text-gray-900 font-semibold text-sm uppercase leading-none">{state.admindata.block}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1 opacity-60">Room No</p>
                                            <p className="text-gray-900 font-semibold text-sm uppercase leading-none">{state.admindata.room_no}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300">
                                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1 opacity-60">Address Line 1</p>
                                            <p className="text-gray-900 font-semibold text-sm uppercase leading-none">{state.admindata.address_line_1}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300 lg:col-span-2">
                                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1 opacity-60">Address Line 2 (City/State/Pin)</p>
                                            <p className="text-gray-900 font-semibold text-sm uppercase leading-none">{state.admindata.address_line_2}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </div>
    );
}