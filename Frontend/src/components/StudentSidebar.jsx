import { Link, useLocation, useParams } from "react-router-dom";
import {
    ChevronDown, UserCircle, User, CloudUpload,
    GraduationCap, Pen, BookOpenCheck, FileSpreadsheet, FileText, CalendarDays, Clock, Trophy,
    Megaphone, BellRing, PartyPopper, LifeBuoy, Bus, Wallet, FilePlus, LogOut, Contact, LayoutDashboard
} from "lucide-react";

export function StudentSidebar({
    uiState,
    expandSidebar,
    openDropdowns,
    handleDropdownClick,
    handleMobileOverlayClick,
    userdata,
    handleMouseEnter,
    handleMouseLeave
}) {
    const location = useLocation();
    const { type } = useParams();

    function getSubMenuLinkClass(targetPath) {
        const baseClass = "menu-link flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ease-out hover:bg-white/[0.08] hover:translate-x-1.5 hover:brightness-110 text-white group";
        const isActive = location.pathname.includes(targetPath);
        const activeClass = isActive ? "!bg-white/20 backdrop-blur-md !text-white shadow-inner border border-white/10 brightness-110 translate-x-1" : "";
        return `${baseClass} ${activeClass}`;
    }

    function handleSidebarContainerClick() {
        expandSidebar();
    }

    function preventFooterPropagation(e) {
        e.stopPropagation();
    }

    function toggleDropdown(name) { handleDropdownClick(name); }

    const hovers = {
        profile: (e) => handleMouseEnter(e, `${userdata.first_name} ${userdata.last_name}`),
        profileView: (e) => handleMouseEnter(e, "View Profile"),
        signOut: (e) => handleMouseEnter(e, "Sign Out"),
        dashboard: (e) => handleMouseEnter(e, "My Dashboard"),
        profileMenu: (e) => handleMouseEnter(e, "Profile"),
        academics: (e) => handleMouseEnter(e, "Academics"),
        announcements: (e) => handleMouseEnter(e, "Announcements"),
        services: (e) => handleMouseEnter(e, "Services"),
        requests: (e) => handleMouseEnter(e, "Requests")
    };

    return (
        <aside
            id="sidebar"
            onClick={handleSidebarContainerClick}
            className={`bg-[#051F3E] text-white fixed top-16 left-0 h-[calc(100vh-4rem)] flex flex-col transition-all duration-300 ease-in-out z-40 shadow-2xl shrink-0 group/sidebar w-60
            ${uiState?.isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
            ${uiState?.isSidebarCollapsed ? "sidebar-collapsed w-20! cursor-pointer" : ""}
            overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-sm hover:[&::-webkit-scrollbar-thumb]:bg-white/40 overflow-x-hidden`}
        >
            {/* Profile Section */}
            {userdata && <div className="px-6 group-[.sidebar-collapsed]/sidebar:px-2 py-2 group-[.sidebar-collapsed]/sidebar:py-4 flex flex-col items-center border-b border-white/10 transition-all duration-300 shrink-0 relative">
                <div
                    className="relative cursor-pointer group/profile mb-4"
                    onMouseEnter={hovers.profile}
                    onMouseLeave={handleMouseLeave}
                >
                    <Link to={`/${type}/profile/my-profile`} onClick={handleMobileOverlayClick} className="profile-img w-20 h-20 group-[.sidebar-collapsed]/sidebar:w-12! group-[.sidebar-collapsed]/sidebar:h-12! group-[.sidebar-collapsed]/sidebar:mb-0 rounded-full bg-slate-700/50 p-1 transition-all duration-300 relative flex items-center justify-center overflow-hidden border border-white/20 shadow-lg">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userdata.first_name}&backgroundColor=b6e3f4`} alt="Student Profile" className="w-full h-full rounded-full object-cover z-10 relative" />
                    </Link>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-blue-700 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-lg border border-white/20 z-20 whitespace-nowrap group-[.sidebar-collapsed]/sidebar:hidden transition-all duration-300 transform group-hover/profile:scale-105">
                        {userdata.batch} — {userdata.batch + 4}
                    </div>
                </div>

                <div className="profile-text group-[.sidebar-collapsed]/sidebar:hidden text-center flex flex-col items-center w-full pb-2">
                    <h2 className="font-heading font-bold text-[18px] tracking-tight text-white drop-shadow-sm leading-tight transition-colors duration-300 z-10">{userdata.first_name} {userdata.last_name}</h2>
                    <span className="text-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase mt-1 drop-shadow-md">CSE Dept</span>
                    <span className="text-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase mt-1 drop-shadow-md">{userdata.roll_no}</span>

                    <div className="flex items-center gap-4 w-full justify-center mt-2">
                        <Link
                            to={`/${type}/profile/my-profile`}
                            onClick={handleMobileOverlayClick}
                            onMouseEnter={hovers.profileView}
                            onMouseLeave={handleMouseLeave}
                            className="p-2 hover:text-emerald-400 transition-all duration-300 group/icon"
                        >
                            <UserCircle className="w-5 h-5 transition-transform duration-300 group-hover/icon:scale-110" />
                        </Link>
                        <Link
                            to={`/${type}/logout`}
                            onClick={handleMobileOverlayClick}
                            onMouseEnter={hovers.signOut}
                            onMouseLeave={handleMouseLeave}
                            className="p-2 hover:text-rose-400 transition-all duration-300 group/icon"
                        >
                            <LogOut className="w-5 h-5 transition-transform duration-300 group-hover/icon:scale-110" />
                        </Link>
                    </div>
                </div>
            </div>}

            {/* Navigation Menu */}
            <nav className="py-4 flex flex-col gap-1.5 relative">

                {/* Dashboard */}
                <Link
                    to={`/${type}/student-dashboard`}
                    onClick={handleMobileOverlayClick}
                    onMouseEnter={hovers.dashboard}
                    onMouseLeave={handleMouseLeave}
                    className={`menu-link flex items-center gap-3 py-3 group-[.sidebar-collapsed]/sidebar:py-2 px-4 transition-all duration-300 ease-out hover:bg-white/8 hover:brightness-110 text-white group relative group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0 group-[.sidebar-collapsed]/sidebar:justify-center ${location.pathname.includes('/dashboard') ? 'bg-white/10' : ''}`}
                >
                    <div className="flex-col flex items-center justify-center">
                        <LayoutDashboard className="w-5 h-5 shrink-0 text-blue-300 drop-shadow-md stroke-[2.5] transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-100" />
                        <span className="hidden group-[.sidebar-collapsed]/sidebar:block text-[10px] text-center mt-1 px-1 opacity-80 leading-tight">Dash.</span>
                    </div>
                    <span className="nav-text group-[.sidebar-collapsed]/sidebar:hidden font-medium text-sm whitespace-nowrap">My Dashboard</span>
                </Link>

                {/* Profile Section */}
                <div className="relative border-t border-white/20">
                    <button onClick={() => toggleDropdown("profile")} onMouseEnter={hovers.profileMenu} onMouseLeave={handleMouseLeave} className="w-full flex items-center justify-between py-3 px-4 transition-all duration-300 hover:bg-white/8 text-white group relative group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0 group-[.sidebar-collapsed]/sidebar:justify-center">
                        <div className="flex items-center gap-3 group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0">
                            <div className="flex-col flex items-center justify-center">
                                <UserCircle className="w-5 h-5 shrink-0 text-indigo-300 drop-shadow-md stroke-[2.5] transition-transform duration-300 group-hover:scale-110" />
                                <span className="hidden group-[.sidebar-collapsed]/sidebar:block text-[10px] text-center mt-1 px-1 opacity-80">Profile</span>
                            </div>
                            <span className="nav-text group-[.sidebar-collapsed]/sidebar:hidden font-medium text-sm tracking-wide ">Profile</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 group-[.sidebar-collapsed]/sidebar:hidden chevron-icon mr-4 ${openDropdowns?.profile ? "rotate-180" : "rotate-0"}`} />
                    </button>
                    <div className={`dropdown-menu flex-col gap-1 overflow-hidden transition-all duration-300 group-[.sidebar-collapsed]/sidebar:hidden! pl-6 ${openDropdowns?.profile ? "flex mb-2" : "hidden"}`}>
                        <Link to={`/${type}/profile/my-profile`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("profile/my-profile")}>
                            <User className="w-4 h-4 text-indigo-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">My Profile</span>
                        </Link>
                        <Link to={`/${type}/profile/upload-docs`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("profile/upload-docs")}>
                            <CloudUpload className="w-4 h-4 text-cyan-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Upload Documents</span>
                        </Link>
                    </div>
                </div>

                {/* Academics Section */}
                <div className="relative border-t border-white/20">
                    <button onClick={() => toggleDropdown("academics")} onMouseEnter={hovers.academics} onMouseLeave={handleMouseLeave} className="w-full flex items-center justify-between py-3 px-4 transition-all duration-300 hover:bg-white/8 text-white group relative group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0 group-[.sidebar-collapsed]/sidebar:justify-center">
                        <div className="flex items-center gap-3 group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0">
                            <div className="flex-col flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 shrink-0 text-emerald-300 drop-shadow-md stroke-[2.5] transition-transform duration-300 group-hover:scale-110" />
                                <span className="hidden group-[.sidebar-collapsed]/sidebar:block text-[10px] text-center mt-1 px-1 opacity-80">Acad.</span>
                            </div>
                            <span className="nav-text group-[.sidebar-collapsed]/sidebar:hidden font-medium text-sm tracking-wide ">Academics</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 group-[.sidebar-collapsed]/sidebar:hidden chevron-icon mr-4 ${openDropdowns.academics ? "rotate-180" : "rotate-0"}`} />
                    </button>
                    <div className={`dropdown-menu flex-col gap-1 overflow-hidden transition-all duration-300 group-[.sidebar-collapsed]/sidebar:hidden! pl-6 ${openDropdowns.academics ? "flex mb-2" : "hidden"}`}>
                        <Link to={`/${type}/academics/attendance`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("academics/attendance")}>
                            <Pen className="w-4 h-4 text-emerald-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Attendance Overview</span>
                        </Link>
                        <Link to={`/${type}/academics/assignments`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("academics/assignments")}>
                            <BookOpenCheck className="w-4 h-4 text-orange-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Assignments</span>
                        </Link>
                        <Link to={`/${type}/academics/exam-info`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("academics/exam-info")}>
                            <FileSpreadsheet className="w-4 h-4 text-violet-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Exam Information</span>
                        </Link>
                        <Link to={`/${type}/academics/results`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("academics/results")}>
                            <FileText className="w-4 h-4 text-fuchsia-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Results</span>
                        </Link>
                        <Link to={`/${type}/academics/calendar`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("academics/calendar")}>
                            <CalendarDays className="w-4 h-4 text-teal-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Academic Calendar</span>
                        </Link>
                        <Link to={`/${type}/academics/timetable`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("academics/timetable")}>
                            <Clock className="w-4 h-4 text-cyan-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Timetable</span>
                        </Link>
                        <Link to={`/${type}/academics/achievements`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("academics/achievements")}>
                            <Trophy className="w-4 h-4 text-amber-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Achievements</span>
                        </Link>
                    </div>
                </div>

                {/* Announcements Section */}
                <div className="relative border-t border-white/20">
                    <button onClick={() => toggleDropdown("announcements")} onMouseEnter={hovers.announcements} onMouseLeave={handleMouseLeave} className="w-full flex items-center justify-between py-3 px-4 transition-all duration-300 hover:bg-white/8 text-white group relative group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0 group-[.sidebar-collapsed]/sidebar:justify-center">
                        <div className="flex items-center gap-3 group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0">
                            <div className="flex-col flex items-center justify-center">
                                <Megaphone className="w-5 h-5 shrink-0 text-amber-300 drop-shadow-md stroke-[2.5] transition-transform duration-300 group-hover:scale-110" />
                                <span className="hidden group-[.sidebar-collapsed]/sidebar:block text-[10px] text-center mt-1 px-1 opacity-80">Announ.</span>
                            </div>
                            <span className="nav-text group-[.sidebar-collapsed]/sidebar:hidden font-medium text-sm tracking-wide">Announcements</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 group-[.sidebar-collapsed]/sidebar:hidden chevron-icon mr-4 ${openDropdowns.announcements ? "rotate-180" : "rotate-0"}`} />
                    </button>
                    <div className={`dropdown-menu flex-col gap-1 overflow-hidden transition-all duration-300 group-[.sidebar-collapsed]/sidebar:hidden! pl-6 ${openDropdowns.announcements ? "flex mb-2" : "hidden"}`}>
                        <Link to={`/${type}/announcements/circulars`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("announcements/circulars")}>
                            <BellRing className="w-4 h-4 text-amber-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Circulars & Notifications</span>
                        </Link>
                        <Link to={`/${type}/announcements/events`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("announcements/events")}>
                            <PartyPopper className="w-4 h-4 text-rose-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Events</span>
                        </Link>
                    </div>
                </div>

                {/* Services Section */}
                <div className="relative border-t border-white/20">
                    <button onClick={() => toggleDropdown("services")} onMouseEnter={hovers.services} onMouseLeave={handleMouseLeave} className="w-full flex items-center justify-between py-3 px-4 transition-all duration-300 hover:bg-white/8 text-white group relative group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0 group-[.sidebar-collapsed]/sidebar:justify-center">
                        <div className="flex items-center gap-3 group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0">
                            <div className="flex-col flex items-center justify-center">
                                <LifeBuoy className="w-5 h-5 shrink-0 text-yellow-300 drop-shadow-md stroke-[2.5] transition-transform duration-300 group-hover:scale-110" />
                                <span className="hidden group-[.sidebar-collapsed]/sidebar:block text-[10px] text-center mt-1 px-1 opacity-80">Serv.</span>
                            </div>
                            <span className="nav-text group-[.sidebar-collapsed]/sidebar:hidden font-medium text-sm tracking-wide">Services</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 group-[.sidebar-collapsed]/sidebar:hidden chevron-icon mr-4 ${openDropdowns.services ? "rotate-180" : "rotate-0"}`} />
                    </button>
                    <div className={`dropdown-menu flex-col gap-1 overflow-hidden transition-all duration-300 group-[.sidebar-collapsed]/sidebar:hidden! pl-6 ${openDropdowns.services ? "flex mb-2" : "hidden"}`}>
                        <Link to={`/${type}/services/transport`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("services/transport")}>
                            <Bus className="w-4 h-4 text-yellow-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Transport</span>
                        </Link>
                        <Link to={`/${type}/services/fee`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("services/fee")}>
                            <Wallet className="w-4 h-4 text-emerald-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Fee Overview</span>
                        </Link>
                    </div>
                </div>

                {/* Requests Section */}
                <div className="relative border-t border-white/20">
                    <button onClick={() => toggleDropdown("requests")} onMouseEnter={hovers.requests} onMouseLeave={handleMouseLeave} className="w-full flex items-center justify-between py-3 px-4 transition-all duration-300 hover:bg-white/8 text-white group relative group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0 group-[.sidebar-collapsed]/sidebar:justify-center">
                        <div className="flex items-center gap-3 group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0">
                            <div className="flex-col flex items-center justify-center">
                                <FilePlus className="w-5 h-5 shrink-0 text-pink-300 drop-shadow-md stroke-[2.5] transition-transform duration-300 group-hover:scale-110" />
                                <span className="hidden group-[.sidebar-collapsed]/sidebar:block text-[10px] text-center mt-1 px-1 opacity-80">Req.</span>
                            </div>
                            <span className="nav-text group-[.sidebar-collapsed]/sidebar:hidden font-medium text-sm tracking-wide">Requests</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 group-[.sidebar-collapsed]/sidebar:hidden chevron-icon mr-4 ${openDropdowns.requests ? "rotate-180" : "rotate-0"}`} />
                    </button>
                    <div className={`dropdown-menu flex-col gap-1 overflow-hidden transition-all duration-300 group-[.sidebar-collapsed]/sidebar:hidden! pl-6 ${openDropdowns.requests ? "flex mb-2" : "hidden"}`}>
                        <Link to={`/${type}/requests/out-pass`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("requests/out-pass")}>
                            <LogOut className="w-4 h-4 text-lime-300 rotate-90" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Out Pass</span>
                        </Link>
                        <Link to={`/${type}/requests/id-card`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("requests/id-card")}>
                            <Contact className="w-4 h-4 text-lime-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">ID Card</span>
                        </Link>
                        <Link to={`/${type}/requests/leave`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("requests/leave")}>
                            <FileText className="w-4 h-4 text-blue-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Leave Application</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Footer Actions */}
            <div className="p-2 group-[.sidebar-collapsed]/sidebar:pb-8 border-t border-white/20 bg-[#051F3E] shrink-0 relative z-50" onClick={preventFooterPropagation}>
                <Link
                    to={`/${type}/logout`}
                    onMouseEnter={hovers.signOut}
                    onMouseLeave={handleMouseLeave}
                    className="flex mt-1 items-center gap-3 px-3 py-2.5 mx-2 group-[.sidebar-collapsed]/sidebar:mx-0 rounded-xl transition-all duration-300 ease-out hover:bg-red-500/80 text-white group relative group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0 group-[.sidebar-collapsed]/sidebar:justify-center"
                >
                    <div className="flex-col flex items-center justify-center">
                        <LogOut className="w-5 h-5 shrink-0 text-red-300 drop-shadow-md stroke-[2.5] transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-white relative z-10" />
                        <span className="hidden group-[.sidebar-collapsed]/sidebar:block text-[8px] text-center mt-1 px-1 opacity-80">Sign out</span>
                    </div>
                    <span className="nav-text group-[.sidebar-collapsed]/sidebar:hidden font-medium text-sm whitespace-nowrap relative z-10">Sign Out</span>
                </Link>
            </div>
        </aside>
    );
}