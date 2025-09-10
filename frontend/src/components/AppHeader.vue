<!-- src/components/AppHeader.vue -->
<template>
  <header class="bg-gray-100 shadow border-b border-gray-300">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <router-link
        :to="{ name: 'Home' }"
        class="text-3xl font-bold text-gray-900"
      >
        Auto<span class="text-gray-500">Service</span>
      </router-link>
      <nav class="hidden md:flex space-x-8 items-center">
        <router-link
          :to="{ name: 'Services' }"
          class="text-gray-600 hover:text-gray-900 transition"
          >Услуги</router-link
        >
        <a href="#" class="text-gray-600 hover:text-gray-900 transition"
          >Контакты</a
        >

        <template v-if="!authStore.isAuthenticated">
          <router-link
            :to="{ name: 'Login' }"
            class="py-2 px-5 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
            >Вход</router-link
          >
          <router-link
            :to="{ name: 'Register' }"
            class="py-2 px-5 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
            >Регистрация</router-link
          >
        </template>
        <template v-else>
          <span class="text-gray-600"
            >Привет, {{ authStore.user?.firstName }}!</span
          >
          <router-link
            v-if="authStore.isClient"
            :to="{ name: 'ClientDashboard' }"
            class="py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
            >Кабинет</router-link
          >
          <router-link
            v-if="authStore.isAdmin"
            :to="{ name: 'AdminDashboard' }"
            class="py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
            >Панель</router-link
          >
          <button
            @click="authStore.logout()"
            class="py-2 px-4 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
          >
            Выйти
          </button>
        </template>
      </nav>
      <div class="md:hidden">
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="text-gray-900 focus:outline-none"
        >
          <i class="fas fa-bars text-xl"></i>
        </button>
      </div>
    </div>
    <!-- Mobile Menu (optional) -->
    <div v-if="isMenuOpen" class="md:hidden">
      <!-- Add mobile navigation links here -->
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";
const authStore = useAuthStore();
const isMenuOpen = ref(false);
</script>
