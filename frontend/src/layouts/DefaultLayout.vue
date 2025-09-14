<template>
  <div
    class="flex min-h-screen flex-col bg-dark font-sans text-primary-text transition-all duration-500"
    :class="layoutClass"
    :style="layoutStyle"
  >
    <AppHeader />
    <main class="flex-grow" :style="{ paddingTop: 'var(--header-height)' }">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

const route = useRoute();
const isHomePage = ref(route.name === "Home");

watch(
  () => route.name,
  (newName) => {
    isHomePage.value = newName === "Home";
  }
);

const layoutClass = computed(() => ({
  "bg-cover bg-center bg-fixed": isHomePage.value,
  "bg-dark": !isHomePage.value,
}));

const layoutStyle = computed(() => {
  if (isHomePage.value) {
    return { backgroundImage: `url('/main_background/background.jpg')` };
  }
  return {};
});
</script>
