import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, Users, CloudUpload, FileText, Trash2, Send, Save, RotateCcw } from "lucide-react";
import Toast from "../components/Toast";
import { Loading } from "../components/Loading";
import { SmallLoader } from "../components/SmallLoader";
import { AssignStudents } from "./AssignStudents";
import { createAssignment, updateAssignment, getAssignmentById } from "../services/assignment.services";
import { getSubjectsByTeacher, getStudentsByFilter } from "../services/subject.services";
import { verify } from "../services/verification.services";

export function CreateAssignment() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("id");


    const defaultFormData = {
        assignmentDetails: { title: "", subject: "", category: "" },
        targetStudents: { course: "", batch: "", semester: "", branch: "", section: "" },
        schedulingScoring: { start_date: "", end_date: "", marks: "", allow_late: false },
        questionsAttachments: { instructions: "", file: null }
    };

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
    const [user, setUser] = useState(null);
    const [collegeData, setCollegeData] = useState(null);
    const {type} = useParams();
    const [filters, setFilters] = useState(defaultFilters);
    const [formData, setFormData] = useState(defaultFormData);
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [toast, setToast] = useState({ message: "", type: "info", show: false });
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [subjectsLoading, setSubjectsLoading] = useState(false);
    const [subjectsError, setSubjectsError] = useState("");

    // Loading States
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
              if (editId) {
                fetchAssignmentDetails(editId, response.college);
                } else {
                    const savedDraft = localStorage.getItem("assignmentDraft");
                    const savedStudents = localStorage.getItem("assignedStudentsDraft");
                    if (savedDraft) setFormData(JSON.parse(savedDraft));
                    if (savedStudents) setAssignedStudents(JSON.parse(savedStudents));
                }
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

    const fileInputRef = useRef(null);

    const token = localStorage.getItem("token");

    // Load Draft from LocalStorage or Fetch Data for Edit
    useEffect(() => {
       // document.addEventListener("mousedown", handleClickOutside);
        getDetails();
       // return () => document.removeEventListener("mousedown", handleClickOutside);
       
      }, []);

    // Fetch Subjects by Teacher when user and college are loaded
    useEffect(() => {
      if (user && collegeData && token) {
        fetchSubjectsByTeacher();
      }
    }, [user, collegeData, token]);

    const fetchSubjectsByTeacher = async () => {
      setSubjectsLoading(true);
      setSubjectsError("");
      const response = await getSubjectsByTeacher(collegeData._id, user._id, token, type);
      if (response.status) {
        const subjects = Array.isArray(response.data.data) ? response.data.data : [];
        // console.log(response.data.data);
        // console.log(subjects);
        setSubjectOptions(subjects.map(sub => ({ value: sub._id, label: sub.name })));
      } else {
        setSubjectsError("Unable to load subjects");
        setSubjectOptions([{ value: '123', label: 'Others' }]);
      }
      setSubjectsLoading(false);
    };

    function handleClickOutside(event) {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setIsFilterOpen(false);
        }
        if (subjectRef.current && !subjectRef.current.contains(event.target)) {
            setIsSubjectOpen(false);
        }
    }

    // Save to LocalStorage on Change (Only if not in edit mode)
    useEffect(() => {
        if (!editId) {
            localStorage.setItem("assignmentDraft", JSON.stringify(formData));
            localStorage.setItem("assignedStudentsDraft", JSON.stringify(assignedStudents));
        }
    }, [formData, assignedStudents, editId]);

    const fetchAssignmentDetails = async (id, college) => {
        setIsPageLoading(true);
        const res = await getAssignmentById(college._id, token, id, type);
        if (res.status && res.data) {
            setFormData({
                assignmentDetails: res.data.assignmentDetails || defaultFormData.assignmentDetails,
                targetStudents: res.data.targetStudents || defaultFormData.targetStudents,
                schedulingScoring: {
                    ...res.data.schedulingScoring,
                    // Format dates for datetime-local input
                    start_date: res.data.schedulingScoring?.start_date ? new Date(res.data.schedulingScoring.start_date).toISOString().slice(0, 16) : "",
                    end_date: res.data.schedulingScoring?.end_date ? new Date(res.data.schedulingScoring.end_date).toISOString().slice(0, 16) : "",
                },
                questionsAttachments: res.data.questionsAttachments || defaultFormData.questionsAttachments
            });
            setAssignedStudents(res.data.assignedStudents || []);
        } else {
            showError("Failed to fetch assignment details.");
        }
        setIsPageLoading(false);
    };

    function handleOpenAssignModal() {
        setShowAssignModal(true);
        if (toast.show) closeToast();
    }

    // Prepare filters for student assignment
    const getStudentFilters = () => {
      return {
        course: formData.targetStudents.course,
        batch: formData.targetStudents.batch,
        sem: formData.targetStudents.semester,
        branch: formData.targetStudents.branch,
        section: formData.targetStudents.section
      };
    };

    function handleClearEverything() {
        if (window.confirm("Are you sure you want to clear the entire form?")) {
            setFormData(defaultFormData);
            setAssignedStudents([]);
            localStorage.removeItem("assignmentDraft");
            localStorage.removeItem("assignedStudentsDraft");
            if (fileInputRef.current) fileInputRef.current.value = "";
            navigate("/t/academic-management/assignments-review/create", { replace: true });
        }
    }

    function closeToast() { setToast({ message: "", type: "info", show: false }); }

    function showError(msg) {
        setToast({ message: msg, type: "error", show: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
    }

    function handleChange(section, e) {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev, [section]: { ...prev[section], [name]: type === "checkbox" ? checked : value }
        }));
        if (toast.show) closeToast();
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, questionsAttachments: { ...prev.questionsAttachments, file } }));
        }
        if (toast.show) closeToast();
    }

    function clearFile() {
        setFormData(prev => ({ ...prev, questionsAttachments: { ...prev.questionsAttachments, file: null } }));
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (toast.show) closeToast();
    }

    function validateForm() {
        const { title, subject, category } = formData.assignmentDetails;
        const { course, batch, semester, branch, section } = formData.targetStudents;
        const { start_date, end_date, marks } = formData.schedulingScoring;
        const { file } = formData.questionsAttachments;

        if (!title || !subject || !category || !course || !batch || !semester || !branch || !section || !start_date || !end_date || !marks) {
            return showError("Please fill all required fields marked with *");
        }

        if (assignedStudents.length === 0) return showError("Please assign at least 1 student.");
        if (!file) return showError("Assignment Questions (PDF) is required.");

        // If file is a new File object, validate format
        if (file instanceof File && file.type !== "application/pdf") return showError("Only PDF format is allowed.");

        return true;
    }

    async function handleSubmit(e, status) {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        const payloadData = { ...formData, status, assignedStudents };

        let res;
        if (editId) {
            res = await updateAssignment(collegeData._id, token, editId, payloadData, type);
        } else {
            res = await createAssignment(collegeData._id, token, type, payloadData);
        }

        setIsSubmitting(false);

        if (res.status) {
            setToast({ message: `Assignment ${editId ? 'Updated' : 'Created'} Successfully!`, type: "success", show: true });
            if (!editId) {
                localStorage.removeItem("assignmentDraft");
                localStorage.removeItem("assignedStudentsDraft");
            }
            setTimeout(() => navigate(-1), 1500); // go back after success
        } else {
            showError(res.message || "Something went wrong.");
        }
    }

    if (isPageLoading) return <Loading title="Loading Assignment Data..." />;

    // File Object rendering helper
    const renderFileInfo = () => {
        const file = formData.questionsAttachments.file;
        if (!file) return null;

        const isNewFile = file instanceof File;
        const fileName = isNewFile ? file.name : file.original_name || file.file_name;
        const fileSizeMB = isNewFile
            ? (file.size / 1024 / 1024).toFixed(2)
            : ((file.file_size || 0) / 1024 / 1024).toFixed(2);

        return (
            <div className="flex items-center justify-between gap-4 bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-sm mt-2 w-full max-w-sm relative z-20">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500 shrink-0">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-bold text-slate-700 truncate w-48">{fileName}</p>
                        <p className="text-xs font-bold text-slate-500">{fileSizeMB} MB</p>
                    </div>
                </div>
                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); clearFile(); }} className="p-2 bg-slate-50 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 border border-slate-200 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        );
    };

    const isBatchDisabled = !formData.targetStudents.course;
    const isSemesterDisabled = isBatchDisabled || !formData.targetStudents.batch;
    const isBranchDisabled = isSemesterDisabled || !formData.targetStudents.semester;
    const isSectionDisabled = isBranchDisabled || !formData.targetStudents.branch;
    const isAssignDisabled = isSectionDisabled || !formData.targetStudents.section;


    return (
        <div className="font-sans text-slate-900 min-h-screen pb-12 bg-[#F8FAFC]">
            {/* Same Modal UI as original */}
            {showAssignModal && (
                <div className="fixed inset-0 z-1000000000 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-3xl overflow-hidden">
                        <AssignStudents 
                          filters={getStudentFilters()}
                          college={collegeData._id}
                          token={token}
                          initialSelected={assignedStudents} 
                          onSave={(ids) => { setAssignedStudents(ids); setShowAssignModal(false); }}
                          type={type}
                          onClose={() => setShowAssignModal(false)}
                        />
                    </div>
                </div>
            )}

            <header className="bg-[#012029] text-white sticky top-0 z-50 border-b border-slate-200 px-4 py-3 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button type="button" className="p-2 hover:bg-white/10 rounded-full transition-colors" onClick={() => window.history.back()}>
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold">{editId ? 'Edit Assignment' : 'Create Assignment'}</h1>
                    </div>
                    <button type="button" onClick={handleClearEverything} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                        <RotateCcw className="w-4 h-4" /> Clear Form
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pt-1 relative">
                <div className="sticky top-20 z-40 mb-4">
                    {toast.show && <Toast message={toast.message} type={toast.type} onClose={closeToast} duration={99999} />}
                </div>

                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold font-display text-slate-800 tracking-tight">New Assignment</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Create a new assignment and upload questions for your students.</p>
                </div>

                <form className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8" noValidate>

                    <div>
                        <h3 className="text-base font-bold text-slate-800 mb-5">
                            Assignment Details
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1.5">Assignment Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.assignmentDetails.title}
                                    onChange={(e) => handleChange("assignmentDetails", e)}
                                    placeholder="e.g., DSA Project Phase I | Binary Trees"
                                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium outline-none shadow-sm hover:border-slate-300"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-1.5">Subject / Course <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.assignmentDetails.subject}
                                            onChange={(e) => handleChange("assignmentDetails", e)}
                                            className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium appearance-none outline-none shadow-sm hover:border-slate-300"
                                            disabled={subjectsLoading}
                                        >
                                            <option value="" disabled>{subjectsLoading ? 'Loading subjects...' : 'Select Subject'}</option>
                                            {subjectOptions.length > 0 ? (
                                              subjectOptions.map((subject) => (
                                                <option key={subject.value} value={subject.value}>{subject.label}</option>
                                              ))
                                            ) : (
                                              <option disabled>No subjects available</option>
                                            )}
                                        </select>
                                        {subjectsError && <p className="text-xs text-red-500 mt-1">{subjectsError}</p>}
                                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1.5">Course Type / Category <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.assignmentDetails.category}
                                            onChange={(e) => handleChange("assignmentDetails", e)}
                                            className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium appearance-none outline-none shadow-sm hover:border-slate-300"
                                        >
                                            <option value="" disabled>Select Category</option>
                                            <option value="Assignment">Assignment</option>
                                            <option value="Project">Project</option>
                                            <option value="Lab Work">Lab Work</option>
                                            <option value="Quiz">Quiz</option>
                                            <option value="Homework">Homework</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-t border-slate-100" />

                    {/* ... Target Students block exactly as original ... */}
                    <div>
                        <h3 className="text-base font-bold text-slate-800 mb-5">
                            Target Students
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                            <div>
                                <label htmlFor="course" className="block text-sm font-semibold text-slate-700 mb-1.5">Course <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select
                                        id="course"
                                        name="course"
                                        value={formData.targetStudents.course}
                                        onChange={(e) => handleChange("targetStudents", e)}
                                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium appearance-none outline-none shadow-sm hover:border-slate-300"
                                    >
                                        <option value="" disabled>Select Course</option>
                                        <option value="B.Tech">B.Tech</option>
                                        <option value="M.Tech">M.Tech</option>
                                        <option value="MCA">MCA</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="batch" className={`block text-sm font-semibold text-slate-700 mb-1.5 transition-opacity ${isBatchDisabled ? 'opacity-50' : ''}`}>Batch <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select
                                        id="batch"
                                        name="batch"
                                        value={formData.targetStudents.batch}
                                        onChange={(e) => handleChange("targetStudents", e)}
                                        disabled={isBatchDisabled}
                                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium appearance-none outline-none shadow-sm hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="" disabled>Select Batch</option>
                                        <option value="2022-2026">2022-2026</option>
                                        <option value="2023-2027">2023-2027</option>
                                        <option value="2024-2028">2024-2028</option>
                                        <option value="2025-2029">2025-2029</option>
                                    </select>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isBatchDisabled ? 'opacity-50' : ''}`} />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="semester" className={`block text-sm font-semibold text-slate-700 mb-1.5 transition-opacity ${isSemesterDisabled ? 'opacity-50' : ''}`}>Semester <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select
                                        id="semester"
                                        name="semester"
                                        value={formData.targetStudents.semester}
                                        onChange={(e) => handleChange("targetStudents", e)}
                                        disabled={isSemesterDisabled}
                                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium appearance-none outline-none shadow-sm hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="" disabled>Select Semester</option>
                                        <option value="1">Semester 1</option>
                                        <option value="2">Semester 2</option>
                                        <option value="3">Semester 3</option>
                                        <option value="4">Semester 4</option>
                                        <option value="5">Semester 5</option>
                                        <option value="6">Semester 6</option>
                                        <option value="7">Semester 7</option>
                                        <option value="8">Semester 8</option>
                                    </select>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isSemesterDisabled ? 'opacity-50' : ''}`} />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="branch" className={`block text-sm font-semibold text-slate-700 mb-1.5 transition-opacity ${isBranchDisabled ? 'opacity-50' : ''}`}>Branch <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select
                                        id="branch"
                                        name="branch"
                                        value={formData.targetStudents.branch}
                                        onChange={(e) => handleChange("targetStudents", e)}
                                        disabled={isBranchDisabled}
                                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium appearance-none outline-none shadow-sm hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="" disabled>Select Branch</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Electronic Communication">Electronic Communication</option>
                                        <option value="Electrical Electronics">Electrical Electronics</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Civil">Civil</option>
                                    </select>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isBranchDisabled ? 'opacity-50' : ''}`} />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="section" className={`block text-sm font-semibold text-slate-700 mb-1.5 transition-opacity ${isSectionDisabled ? 'opacity-50' : ''}`}>Section <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select
                                        id="section"
                                        name="section"
                                        value={formData.targetStudents.section}
                                        onChange={(e) => handleChange("targetStudents", e)}
                                        disabled={isSectionDisabled}
                                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium appearance-none outline-none shadow-sm hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="" disabled>Select Section</option>
                                        <option value="A">Section A</option>
                                        <option value="B">Section B</option>
                                        <option value="C">Section C</option>
                                        <option value="D">Section D</option>
                                    </select>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isSectionDisabled ? 'opacity-50' : ''}`} />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-semibold text-slate-700 mb-1.5 transition-opacity ${isAssignDisabled ? 'opacity-50' : ''}`}>Assign Students <span className="text-red-500">*</span></label>
                                <button
                                    type="button"
                                    onClick={handleOpenAssignModal}
                                    disabled={isAssignDisabled}
                                    className="w-full bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Users className="w-4 h-4" />
                                    {assignedStudents.length > 0 ? `${assignedStudents.length} Students Assigned` : "Select Students"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <hr className="border-t border-slate-100" />

                    <div>
                        <h3 className="text-base font-bold text-slate-800 mb-5">
                            Scheduling & Scoring
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date & Time <span className="text-red-500">*</span></label>
                                <input
                                    type="datetime-local"
                                    id="start_date"
                                    name="start_date"
                                    value={formData.schedulingScoring.start_date}
                                    onChange={(e) => handleChange("schedulingScoring", e)}
                                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-slate-600 outline-none shadow-sm hover:border-slate-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="end_date" className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date & Time <span className="text-red-500">*</span></label>
                                <input
                                    type="datetime-local"
                                    id="end_date"
                                    name="end_date"
                                    value={formData.schedulingScoring.end_date}
                                    onChange={(e) => handleChange("schedulingScoring", e)}
                                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-slate-600 outline-none shadow-sm hover:border-slate-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="marks" className="block text-sm font-semibold text-slate-700 mb-1.5">Maximum Marks <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    id="marks"
                                    name="marks"
                                    value={formData.schedulingScoring.marks}
                                    onChange={(e) => handleChange("schedulingScoring", e)}
                                    min="1"
                                    max="1000"
                                    placeholder="e.g. 100"
                                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium outline-none shadow-sm hover:border-slate-300"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="allow_late"
                                    checked={formData.schedulingScoring.allow_late}
                                    onChange={(e) => handleChange("schedulingScoring", e)}
                                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-slate-700">Allow late submission (with penalty mark)</span>
                            </label>
                        </div>
                    </div>

                    <hr className="border-t border-slate-100" />

                    <div>
                        <h3 className="text-base font-bold text-slate-800 mb-5">Questions & Attachments</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Assignment Questions (PDF) <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <input type="file" accept="application/pdf" ref={fileInputRef} onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    <div className={`w-full border-2 ${formData.questionsAttachments.file ? 'border-solid border-slate-200 py-6' : 'border-dashed border-slate-300 py-8'} rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 group-hover:bg-teal-50 transition-all`}>
                                        <div className={formData.questionsAttachments.file ? 'hidden' : ''}>
                                            <CloudUpload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                            <p className="text-sm font-bold text-slate-700">Upload PDF File</p>
                                        </div>
                                        {renderFileInfo()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button type="button" disabled={isSubmitting} onClick={(e) => handleSubmit(e, "drafted")} className="px-6 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 border border-transparent transition-all flex items-center gap-2 disabled:opacity-50">
                            <Save className="w-4 h-4" /> Save as Draft
                        </button>
                        <button type="button" disabled={isSubmitting} onClick={(e) => handleSubmit(e, "published")} className="bg-[#012029] hover:bg-teal-800 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50 min-w-50 justify-center">
                            {isSubmitting ? <SmallLoader /> : <><Send className="w-4 h-4" /> {editId ? 'Update Assignment' : 'Publish Assignment'}</>}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}