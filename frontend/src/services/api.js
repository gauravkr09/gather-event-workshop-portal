import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
api.interceptors.response.use(
  (r) => r,
  (e) => {
    const message =
      e.response?.data?.message ||
      (!e.response
        ? "Cannot connect to the server. Check that the backend is running."
        : "Request failed. Please try again.");
    return Promise.reject(new Error(message));
  },
);
export default api;
