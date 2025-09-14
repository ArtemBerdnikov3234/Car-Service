<template>
  <header
    ref="headerRef"
    class="fixed top-0 left-0 right-0 z-50 border-b border-brand-red-light bg-light-dark bg-opacity-90 py-4 px-6 backdrop-blur-lg"
  >
    <div class="container mx-auto flex items-center justify-between">
      <router-link
        :to="{ name: 'Home' }"
        class="text-3xl font-bold text-brand-red"
      >
        Auto<span class="text-white">Service</span>
      </router-link>

      <nav class="hidden items-center space-x-8 md:flex">
        <template v-if="authStore.isAuthenticated">
          <span class="text-secondary-text"
            >Привет, {{ authStore.user?.firstName }}!</span
          >
        </template>

        <router-link
          :to="{ name: 'Services' }"
          class="group relative font-medium text-white transition duration-300 hover:text-brand-red"
        >
          <span>Услуги</span>
          <span
            class="absolute bottom-[-5px] left-0 h-[2px] w-0 bg-brand-red transition-all duration-300 group-hover:w-full"
          ></span>
        </router-link>

        <template v-if="!authStore.isAuthenticated">
          <router-link
            :to="{ name: 'Login' }"
            class="font-semibold text-white transition hover:text-brand-red"
            >Вход</router-link
          >
          <BaseButton :to="{ name: 'Register' }" tag="router-link"
            >Регистрация</BaseButton
          >
        </template>

        <template v-else>
          <router-link
            v-if="authStore.isClient"
            :to="{ name: 'ClientDashboard' }"
            class="group relative font-medium text-white transition duration-300 hover:text-brand-red"
          >
            <span>Кабинет</span>
            <span
              class="absolute bottom-[-5px] left-0 h-[2px] w-0 bg-brand-red transition-all duration-300 group-hover:w-full"
            ></span>
          </router-link>
          <router-link
            v-if="authStore.isAdmin"
            :to="{ name: 'AdminDashboard' }"
            class="group relative font-medium text-white transition duration-300 hover:text-brand-red"
          >
            <span>Панель</span>
            <span
              class="absolute bottom-[-5px] left-0 h-[2px] w-0 bg-brand-red transition-all duration-300 group-hover:w-full"
            ></span>
          </router-link>
          <BaseButton
            @click="showLogoutConfirm = true"
            variant="primary"
            class="!py-2 !px-6"
          >
            Выйти
          </BaseButton>
        </template>
      </nav>

      <div class="md:hidden">
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="text-white focus:outline-none"
        >
          <i class="fas fa-bars text-xl"></i>
        </button>
      </div>
    </div>
  </header>

  <ConfirmDialog
    :show="showLogoutConfirm"
    title="Подтвердите выход"
    message="Вы действительно хотите выйти из своего аккаунта?"
    @close="showLogoutConfirm = false"
    @cancel="showLogoutConfirm = false"
    @confirm="handleLogout"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/store/auth";
import BaseButton from "@/components/BaseButton.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

const authStore = useAuthStore();
const isMenuOpen = ref(false);
const headerRef = ref(null);
const showLogoutConfirm = ref(false);

const handleLogout = () => {
  authStore.logout();
  showLogoutConfirm.value = false;
};

let resizeObserver;
onMounted(() => {
  if (headerRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const height = entry.contentRect.height;
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`
        );
      }
    });
    resizeObserver.observe(headerRef.value);
  }
});
onUnmounted(() => {
  if (resizeObserver && headerRef.value) {
    resizeObserver.unobserve(headerRef.value);
  }
});
</script>

<style scoped></style>
