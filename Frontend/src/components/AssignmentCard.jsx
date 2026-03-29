import { AlertCircle, Clock3, CheckCircle, Calendar, Clock, Edit3, Trash2 } from "lucide-react";

export function AssignmentCard({ assignment, onEdit, onDelete }) {
    // Map the nested payload structure from the API to flat variables for UI
    const details = assignment.assignmentDetails || {};
    const target = assignment.targetStudents || {};
    const scoring = assignment.schedulingScoring || {};
    
    // Determine Status dynamically based on dates
    const now = new Date();
    const startDate = new Date(scoring.start_date);
    const endDate = new Date(scoring.end_date);
    
    let status = "active";
    let statusTheme = {
        bgColor: "bg-[#FFEDD5]",
        borderColor: "border-orange-200",
        textColor: "text-orange-700",
        iconColor: "text-orange-600",
        Icon: Clock3
    };

    if (now > endDate) {
        status = "expired";
        statusTheme = {
            bgColor: "bg-[#FEE2E2]",
            borderColor: "border-red-200",
            textColor: "text-red-700",
            iconColor: "text-red-600",
            Icon: AlertCircle
        };
    } else if (assignment.submitted >= (assignment.total || 1)) {
        status = "completed";
        statusTheme = {
            bgColor: "bg-[#DCFCE7]",
            borderColor: "border-green-200",
            textColor: "text-green-700",
            iconColor: "text-green-600",
            Icon: CheckCircle
        };
    }

    // Format dates for display
    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString('en-GB'); // DD/MM/YYYY
    };
    
    const formatTime = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const totalStudents = assignment.assignedStudents?.length || 0;
    const submittedCount = assignment.submissions?.length || 0; // Assuming submissions array exists

    return (
        <div className={`group ${statusTheme.bgColor} relative rounded-2xl rounded-tr-none p-5 md:p-7 border ${statusTheme.borderColor} shadow-sm transition-all hover:shadow-md`}>
            <div className={`absolute -top-7 right-0 flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-t-xl border ${statusTheme.borderColor} border-b-0 shadow-[0_-2px_5px_rgba(0,0,0,0.03)] z-10`}>
                <statusTheme.Icon className={`w-3.5 h-3.5 ${statusTheme.iconColor}`} />
                <span className={`text-[10px] font-bold ${statusTheme.textColor} uppercase`}>{status}</span>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-[1fr_auto] md:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <p className={`text-[11px] md:text-xs font-bold ${statusTheme.textColor}/70 uppercase tracking-wider`}>{details.subject}</p>
                            <span className="text-slate-300">•</span>
                            <p className="text-[10px] font-semibold text-slate-500 bg-white/60 px-2 py-0.5 rounded-full border border-slate-200/50">
                                {target.course?.toUpperCase()} - {target.branch?.toUpperCase()} - {target.section}
                            </p>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">{details.title}</h3>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium">{formatDate(scoring.start_date)} - {formatDate(scoring.end_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium">{formatTime(scoring.start_date)} - {formatTime(scoring.end_date)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between items-end self-stretch py-1 md:pl-8 md:border-l border-slate-200/50">
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-700">{submittedCount} / {totalStudents} Submitted</p>
                        <div className="w-full bg-slate-200/50 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div 
                                className={`h-1.5 rounded-full ${status === 'completed' ? 'bg-green-500' : status === 'expired' ? 'bg-red-500' : 'bg-orange-500'}`} 
                                style={{ width: `${totalStudents > 0 ? (submittedCount / totalStudents) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-4">
                        <button onClick={() => onEdit(assignment._id)} className="p-2 text-slate-600 hover:text-teal-600 bg-white shadow-sm border border-slate-200 rounded-xl hover:border-teal-300 transition-all" title="Edit">
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(assignment._id, assignment.questionsAttachments?.file?._id)} className="p-2 text-slate-600 hover:text-red-600 bg-white shadow-sm border border-slate-200 rounded-xl hover:border-red-300 transition-all" title="Delete">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}