import { api_college } from "./api";

export const getCollegesList = async () => {
  try {
    const response = await api_college.get('/college/');
    return {
      status: true,
      college: response.data
    };
  }catch(e) {
    console.log(e);
    return {
      status: false,
      college: null
    };
  }
}

export const getSingleCollege = async (name) => {
  try {
    const response = await api_college.get(`/college/name/${name}`);
    return {
      status: true,
      college: response.data
    };
  }catch(e) {
    console.log(e);
    return {
      status: false,
      college: null
    };
  }
}
