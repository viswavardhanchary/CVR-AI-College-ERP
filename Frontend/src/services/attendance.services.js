import { api_college } from "./api";

export const getStudentAttendance = async (type, collegeId, studentId, token, month, year) => {
  try {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api_college.get(
      `/attendance/${type}/${collegeId}/student/${studentId}${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      error,
    };
  }
};

export const getAllAttendance = async (type, collegeId, token, month, year) => {
  try {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api_college.get(`/attendance/${type}/${collegeId}${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      error,
    };
  }
};
