import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { verify } from '../services/verification.services';
import { getAssignmentById, submitStudentAssignment, getStudentAssignmentUpload, deleteStudentAssignmentUpload } from '../services/assignment.services';
import { uploadFile } from '../services/upload.services';
import { Loading } from './Loading';

function AssignmentDetails() {
  const [activeTab, setActiveTab] = useState('question');
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [studentUpload, setStudentUpload] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { type, id } = useParams();

  useEffect(() => {
    const fetchAssignment = async () => {
      setLoading(true);
      setError(null);

      const auth = await verify(location, type);
      if (!auth || !auth.status) {
        setError(auth?.message || 'Unable to verify user.');
        setLoading(false);
        if (auth?.redirectURL) window.location.href = auth.redirectURL;
        return;
      }

      const response = await getAssignmentById(auth.college._id, localStorage.getItem('token'), id, type);
      if (!response.status || !response.data) {
        setError('Unable to find assignment.');
        setLoading(false);
        return;
      }

      setAssignment(response.data);

      const uploadResponse = await getStudentAssignmentUpload(auth.college._id, localStorage.getItem('token'), auth.user._id, id, type);
      if (uploadResponse.status && uploadResponse.data) {
        setStudentUpload(uploadResponse.data);
      }

      setLoading(false);
    };

    fetchAssignment();
  }, [location, type, id]);

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatTime = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const parseDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileName('');
    setLocalPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (!selectedFile) {
      setLocalPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setLocalPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
      setLocalPreviewUrl(null);
    };
  }, [selectedFile]);

  const handleSubmitUpload = async () => {
    if (!selectedFile) return;
    setSubmitting(true);
    setError(null);

    const auth = await verify(location, type);
    if (!auth || !auth.status) {
      setError('Unable to verify your account before uploading.');
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', 'student');
    formData.append('id', auth.user._id);

    const uploadResponse = await uploadFile(auth.college._id, formData);
    if (!uploadResponse.status || !uploadResponse.upload) {
      setError('File upload failed. Please try again.');
      setSubmitting(false);
      return;
    }

    const submissionResponse = await submitStudentAssignment(
      auth.college._id,
      localStorage.getItem('token'),
      auth.user._id,
      id,
      uploadResponse.upload._id,
      type
    );

    if (!submissionResponse.status || !submissionResponse.data) {
      setError('Unable to submit assignment.');
      setSubmitting(false);
      return;
    }

    setStudentUpload(submissionResponse.data);
    setSelectedFile(null);
    setFileName('');
    setSubmitting(false);
  };

  const handleDeleteUploadedFile = async () => {
    if (!studentUpload) return;
    setSubmitting(true);
    setError(null);

    const auth = await verify(location, type);
    if (!auth || !auth.status) {
      setError('Unable to verify your account before removing the file.');
      setSubmitting(false);
      return;
    }

    const deleteResponse = await deleteStudentAssignmentUpload(
      auth.college._id,
      localStorage.getItem('token'),
      auth.user._id,
      id,
      type
    );

    if (!deleteResponse.status) {
      setError('Unable to remove uploaded file. Please try again.');
      setSubmitting(false);
      return;
    }

    setStudentUpload(null);
    clearSelectedFile();
    setSubmitting(false);
  };

  const questionFileUrl = assignment?.questionsAttachments?.file?.file_url || assignment?.questionsAttachments?.file || null;
  const previewUrl = selectedFile ? localPreviewUrl : studentUpload?.upload?.file_url || null;

  const startDateObj = parseDate(assignment?.schedulingScoring?.start_date);
  const endDateObj = parseDate(assignment?.schedulingScoring?.end_date);
  const now = new Date();
  const isBeforeStart = startDateObj ? now < startDateObj : false;
  const isAfterEnd = endDateObj ? now > endDateObj : false;
  const assignmentWindowOpen = !isBeforeStart && !isAfterEnd;
  const hasSubmitted = Boolean(studentUpload?.upload);
  const title = assignment?.assignmentDetails?.title || 'Assignment Detail';
  const subjectName = assignment?.assignmentDetails?.subject || 'Unknown Subject';
  const category = assignment?.assignmentDetails?.category || 'General';
  const teacherName = assignment?.createdBy?.first_name + " " +  assignment?.createdBy?.last_name|| 'Assigned Teacher';
  const marks = assignment?.schedulingScoring?.marks || 'N/A';
  const startDate = formatDate(assignment?.schedulingScoring?.start_date);
  const endDate = formatDate(assignment?.schedulingScoring?.end_date);
  const startTime = formatTime(assignment?.schedulingScoring?.start_date);
  const endTime = formatTime(assignment?.schedulingScoring?.end_date);

  if (loading) {
    return <Loading title="Loading assignment details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="rounded-3xl bg-white p-8 shadow-md border border-red-200 text-red-700">
          <p>{error}</p>
          <button onClick={() => navigate(`/${type}/academics/assignments`)} className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white">Back to assignments</button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-slate-800 min-h-screen flex flex-col bg-white text-left">
      <header className="bg-[#051F3E] border-none px-4 py-2 sticky top-0 z-100">
        <div className="max-w-7xl mx-auto flex items-center justify-start">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(`/${type}/academics/assignments`)} className="p-2 rounded-full transition-colors duration-200 bg-transparent cursor-pointer flex items-center justify-center text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold tracking-tight font-['DM_Sans'] m-0 text-white">Assignment</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full grow flex flex-col">
        <div className="px-4 py-3 sm:p-4 sm:px-6 bg-white flex flex-col gap-3 border-b border-slate-200">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest m-0">{category}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 font-['DM_Sans'] mt-2 mb-1">{title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-slate-600">
                <span className="text-xs font-medium">Assigned by {teacherName}</span>
                <span className="text-xs font-medium">Marks: {marks}</span>
              </div>
            </div>
            <div className="grid gap-2 text-right">
              <div className="text-xs text-slate-500">Due</div>
              <div className="text-base font-semibold text-slate-900">{startDate} - {endDate}</div>
              <div className="text-xs text-slate-500">{startTime} to {endTime}</div>
            </div>
          </div>
        </div>

        <nav className="flex border-b border-slate-200 bg-white sticky top-13.75 z-40">
          <button
            onClick={() => setActiveTab('question')}
            className={`flex-1 py-4 text-center text-sm transition-all duration-200 border-b-2 bg-transparent cursor-pointer ${activeTab === 'question' ? 'text-blue-700 border-blue-700 font-semibold' : 'text-slate-500 border-transparent font-medium hover:text-slate-800'}`}
          >
            Question
          </button>
          <button
            onClick={() => setActiveTab('answers')}
            className={`flex-1 py-4 text-center text-sm transition-all duration-200 border-b-2 bg-transparent cursor-pointer ${activeTab === 'answers' ? 'text-blue-700 border-blue-700 font-semibold' : 'text-slate-500 border-transparent font-medium hover:text-slate-800'}`}
          >
            Answers
          </button>
        </nav>

        <div className="grow flex flex-col bg-white">
          {activeTab === 'question' && (
            <div className="grow flex flex-col">
              <div className="relative bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-4 sm:p-6 h-[90vh]">
                {questionFileUrl ? (
                  <object data={questionFileUrl} type="application/pdf" width="100%" height="100%">
                    <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-3">
                      <p>Unable to display the PDF in-browser.</p>
                      <a href={questionFileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open assignment PDF in new tab</a>
                    </div>
                  </object>
                ) : (
                  <div className="min-h-[60vh] flex items-center justify-center text-slate-500">Assignment question PDF is not available.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'answers' && (
            <div className="flex flex-col  gap-4 p-4 sm:p-6">
              {!selectedFile && !studentUpload ? (
                <div className="relative min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                  {assignmentWindowOpen ? (
                    <>
                      <label htmlFor="assignmentUpload" className="cursor-pointer">
                        <div className="space-y-4">
                          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                              <path d="M12 12v9" />
                              <path d="m16 16-4-4-4 4" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xl font-bold text-slate-800">Upload Your Assignment</p>
                            <p className="text-sm text-slate-500">Drop a PDF file here or browse your computer to upload your answer sheet.</p>
                          </div>
                          <span className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 text-white font-semibold">Choose PDF</span>
                        </div>
                      </label>
                      <input
                        ref={fileInputRef}
                        id="assignmentUpload"
                        type="file"
                        accept="application/pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                      />
                    </>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xl font-semibold text-slate-800">Submission not open</p>
                      <p className="text-sm text-slate-500">
                        Assignments can only be submitted between {formatDate(assignment?.schedulingScoring?.start_date)} and {formatDate(assignment?.schedulingScoring?.end_date)}.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-4 sm:p-6 h-[90vh]">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">Previewing assignment file</p>
                      <p className="font-semibold text-slate-900">{fileName || studentUpload?.upload?.original_name || 'Uploaded assignment'}</p>
                    </div>
                    {selectedFile && !studentUpload && (
                      <button onClick={clearSelectedFile} className="px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100">Choose another PDF</button>
                    )}
                  </div>

                  {previewUrl ? (
                    <object data={previewUrl} type="application/pdf" width="100%" height="100%">
                      <div className="min-h-[40vh] flex flex-col items-center justify-center text-slate-500 gap-3">
                        <p>Unable to display the uploaded PDF preview.</p>
                        <a href={previewUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open PDF in new tab</a>
                      </div>
                    </object>
                  ) : (
                    <div className="min-h-[40vh] flex items-center justify-center text-slate-500">Unable to preview the selected PDF.</div>
                  )}

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {!studentUpload ? (
                      <button
                        type="button"
                        onClick={handleSubmitUpload}
                        disabled={!selectedFile || submitting || !assignmentWindowOpen}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                      >
                        {submitting ? 'Submitting...' : 'Submit Assignment'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleDeleteUploadedFile}
                        disabled={submitting}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
                      >
                        {submitting ? 'Removing...' : 'Remove file'}
                      </button>
                    )}

                    {studentUpload && (
                      <div className="text-sm text-slate-500">Last submitted: {new Date(studentUpload.submittedAt).toLocaleString()}</div>
                    )}
                  </div>

                  {!assignmentWindowOpen && !studentUpload && (
                    <div className="mt-4 rounded-2xl bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
                      Assignment submission is only allowed between {formatDate(assignment?.schedulingScoring?.start_date)} and {formatDate(assignment?.schedulingScoring?.end_date)}.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AssignmentDetails;
