import { MAIN_WEBSITE_URL } from "../utils/constants";
import { COLLEGE_UNIQUE_NAME } from "../utils/currentCollegeDetails";
import { api_college } from "./api";
import { getSingleCollege } from "./college.services";
import { getSingleUser } from "./user.services";


// export const checkToken = async (college , type , token) => {
//   try {
//     let response = null;
//     if(type === 's') {
//       response = await api_college.post('/student/verify' , {college , token});
//     }else if(type === 't') {
//       response = await api_college.post('/teacher/verify' , {college , token});
//     }else {
//       response = await api_college.post('/admin/verify' , {college , token});
//     }
//     return {
//       status: true,
//       id: response.data.id,
//     }
//   }catch(e) {
//     console.log(e);
//     return {
//       status: false,
//       id: null
//     }
//   }
// }


export const verify = async (location, type) => { 
  const path = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  if(queryParams.get('token')) {
    localStorage.setItem('token' , queryParams.get('token'));
  }
  try {
    if(!localStorage.getItem('token')) {
      return {
        status: false,
        message: 'Token Not Found',
        redirectURL: `${MAIN_WEBSITE_URL}/login/${COLLEGE_UNIQUE_NAME}`,
        user: null,
        college: null
      }
    }
    const collegeResponse = await getCollegeDetails();
    if(!collegeResponse.status) {
      return collegeResponse;
    }
    const response = await api_college.get(`/verify/${type}/${collegeResponse.college._id}/${localStorage.getItem('token')}`);
    const userResponse = response.data;
    if(!userResponse.status) {
      return {
        status: false,
        message: 'Invalid Token! Login Again',
        redirectURL: `${MAIN_WEBSITE_URL}/login/${COLLEGE_UNIQUE_NAME}`,
        user: null,
        college: null
      }
    }else if(queryParams.get('token')) {
      return {
        status: true,
        message: 'SuccessFull Login',
        redirectURL: path,
        user: userResponse.user,
        college: collegeResponse.college
      }
    }else {
      return {
        status: true,
        message: 'SuccessFull Login',
        redirectURL: null,
        user: userResponse.user,
        college: collegeResponse.college
      }
    }
  }catch(e) {
    console.log('Error in processing... ' + e);
    return {
      status: false,
      error: true,
      message: e.response?.message,
      redirectURL: null,
      college: null,
      user: null
    }
  }
}

export const getCollegeDetails = async () => {
  const uniqueName = COLLEGE_UNIQUE_NAME;
  try {
    const response = await getSingleCollege(uniqueName);
    if(response.status) {
      return {
        status: true,
        college: response.college,
        redirectURL: null,
        message: "Fetched College Details"
      }
    }else {
      return {
        status: false,
        college: null,
        redirectURL: `${MAIN_WEBSITE_URL}/college`,
        message: 'Failed to Fetch College Details'
      }
    }
  }catch(e) {
    console.log(e);
    return {
      status: false,
      college: null,
      error: true,
      redirectURL: `${MAIN_WEBSITE_URL}/college`,
      message: e.response?.message
    }
  }
} 

const verifyToken = async (id, type) => {
  try {
    const response = await getSingleUser(id , type , localStorage.getItem('token'), );
    if(response.status) {
      return {
        status: true,
        user: response.user,
      }
    }else {
      return {
        status: false,
        user: null,
        redirectURL: `${MAIN_WEBSITE_URL}/login/cvr`,
      }
    }
  }catch(e) {
    console.log(e);
    return {
      status: false,
      user: null,
      error: true,
      redirectURL: `${MAIN_WEBSITE_URL}/login/cvr`,
      message: e.response?.message
    }
  }
}