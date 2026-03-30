import { useState } from "react";
import { Menu, MessageSquare, Bell, Settings, User, ChevronRight } from "lucide-react";

export function StudentHeader({ userdata, onToggleSidebar, handleMouseEnter, handleMouseLeave, collegeData }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    function handleImageError(e) {
        e.currentTarget.src = 'https://ui-avatars.com/api/?name=CVR&background=0D8ABC&color=fff';
    }

    // --- Your original hover logic functions ---
    function onMessagesEnter(e) {
        handleMouseEnter(e, "Messages", "bottom");
    }

    function onNotificationsEnter(e) {
        handleMouseEnter(e, "Notifications", "bottom");
    }

    function onProfileEnter(e) {
        handleMouseEnter(e, "User Settings", "bottom");
    }

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <header className="h-16 flex items-center justify-between px-2 lg:px-4 shrink-0 z-50 border-b-2 border-blue-100/60 shadow-sm bg-gray-200 relative">

            {/* Left Section */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onToggleSidebar}
                    className="cursor-pointer rounded-full text-slate-600 hover:bg-blue-400/80 hover:text-white transition-all duration-300 p-2"
                >
                    <Menu className="w-5 h-5 stroke-[2.5]" />
                </button>
                <span className="font-heading font-extrabold text-lg text-slate-800 tracking-tight hidden md:block">
                    CampusFlow
                </span>
            </div>

            {/* Middle Section: College Info */}
            <div className="flex items-center gap-2 justify-center sm:justify-start sm:px-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-blue-100 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                    <img
                        src={collegeData?.logo?.file_url}
                        alt="College Logo"
                        onError={handleImageError}
                        className="w-full h-full object-contain p-1"
                    />
                </div>
                <span className="font-heading font-bold text-slate-700 tracking-wide text-[10px] sm:text-lg uppercase truncate max-w-37.5 sm:max-w-none">
                    CVR COLLEGE of engineering
                </span>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">

                <div className="hidden md:flex items-center gap-3">
                    <button
                        onMouseEnter={onMessagesEnter}
                        onMouseLeave={handleMouseLeave}
                        className="relative p-2 text-slate-500 hover:bg-blue-100/60 hover:text-blue-700 rounded-full transition-all"
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">0</span>
                    </button>

                    <button
                        onMouseEnter={onNotificationsEnter}
                        onMouseLeave={handleMouseLeave}
                        className="relative p-2 text-slate-500 hover:bg-blue-100/60 hover:text-blue-700 rounded-full transition-all"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">1</span>
                    </button>

                    <div
                        onMouseEnter={onProfileEnter}
                        onMouseLeave={handleMouseLeave}
                        className="w-10 h-10 rounded-full border-2 border-blue-200 hover:border-blue-500 overflow-hidden cursor-pointer transition-all"
                    >
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userdata?.first_name}`} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Mobile View: Settings Toggle */}
                <div className="md:hidden relative">
                    <button
                        onClick={toggleMobileMenu}
                        className={`p-2 rounded-full transition-all ${isMobileMenuOpen ? 'bg-blue-500 text-white' : 'text-slate-600 bg-white/50'}`}
                    >
                        <Settings className="w-6 h-6" />
                    </button>

                    {/* Dropdown Menu */}
                    {/* Dropdown Menu inside StudentHeader */}
                    {isMobileMenuOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-gray-50/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">

                            {/* User Identity Header */}
                            <div className="px-5 py-3 mb-2 flex items-center gap-3 border-b border-gray-200/50">
                                <div className="w-10 h-10 rounded-full border-2 border-blue-200 overflow-hidden">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userdata?.first_name}`}
                                        alt="Profile"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-800 leading-tight">
                                        {userdata?.first_name || 'Student'}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-medium">Student Account</span>
                                </div>
                            </div>

                            {/* Menu Actions */}
                            <div className="flex flex-col">
                                <MobileMenuItem
                                    icon={<MessageSquare size={18} className="stroke-[2.5]" />}
                                    label="Messages"
                                    count={0}
                                />
                                <MobileMenuItem
                                    icon={<Bell size={18} className="stroke-[2.5]" />}
                                    label="Notifications"
                                    count={1}
                                />
                                <MobileMenuItem
                                    icon={<User size={18} className="stroke-[2.5]" />}
                                    label="User Settings"
                                />
                            </div>

                            {/* Optional: Logout Footer */}
                            <div className="mt-2 px-4">
                                <button className="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

function MobileMenuItem({ icon, label, count, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-[92%] mx-auto flex items-center justify-between px-4 py-3 mb-1 
                       rounded-xl text-slate-700 transition-all duration-200
                       hover:bg-blue-50 hover:text-blue-700 group"
        >
            <div className="flex items-center gap-4">
                {/* Icon Container with subtle background */}
                <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-colors">
                    {icon}
                </div>
                <span className="text-sm font-semibold tracking-tight">{label}</span>
            </div>

            <div className="flex items-center gap-2">
                {count !== undefined && count > 0 && (
                    <span className="flex items-center justify-center min-w-5 h-5 px-1.5 
                                   text-[10px] font-bold text-white bg-red-500 rounded-full shadow-sm">
                        {count}
                    </span>
                )}
                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
            </div>
        </button>
    );
}