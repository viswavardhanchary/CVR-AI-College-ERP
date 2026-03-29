import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; // Assuming react-router-dom
import { Plus, SlidersHorizontal, ChevronDown, ArrowDown, Search } from "lucide-react";
import {Loading} from "../components/Loading";
import Toast from "../components/Toast";
import { verify } from "../services/verification.services";
import { AssignmentCard } from "./AssignmentCard";
import { getAssignments, deleteAssignment } from "../services/assignment.services";

export function TeacherAssignments() {
    const navigate = useNavigate();
    const defaultFilters = {
    loading: false,
    toast: {
      message: '',
      status: false,
      type: ''
    },
    refresh: false,
    navigate: {
      url: '',
      status: false,
    }
  }
  const [filters, setFilters] = useState(defaultFilters);
    const {type} = useParams();
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: "", type: "info" });
    
    // Filter & Sort States
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSubjectOpen, setIsSubjectOpen] = useState(false);
    const [dateSortDesc, setDateSortDesc] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');
    const [advancedFilters, setAdvancedFilters] = useState({
        course: '', batch: '', semester: '', branch: '', section: ''
    });

    const [user, setUser] = useState(null);
    const [collegeData, setCollegeData] = useState(null);

    const filterRef = useRef(null);
    const subjectRef = useRef(null);

    // Auth details (Replace with your actual state/context management)
    const token = localStorage.getItem("token"); 

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        getDetails();
        return () => document.removeEventListener("mousedown", handleClickOutside);
       
      }, []);
    
    const getDetails = async () => {
        setFilters({
          ...filters,
          loading: true
        });
        const response = await verify(location, type);
        if (response.status) {
          if (response.redirectURL) {
            navigate(response.redirectURL, { replace: true });
          }
          setUser(response.user);
          setCollegeData(response.college);
          fetchAssignments(response.college, response.user);
          setFilters({
            ...filters,
            loading: false
          });
        } else if (response.error) {
          setFilters({
            ...filters,
            loading: false,
            toast: {
              message: response.message,
              status: true,
              type: 'error'
            },
            refresh: true
          });
    
        } else {
          setFilters({
            ...filters,
            loading: false,
            toast: {
              message: response.message,
              status: true,
              type: 'info'
            },
            navigate: {
              status: true,
              url: response.redirectURL
            },
          });
          setTimeout(() => {
            //window.location.href = response.redirectURL;
          }, 3000);
        }
    }
    

    function handleClickOutside(event) {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setIsFilterOpen(false);
        }
        if (subjectRef.current && !subjectRef.current.contains(event.target)) {
            setIsSubjectOpen(false);
        }
    }

    const fetchAssignments = async (college, user) => {
        setIsLoading(true);
        const res = await getAssignments(college._id, token, user._id);
        if (res.status) {
            setAssignments(res.data || []);
        } else {
            setToast({ show: true, message: "Failed to fetch assignments", type: "error" });
        }
        setIsLoading(false);
    };

    const handleEdit = (id) => {
        navigate(`/t/academic-management/assignments-review/create?id=${id}`);
    };

    const handleDelete = async (id, fileId) => {
        if (!window.confirm("Are you sure you want to delete this assignment?")) return;
        
        setIsLoading(true);
        const res = await deleteAssignment(collegeData._id, token, id, type, fileId);
        if (res.status) {
            setToast({ show: true, message: "Assignment deleted successfully!", type: "success" });
            fetchAssignments();
        } else {
            setToast({ show: true, message: res.message || "Failed to delete assignment", type: "error" });
            setIsLoading(false);
        }
    };

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
        setIsSubjectOpen(false);
    };

    const handleAdvancedFilterChange = (e) => {
        const { name, value } = e.target;
        setAdvancedFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => setIsFilterOpen(false);

    // Filter Logic
    let filteredAssignments = assignments.filter(assignment => {
        const details = assignment.assignmentDetails || {};
        const target = assignment.targetStudents || {};
        const scoring = assignment.schedulingScoring || {};
        
        // Tab filtering logic requires real-time status check
        if (activeTab !== 'all' && activeTab !== 'marks') {
            const now = new Date();
            const endDate = new Date(scoring.end_date);
            const isCompleted = (assignment.submissions?.length || 0) >= (assignment.assignedStudents?.length || 1);
            const isExpired = now > endDate;
            
            if (activeTab === 'active' && (isExpired || isCompleted)) return false;
            if (activeTab === 'completed' && !isCompleted) return false;
            if (activeTab === 'expired' && (!isExpired || isCompleted)) return false;
        }

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            if (!details.title?.toLowerCase().includes(lowerQuery) && 
                !details.subject?.toLowerCase().includes(lowerQuery)) {
                return false;
            }
        }

        if (selectedSubject !== 'All Subjects' && details.subject !== selectedSubject) return false;
        if (advancedFilters.course && target.course !== advancedFilters.course) return false;
        if (advancedFilters.batch && target.batch !== advancedFilters.batch) return false;
        if (advancedFilters.semester && target.semester !== advancedFilters.semester) return false;
        if (advancedFilters.branch && target.branch !== advancedFilters.branch) return false;
        if (advancedFilters.section && target.section !== advancedFilters.section) return false;

        return true;
    });

    // Sorting Logic
    filteredAssignments.sort((a, b) => {
        const dateA = new Date(a.schedulingScoring?.start_date || 0);
        const dateB = new Date(b.schedulingScoring?.start_date || 0);
        return dateSortDesc ? dateB - dateA : dateA - dateB;
    });

    if (isLoading) {
        return <Loading title='Loading Assignments...'/>
    }

    return (
        <div className="font-sans text-slate-900 min-h-screen bg-slate-50">
            {toast.show && <div className="fixed top-4 right-4 z-50"><Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false })} /></div>}
            
            <header className="bg-[#012029] text-white sticky top-0 z-50 border-b border-slate-200 px-4 py-3 sm:px-6 shadow-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-bold font-display tracking-tight">My Assignments</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 font-display">Assignment Management</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Edit, delete or view submissions for your assigned tasks.</p>
                    </div>
                    <Link to="/t/academic-management/assignments-review/create" className="inline-flex items-center justify-center gap-2 bg-[#012029] hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-teal-900/10 transition-all hover:-translate-y-0.5">
                        <Plus className="w-4 h-4" /> Create Assignment
                    </Link>
                </div>

                {/* Filter and Nav elements (Same UI as original, collapsed for brevity but assume intact) */}
                <nav className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
                    {['all', 'active', 'completed', 'expired', 'marks'].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-sm whitespace-nowrap transition-all ${activeTab === tab ? 'font-semibold text-[#012029] border-b-2 border-[#012029]' : 'font-medium text-slate-500 hover:text-slate-700'}`}>
                            {tab === 'marks' ? 'Allocated Marks' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* ... Search input ... */}
                     <div className="flex flex-wrap items-center gap-3 w-full">
                        <div className="relative flex-1 sm:flex-none min-w-50">
                            <input type="text" placeholder="Search assignments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                        {/* Advanced Filter UI */}
                        {/* Keep original Filter HTML here */}
                    </div>
                </div>

                <div className="grid gap-12 md:gap-14">
                    {filteredAssignments.map((assignment) => (
                        <AssignmentCard 
                            key={assignment._id} 
                            assignment={assignment} 
                            onEdit={handleEdit} 
                            onDelete={handleDelete} 
                        />
                    ))}

                    {filteredAssignments.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                            <h3 className="text-lg font-bold text-slate-800 mb-1">No Assignments Found</h3>
                            <button onClick={() => { setSearchQuery(''); setSelectedSubject('All Subjects'); setAdvancedFilters({ course: '', batch: '', semester: '', branch: '', section: '' }); setActiveTab('all'); }} className="mt-6 px-5 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold">Clear All Filters</button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}