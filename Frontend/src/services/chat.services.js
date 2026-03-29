import { io } from 'socket.io-client';
import { api_college } from './api';

const SOCKET_URL = 'http://localhost:3000';

export function connectToWebSocket() {
  return io(SOCKET_URL, {
    transports: ['websocket'],
  });
}

const authHeaders = () => ({
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const fetchChatParticipants = async (collegeId, type) => {
  return api_college.get(`/chat/${type}/${collegeId}/participants`, authHeaders());
};

export const fetchUserChatSessions = async (collegeId, userId, type) => {
  return api_college.get(`/chat/${type}/${collegeId}/sessions/user/${userId}`, authHeaders());
};

export const createChatSession = async (collegeId, payload, type) => {
  return api_college.post(`/chat/${type}/${collegeId}/sessions`, payload, authHeaders());
};

export const addChatMessage = async (collegeId, sessionId, payload,type) => {
  return api_college.post(`/chat/${type}/${collegeId}/sessions/${sessionId}/messages`, payload, authHeaders());
};

export const updateChatSession = async (collegeId, sessionId, payload, type) => {
  return api_college.patch(`/chat/${type}/${collegeId}/sessions/${sessionId}`, payload, authHeaders());
};

export const getChatSession = async (collegeId, sessionId, type) => {
  return api_college.get(`/chat/${type}/${collegeId}/sessions/${sessionId}`, authHeaders());
};
