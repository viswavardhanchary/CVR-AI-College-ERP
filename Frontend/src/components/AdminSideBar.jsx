import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
    LayoutDashboard, Users, ChevronDown, UserCog, ShieldCheck, GraduationCap,
    Settings2, CalendarCheck, FileSpreadsheet, CalendarDays, Briefcase, Wallet,
    Bus, Megaphone, MessageSquare, ShieldAlert, Workflow, History, LogOut, UserCircle,ExternalLink
} from "lucide-react";

export function AdminSidebar({
    uiState,
    adminData,
    expandSidebar,
    handleMobileOverlayClick,
    handleMouseEnter,
    handleMouseLeave
}) {
    const location = useLocation();
    const { type } = useParams();

    const defaultDropdowns = { access: true, academic: true, finance: true, communication: true, system: true };
    const [openDropdowns, setOpenDropdowns] = useState(defaultDropdowns);

    function handleDropdownClick(dropdownName) {
        setOpenDropdowns(prev => ({ ...prev, [dropdownName]: !prev[dropdownName] }));
    }

    function handleSidebarContainerClick() { expandSidebar(); }
    function preventFooterPropagation(e) { e.stopPropagation(); }

    function getSubMenuLinkClass(targetPath) {
        const baseClass = "menu-link flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ease-out hover:bg-white/[0.08] hover:translate-x-1 hover:brightness-110 text-white group";
        const isActive = location.pathname.includes(targetPath);
        const activeClass = isActive ? "bg-white/[0.08] brightness-110 translate-x-1 shadow-inner border border-white/10" : "";
        return `${baseClass} ${activeClass}`;
    }

    return (
        <aside
            id="sidebar"
            onClick={handleSidebarContainerClick}
            className={`bg-[#100636] text-white fixed top-16 left-0 h-[calc(100vh-4rem)] flex flex-col transition-all duration-300 ease-in-out z-40 shadow-2xl shrink-0 group/sidebar w-60
            ${uiState?.isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
            ${uiState?.isSidebarCollapsed ? "sidebar-collapsed w-20! cursor-pointer" : ""}
            overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-sm hover:[&::-webkit-scrollbar-thumb]:bg-white/40 overflow-x-hidden`}
        >
            {
                adminData && <div className="px-6 group-[.sidebar-collapsed]/sidebar:px-2 py-2 group-[.sidebar-collapsed]/sidebar:py-4 flex flex-col items-center border-b border-white/10 transition-all duration-300 shrink-0 relative overflow-hidden">
                    <div className="relative cursor-pointer group/profile mb-4" onMouseEnter={(e) => handleMouseEnter(e, `${adminData.first_name} ${adminData.last_name}`)} onMouseLeave={handleMouseLeave}>
                        <div className="profile-img w-20 h-20 group-[.sidebar-collapsed]/sidebar:w-12! group-[.sidebar-collapsed]/sidebar:h-12! group-[.sidebar-collapsed]/sidebar:mb-0 rounded-full bg-slate-700/50 p-1 transition-all duration-300 relative flex items-center justify-center overflow-hidden border border-white/20 shadow-lg">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${adminData.first_name}&backgroundColor=b6e3f4`} alt="Admin Profile" className="w-full h-full rounded-full object-cover z-10 relative" />
                        </div>
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-lg border border-white/20 z-20 whitespace-nowrap group-[.sidebar-collapsed]/sidebar:hidden transition-all duration-300 transform group-hover/profile:scale-105">
                            {adminData.position}
                        </div>
                    </div>

                    <div className="profile-text group-[.sidebar-collapsed]/sidebar:hidden text-center flex flex-col items-center w-full pb-2">
                        <h2 className="font-heading font-bold text-[18px] tracking-tight text-white drop-shadow-sm leading-tight transition-colors duration-300 z-10">{adminData.first_name} {adminData.last_name}</h2>
                        <span className="text-green-300 text-[10px] font-bold tracking-[0.2em] uppercase mt-1 drop-shadow-md">{adminData.dept}</span>
                        <span className="text-green-300 text-[10px] font-bold tracking-[0.2em] uppercase mt-1 drop-shadow-md">{adminData.roll_no}</span>

                        <div className="flex items-center gap-4 w-full justify-center mt-2">
                            <Link to={`/${type}/admin-profile/my-profile`} onClick={handleMobileOverlayClick} onMouseEnter={(e) => handleMouseEnter(e, "View Profile")} onMouseLeave={handleMouseLeave} className="p-1.5 hover:text-green-400 transition-all duration-300 group/icon">
                                <UserCircle className="w-5 h-5 transition-transform duration-300 group-hover/icon:scale-110" />
                            </Link>
                            <Link to={`/${type}/logout`} onClick={handleMobileOverlayClick} onMouseEnter={(e) => handleMouseEnter(e, "Sign Out")} onMouseLeave={handleMouseLeave} className="p-1.5 hover:text-rose-400 transition-all duration-300 group/icon">
                                <LogOut className="w-5 h-5 transition-transform duration-300 group-hover/icon:scale-110" />
                            </Link>
                        </div>
                    </div>
                </div>
            }

            <nav className="py-4 flex flex-col gap-1.5 relative">
                <Link
                    to={`/${type}/chat/ui`}
                    onClick={handleMobileOverlayClick}
                    onMouseEnter={(e) => handleMouseEnter(e, "Chat Console")}
                    onMouseLeave={handleMouseLeave}
                    className={`menu-link flex items-center gap-3 py-3 group-[.sidebar-collapsed]/sidebar:py-2 px-4 transition-all duration-300 ease-out hover:bg-white/8 hover:brightness-110 text-white group relative group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0 group-[.sidebar-collapsed]/sidebar:justify-center ${location.pathname.includes('/chat/ui') ? 'bg-white/10' : ''}`}
                >
                    <div className="flex-col flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 shrink-0 text-blue-300 drop-shadow-md stroke-[2.5] transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-100" />
                        <span className="hidden group-[.sidebar-collapsed]/sidebar:block text-[10px] text-center mt-1 px-1 opacity-80 leading-tight">Chat.</span>
                    </div>
                    <span className="nav-text group-[.sidebar-collapsed]/sidebar:hidden font-medium text-sm whitespace-nowrap">Open Chat Console </span>
                </Link>
                <Link to={`/${type}/admin-dashboard`} onClick={handleMobileOverlayClick} onMouseEnter={(e) => handleMouseEnter(e, "Admin Dashboard")} onMouseLeave={handleMouseLeave} className={`menu-link flex items-center gap-3 py-3 px-4 transition-all duration-300 ease-out hover:bg-white/8 hover:brightness-110 text-white group relative group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0 group-[.sidebar-collapsed]/sidebar:justify-center ${location.pathname.includes("admin-dashboard") ? "bg-white/8 brightness-110" : ""}`}>
                    <div className="flex-col flex items-center justify-center">
                        <LayoutDashboard className="w-5 h-5 shrink-0 text-blue-300 drop-shadow-md stroke-[2.5] transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-100" />
                        <span className="hidden group-[.sidebar-collapsed]/sidebar:block text-[10px] text-center mt-1 px-1 opacity-80 leading-tight">Dash.</span>
                    </div>
                    <span className="nav-text group-[.sidebar-collapsed]/sidebar:hidden font-medium text-sm whitespace-nowrap">Admin Dashboard</span>
                </Link>

                {/* User & Access Management */}
                <div className="relative border-t border-white/20">
                    <button onClick={() => handleDropdownClick("access")} onMouseEnter={(e) => handleMouseEnter(e, "User & Access Management")} onMouseLeave={handleMouseLeave} className="w-full flex items-center justify-between py-3 px-4 transition-all duration-300 ease-out hover:bg-white/8 focus:bg-white/8 text-white group relative group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0 group-[.sidebar-collapsed]/sidebar:justify-center">
                        <div className="flex items-center gap-3 group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0">
                            <div className="flex-col flex items-center justify-center">
                                <Users className="w-5 h-5 shrink-0 text-indigo-300 drop-shadow-md stroke-[2.5] transition-transform duration-300 group-hover:scale-110" />
                                <span className="hidden group-[.sidebar-collapsed]/sidebar:block text-[10px] text-center mt-1 px-1 opacity-80">Access</span>
                            </div>
                            <span className="nav-text group-[.sidebar-collapsed]/sidebar:hidden font-medium text-sm tracking-wide">User & Access Management</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 group-[.sidebar-collapsed]/sidebar:hidden chevron-icon mr-4 ${openDropdowns.access ? "rotate-180" : "rotate-0"}`} />
                    </button>
                    <div className={`dropdown-menu flex-col gap-1 overflow-hidden transition-all duration-300 group-[.sidebar-collapsed]/sidebar:hidden! pl-6 ${openDropdowns.access ? "flex mb-2" : "hidden"}`}>
                        <Link to={`/${type}/user-access-management/user-management`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("user-access-management/user-management")}>
                            <UserCog className="w-4 h-4 text-indigo-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">User Management</span>
                        </Link>
                        <Link to={`/${type}/user-access-management/doc-verification`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("user-access-management/doc-verification")}>
                            <ShieldCheck className="w-4 h-4 text-indigo-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Document Verification</span>
                        </Link>
                    </div>
                </div>

                {/* Academic Administration */}
                <div className="relative border-t border-white/20">
                    <button onClick={() => handleDropdownClick("academic")} onMouseEnter={(e) => handleMouseEnter(e, "Academic Administration")} onMouseLeave={handleMouseLeave} className="w-full flex items-center justify-between py-3 px-4 transition-all duration-300 ease-out hover:bg-white/8 focus:bg-white/8 text-white group relative group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0 group-[.sidebar-collapsed]/sidebar:justify-center">
                        <div className="flex items-center gap-3 group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0">
                            <div className="flex-col flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 shrink-0 text-emerald-300 drop-shadow-md stroke-[2.5] transition-transform duration-300 group-hover:scale-110" />
                                <span className="hidden group-[.sidebar-collapsed]/sidebar:block text-[10px] text-center mt-1 px-1 opacity-80">Acad.</span>
                            </div>
                            <span className="nav-text group-[.sidebar-collapsed]/sidebar:hidden font-medium text-sm tracking-wide">Academic Administration</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 group-[.sidebar-collapsed]/sidebar:hidden chevron-icon mr-4 ${openDropdowns.academic ? "rotate-180" : "rotate-0"}`} />
                    </button>
                    <div className={`dropdown-menu flex-col gap-1 overflow-hidden transition-all duration-300 group-[.sidebar-collapsed]/sidebar:hidden! pl-6 ${openDropdowns.academic ? "flex mb-2" : "hidden"}`}>
                        <Link to={`/${type}/academic-administration/academic-config`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("academic-administration/academic-config")}>
                            <Settings2 className="w-4 h-4 text-emerald-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Academic Configuration</span>
                        </Link>
                        <Link to={`/${type}/academic-administration/attendance-oversight`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("academic-administration/attendance-oversight")}>
                            <CalendarCheck className="w-4 h-4 text-emerald-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Attendance Oversight</span>
                        </Link>
                        <Link to={`/${type}/academic-administration/exam-cell`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("academic-administration/exam-cell")}>
                            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Examination Cell</span>
                        </Link>
                        <Link to={`/${type}/academic-administration/academic-calendar`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("academic-administration/academic-calendar")}>
                            <CalendarDays className="w-4 h-4 text-emerald-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Academic Calendar</span>
                        </Link>
                    </div>
                </div>

                {/* Finance & Operations */}
                <div className="relative border-t border-white/20">
                    <button onClick={() => handleDropdownClick("finance")} onMouseEnter={(e) => handleMouseEnter(e, "Finance & Operations")} onMouseLeave={handleMouseLeave} className="w-full flex items-center justify-between py-3 px-4 transition-all duration-300 hover:bg-white/8 focus:bg-white/8 text-white group relative group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0 group-[.sidebar-collapsed]/sidebar:justify-center">
                        <div className="flex items-center gap-3 group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0">
                            <div className="flex-col flex items-center justify-center">
                                <Briefcase className="w-5 h-5 shrink-0 text-amber-300 drop-shadow-md stroke-[2.5] transition-transform duration-300 group-hover:scale-110" />
                                <span className="hidden group-[.sidebar-collapsed]/sidebar:block text-[10px] text-center mt-1 px-1 opacity-80">Ops.</span>
                            </div>
                            <span className="nav-text group-[.sidebar-collapsed]/sidebar:hidden font-medium text-sm tracking-wide">Finance & Operations</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 group-[.sidebar-collapsed]/sidebar:hidden chevron-icon mr-4 ${openDropdowns.finance ? "rotate-180" : "rotate-0"}`} />
                    </button>
                    <div className={`dropdown-menu flex-col gap-1 overflow-hidden transition-all duration-300 group-[.sidebar-collapsed]/sidebar:hidden! pl-6 ${openDropdowns.finance ? "flex mb-2" : "hidden"}`}>
                        <Link to={`/${type}/finance-operations/financial-hub`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("finance-operations/financial-hub")}>
                            <Wallet className="w-4 h-4 text-amber-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Financial Hub</span>
                        </Link>
                        <Link to={`/${type}/finance-operations/transport-logistics`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("finance-operations/transport-logistics")}>
                            <Bus className="w-4 h-4 text-amber-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Transport & Logistics</span>
                        </Link>
                    </div>
                </div>

                {/* Communication */}
                <div className="relative border-t border-white/20">
                    <button onClick={() => handleDropdownClick("communication")} onMouseEnter={(e) => handleMouseEnter(e, "Communication")} onMouseLeave={handleMouseLeave} className="w-full flex items-center justify-between py-3 px-4 transition-all duration-300 hover:bg-white/8 focus:bg-white/8 text-white group relative group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0 group-[.sidebar-collapsed]/sidebar:justify-center">
                        <div className="flex items-center gap-3 group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0">
                            <div className="flex-col flex items-center justify-center">
                                <Megaphone className="w-5 h-5 shrink-0 text-violet-300 drop-shadow-md stroke-[2.5] transition-transform duration-300 group-hover:scale-110" />
                                <span className="hidden group-[.sidebar-collapsed]/sidebar:block text-[10px] text-center mt-1 px-1 opacity-80">Comm.</span>
                            </div>
                            <span className="nav-text group-[.sidebar-collapsed]/sidebar:hidden font-medium text-sm tracking-wide">Communication</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 group-[.sidebar-collapsed]/sidebar:hidden chevron-icon mr-4 ${openDropdowns.communication ? "rotate-180" : "rotate-0"}`} />
                    </button>
                    <div className={`dropdown-menu flex-col gap-1 overflow-hidden transition-all duration-300 group-[.sidebar-collapsed]/sidebar:hidden! pl-6 ${openDropdowns.communication ? "flex mb-2" : "hidden"}`}>
                        <Link to={`/${type}/communication/comm-center`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("communication/comm-center")}>
                            <MessageSquare className="w-4 h-4 text-violet-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">Communication Center</span>
                        </Link>
                    </div>
                </div>

                {/* System Management */}
                <div className="relative border-t border-white/20">
                    <button onClick={() => handleDropdownClick("system")} onMouseEnter={(e) => handleMouseEnter(e, "System Management")} onMouseLeave={handleMouseLeave} className="w-full flex items-center justify-between py-3 px-4 transition-all duration-300 hover:bg-white/8 focus:bg-white/8 text-white group relative group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0 group-[.sidebar-collapsed]/sidebar:justify-center">
                        <div className="flex items-center gap-3 group-[.sidebar-collapsed]/sidebar:flex-col group-[.sidebar-collapsed]/sidebar:gap-0">
                            <div className="flex-col flex items-center justify-center">
                                <ShieldAlert className="w-5 h-5 shrink-0 text-pink-300 drop-shadow-md stroke-[2.5] transition-transform duration-300 group-hover:scale-110" />
                                <span className="hidden group-[.sidebar-collapsed]/sidebar:block text-[10px] text-center mt-1 px-1 opacity-80">Sys.</span>
                            </div>
                            <span className="nav-text group-[.sidebar-collapsed]/sidebar:hidden font-medium text-sm tracking-wide">System Management</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 group-[.sidebar-collapsed]/sidebar:hidden chevron-icon mr-4 ${openDropdowns.system ? "rotate-180" : "rotate-0"}`} />
                    </button>
                    <div className={`dropdown-menu flex-col gap-1 overflow-hidden transition-all duration-300 group-[.sidebar-collapsed]/sidebar:hidden! pl-6 ${openDropdowns.system ? "flex mb-2" : "hidden"}`}>
                        <Link to={`/${type}/system-management/workflows`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("system-management/workflows")}>
                            <Workflow className="w-4 h-4 text-pink-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">System Workflows</span>
                        </Link>
                        <Link to={`/${type}/system-management/system-logs`} onClick={handleMobileOverlayClick} className={getSubMenuLinkClass("system-management/system-logs")}>
                            <History className="w-4 h-4 text-pink-300" />
                            <span className="nav-text font-medium text-sm whitespace-nowrap">System Logs & Security</span>
                        </Link>
                    </div>
                </div>

            </nav>
            <div className="p-2 group-[.sidebar-collapsed]/sidebar:pb-8 border-t border-white/20 bg-[#100636] shrink-0 relative z-50" onClick={preventFooterPropagation}>
                <Link
                    to={`/${type}/logout`}
                    onMouseEnter={(e) => handleMouseEnter(e, "Sign Out")}
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
        </aside >
    );
}