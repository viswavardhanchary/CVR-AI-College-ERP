import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, ChevronDown, Layers, BookOpen, Send } from 'lucide-react';
import { createResult } from '../services/result.services';
import { getCollegeDetails } from '../services/verification.services';

export function UploadResultsAdmin() {
  const { type } = useParams();
  const [formState, setFormState] = useState({
    studentId: '',
    subjectId: '',
    yearFrom: '',
    yearTo: '',
    semesterNumber: '',
    examType: '',
    examMethod: '',
    statusView: '',
    semesterDate: '',
    grade: '',
    marks: '',
    subjectStatus: '',
    cgpa: '',
    sgpa: ''
  });
  const [collegeId, setCollegeId] = useState('');
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCollege = async () => {
      const response = await getCollegeDetails();
      if (response.status) {
        setCollegeId(response.college._id);
      } else {
        setMessage('Unable to load college details. Please refresh the page.');
      }
    };
    loadCollege();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => ({
    student_id: formState.studentId,
    college: collegeId,
    years: [
      {
        from: formState.yearFrom ? new Date(formState.yearFrom) : undefined,
        to: formState.yearTo ? new Date(formState.yearTo) : undefined,
        semesters: [
          {
            exam_type: formState.examType,
            exam_method: formState.examMethod,
            sem_number: Number(formState.semesterNumber),
            date: formState.semesterDate ? new Date(formState.semesterDate) : undefined,
            status_view: formState.statusView,
            registerd_subjects: [
              {
                subject_id: formState.subjectId,
                grade: Number(formState.grade),
                marks: Number(formState.marks),
                status: formState.subjectStatus
              }
            ],
            cgpa: formState.cgpa ? Number(formState.cgpa) : undefined,
            sgpa: formState.sgpa ? Number(formState.sgpa) : undefined
          }
        ]
      }
    ]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!collegeId) {
      setMessage('College information is missing.');
      return;
    }

    if (
      !formState.studentId ||
      !formState.subjectId ||
      !formState.yearFrom ||
      !formState.yearTo ||
      !formState.semesterNumber ||
      !formState.examType ||
      !formState.examMethod ||
      !formState.statusView ||
      !formState.semesterDate ||
      !formState.grade ||
      !formState.marks ||
      !formState.subjectStatus
    ) {
      setMessage('Please complete all required fields before submitting.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    const response = await createResult(type, collegeId, token, buildPayload());
    setIsSubmitting(false);

    if (response.status) {
      setMessage('Result record created successfully.');
      setFormState({
        studentId: '',
        subjectId: '',
        yearFrom: '',
        yearTo: '',
        semesterNumber: '',
        examType: '',
        examMethod: '',
        statusView: '',
        semesterDate: '',
        grade: '',
        marks: '',
        subjectStatus: '',
        cgpa: '',
        sgpa: ''
      });
    } else {
      setMessage(`Failed to create result: ${response.error?.message || response.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col h-dvh overflow-hidden font-body">
      <header className="bg-[#100636] shadow-md h-16 flex items-center px-4 sm:px-8 shrink-0 z-40">
        <div className="flex items-center w-full max-w-5xl">
          <h1 className="font-heading font-bold text-lg text-white tracking-wide">Upload Results</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative bg-gray-50 overflow-y-auto">
        <div className="p-6 md:p-8 lg:p-10 max-w-5xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-heading font-bold tracking-tight text-gray-900">Upload Results</h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base font-medium">
              Create backend-aligned student result records for this college.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#e7e5fc] rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="studentId" className="block text-sm font-bold text-gray-700">Student ID</label>
                  <input
                    id="studentId"
                    name="studentId"
                    value={formState.studentId}
                    onChange={handleChange}
                    placeholder="MongoDB student ObjectId"
                    className="w-full h-12 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="subjectId" className="block text-sm font-bold text-gray-700">Subject ID</label>
                  <input
                    id="subjectId"
                    name="subjectId"
                    value={formState.subjectId}
                    onChange={handleChange}
                    placeholder="MongoDB subject ObjectId"
                    className="w-full h-12 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="yearFrom" className="block text-sm font-bold text-gray-700">Academic Year From</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="yearFrom"
                      name="yearFrom"
                      type="date"
                      value={formState.yearFrom}
                      onChange={handleChange}
                      className="w-full h-12 pl-11 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="yearTo" className="block text-sm font-bold text-gray-700">Academic Year To</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="yearTo"
                      name="yearTo"
                      type="date"
                      value={formState.yearTo}
                      onChange={handleChange}
                      className="w-full h-12 pl-11 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="semesterNumber" className="block text-sm font-bold text-gray-700">Semester Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                    </div>
                    <select
                      id="semesterNumber"
                      name="semesterNumber"
                      value={formState.semesterNumber}
                      onChange={handleChange}
                      className="w-full h-12 pl-11 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700 cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select Semester</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="examType" className="block text-sm font-bold text-gray-700">Exam Type</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Layers className="w-5 h-5 text-gray-400" />
                    </div>
                    <select
                      id="examType"
                      name="examType"
                      value={formState.examType}
                      onChange={handleChange}
                      className="w-full h-12 pl-11 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700 cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select Exam Type</option>
                      <option value="internal">Internal</option>
                      <option value="external">External</option>
                      <option value="lab internal">Lab Internal</option>
                      <option value="lab external">Lab External</option>
                      <option value="others">Others</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="examMethod" className="block text-sm font-bold text-gray-700">Exam Method</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                    </div>
                    <select
                      id="examMethod"
                      name="examMethod"
                      value={formState.examMethod}
                      onChange={handleChange}
                      className="w-full h-12 pl-11 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700 cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select Exam Method</option>
                      <option value="regular">Regular</option>
                      <option value="supplymentary">Supplymentary</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="statusView" className="block text-sm font-bold text-gray-700">Status View</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                    </div>
                    <select
                      id="statusView"
                      name="statusView"
                      value={formState.statusView}
                      onChange={handleChange}
                      className="w-full h-12 pl-11 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700 cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select Status View</option>
                      <option value="active">Active</option>
                      <option value="not active">Not Active</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="semesterDate" className="block text-sm font-bold text-gray-700">Semester Date</label>
                  <input
                    id="semesterDate"
                    name="semesterDate"
                    type="date"
                    value={formState.semesterDate}
                    onChange={handleChange}
                    className="w-full h-12 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="grade" className="block text-sm font-bold text-gray-700">Grade</label>
                  <input
                    id="grade"
                    name="grade"
                    type="number"
                    min="0"
                    value={formState.grade}
                    onChange={handleChange}
                    placeholder="e.g. 8"
                    className="w-full h-12 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="marks" className="block text-sm font-bold text-gray-700">Marks</label>
                  <input
                    id="marks"
                    name="marks"
                    type="number"
                    min="0"
                    value={formState.marks}
                    onChange={handleChange}
                    placeholder="e.g. 85"
                    className="w-full h-12 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="subjectStatus" className="block text-sm font-bold text-gray-700">Subject Status</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                    </div>
                    <select
                      id="subjectStatus"
                      name="subjectStatus"
                      value={formState.subjectStatus}
                      onChange={handleChange}
                      className="w-full h-12 pl-11 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700 cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select Subject Status</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="cgpa" className="block text-sm font-bold text-gray-700">CGPA (Optional)</label>
                  <input
                    id="cgpa"
                    name="cgpa"
                    type="number"
                    step="0.01"
                    value={formState.cgpa}
                    onChange={handleChange}
                    placeholder="e.g. 8.25"
                    className="w-full h-12 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="sgpa" className="block text-sm font-bold text-gray-700">SGPA (Optional)</label>
                  <input
                    id="sgpa"
                    name="sgpa"
                    type="number"
                    step="0.01"
                    value={formState.sgpa}
                    onChange={handleChange}
                    placeholder="e.g. 7.95"
                    className="w-full h-12 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700"
                  />
                </div>
              </div>

              {message && (
                <div className="rounded-2xl bg-[#f8fafc] border border-[#d1e8ff] px-4 py-3 text-sm text-[#0f4c81]">
                  {message}
                </div>
              )}

              <div className="pt-8 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setFormState({
                    studentId: '',
                    subjectId: '',
                    yearFrom: '',
                    yearTo: '',
                    semesterNumber: '',
                    examType: '',
                    examMethod: '',
                    statusView: '',
                    semesterDate: '',
                    grade: '',
                    marks: '',
                    subjectStatus: '',
                    cgpa: '',
                    sgpa: ''
                  })}
                  className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-[#100636] border border-transparent rounded-xl hover:bg-[#1a0b54] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#100636] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Results'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
