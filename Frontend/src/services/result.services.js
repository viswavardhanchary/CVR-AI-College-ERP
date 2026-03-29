import { api_college } from "./api";

const resultUrl = (type, collegeId, studentId) => `/result/${type}/${collegeId}/student/${studentId}`;

export const getResultsByStudent = async (type, collegeId, studentId, token, filters = {}) => {
  const params = {};
  if (filters.exam_type) params.exam_type = filters.exam_type;
  if (filters.exam_method) params.exam_method = filters.exam_method;
  if (filters.semester) params.semester = filters.semester;
  if (filters.from_year) params.from_year = filters.from_year;
  if (filters.to_year) params.to_year = filters.to_year;

  const response = await api_college.get(resultUrl(type, collegeId, studentId), {
    params,
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getResultsByStudentByExamType = async (type, collegeId, studentId, examType, token, filters = {}) => {
  return getResultsByStudent(type, collegeId, studentId, token, { ...filters, exam_type: examType });
};
