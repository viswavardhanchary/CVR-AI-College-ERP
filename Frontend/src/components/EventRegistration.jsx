import { useState } from "react";
import { Image, FileText, CheckCircle } from "lucide-react";
import Toast from "../components/Toast";

export function EventRegistration() {
    // Segregated Form Data
    const defaultFormData = {
        basicInfo: {
            title: "",
            category: "",
            organizer: "",
            speaker: "",
            description: "",
            event_description: "",
            eligibility: "",
        },
        dateAndVenue: {
            startDate: "",
            endDate: "",
            registrationDeadline: "",
            mode: "In-Person",
            venueName: "",
            meetingLink: "",
            targetAudience: [],
            participantLimit: "",
            teamSize: "Individual",
        },
        contactInfo: {
            contactName1: "",
            contactPhone1: "",
            contactEmail1: "",
            contactDesc1: "",
        },
        mediaAndExtras: {
            poster: null,
            brochure: null,
            entryFee: "0",
            prerequisites: ""
        }
    };

    const defaultToast = {
        message: "",
        type: "info",
        show: false
    };

    const [formData, setFormData] = useState(defaultFormData);
    const [toast, setToast] = useState(defaultToast);

    function closeToast() {
        setToast(prev => ({ ...prev, show: false }));
    }

    // Updated to handle nested sections
    function handleChange(section, e) {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [section]: {
                ...prev[section],
                [name]: value
            }
        }));
        if (toast.show) closeToast();
    }

    // Updated to target dateAndVenue section
    function handleTargetAudienceChange(e) {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentAudience = prev.dateAndVenue.targetAudience;
            const newAudience = checked 
                ? [...currentAudience, value] 
                : currentAudience.filter(item => item !== value);
            
            return { 
                ...prev, 
                dateAndVenue: {
                    ...prev.dateAndVenue,
                    targetAudience: newAudience
                } 
            };
        });
        if (toast.show) closeToast();
    }

    // Updated to target mediaAndExtras section
    function handleFileChange(e) {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setFormData(prev => ({ 
                ...prev, 
                mediaAndExtras: {
                    ...prev.mediaAndExtras,
                    [name]: files[0]
                }
            }));
        }
        if (toast.show) closeToast();
    }

    function showError(msg) {
        setToast({ message: msg, type: "error", show: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
    }

    function validateForm() {
        const { title, category, organizer, speaker, description, event_description, eligibility } = formData.basicInfo;
        const { startDate, endDate, registrationDeadline, mode, venueName, meetingLink, targetAudience, participantLimit, teamSize } = formData.dateAndVenue;
        const { contactName1, contactPhone1, contactEmail1 } = formData.contactInfo;
        const { poster, brochure, entryFee, prerequisites } = formData.mediaAndExtras;

        const now = new Date();
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        const regDeadline = registrationDeadline ? new Date(registrationDeadline) : null;

        const limit = Number(participantLimit);
        const fee = Number(entryFee);

        let isMeetingLinkValid = true;
        if (meetingLink) {
            try {
                new URL(meetingLink);
                isMeetingLinkValid = /meet\.google\.com|zoom\.us|teams\.microsoft\.com/i.test(meetingLink);
            } catch {
                isMeetingLinkValid = false;
            }
        }

        switch (true) {
            case !title:
                return showError("Event Title is required.");
            case title.length < 5 || title.length > 100:
                return showError("Title must be between 5 and 100 characters.");
            case !/^[a-zA-Z0-9\s\-&]+$/.test(title):
                return showError("Title contains invalid characters. No special symbols allowed.");

            case !category:
                return showError("Please select an event category.");

            case !organizer:
                return showError("Organizer Name is required.");
            case organizer.length < 3 || organizer.length > 80:
                return showError("Organizer name must be between 3 and 80 characters.");
            case !/^[a-zA-Z\s&]+$/.test(organizer):
                return showError("Organizer name can only contain letters, spaces, and &.");

            case Boolean(speaker && (speaker.length < 3 || speaker.length > 80)):
                return showError("Speaker name must be between 3 and 80 characters.");
            case Boolean(speaker && !/^[a-zA-Z\s.]+$/.test(speaker)):
                return showError("Speaker name can only contain letters, spaces, and dots.");

            case !description:
                return showError("Short Description is required.");

            case !event_description:
                return showError("Detailed Event Description is required.");
            case event_description.length < 50 || event_description.length > 2000:
                return showError("Event description must be between 50 and 2000 characters.");
            case /<[a-z][\s\S]*>/i.test(event_description):
                return showError("HTML tags are not allowed in the description.");

            case !eligibility:
                return showError("Eligibility is required.");
            case eligibility.length < 10 || eligibility.length > 500:
                return showError("Eligibility must be between 10 and 500 characters.");

            case !startDate:
                return showError("Start Date & Time is required.");
            case !endDate:
                return showError("End Date & Time is required.");
            case !registrationDeadline:
                return showError("Registration Deadline is required.");

            case Boolean(start && start < now):
                return showError("Start date cannot be in the past.");
            case Boolean(start && end && end <= start):
                return showError("End date must be after the start date.");
            case Boolean(start && regDeadline && regDeadline >= start):
                return showError("Registration deadline must be before the start date.");

            case (mode === "In-Person" || mode === "Hybrid") && !venueName:
                return showError("Venue Name is required for In-Person or Hybrid events.");
            case (mode === "In-Person" || mode === "Hybrid") && Boolean(venueName && (venueName.length < 3 || venueName.length > 100)):
                return showError("Venue name must be between 3 and 100 characters.");

            case (mode === "Virtual" || mode === "Hybrid") && !meetingLink:
                return showError("Meeting link is required for Virtual/Hybrid events.");
            case (mode === "Virtual" || mode === "Hybrid") && !isMeetingLinkValid:
                return showError("Invalid meeting link URL. Must be Google Meet, Zoom, or MS Teams.");

            case !targetAudience || targetAudience.length === 0:
                return showError("Please select at least one target audience.");

            case !participantLimit:
                return showError("Participant Limit is required.");
            case limit < 1 || limit > 10000:
                return showError("Participant limit must be between 1 and 10,000.");

            case !teamSize:
                return showError("Please select a team size.");

            case !contactName1:
                return showError("Contact Name is required.");
            case contactName1.length < 3:
                return showError("Contact name must be at least 3 characters.");
            case !/^[a-zA-Z\s]+$/.test(contactName1):
                return showError("Contact name can only contain letters and spaces.");

            case !contactPhone1:
                return showError("Mobile Number is required.");
            case !/^[6-9]\d{9}$/.test(contactPhone1):
                return showError("Enter a valid 10-digit mobile number starting with 6-9.");

            case !contactEmail1:
                return showError("Email ID is required.");
            case !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(contactEmail1):
                return showError("Enter a valid email address.");

            case Boolean(poster && !['image/png', 'image/jpeg', 'image/jpg'].includes(poster.type)):
                return showError("Poster must be PNG, JPG, or JPEG.");
            case Boolean(poster && poster.size > 5 * 1024 * 1024):
                return showError("Poster size must be less than 5MB.");

            case Boolean(brochure && brochure.type !== 'application/pdf'):
                return showError("Rulebook/Brochure must be a PDF file.");
            case Boolean(brochure && brochure.size > 10 * 1024 * 1024):
                return showError("Brochure size must be less than 10MB.");

            case entryFee === "":
                return showError("Entry Fee is required.");
            case fee < 0 || fee > 10000:
                return showError("Entry fee must be between 0 and 10000.");

            case Boolean(prerequisites && prerequisites.length > 200):
                return showError("Prerequisites cannot exceed 200 characters.");

            default:
                return true;
        }
    }
    function handleSubmit(e) {
        e.preventDefault();
        if (validateForm()) {
            setToast({ message: "Event created successfully!", type: "success", show: true });
            console.log("Form Submitted Successfully", formData);
        }
    }

    return (
        <div className="bg-white text-slate-800 min-h-screen font-body">
            <div className="w-full min-h-screen flex flex-col">
                
                <div 
                    className="w-full py-12 px-6 md:px-10 lg:px-20 text-white shadow-md relative overflow-hidden bg-cover bg-center" 
                    style={{ backgroundImage: "url('/images/event_banner.jpg')" }}
                >
                    <div className="absolute inset-0 bg-slate-900/70 z-0"></div>
                    
                    <div className="relative z-10 max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                               <span className="bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/40">Portal</span>
                               <div className="h-px w-8 bg-white/30"></div>
                               <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Event Management</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold font-heading mb-2 tracking-tight">Create New Event</h2>
                            <p className="text-white/70 font-medium text-base md:text-lg max-w-2xl">Streamline your campus activities with our AI Integrated Management System.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white flex-1 p-6 md:p-10 lg:px-20">
                    <form onSubmit={handleSubmit} noValidate className="space-y-12 max-w-6xl mx-auto relative">
                        
                        <div className="sticky top-4 z-50">
                            {toast.show && (
                                <Toast message={toast.message} type={toast.type} onClose={closeToast} duration={99999999} />
                            )}
                        </div>

                        {/* BASIC INFORMATION */}
                        <div className="space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-lg font-heading font-bold text-slate-800 flex items-center gap-2">
                                    Basic Information
                                </h3>
                                <p className="text-slate-500 text-xs mt-1">The main details of the event.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                        Event Title <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        id="title" 
                                        name="title" 
                                        value={formData.basicInfo.title}
                                        onChange={(e) => handleChange("basicInfo", e)}
                                        placeholder="e.g., Annual Tech Fest 2026" 
                                        className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all" 
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="category" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                            Event Category <span className="text-red-500">*</span>
                                        </label>
                                        <select 
                                            id="category" 
                                            name="category" 
                                            value={formData.basicInfo.category}
                                            onChange={(e) => handleChange("basicInfo", e)}
                                            className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none appearance-none transition-all cursor-pointer"
                                        >
                                            <option value="" disabled>Select Category</option>
                                            <option value="Technical">Technical</option>
                                            <option value="Workshop">Workshop</option>
                                            <option value="Hackathon">Hackathon</option>
                                            <option value="Seminar">Seminar</option>
                                            <option value="Cultural">Cultural</option>
                                            <option value="Competition">Competition</option>
                                            <option value="Webinar">Webinar</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="organizer" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                            Organizer Name <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="organizer" 
                                            name="organizer" 
                                            value={formData.basicInfo.organizer}
                                            onChange={(e) => handleChange("basicInfo", e)}
                                            placeholder="e.g., AI Research Lab" 
                                            className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all" 
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="speaker" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                            Speaker Name
                                        </label>
                                        <input 
                                            type="text" 
                                            id="speaker" 
                                            name="speaker" 
                                            value={formData.basicInfo.speaker}
                                            onChange={(e) => handleChange("basicInfo", e)}
                                            placeholder="e.g., Dr. Jane Smith" 
                                            className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all" 
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="description" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                            Short Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea 
                                            id="description" 
                                            name="description" 
                                            value={formData.basicInfo.description}
                                            onChange={(e) => handleChange("basicInfo", e)}
                                            rows="1" 
                                            placeholder="A brief overview..." 
                                            className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="event_description" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                        Detailed Event Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea 
                                        id="event_description" 
                                        name="event_description" 
                                        value={formData.basicInfo.event_description}
                                        onChange={(e) => handleChange("basicInfo", e)}
                                        rows="3" 
                                        placeholder="Provide a detailed overview of the event for the AI Chatbot to use..." 
                                        className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all resize-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="eligibility" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                        Eligibility <span className="text-red-500">*</span>
                                    </label>
                                    <textarea 
                                        id="eligibility" 
                                        name="eligibility" 
                                        value={formData.basicInfo.eligibility}
                                        onChange={(e) => handleChange("basicInfo", e)}
                                        rows="2" 
                                        placeholder="e.g., Open to all B.Tech students..." 
                                        className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* DATE & VENUE */}
                        <div className="space-y-4 pt-2">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-lg font-heading font-bold text-slate-800 flex items-center gap-2">
                                    Date & Venue
                                </h3>
                                <p className="text-slate-500 text-xs mt-1">Schedules, Location, and Attendees.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startDate" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                        Start Date & Time <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="datetime-local" 
                                        id="startDate" 
                                        name="startDate" 
                                        value={formData.dateAndVenue.startDate}
                                        onChange={(e) => handleChange("dateAndVenue", e)}
                                        className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all text-slate-700" 
                                    />
                                </div>

                                <div>
                                    <label htmlFor="endDate" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                        End Date & Time <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="datetime-local" 
                                        id="endDate" 
                                        name="endDate" 
                                        value={formData.dateAndVenue.endDate}
                                        onChange={(e) => handleChange("dateAndVenue", e)}
                                        className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all text-slate-700" 
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="registrationDeadline" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                        Registration Deadline <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="datetime-local" 
                                        id="registrationDeadline" 
                                        name="registrationDeadline" 
                                        value={formData.dateAndVenue.registrationDeadline}
                                        onChange={(e) => handleChange("dateAndVenue", e)}
                                        className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all text-slate-700" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                        Event Mode <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-4 mt-2">
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="mode" 
                                                value="In-Person" 
                                                checked={formData.dateAndVenue.mode === "In-Person"}
                                                onChange={(e) => handleChange("dateAndVenue", e)}
                                                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" 
                                            />
                                            <span className="text-xs font-medium text-slate-700">In-Person</span>
                                        </label>
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="mode" 
                                                value="Virtual" 
                                                checked={formData.dateAndVenue.mode === "Virtual"}
                                                onChange={(e) => handleChange("dateAndVenue", e)}
                                                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" 
                                            />
                                            <span className="text-xs font-medium text-slate-700">Virtual</span>
                                        </label>
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="mode" 
                                                value="Hybrid" 
                                                checked={formData.dateAndVenue.mode === "Hybrid"}
                                                onChange={(e) => handleChange("dateAndVenue", e)}
                                                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500" 
                                            />
                                            <span className="text-xs font-medium text-slate-700">Hybrid</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="venueName" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                        Venue Name {(formData.dateAndVenue.mode === "In-Person" || formData.dateAndVenue.mode === "Hybrid") && <span className="text-red-500">*</span>}
                                    </label>
                                    <input 
                                        type="text" 
                                        id="venueName" 
                                        name="venueName" 
                                        value={formData.dateAndVenue.venueName}
                                        onChange={(e) => handleChange("dateAndVenue", e)}
                                        placeholder="e.g., Main Auditorium, Block-A" 
                                        className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all" 
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="meetingLink" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                        Meeting Link {(formData.dateAndVenue.mode === "Virtual" || formData.dateAndVenue.mode === "Hybrid") && <span className="text-red-500">*</span>}
                                    </label>
                                    <input 
                                        type="text" 
                                        id="meetingLink" 
                                        name="meetingLink" 
                                        value={formData.dateAndVenue.meetingLink}
                                        onChange={(e) => handleChange("dateAndVenue", e)}
                                        placeholder="https://meet.google.com/..."
                                        className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all" 
                                    />
                                    <p className="text-[10px] text-slate-500 mt-1">Required if your event is Virtual or Hybrid (Google Meet, Zoom, MS Teams).</p>
                                </div>
                            </div>

                            <div className="pt-1">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                                    Target Audience <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "All Students", "Faculty", "1st Year", "2nd Year", 
                                        "3rd Year", "4th Year", "CSE Students", "Final Year Students"
                                    ].map((audience, idx) => (
                                        <label key={idx} className="cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                name="targetAudience" 
                                                value={audience} 
                                                checked={formData.dateAndVenue.targetAudience.includes(audience)}
                                                onChange={handleTargetAudienceChange}
                                                className="peer sr-only" 
                                            />
                                            <div className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all border bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 select-none peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-700">
                                                {audience}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                <div>
                                    <label htmlFor="participantLimit" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                       Participant Limit <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        id="participantLimit" 
                                        name="participantLimit" 
                                        value={formData.dateAndVenue.participantLimit}
                                        onChange={(e) => handleChange("dateAndVenue", e)}
                                        placeholder="Max Capacity (1-10000)" 
                                        className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all" 
                                    />
                                </div>

                                <div>
                                    <label htmlFor="teamSize" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                        Team Size <span className="text-red-500">*</span>
                                    </label>
                                    <select 
                                        id="teamSize" 
                                        name="teamSize" 
                                        value={formData.dateAndVenue.teamSize}
                                        onChange={(e) => handleChange("dateAndVenue", e)}
                                        className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none appearance-none transition-all cursor-pointer"
                                    >
                                        <option value="Individual">Individual</option>
                                        <option value="2 Members">2 Members</option>
                                        <option value="3 Members">3 Members</option>
                                        <option value="4 Members">4 Members</option>
                                        <option value="5 Members">5 Members</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        {/* CONTACT INFORMATION */}
                        <div className="space-y-4 pt-2">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-lg font-heading font-bold text-slate-800 flex items-center gap-2">
                                    Contact Information
                                </h3>
                                <p className="text-slate-500 text-xs mt-1">People to reach out to for queries.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 relative">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="contactName1" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                                Contact Name <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                id="contactName1" 
                                                name="contactName1" 
                                                value={formData.contactInfo.contactName1}
                                                onChange={(e) => handleChange("contactInfo", e)}
                                                placeholder="e.g., John Doe" 
                                                className="w-full text-sm bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all" 
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="contactPhone1" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                                Mobile Number <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="tel" 
                                                id="contactPhone1" 
                                                name="contactPhone1" 
                                                value={formData.contactInfo.contactPhone1}
                                                onChange={(e) => handleChange("contactInfo", e)}
                                                placeholder="e.g., 9876543210" 
                                                className="w-full text-sm bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all" 
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="contactEmail1" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                                Email ID <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="email" 
                                                id="contactEmail1" 
                                                name="contactEmail1" 
                                                value={formData.contactInfo.contactEmail1}
                                                onChange={(e) => handleChange("contactInfo", e)}
                                                placeholder="e.g., john.doe@cvrc.edu.in" 
                                                className="w-full text-sm bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all" 
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="contactDesc1" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                                Brief Role/Desc
                                            </label>
                                            <input 
                                                type="text" 
                                                id="contactDesc1" 
                                                name="contactDesc1" 
                                                value={formData.contactInfo.contactDesc1}
                                                onChange={(e) => handleChange("contactInfo", e)}
                                                placeholder="e.g., Student Coordinator"
                                                className="w-full text-sm bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MEDIA & EXTRAS */}
                        <div className="space-y-4 pt-2">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-lg font-heading font-bold text-slate-800 flex items-center gap-2">
                                    Media & Extras
                                </h3>
                                <p className="text-slate-500 text-xs mt-1">Make your event stand out.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors relative group">
                                    <input 
                                        type="file" 
                                        id="poster" 
                                        name="poster" 
                                        accept="image/png, image/jpeg, image/jpg" 
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                    />
                                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
                                            <Image className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700 text-xs">Upload Event Poster</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">PNG, JPG up to 5MB</p>
                                            {formData.mediaAndExtras.poster && <p className="text-[10px] text-blue-600 mt-1 font-semibold border border-blue-200 bg-blue-50 rounded px-2 py-1 truncate">{formData.mediaAndExtras.poster.name}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors relative group">
                                    <input 
                                        type="file" 
                                        id="brochure" 
                                        name="brochure" 
                                        accept=".pdf" 
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                    />
                                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
                                            <FileText className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700 text-xs">Upload Rulebook/Brochure</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">PDF file only (Max 10MB)</p>
                                            {formData.mediaAndExtras.brochure && <p className="text-[10px] text-purple-600 mt-1 font-semibold border border-purple-200 bg-purple-50 rounded px-2 py-1 truncate">{formData.mediaAndExtras.brochure.name}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                <div>
                                    <label htmlFor="entryFee" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                        Entry Fee (₹) <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        id="entryFee" 
                                        name="entryFee" 
                                        value={formData.mediaAndExtras.entryFee}
                                        onChange={(e) => handleChange("mediaAndExtras", e)}
                                        placeholder="0 for free events" 
                                        className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all" 
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="prerequisites" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                                        Prerequisites
                                    </label>
                                    <input 
                                        type="text" 
                                        id="prerequisites" 
                                        name="prerequisites" 
                                        value={formData.mediaAndExtras.prerequisites}
                                        onChange={(e) => handleChange("mediaAndExtras", e)}
                                        placeholder="e.g., Bring your laptop"
                                        className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg px-3 py-2 outline-none transition-all" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-slate-100 pt-6 flex justify-end">
                            <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-sm transition-all transform active:scale-95 shadow-md shadow-blue-500/30 cursor-pointer">
                                Register Event <CheckCircle className="w-4 h-4" />
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}