import { api_college } from "./api";

export const getSingleUser = async (college , type , token) => {
  console.log(type);
  console.log(college);
  try {
    let response = null;
    const id = await getUserId(token , college);
    if(id === null) {
      return {
        status: false,
      }
    }
    console.log(id);
    if(type === 's') {
      response = await api_college.get(`/student/${college}/${id}` , {headers: {
        authorization: `Bearer ${token}`
      }});
    }else if(type === 't') {
      response = await api_college.get(`/teacher/${college}/${id}`,  {headers: {
        authorization: `Bearer ${token}`
      }});
    }else {
      response = await api_college.get(`/admin/${college}/${id}`,  {headers: {
        authorization: `Bearer ${token}`
      }});
    }
    return {
      status: true,
      user: response.data,
    }
  }catch(e) {
    console.log(e);
    return {
      status: false,
    }
  }
}

const getUserId = async (token, college) => {
  console.log(token);
  try {
    const response = await api_college.get(`/verify/${college}/${token}`);
    console.log(response);
    if(response.data.status) {
      return response.data.id
    }else {
      return null;
    }
  }catch(e) {
    console.log(e);
    return null;
  }
}