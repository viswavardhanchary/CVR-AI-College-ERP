import { useParams, useLocation} from "react-router-dom";
import {useState, useEffect} from 'react'
import '../index.css';
import { MAIN_WEBSITE_URL } from "../utils/constants";
import { COLLEGE_UNIQUE_NAME } from "../utils/currentCollegeDetails";
import { getCollegeDetails, verify } from "../services/verification.services";
import { StudentDashboard } from "./StudentDashboard";
import { TeacherDashboard } from "./TeacherDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { ChatbotWidget } from "../components/ChatbotWidget";

export function MainPageLayout() {
  const [userType, setUserType] = useState(null);
  const location = useLocation();
  const {type} = useParams();
  useEffect(() => {
    checkType();
  },[]);

  async function checkType() {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token') || localStorage.getItem('token');
    
    if(token === null) {
      window.location.href = `${MAIN_WEBSITE_URL}/login/${COLLEGE_UNIQUE_NAME}`;
    }else {
      try {
        console.log(type);
        const response = await verify(location, type);
        console.log(response);
        if(response.status) {
          setUserType(type);
        }else {
          window.location.href = `${MAIN_WEBSITE_URL}/login/${COLLEGE_UNIQUE_NAME}`;
        }
      }catch(e) {
        console.log(e);
        window.location.href = `${MAIN_WEBSITE_URL}/college`;
      }
    }
  }

  return (
    <>
      <div>
        {userType && userType === 's' && 
        <>
        <StudentDashboard/>
        </>
        }
        {userType && userType === 't' && 
        <>
        <TeacherDashboard/>
        </>
        }
        {userType && userType === 'a' && 
        <>
        <AdminDashboard/>
        </>
        }
      </div>

      {/* Global chatbot widget — visible across all routes & user types */}
      {userType && <ChatbotWidget />}
    </>
  )
}




