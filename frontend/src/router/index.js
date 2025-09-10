import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Services from "@/views/Services.vue";
import ServiceDetail from "@/views/ServiceDetail.vue";
import ClientDashboard from "@/views/client/Dashboard.vue";
import BookingWizard from "@/views/BookingWizard.vue";
import AdminDashboard from "@/views/admin/Dashboard.vue";
import Dictionaries from "@/views/admin/Dictionaries.vue";
import AdminClients from "@/views/admin/AdminClients.vue";
import MasterDashboard from "@/views/master/Dashboard.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", name: "Home", component: Home, meta: { title: "Главная" } },
      {
        path: "login",
        name: "Login",
        component: Login,
        meta: { guestOnly: true, title: "Вход" },
      },
      {
        path: "register",
        name: "Register",
        component: Register,
        meta: { guestOnly: true, title: "Регистрация" },
      },
      {
        path: "services",
        name: "Services",
        component: Services,
        meta: { title: "Наши услуги" },
      },
      {
        path: "service/:id",
        name: "ServiceDetail",
        component: ServiceDetail,
        props: true,
        meta: { title: "Детали услуги" },
      },
    ],
  },
  {
    path: "/dashboard",
    component: DefaultLayout,
    meta: { requiresAuth: true, role: "client" },
    children: [
      {
        path: "",
        name: "ClientDashboard",
        component: ClientDashboard,
        meta: { title: "Личный кабинет" },
      },
      {
        path: "new-booking",
        name: "NewBooking",
        component: BookingWizard,
        meta: { title: "Новая запись" },
      },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, role: "admin" },
    children: [
      { path: "", redirect: { name: "AdminDashboard" } },
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: AdminDashboard,
        meta: { title: "Расписание" },
      },
      {
        path: "dictionaries",
        name: "AdminDictionaries",
        component: Dictionaries,
        meta: { title: "Справочники" },
      },
      {
        path: "clients",
        name: "AdminClients",
        component: AdminClients,
        meta: { title: "Клиенты" },
      },
    ],
  },
  {
    path: "/master",
    component: DefaultLayout,
    meta: { requiresAuth: true, role: "master" },
    children: [
      {
        path: "dashboard",
        name: "MasterDashboard",
        component: MasterDashboard,
        meta: { title: "Мои задачи" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  document.title = `AutoService | ${
    to.meta.title || "Профессиональный ремонт"
  }`;

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: "Login", query: { redirect: to.fullPath } });
  }
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: "Home" });
  }
  if (
    to.meta.requiresAuth &&
    to.meta.role &&
    to.meta.role !== authStore.user?.role
  ) {
    return next({ name: "Home" });
  }
  next();
});

export default router;
