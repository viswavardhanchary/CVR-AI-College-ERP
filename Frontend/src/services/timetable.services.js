import { api_college } from "./api";

export const createTimetable = async (collegeId, token, payload) => {
  try {
    const response = await api_college.post(`/timetable/${collegeId}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return {
      status: true,
      timetable: response.data,
    };
  } catch (e) {
    console.error(e);
    return {
      status: false,
      error: e.response?.data || e.message,
    };
  }
};
