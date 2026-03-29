import { Calendar, Clock, AlertCircle, Clock3, CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export function StudentAssignmentCard({ assignment }) {
  let bgColor = "";
  let textColor = "";
  let borderColor = "";
  let iconColor = "";

  const schedule = assignment.schedulingScoring || assignment.schedule || {};
  const startDate = schedule.start_date ? new Date(schedule.start_date) : null;
  const endDate = schedule.end_date ? new Date(schedule.end_date) : null;
  const now = new Date();
  const hasSubmitted = Boolean(assignment.studentUpload?.status === 'submitted' || assignment.studentUpload?.upload);
  const isExpired = endDate ? now > endDate : false;
  const normalizedStatus = hasSubmitted
    ? 'completed'
    : isExpired
      ? 'expired'
      : 'pending';

  const isOpen = !isExpired && (!startDate || now >= startDate);

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (normalizedStatus === "expired") {
    bgColor = "bg-[#FEE2E2]";
    textColor = "text-red-700";
    borderColor = "border-red-200";
    iconColor = "text-red-600";
  } else if (normalizedStatus === "pending") {
    bgColor = "bg-[#FFEDD5]";
    textColor = "text-orange-900";
    borderColor = "border-orange-200";
    iconColor = "text-orange-600";
  } else if (normalizedStatus === "completed") {
    bgColor = "bg-[#DCFCE7]";
    textColor = "text-green-700";
    borderColor = "border-green-200";
    iconColor = "text-green-600";
  }

  const { type } = useParams();
  const assignmentId = assignment._id || assignment.id || '';
  const assignmentDetails = assignment.assignmentDetails || {};
  const assignedBy = assignment.assigned_by || assignment.createdBy.first_name + " " + assignment.createdBy.last_name || {};
  const teacherName = assignedBy.name || assignment.createdBy.first_name + " " + assignment.createdBy.last_name || 'Teacher';
  const profileImage = assignedBy.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherName)}&background=0D9488&color=fff`;
  const subject = typeof assignmentDetails.subject === 'object'
    ? assignmentDetails.subject
    : { name: assignmentDetails.subject || 'Unknown subject', category: assignmentDetails.category || 'General', type: assignmentDetails.type || 'Regular' };
  const statusKey = normalizedStatus;

  const cardClassName = `${bgColor} relative rounded-2xl rounded-tr-none p-5 md:p-6 border ${borderColor} shadow-sm transition-transform ${isOpen ? 'hover:scale-[1.01] cursor-pointer' : 'opacity-90'}`;
  const cardProps = { className: cardClassName };
  if (isOpen) cardProps.to = `/${type}/academics/assignments/${assignmentId}`;
  const Container = isOpen ? Link : 'div';

  return (
    <Container {...cardProps}>
      <div className={`absolute -top-7 right-0 flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-t-xl border ${borderColor} border-b-0 shadow-sm z-10`}>
        {normalizedStatus === "expired" && <AlertCircle className={`w-3.5 h-3.5 ${iconColor}`} />}
        {normalizedStatus === "pending" && <Clock3 className={`w-3.5 h-3.5 ${iconColor}`} />}
        {normalizedStatus === "completed" && <CheckCircle className={`w-3.5 h-3.5 ${iconColor}`} />}
        <span className={`text-[10px] font-bold ${textColor} uppercase`}>
          {normalizedStatus}
        </span>
      </div>

      <div className="mb-1">
        <p className="text-xs md:text-sm font-medium text-slate-600">
          {subject.name} ({assignmentDetails.category} | {subject.sub_type} | {subject.code})
        </p>
      </div>

      <h3 className={`text-lg md:text-xl font-bold text-slate-800 mb-1 ${statusKey === "expired" ? "line-through" : ""}`}>
        {assignmentDetails.title || assignment.title || 'Untitled Assignment'}
      </h3>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-semibold text-slate-400 uppercase">
          Assigned by:
        </span>
        <div className="flex items-center gap-1.5">
          <img
            src={profileImage}
            className="w-5 h-5 rounded-full ring-1 ring-white shadow-sm"
            alt={teacherName}
          />
          <span className="text-xs font-semibold text-slate-700">
            {teacherName}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">
            {formatDate(schedule.start_date)} to {formatDate(schedule.end_date)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">
             {formatTime(schedule.start_date)} to {formatTime(schedule.end_date)}
          </span>
        </div>
      </div>
    </Container>
  );
}