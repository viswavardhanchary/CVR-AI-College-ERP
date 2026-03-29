import { api_college } from "./api";
import { deleteFile } from "./upload.services";
import { uploadFile } from "./upload.services";

// ✅ CREATE
export const createAssignment = async (college, token, type, data) => {
  if(type !== 't') {
    return { status: false, message: 'No Access' };
  }
  try {

    // 🔥 upload file first
    const formData = new FormData();
    formData.append("file", data.questionsAttachments.file);

    const uploadRes = await uploadFile(college, formData);

    if (!uploadRes.status) {
      return { status: false, message: "File upload failed" };
    }

    const payload = {
      ...data,
      questionsAttachments: {
        ...data.questionsAttachments,
       file : uploadRes.upload._id
      }
    };

    const response = await api_college.post(
      `/teacher/${college}/assignment/create`,
      payload,
    {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return { status: true, data: response.data };

  } catch (e) {
    console.log(e);
    return { status: false };
  }
};


// ✅ UPDATE
export const updateAssignment = async (college, token, id, data, type) => {
  if(type !== 't') {
    return { status: false, message: 'No Access' };
  }
  try {

    if (data.questionsAttachments.file) {
      const formData = new FormData();
      formData.append("file", data.questionsAttachments.file);

      const uploadRes = await uploadFile(college, formData);

      if (uploadRes.status) {
        data.questionsAttachments.file = uploadRes.upload._id;
      }
    }

    const response = await api_college.put(
      `/teacher/${college}/assignment/${id}`,
      data,
    {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return { status: true, data: response.data };

  } catch (e) {
    console.log(e);
    return { status: false };
  }
};

export const deleteAssignment = async (college, token, id, type, fileId) => {
  if(type !== 't') {
    return { status: false, message: 'No Access' };
  }
  try {
    const uploadRes = await deleteFile(college, fileId);

    if (!uploadRes.status) {
      return {
        status: false
      }
    }
    const response = await api_college.delete(
      `/teacher/${college}/assignment/${id}`,
     {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return { status: true, data: response.data };

  } catch (e) {
    console.log(e);
    return { status: false };
  }
};



export const getAssignments = async (college, token, id) => {
  try {
    const response = await api_college.get(
      `/teacher/${college}/assignment/all/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return { status: true, data: response.data.data };

  } catch (e) {
    console.log(e);
    return { status: false };
  }
};


export const getAssignmentById = async (college, token, id, type) => {
  try {
    const response = await api_college.get(
      `/teacher/${college}/assignment/${type}/${id}`,
       {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return { status: true, data: response.data.data };

  } catch (e) {
    console.log(e);
    return { status: false };
  }
};

export const getStudentAssignments = async (college, token, studentId, type) => {
  try {
    const response = await api_college.get(
      `/teacher/${college}/assignment/student/${type}/${studentId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return { status: true, data: response.data.data };
  } catch (e) {
    console.log(e);
    return { status: false };
  }
};

export const submitStudentAssignment = async (college, token, studentId, assignmentId, uploadId, type) => {
  try {
    const response = await api_college.post(
      `/upload-assignment/${type}/${college}/`,
      {
        studentId,
        assignmentId,
        uploadId
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return { status: true, data: response.data.data };
  } catch (e) {
    console.log(e);
    return { status: false };
  }
};

export const getStudentAssignmentUpload = async (college, token, studentId, assignmentId, type) => {
  try {
    const response = await api_college.get(
      `/upload-assignment/${type}/${college}/student/assignment/${type}/${studentId}/${assignmentId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return { status: true, data: response.data.data };
  } catch (e) {
    console.log(e);
    return { status: false };
  }
};

export const deleteStudentAssignmentUpload = async (college, token, studentId, assignmentId, type) => {
  try {
    const response = await api_college.delete(
      `/upload-assignment/${type}/${college}/student/${studentId}/${assignmentId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return { status: true, data: response.data };
  } catch (e) {
    console.log(e);
    return { status: false };
  }
};

export const getStudentsForAssignment = async (college, token, type, data) => {
  try {
    const response = await api_college.post(
      `/student/${college}/get/filters`,
       {
        headers: { Authorization: `Bearer ${token}` },
        body: {...data}
      }
    );

    return { status: true, data: response.data.data };

  } catch (e) {
    console.log(e);
    return { status: false };
  }
}