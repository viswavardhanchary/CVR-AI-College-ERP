import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { StudentHeader } from "../components/StudentHeader";
import { StudentSidebar } from "../components/StudentSidebar";
import { Outlet, useLocation, useNavigate, useParams, Link } from "react-router-dom"; 
import { verify } from "../services/verification.services";
import { Toast } from '../components/Toast';
import { Footer } from "../components/Footer";

export function StudentDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { type } = useParams();
    const defaultFilters = {
        loading: false,
        toast: { message: '', status: false, type: '' },
        refresh: false,
        navigate: { url: '', status: false }
    }
    const [filters, setFilters] = useState(defaultFilters);

    // Initial state setup to match Tailwind's breakpoints
    const [uiState, setUiState] = useState(() => {
        const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
        return {
            isSidebarCollapsed: width >= 640 && width < 768, // Collapsed to icons between sm and md
            isSidebarOpen: false,
        };
    });

    const defaultDropdowns = {
        profile: true, academics: true, announcements: true, services: true, requests: true
    };

    const defaultTooltipState = { visible: false, text: "", top: 0, left: 0, position: "right" };

    const [openDropdowns, setOpenDropdowns] = useState(defaultDropdowns);
    const [tooltip, setTooltip] = useState(defaultTooltipState);
    const [user, setUser] = useState(null);
    const [collegeData, setCollegeData] = useState(null);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        getDetails();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function handleResize() {
        const width = window.innerWidth;
        if (width < 640) {
            // Below sm: Hide completely
            setUiState(prev => (prev.isSidebarCollapsed || prev.isSidebarOpen ? { ...prev, isSidebarOpen: false, isSidebarCollapsed: false } : prev));
        } else if (width < 768) {
            // Below md (sm to md): Show only logos automatically
            setUiState(prev => (!prev.isSidebarCollapsed ? { ...prev, isSidebarCollapsed: true, isSidebarOpen: false } : prev));
        } else {
            // md and above: Ensure it scales properly based on your preference
            setUiState(prev => (prev.isSidebarCollapsed ? { ...prev, isSidebarCollapsed: false } : prev));
        }
    }

    const getDetails = async () => {
        setFilters({ ...filters, loading: true });
        const response = await verify(location, type);
        if (response.status) {
            if (response.redirectURL) {
                navigate(response.redirectURL, { replace: true });
            }
            setUser(response.user);
            setCollegeData(response.college);
            setFilters({ ...filters, loading: false });
        } else if (response.error) {
            setFilters({
                ...filters, loading: false,
                toast: { message: response.message, status: true, type: 'error' },
                refresh: true
            });
        } else {
            setFilters({
                ...filters, loading: false,
                toast: { message: response.message, status: true, type: 'info' },
                navigate: { status: true, url: response.redirectURL },
            });
        }
    }

    function onClose() {
        setFilters({
            ...filters,
            toast: { message: "", status: false, type: '' },
        });
    }

    function handleDropdownClick(dropdownName) {
        setOpenDropdowns(prev => ({ ...prev, [dropdownName]: !prev[dropdownName] }));
    }

    function handleToggleSidebar() {
        if (window.innerWidth < 640) {
            setUiState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }));
        } else {
            setUiState(prev => ({ ...prev, isSidebarCollapsed: !prev.isSidebarCollapsed }));
        }
    }

    function expandSidebar() {
        if (uiState.isSidebarCollapsed) {
            setUiState(prev => ({ ...prev, isSidebarCollapsed: false }));
        }
    }

    function handleMobileOverlayClick() {
        if (window.innerWidth < 640) {
            setUiState(prev => ({ ...prev, isSidebarOpen: false }));
        } else if (window.innerWidth < 1024) {
            // Also collapse the sidebar if clicking the overlay on md/tablet screens
            setUiState(prev => ({ ...prev, isSidebarCollapsed: true }));
        }
    }

    function handleMouseEnter(e, text, position = "right") {
        const isHeaderItem = e.currentTarget.closest('header');
        if (!uiState.isSidebarCollapsed && !isHeaderItem) return;

        const rect = e.currentTarget.getBoundingClientRect();
        if (position === "bottom") {
            setTooltip({ visible: true, text, top: rect.bottom + 8, left: rect.left + rect.width / 2, position: "bottom" });
        } else {
            setTooltip({ visible: true, text, top: rect.top + rect.height / 2, left: rect.right + 6, position: "right" });
        }
    }

    function handleMouseLeave() {
        setTooltip(prev => ({ ...prev, visible: false }));
    }

    return (
        <div className="">
            {filters.toast.status &&
                <div className="mb-3">
                    <Toast message={filters.toast.message} type={filters.toast.type} onClose={onClose} />
                </div>
            }

            {filters.refresh && <div className="mb-3">Refresh....</div>}

            {filters.navigate.status &&
                <div className="mb-3">
                    Redirecting to <Link to={filters.navigate.url} className="underline text-blue-600">{filters.navigate.url}</Link> in a second
                </div>
            }

            {!filters.loading && !filters.refresh && !filters.navigate.status && user && collegeData &&
                <div className="bg-gray-50 h-screen overflow-hidden font-body relative">

                    <StudentHeader
                        userdata={user}
                        onToggleSidebar={handleToggleSidebar}
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        collegeData={collegeData}
                    />

                    <div className="flex h-full">

                        {/* Mobile & Tablet Overlay Background when hovering */}
                        {((uiState.isSidebarOpen && window.innerWidth < 640) || 
                          (!uiState.isSidebarCollapsed && window.innerWidth >= 640 && window.innerWidth < 1024)) && (
                            <div 
                                className="fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity"
                                onClick={handleMobileOverlayClick}
                            />
                        )}

                        <StudentSidebar
                            uiState={uiState}
                            expandSidebar={expandSidebar}
                            openDropdowns={openDropdowns}
                            handleDropdownClick={handleDropdownClick}
                            handleMobileOverlayClick={handleMobileOverlayClick}
                            userdata={user}
                            handleMouseEnter={handleMouseEnter}
                            handleMouseLeave={handleMouseLeave}
                        />

                        {/* MAIN CONTENT AREA: ml-0 applied everywhere below lg (1024px) so it hovers. lg:ml-20 or lg:ml-60 applied to take space on desktop */}
                        <main className={`flex flex-col h-full w-full overflow-hidden transition-all duration-300 ml-0 ${uiState?.isSidebarCollapsed ? "sm:ml-20" : "lg:ml-60"}`}>
                            <div className="flex-1 overflow-y-auto mt-0 mb-20">
                                <Outlet />
                                <Footer />
                            </div>
                        </main>

                    </div>

                    {tooltip.visible && createPortal(
                        <div
                            style={{ top: tooltip.top, left: tooltip.position === "bottom" ? tooltip.left : undefined, marginLeft: tooltip.position === "bottom" ? 0 : "6px" }}
                            className={`fixed px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap z-1000 shadow-2xl pointer-events-none border border-white/10 flex items-center ${tooltip.position === "bottom" ? "-translate-x-1/2" : "left-20 -translate-y-1/2"}`}
                        >
                            {tooltip.text}
                            <div className={`absolute border-[6px] border-transparent ${tooltip.position === "bottom" ? "bottom-full left-1/2 -translate-x-1/2 border-b-slate-900" : "right-full top-1/2 -translate-y-1/2 border-r-slate-900"}`}></div>
                        </div>,
                        document.body
                    )}

                </div>
            }

            {filters.loading && <div className="text-pink-500">Loading....</div>}
        </div>
    );
}