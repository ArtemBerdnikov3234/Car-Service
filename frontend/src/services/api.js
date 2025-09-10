import axios from "axios";
import { useAuthStore } from "@/store/auth";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    try {
      const authStore = useAuthStore();
      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
      }
    } catch (error) {}
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const authStore = useAuthStore();
        authStore.logout();
      } catch (e) {}
    }
    return Promise.reject(error);
  }
);

export default apiClient;
