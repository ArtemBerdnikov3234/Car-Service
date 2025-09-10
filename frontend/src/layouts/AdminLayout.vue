<!-- src/layouts/AdminLayout.vue -->
<template>
  <div class="flex h-screen bg-gray-100 text-gray-800">
    <!-- Sidebar (темный) -->
    <aside
      class="w-64 bg-brand-gray text-gray-300 flex flex-col border-r border-brand-light-gray"
    >
      <div
        class="p-4 text-3xl font-bold border-b border-brand-light-gray text-brand-white"
      >
        Auto<span class="text-brand-accent">Service</span>
      </div>
      <nav class="flex-grow p-4 space-y-2">
        <!-- Классы .nav-link теперь применены напрямую -->
        <router-link
          :to="{ name: 'AdminDashboard' }"
          class="flex items-center px-4 py-3 rounded-lg transition duration-200 hover:bg-brand-light-gray hover:text-white"
          active-class="bg-brand-accent text-white"
        >
          <i class="fas fa-calendar-alt w-6 text-center mr-3"></i>Расписание
        </router-link>

        <router-link
          :to="{ name: 'AdminDictionaries' }"
          class="flex items-center px-4 py-3 rounded-lg transition duration-200 hover:bg-brand-light-gray hover:text-white"
          active-class="bg-brand-accent text-white"
        >
          <i class="fas fa-book w-6 text-center mr-3"></i>Справочники
        </router-link>

        <router-link
          :to="{ name: 'AdminClients' }"
          class="flex items-center px-4 py-3 rounded-lg transition duration-200 hover:bg-brand-light-gray hover:text-white"
          active-class="bg-brand-accent text-white"
        >
          <i class="fas fa-users w-6 text-center mr-3"></i>Клиенты
        </router-link>
      </nav>
      <div class="p-4 border-t border-brand-light-gray">
        <!-- Классы .nav-link применены и здесь -->
        <button
          @click="authStore.logout()"
          class="w-full flex items-center px-4 py-3 rounded-lg transition duration-200 hover:bg-brand-light-gray hover:text-white"
        >
          <i class="fas fa-sign-out-alt w-6 text-center mr-3"></i>Выйти
        </button>
      </div>
    </aside>

    <!-- Content (светлый) -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header
        class="bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200"
      >
        <h1 class="text-2xl font-bold text-gray-800">
          {{ $route.meta.title || "Панель управления" }}
        </h1>
        <div>
          <span class="text-gray-500"
            >Администратор: {{ authStore.user?.firstName }}</span
          >
        </div>
      </header>
      <main class="flex-1 p-6 overflow-y-auto bg-gray-100">
        <router-view />
      </main>
    </div>
  </div>
</template>

<!-- Блок <style> полностью удален -->

<script setup>
import { useAuthStore } from "@/store/auth";
const authStore = useAuthStore();
</script>
