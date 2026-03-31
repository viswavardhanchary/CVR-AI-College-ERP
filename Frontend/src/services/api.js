import axios from 'axios';

export const api_college = axios.create({
  baseURL: 'https://backend-campusflow.onrender.com'
});