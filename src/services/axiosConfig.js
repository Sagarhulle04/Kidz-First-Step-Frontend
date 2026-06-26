import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

// Request interceptor to add authorization token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("kidz-app");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      localStorage.removeItem("kidz-app");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axios;
