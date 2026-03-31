import { Link } from "react-router-dom";
import { 
    Facebook, Twitter, Instagram, Linkedin, Github, 
    Mail, MapPin, Phone, Heart, ExternalLink 
} from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Academics",
            links: [
                { name: "Attendance Overview", path: "/student/academics/attendance" },
                { name: "Assignments", path: "/student/academics/assignments" },
                { name: "Exam Information", path: "/student/academics/exam-info" },
                { name: "Results", path: "/student/academics/results" }
            ]
        },
        {
            title: "Services",
            links: [
                { name: "Transport", path: "/student/services/transport" },
                { name: "Fee Overview", path: "/student/services/fee" },
                { name: "Academic Calendar", path: "/student/academics/calendar" },
                { name: "Timetable", path: "/student/academics/timetable" }
            ]
        },
        {
            title: "Support",
            links: [
                { name: "Help Center", path: "/student/help" },
                { name: "Leave Application", path: "/student/requests/leave" },
                { name: "Out Pass", path: "/student/requests/out-pass" },
                { name: "ID Card Request", path: "/student/requests/id-card" }
            ]
        }
    ];

    return (
        <footer className="bg-[#051F3E] text-white pt-12 pb-6 px-4 sm:px-6 lg:px-8 mt-auto">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    
                    {/* Branding Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 shadow-lg shadow-blue-500/20">
                                <img src="/logo.png" alt="CVR" className="w-full h-full object-contain" onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=CVR&background=fff&color=051F3E"} />
                            </div>
                            <span className="font-heading font-extrabold text-xl tracking-tight">
                                Campus<span className="text-blue-400">Flow</span>
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Elevating the educational experience through streamlined digital solutions. CVR College of Engineering ERP portal.
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <SocialIcon icon={<Twitter size={18} />} />
                            <SocialIcon icon={<Linkedin size={18} />} />
                            <SocialIcon icon={<Instagram size={18} />} />
                            <SocialIcon icon={<Github size={18} />} />
                        </div>
                    </div>

                    {/* Navigation Sections */}
                    {footerSections.map((section, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                            <h3 className="font-heading font-bold text-sm uppercase tracking-[0.1em] text-blue-400">
                                {section.title}
                            </h3>
                            <ul className="flex flex-col gap-2.5">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link 
                                            to={link.path} 
                                            className="text-slate-300 hover:text-white text-sm transition-colors duration-200 flex items-center group"
                                        >
                                            <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-300 rounded-full" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Contact Strip */}
                <div className="border-t border-white/10 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <ContactItem 
                        icon={<MapPin className="text-blue-400" size={20} />} 
                        label="Location" 
                        value="Ibrahimpatan, Mangalpalle, Telangana" 
                    />
                    <ContactItem 
                        icon={<Mail className="text-blue-400" size={20} />} 
                        label="Support Email" 
                        value="support@cvr.ac.in" 
                    />
                    <ContactItem 
                        icon={<Phone className="text-blue-400" size={20} />} 
                        label="Phone" 
                        value="+91 8414 661 661" 
                    />
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-slate-400 text-sm flex items-center gap-1.5">
                        <span>&copy; {currentYear} CVR College of Engineering.</span>
                        <span className="hidden sm:inline">|</span>
                        <span>All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <span>Made with</span>
                        <Heart size={14} className="text-rose-500 fill-rose-500 mx-0.5" />
                        <span>by</span>
                        <span className="text-blue-400 font-bold hover:underline cursor-pointer ml-1">Team CampusFlow</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon }) {
    return (
        <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-sm cursor-pointer">
            {icon}
        </button>
    );
}

function ContactItem({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4 group cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors duration-300">
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors duration-300">{value}</p>
            </div>
        </div>
    );
}