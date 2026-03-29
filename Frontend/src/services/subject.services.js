import { api_college } from "./api";

// ✅ GET SUBJECTS BY TEACHER
export const getSubjectsByTeacher = async (college, teacherId, token, type) => {
  try {
    const response = await api_college.get(
      `/subject/${college}/${type}/teacher/${teacherId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return { status: true, data: response.data };
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return { status: false, message: error.message };
  }
};

// ✅ GET STUDENTS WITH FILTERS
export const getStudentsByFilter = async (college, filters, token, type) => {
  try {
    const response = await api_college.post(
      `/student/${college}/${type}/get/filters`,
      filters,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return { status: true, data: response.data };
  } catch (error) {
    console.error('Error fetching filtered students:', error);
    return { status: false, message: error.message };
  }
};
