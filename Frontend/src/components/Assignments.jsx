import { useState, useEffect } from "react";
import { ArrowLeft, SlidersHorizontal, ArrowDown, ChevronDown } from "lucide-react";
import { StudentAssignmentCard } from "./StudentAssignmentCard";
import { useLocation, useParams } from "react-router-dom";
import { verify } from "../services/verification.services";
import { getStudentAssignments } from "../services/assignment.services";
import { Loading } from "./Loading";

export function Assignments() {
  const defaultFilterState = {
    activeTab: "all",
    dropDownOpen: false,
    selectedSubject: "All Subjects",
    fromDate: "",
    toDate: "",
  };

  const [filters, setFilters] = useState(defaultFilterState);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAssignmentSchedule = (assignment) => assignment.schedulingScoring || assignment.schedule || {};

  const getAssignmentStatus = (assignment) => {
    if (assignment.studentUpload?.status === 'submitted' || assignment.studentUpload?.upload) {
      return 'completed';
    }

    const schedule = getAssignmentSchedule(assignment);
    const endDate = schedule.end_date ? new Date(schedule.end_date) : null;
    const now = new Date();

    if (endDate && now > endDate) {
      return 'expired';
    }

    return 'pending';
  };

  const getSubjectName = (assignment) => {
    const details = assignment.assignmentDetails || {};
    if (typeof details.subject === 'object' && details.subject !== null) {
      return details.subject.name || 'Unknown Subject';
    }
    return details.subject || 'Unknown Subject';
  };
  const location = useLocation();
  const { type } = useParams();

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);

      const auth = await verify(location, type);
      if (!auth || !auth.status) {
        setError(auth?.message || "Unable to verify user.");
        setLoading(false);
        if (auth?.redirectURL) window.location.href = auth.redirectURL;
        return;
      }

      const response = await getStudentAssignments(auth.college._id, localStorage.getItem("token"), auth.user._id, type);
      if (!response.status) {
        setError("Unable to fetch assignments.");
        setLoading(false);
        return;
      }

      setAssignments(response.data || []);
      setLoading(false);
    };

    fetchAssignments();
  }, [location, type]);

  function handleTabChange(tab) {
    setFilters((prev) => ({ ...prev, activeTab: tab }));
  }

  function toggleDropdown() {
    setFilters((prev) => ({ ...prev, dropDownOpen: !prev.dropDownOpen }));
  }

  function handleSubjectSelect(subject) {
    setFilters((prev) => ({
      ...prev,
      selectedSubject: subject,
      dropDownOpen: false,
    }));
  }

  function handleFromDateChange(e) {
    setFilters((prev) => ({ ...prev, fromDate: e.target.value }));
  }

  function handleToDateChange(e) {
    setFilters((prev) => ({ ...prev, toDate: e.target.value }));
  }

  const filteredAssignments = assignments.filter((assignment) => {
    const assignmentStatus = getAssignmentStatus(assignment);
    const matchesTab = filters.activeTab === "all" || assignmentStatus === filters.activeTab;
    const details = assignment.assignmentDetails || {};
    const subjectName = getSubjectName(assignment);
    const matchesSubject = filters.selectedSubject === "All Subjects" || subjectName === filters.selectedSubject;
    let matchesDate = true;
    const schedule = getAssignmentSchedule(assignment);
    const assignmentDate = new Date(schedule.start_date || Date.now());

    if (filters.fromDate) {
      const filterFromDate = new Date(filters.fromDate);
      filterFromDate.setHours(0, 0, 0, 0);
      if (assignmentDate < filterFromDate) {
        matchesDate = false;
      }
    }

    if (filters.toDate) {
      const filterToDate = new Date(filters.toDate);
      filterToDate.setHours(23, 59, 59, 999);
      if (assignmentDate > filterToDate) {
        matchesDate = false;
      }
    }
    return matchesTab && matchesSubject && matchesDate;
  });

  if (loading) {
    return <Loading title="Loading assignments..." />;
  }

  return (
    <div className="font-sans text-slate-900 min-h-screen bg-[#F8FAFC]">
      <header className="bg-[#051F3E] text-white sticky top-0 z-50 border-b border-slate-200 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 hover:text-blue-600 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold font-display tracking-tight">
              Assignments
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {error ? (
          <div className="rounded-3xl bg-white shadow-sm border border-red-200 p-8 text-red-700 text-center">
            {error}
          </div>
        ) : (
          <>
            <nav className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
          <button onClick={() => handleTabChange("all")} className={`px-6 py-3 text-sm whitespace-nowrap transition-all ${filters.activeTab === "all" ? "font-semibold text-blue-600 border-b-2 border-blue-500" : "font-medium text-slate-500 hover:text-slate-700"}`}>All</button>
          <button onClick={() => handleTabChange("completed")} className={`px-6 py-3 text-sm whitespace-nowrap transition-all ${filters.activeTab === "completed" ? "font-semibold text-blue-600 border-b-2 border-blue-500" : "font-medium text-slate-500 hover:text-slate-700"}`}>Completed</button>
          <button onClick={() => handleTabChange("pending")} className={`px-6 py-3 text-sm whitespace-nowrap transition-all ${filters.activeTab === "pending" ? "font-semibold text-blue-600 border-b-2 border-blue-500" : "font-medium text-slate-500 hover:text-slate-700"}`}>Pending</button>
          <button onClick={() => handleTabChange("expired")} className={`px-6 py-3 text-sm whitespace-nowrap transition-all ${filters.activeTab === "expired" ? "font-semibold text-blue-600 border-b-2 border-blue-500" : "font-medium text-slate-500 hover:text-slate-700"}`}>Expired</button>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium hover:border-blue-400 transition-all shadow-sm">
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium hover:border-blue-400 transition-all shadow-sm group">
            <span className="text-slate-600">Date</span>
            <ArrowDown className="w-4 h-4 text-slate-400 transition-transform duration-300" />
          </button>

          <div className="relative min-w-55">
            <button onClick={toggleDropdown} className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium hover:border-blue-400 transition-all shadow-sm">
              <span>Subject : {filters.selectedSubject}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${filters.dropDownOpen ? "rotate-180" : ""}`} />
            </button>

            {filters.dropDownOpen && (
              <div className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1">
                <button onClick={() => handleSubjectSelect("All Subjects")} className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors">All Subjects</button>
                <button onClick={() => handleSubjectSelect("Principles of Programming Languages")} className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors">Principles of Programming Languages</button>
                <button onClick={() => handleSubjectSelect("Data Structures & Algorithms")} className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors">Data Structures & Algorithms</button>
                <button onClick={() => handleSubjectSelect("Computer Networks")} className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors">Computer Networks</button>
                <button onClick={() => handleSubjectSelect("Machine Learning")} className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors">Machine Learning</button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">From:</span>
              <input type="date" value={filters.fromDate} className="text-sm font-medium focus:outline-none bg-transparent" onChange={handleFromDateChange} />
            </div>
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">To:</span>
              <input type="date" value={filters.toDate} className="text-sm font-medium focus:outline-none cursor-pointer bg-transparent" onChange={handleToDateChange} />
            </div>
          </div>
        </div>

        <div className="grid gap-12 md:gap-12">
          {filteredAssignments.map((assignment) => (
            <StudentAssignmentCard key={assignment._id} assignment={assignment} />
          ))}

          {filteredAssignments.length === 0 && (
            <div className="text-center py-12 text-slate-500 font-medium">
              No assignments found matching these filters.
            </div>
          )}
        </div>
          </>
        )}
      </main>
    </div>
  );
}