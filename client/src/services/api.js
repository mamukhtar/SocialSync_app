// Description: API service to make requests to the server

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Important to send cookies with requests
});

export default api;
