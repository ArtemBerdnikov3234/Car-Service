<template>
  <div class="flex h-screen bg-dark font-sans text-primary-text">
    <aside class="flex w-64 flex-col border-r border-white/10 bg-light-dark">
      <div class="border-b border-white/10 p-4 text-center text-2xl font-bold">
        <router-link :to="{ name: 'AdminDashboard' }">
          <span class="text-brand-red">Admin</span
          ><span class="text-white">Panel</span>
        </router-link>
      </div>

      <nav class="flex-grow space-y-2 p-4">
        <router-link
          :to="{ name: 'AdminDashboard' }"
          class="flex items-center gap-3 rounded-lg px-4 py-3 text-secondary-text transition duration-200 hover:bg-white/5 hover:text-white"
          active-class="bg-brand-red !text-white shadow-lg shadow-brand-red/20"
        >
          <i class="fas fa-calendar-alt w-6 text-center"></i>
          <span>Расписание</span>
        </router-link>

        <router-link
          :to="{ name: 'AdminDictionaries' }"
          class="flex items-center gap-3 rounded-lg px-4 py-3 text-secondary-text transition duration-200 hover:bg-white/5 hover:text-white"
          active-class="bg-brand-red !text-white shadow-lg shadow-brand-red/20"
        >
          <i class="fas fa-book w-6 text-center"></i>
          <span>Справочники</span>
        </router-link>

        <router-link
          :to="{ name: 'AdminClients' }"
          class="flex items-center gap-3 rounded-lg px-4 py-3 text-secondary-text transition duration-200 hover:bg-white/5 hover:text-white"
          active-class="bg-brand-red !text-white shadow-lg shadow-brand-red/20"
        >
          <i class="fas fa-users w-6 text-center"></i>
          <span>Клиенты</span>
        </router-link>
      </nav>

      <div class="border-t border-white/10 p-4">
        <button
          @click="authStore.logout()"
          class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-secondary-text transition duration-200 hover:bg-white/5 hover:text-white"
        >
          <i class="fas fa-sign-out-alt w-6 text-center"></i>
          <span>Выйти</span>
        </button>
      </div>
    </aside>

    <div class="flex flex-1 flex-col overflow-hidden">
      <header
        class="flex items-center justify-between border-b border-white/10 bg-card-dark p-4 shadow-lg"
      >
        <h1 class="text-2xl font-bold text-white">
          {{ $route.meta.title || "Панель управления" }}
        </h1>
        <div class="text-secondary-text">
          Администратор: {{ authStore.user?.firstName }}
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
const authStore = useAuthStore();
</script>

<style scoped></style>
