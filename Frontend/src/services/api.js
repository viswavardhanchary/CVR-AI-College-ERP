import axios from 'axios';

export const api_college = axios.create({
  baseURL: 'http://localhost:3000'
});