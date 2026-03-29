import { api_college } from "./api";

export const uploadFile = async (college, formData) => {
  try {
    const response = await api_college.post(`/upload/${college}/` , formData);
    console.log(response.data);
    return {
      status: true,
      upload: response.data.upload
    }
  }catch(e) {
    console.log(e);
    return {
      status: false,
      upload: null
    }
  }
}

export const deleteFile = async (college, id) => {
   try {
    const response = await api_college.delete(`/upload/${college}/${id}`);
    if(response.data.status) {
      return {
        status: true
      }
    }else {
      return {
        status: false
      }
    }
    
  }catch(e) {
    console.log(e);
    return {
      status: false,
    }
  }
}