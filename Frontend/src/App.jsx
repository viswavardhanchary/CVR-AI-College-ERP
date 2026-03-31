import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import { MainPageLayout } from "./layout/MainPageLayout";
import Home from "./pages/Home";
import { Chat } from "./pages/Chat";
import Ai from "./pages/Ai";
import {TeacherAssignments} from "./components/TeacherAssignments";
import { CreateAssignment } from "./components/CreateAssignment";
import { MainApp } from "./chat/MainApp";
import { StudentProfile } from "./components/StudentProfie";
import { TeacherProfile } from "./components/TeacherProfile";
import { AdminProfile } from "./components/AdminProfile";
import { Results } from "./components/Results";
import { InternalResults } from "./components/InternalResults";
import { ExternalResults } from "./components/ExternalResults";
import { Assignments } from './components/Assignments';
import AssignmentDetails from './components/AssignmentDetails';
import { TimetableUpload } from "./components/TimetableUpload";
import { UploadResultsAdmin } from "./components/UploadResultsAdmin";
import { Attendance } from "./components/Attendence";


const DummyComponent = ({ title }) => <div className="p-6">{title}</div>;

function App() {
  const route = createBrowserRouter([
    {
      path: '/:type/chat/ui',
      element: <MainApp/>
    },
    {
      path: "/:type",
      element: <MainPageLayout />,
      children: [
        //all
        {
          index: true,
          element: <Home/>
        },
        
        //student
        
        { 
          path: "student-dashboard", 
          element: <Home/> 
        },
        { 
          path: "chat", 
          element: <Chat /> 
        },
        { 
          path: "ai", 
          element: <Ai /> 
        },
        { 
          path: "profile/my-profile", 
          element: <StudentProfile/>
        },
        { 
          path: "profile/upload-docs", 
          element: <div>Upload Docus</div> 
        },
        { path: "academics/attendance", element:<Attendance /> },
        { path: "academics/assignments", element: <Assignments/>
        },
        { path: "academics/assignments/:id", element: <AssignmentDetails />
        },
        { path: "academics/exam-info", element: <div>Exam Info</div> },
        { path: "academics/results", element: <Results/> },
        { path: "academics/results/internal", element: <InternalResults/> },
        { path: "academics/results/external", element: <ExternalResults/> },
        { path: "academics/calendar", element: <div>Calendar</div> },
        { path: "academics/timetable", element: <div>Timetable</div> },
        { path: "academics/achievements", element: <div>Achievements</div> },
        { path: "announcements/circulars", element: <div>Circulars</div> },
        { path: "announcements/events", element: <div>Events</div> },
        { path: "services/transport", element: <div>Transport</div> },
        { path: "services/fee", element: <div>Fee Overview</div> },
        { path: "requests/out-pass", element: <div>Out Pass</div> },
        { path: "requests/id-card", element: <div>ID Card</div> },
        { path: "requests/leave", element: <div>Leave Application</div> },

        //Admin
        { path: "admin-dashboard", element: <Home/> },
        { path: "user-access-management/user-management", element: <DummyComponent title="User Management" /> },
        { path: "user-access-management/doc-verification", element: <DummyComponent title="Document Verification" /> },
        { path: "academic-administration/academic-config", element: <UploadResultsAdmin/> },
        { path: "academic-administration/attendance-oversight", element: <DummyComponent title="Attendance Oversight" /> },
        { path: "academic-administration/exam-cell", element: <DummyComponent title="Examination Cell" /> },
        { path: "academic-administration/academic-calendar", element: <TimetableUpload/> },
        { path: "finance-operations/financial-hub", element: <DummyComponent title="Financial Hub" /> },
        { path: "finance-operations/transport-logistics", element: <DummyComponent title="Transport Logistics" /> },
        { path: "communication/comm-center", element: <DummyComponent title="Communication Center" /> },
        { path: "system-management/workflows", element: <DummyComponent title="System Workflows" /> },
        { path: "system-management/system-logs", element: <DummyComponent title="System Logs" /> },
         { path: "admin-profile/my-profile", element: <AdminProfile/> },

        //Teacher

        { path: "teacher-dashboard", element: <Home/> },
        { path: "teacher-profile/my-profile", element: <TeacherProfile/> },
        { path: "academic-management/academic-overview", element: <DummyComponent title="Academic Overview" /> },
        { path: "academic-management/mark-attendance", element: <DummyComponent title="Mark Attendance" /> },
        { path: "academic-management/assignments-review", element: <TeacherAssignments /> },
        { path: "academic-management/assignments-review/create", element: <CreateAssignment /> },
        { path: "academic-management/upload-resources", element: <DummyComponent title="Upload Resources" /> },
        { path: "academic-management/results-management", element: <DummyComponent title="Results Management" /> },
        { path: "student-support/mentorship", element: <DummyComponent title="Student Mentorship" /> },
        { path: "announcements/teacher-circulars", element: <DummyComponent title="Circulars & Notifications" /> },
        { path: "announcements/teacher-calendar", element: <DummyComponent title="Academic Calendar" /> },
        { path: "announcements/events-coordination", element: <DummyComponent title="Events Coordination" /> },
        { path: "requests/request-access", element: <DummyComponent title="Request Access" /> },
        { path: "requests/leaves-approval", element: <DummyComponent title="Leaves Approval" /> },
        { path: "staff-services/salary-payroll", element: <DummyComponent title="Salary & Payroll" /> },
        { path: "staff-services/teacher-transport", element: <DummyComponent title="Teacher Transport" /> },
        {path: '*' , element: <div>Page not Found</div>}
      ],
    },
    
  ]);

  return <RouterProvider router={route} />;
}

export default App;