import { defineStore } from "pinia";
import apiClient from "@/services/api";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "admin",
    isClient: (state) => state.user?.role === "client",
    isMaster: (state) => state.user?.role === "master",
  },
  actions: {
    async login(credentials) {
      try {
        const { data } = await apiClient.post("/auth/login", credentials);
        const { token, user } = data;

        this.token = token;
        this.user = user;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("Login successful. User role:", user.role);

        if (user.role === "admin") {
          console.log("Redirecting to AdminDashboard...");
          router.push({ name: "AdminDashboard" });
        } else if (user.role === "master") {
          console.log("Redirecting to MasterDashboard...");
          router.push({ name: "MasterDashboard" });
        } else {
          console.log("Redirecting to ClientDashboard...");
          router.push({ name: "ClientDashboard" });
        }
      } catch (error) {
        console.error("Login action failed:", error);

        throw error;
      }
    },
    async register(userData) {
      await apiClient.post("/auth/register", userData);
      router.push({ name: "Login", query: { registered: "true" } });
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push({ name: "Home" });
    },
  },
});
