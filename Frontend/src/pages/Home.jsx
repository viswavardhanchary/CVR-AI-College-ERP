import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { verify } from "../services/verification.services";
import { Toast } from '../components/Toast';
import { Loading } from "../components/Loading";
import {
  LayoutDashboard,
  UserCircle,
  CloudUpload,
  GraduationCap,
  BookOpenCheck,
  FileSpreadsheet,
  FileText,
  CalendarDays,
  Clock,
  Trophy,
  Megaphone,
  BellRing,
  PartyPopper,
  LifeBuoy,
  Bus,
  Wallet,
  FilePlus,
  Contact,
  ShieldCheck,
  UserCog,
  Settings2,
  CalendarCheck,
  Briefcase,
  MessageSquare,
  ShieldAlert,
  Workflow,
  History,
  Cpu
} from "lucide-react";

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
};

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const { type } = useParams();
  const [filters, setFilters] = useState(defaultFilters);
  const [collegeData, setCollegeData] = useState(null);
  const [user, setUser] = useState(null);


  useEffect(() => {
    getDetails();
  }, [type]);

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

  function onClose() {
    setFilters({
      ...filters,
      toast: {
        message: "",
        status: false,
        type: ''
      },
    });
  }

  const pageTypeLabel = type === 's' ? 'Student' : type === 't' ? 'Teacher' : type === 'a' ? 'Admin' : 'User';

  const studentServices = [
    { title: 'Student Dashboard', to: `/${type}/student-dashboard`, icon: LayoutDashboard, category: 'Dashboard' },
    { title: 'My Profile', to: `/${type}/profile/my-profile`, icon: UserCircle, category: 'Profile' },
    { title: 'Upload Documents', to: `/${type}/profile/upload-docs`, icon: CloudUpload, category: 'Profile' },
    { title: 'Attendance Overview', to: `/${type}/academics/attendance`, icon: CalendarCheck, category: 'Academics' },
    { title: 'Assignments', to: `/${type}/academics/assignments`, icon: BookOpenCheck, category: 'Academics' },
    { title: 'Exam Information', to: `/${type}/academics/exam-info`, icon: FileSpreadsheet, category: 'Academics' },
    { title: 'Results', to: `/${type}/academics/results`, icon: FileText, category: 'Academics' },
    { title: 'Academic Calendar', to: `/${type}/academics/calendar`, icon: CalendarDays, category: 'Academics' },
    { title: 'Timetable', to: `/${type}/academics/timetable`, icon: Clock, category: 'Academics' },
    { title: 'Achievements', to: `/${type}/academics/achievements`, icon: Trophy, category: 'Academics' },
    { title: 'Circulars & Notifications', to: `/${type}/announcements/circulars`, icon: BellRing, category: 'Announcements' },
    { title: 'Events', to: `/${type}/announcements/events`, icon: PartyPopper, category: 'Announcements' },
    { title: 'Transport', to: `/${type}/services/transport`, icon: Bus, category: 'Services' },
    { title: 'Fee Overview', to: `/${type}/services/fee`, icon: Wallet, category: 'Services' },
    { title: 'Out Pass', to: `/${type}/requests/out-pass`, icon: FilePlus, category: 'Requests' },
    { title: 'ID Card', to: `/${type}/requests/id-card`, icon: Contact, category: 'Requests' },
    { title: 'Leave Application', to: `/${type}/requests/leave`, icon: FileText, category: 'Requests' },
    { title: 'Chat Application', to: `/${type}/chat`, icon: MessageSquare, category: 'Communication' },
    { title: 'AI Application', to: `/${type}/ai`, icon: Cpu, category: 'AI' }
  ];

  const teacherServices = [
    { title: 'Teacher Dashboard', to: `/${type}/teacher-dashboard`, icon: LayoutDashboard, category: 'Dashboard' },
    { title: 'My Profile', to: `/${type}/teacher-profile/my-profile`, icon: UserCircle, category: 'Profile' },
    { title: 'Academic Overview', to: `/${type}/academic-management/academic-overview`, icon: GraduationCap, category: 'Academic' },
    { title: 'Mark Attendance', to: `/${type}/academic-management/mark-attendance`, icon: CalendarCheck, category: 'Academic' },
    { title: 'Assignments Review', to: `/${type}/academic-management/assignments-review`, icon: FileSpreadsheet, category: 'Academic' },
    { title: 'Upload Resources', to: `/${type}/academic-management/upload-resources`, icon: CloudUpload, category: 'Academic' },
    { title: 'Results Management', to: `/${type}/academic-management/results-management`, icon: GraduationCap, category: 'Academic' },
    { title: 'Student Mentorship', to: `/${type}/student-support/mentorship`, icon: LifeBuoy, category: 'Support' },
    { title: 'Circulars & Notifications', to: `/${type}/announcements/teacher-circulars`, icon: BellRing, category: 'Announcements' },
    { title: 'Academic Calendar', to: `/${type}/announcements/teacher-calendar`, icon: CalendarDays, category: 'Announcements' },
    { title: 'Events Coordination', to: `/${type}/announcements/events-coordination`, icon: PartyPopper, category: 'Announcements' },
    { title: 'Request Access', to: `/${type}/requests/request-access`, icon: ShieldCheck, category: 'Requests' },
    { title: 'Leaves Approval', to: `/${type}/requests/leaves-approval`, icon: FilePlus, category: 'Requests' },
    { title: 'Salary & Payroll', to: `/${type}/staff-services/salary-payroll`, icon: Wallet, category: 'Staff Services' },
    { title: 'Transport', to: `/${type}/staff-services/teacher-transport`, icon: Bus, category: 'Staff Services' },
    { title: 'Chat Application', to: `/${type}/chat`, icon: MessageSquare, category: 'Communication' },
    { title: 'AI Application', to: `/${type}/ai`, icon: Cpu, category: 'AI' }
  ];

  const adminServices = [
    { title: 'Admin Dashboard', to: `/${type}/admin-dashboard`, icon: LayoutDashboard, category: 'Dashboard' },
    { title: 'User Management', to: `/${type}/user-access-management/user-management`, icon: UserCog, category: 'Access' },
    { title: 'Document Verification', to: `/${type}/user-access-management/doc-verification`, icon: ShieldCheck, category: 'Access' },
    { title: 'Academic Configuration', to: `/${type}/academic-administration/academic-config`, icon: Settings2, category: 'Academic' },
    { title: 'Attendance Oversight', to: `/${type}/academic-administration/attendance-oversight`, icon: CalendarCheck, category: 'Academic' },
    { title: 'Examination Cell', to: `/${type}/academic-administration/exam-cell`, icon: FileSpreadsheet, category: 'Academic' },
    { title: 'Academic Calendar', to: `/${type}/academic-administration/academic-calendar`, icon: CalendarDays, category: 'Academic' },
    { title: 'Financial Hub', to: `/${type}/finance-operations/financial-hub`, icon: Wallet, category: 'Finance' },
    { title: 'Transport Logistics', to: `/${type}/finance-operations/transport-logistics`, icon: Bus, category: 'Finance' },
    { title: 'Communication Center', to: `/${type}/communication/comm-center`, icon: MessageSquare, category: 'Communication' },
    { title: 'System Workflows', to: `/${type}/system-management/workflows`, icon: Workflow, category: 'System' },
    { title: 'System Logs & Security', to: `/${type}/system-management/system-logs`, icon: History, category: 'System' },
    { title: 'Chat Application', to: `/${type}/chat`, icon: MessageSquare, category: 'Communication' },
    { title: 'AI Application', to: `/${type}/ai`, icon: Cpu, category: 'AI' }
  ];

  const services = type === 's' ? studentServices : type === 't' ? teacherServices : type === 'a' ? adminServices : [];

  return (
    <>
      <div className="">
        {filters.toast.status &&
          <div className="mb-3">
            <Toast
              message={filters.toast.message}
              type={filters.toast.type}
              onClose={onClose}
            />
          </div>
        }
        {filters.refresh &&
          <div className="mb-3">
            Refresh....
          </div>
        }
        {filters.navigate.status &&
          <div className="mb-3">
            Redirecting to <Link to={filters.navigate.url} className="underline text-blue-600">{filters.navigate.url}</Link> in a second
          </div>
        }
        {!filters.loading && !filters.refresh && !filters.navigate.status &&
          <div className="space-y-6">
            <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Welcome</p>
                  <h1 className="mt-3 text-3xl font-semibold text-white">{pageTypeLabel} Dashboard</h1>
                  <p className="mt-2 max-w-2xl text-sm text-slate-400">Pick a service below to navigate directly to the feature you need.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                  {user?.first_name ? `Hello ${user.first_name}` : 'Authenticated home page'}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.title}
                    to={service.to}
                    className="group flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="rounded-2xl bg-slate-900/70 p-3 text-cyan-300">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.35em] text-slate-500">{service.category}</span>
                    </div>
                    <div className="mt-6">
                      <h2 className="text-lg font-semibold text-white">{service.title}</h2>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        }
        {filters.loading &&
          <Loading title='Loading Dashboard....'/>
        }
      </div>
    </>
  )
}