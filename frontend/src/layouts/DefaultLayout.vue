<!-- src/layouts/DefaultLayout.vue -->
<template>
  <div class="flex flex-col min-h-screen bg-white text-gray-900">
    <AppHeader />
    <!-- RouterView будет отображать содержимое конкретной страницы (Home, Services и т.д.) -->
    <router-view />
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
</script>
