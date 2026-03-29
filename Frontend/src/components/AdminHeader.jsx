import { useState } from "react";
import { Menu, MessageSquare, Bell, Settings, User, ChevronRight } from "lucide-react";

export function AdminHeader({ adminData, handleSidebarToggle, handleMouseEnter, handleMouseLeave, collegeData }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    const onMessagesEnter = (e) => handleMouseEnter(e, "Messages", "bottom");
    const onNotificationsEnter = (e) => handleMouseEnter(e, "Notifications", "bottom");
    const onProfileEnter = (e) => handleMouseEnter(e, "User Settings", "bottom");
    const handleImageError = (e) => {
        e.currentTarget.src = 'https://ui-avatars.com/api/?name=CVR&background=0D8ABC&color=fff';
    };

    return (
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 border-b border-gray-200 relative">
           {/* Left Section */}
            <div className="flex items-center gap-2">
                <button
                    onClick={handleSidebarToggle}
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
                        src={collegeData?.image?.[0]?.file_url}
                        alt="College Logo"
                        onError={handleImageError}
                        className="w-full h-full object-contain p-1"
                    />
                </div>
                <span className="font-heading font-bold text-slate-700 tracking-wide text-[10px] sm:text-lg uppercase truncate max-w-37.5 sm:max-w-none">
                    CVR COLLEGE of engineering
                </span>
            </div>

            <div className="flex items-center gap-2">
                {/* Desktop View Icons */}
                <div className="hidden md:flex items-center gap-4">
                    <button onMouseEnter={onMessagesEnter} onMouseLeave={handleMouseLeave} className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                        <MessageSquare className="w-5 h-5 stroke-2" />
                        <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full">0</span>
                    </button>
                    <button onMouseEnter={onNotificationsEnter} onMouseLeave={handleMouseLeave} className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                        <Bell className="w-5 h-5 stroke-2" />
                        <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full">1</span>
                    </button>
                    <div onMouseEnter={onProfileEnter} onMouseLeave={handleMouseLeave} className="w-10 h-10 rounded-full border-2 border-blue-100 overflow-hidden cursor-pointer hover:border-blue-300 transition-colors">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${adminData?.first_name}&backgroundColor=b6e3f4`} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Mobile Settings Toggle */}
                <div className="md:hidden">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`p-2 rounded-lg transition-all ${isMobileMenuOpen ? 'bg-blue-600 text-white' : 'text-blue-600 bg-blue-50 border border-blue-100'}`}
                    >
                        <Settings className="w-6 h-6" />
                    </button>

                    {isMobileMenuOpen && (
                        <MobileDropdown 
                            userData={adminData} 
                            onClose={() => setIsMobileMenuOpen(false)}
                            role="Administrator"
                        />
                    )}
                </div>
            </div>
        </header>
    );
}

function MobileDropdown({ userData, onClose, role }) {
    return (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Profile Header */}
            <div className="px-5 py-3 mb-2 flex items-center gap-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full border-2 border-blue-100 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.first_name}&backgroundColor=b6e3f4`} alt="Avatar" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 leading-tight">{userData?.first_name || 'User'}</span>
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{role}</span>
                </div>
            </div>
            
            <div className="flex flex-col gap-1">
                <MobileItem icon={<MessageSquare size={18} />} label="Messages" count={0} />
                <MobileItem icon={<Bell size={18} />} label="Notifications" count={1} />
                <MobileItem icon={<User size={18} />} label="Profile Settings" />
            </div>

            <div className="mt-3 px-4 pt-2 border-t border-gray-100">
                <button className="w-full py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    Log Out
                </button>
            </div>
        </div>
    );
}

function MobileItem({ icon, label, count }) {
    return (
        <button className="w-[92%] mx-auto flex items-center justify-between px-4 py-3 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 group transition-all">
            <div className="flex items-center gap-4">
                <span className="p-2 rounded-lg bg-gray-50 group-hover:bg-blue-100 transition-colors">{icon}</span>
                <span className="text-sm font-semibold">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {count > 0 && (
                    <span className="h-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                        {count}
                    </span>
                )}
                <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-300" />
            </div>
        </button>
    );
}